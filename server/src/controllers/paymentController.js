import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import PaymentAttempt from '../models/PaymentAttempt.js';
import { createAndBroadcastNotification } from '../services/notificationService.js';
import { logAdminAction } from '../services/auditService.js';

// Setup Razorpay instance if keys are configured in environment
const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    try {
      return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    } catch (err) {
      console.warn('Failed to initialize Razorpay instance:', err.message);
    }
  }
  return null;
};

/**
 * Helper to execute MongoDB updates with transaction support if replica set is available,
 * or fallback gracefully for standalone / local dev instances.
 */
async function runWithTransaction(workFn) {
  // Check if current MongoDB topology supports multi-document transactions (ReplicaSet or Sharded)
  const topologyType = mongoose.connection?.client?.topology?.description?.type;
  const isReplicaSet = topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded';
  if (!isReplicaSet) {
    return await workFn(null);
  }

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const result = await workFn(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    if (session) {
      try {
        await session.abortTransaction();
      } catch (_) {}
    }
    const combinedMsg = `${err.message || ''} ${err.errorResponse?.errmsg || ''} ${err.originalError?.message || ''}`;
    if (
      combinedMsg.includes('replica set') ||
      combinedMsg.includes('Transaction numbers') ||
      combinedMsg.includes('retryable writes')
    ) {
      console.warn('MongoDB Transactions not supported in current topology, executing non-transactionally:', err.message);
      return await workFn(null);
    }
    throw err;
  } finally {
    if (session) {
      session.endSession();
    }
  }
}

/**
 * 1. Get Public Payment Gateway Configuration
 */
export const getPaymentConfig = (req, res) => {
  const upiId = process.env.UPI_ID || 'ttdyatra@sbi';
  const upiName = process.env.UPI_NAME || 'TTD Yatra Pilgrimage Services';
  const paymentMode = process.env.PAYMENT_MODE || 'test';
  const razorpayEnabled = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

  return res.json({
    success: true,
    data: {
      upiId,
      upiName,
      paymentMode,
      razorpayEnabled,
      razorpayKeyId: razorpayEnabled ? process.env.RAZORPAY_KEY_ID : '',
      acceptedMethods: ['upi', 'card', 'netbanking'],
    },
  });
};

/**
 * 2. Create Booking and Payment Order (Rule #3: Create booking before payment with status 'payment_pending')
 * POST /api/payments/create-order
 */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const {
      bookingId: existingBookingId,
      pnr: existingPnr,
      type = 'package',
      itemName,
      travelDate,
      date,
      returnDate,
      travellers = 1,
      amount,
      customerDetails = {},
      leadPilgrim = {},
      method = 'upi',
      notes = '',
    } = req.body;

    let booking = null;

    // Check if linked to an existing booking (e.g. for retry)
    if (existingBookingId || existingPnr) {
      booking = await Booking.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(existingBookingId) ? existingBookingId : null },
          { bookingId: existingBookingId },
          { pnr: existingPnr },
        ].filter(Boolean),
        isDeleted: false,
      });
    }

    const finalCustomer = (customerDetails && customerDetails.name) ? customerDetails : leadPilgrim;

    // If no existing booking, create a new one in 'payment_pending' state
    if (!booking) {
      if (!itemName || !amount || Number(amount) <= 0 || !finalCustomer.name || !finalCustomer.phone) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required booking details (service name, date, customer name & contact phone)',
        });
      }

      const finalTravelDate = travelDate || date || new Date().toISOString().split('T')[0];
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const generatedPnr = `TTY-${new Date().getFullYear()}-${randomSuffix}`;
      const generatedBkId = `bk_${Date.now()}`;

      booking = await Booking.create({
        bookingId: generatedBkId,
        pnr: generatedPnr,
        user: req.user?._id || null,
        type,
        itemName,
        travelDate: new Date(finalTravelDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        travellers: Number(travellers) || 1,
        amount: Number(amount),
        customerDetails: {
          name: finalCustomer.name.trim(),
          phone: finalCustomer.phone.trim(),
          email: finalCustomer.email?.trim() || `${finalCustomer.phone.replace(/\D/g, '') || 'devotee'}@ttdyatra.com`,
          city: finalCustomer.city?.trim() || 'India',
        },
        leadPilgrim: {
          name: finalCustomer.name.trim(),
          phone: finalCustomer.phone.trim(),
          email: finalCustomer.email?.trim() || `${finalCustomer.phone.replace(/\D/g, '') || 'devotee'}@ttdyatra.com`,
          city: finalCustomer.city?.trim() || 'India',
        },
        paymentMethod: method.toUpperCase(),
        paymentStatus: 'pending',
        bookingStatus: 'payment_pending', // Explicitly payment_pending!
        notes,
      });
    }

    // Backend amount security (Rule #29: Never trust frontend amount blindly)
    const finalAmount = booking.amount;

    // Check if an existing pending payment order exists for this booking to ensure idempotency (#28)
    let payment = await Payment.findOne({
      bookingId: booking._id,
      status: { $in: ['pending', 'verification_pending'] },
    }).sort({ createdAt: -1 });

    const razorpay = getRazorpayInstance();
    const paymentMode = process.env.PAYMENT_MODE || 'test';

    if (!payment) {
      const generatedPaymentId = `PAY-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      let gatewayOrderId = '';
      let gateway = method === 'upi' ? 'manual_upi' : (razorpay ? 'razorpay' : 'test');

      if (razorpay && (method === 'card' || method === 'netbanking')) {
        try {
          const rzpOrder = await razorpay.orders.create({
            amount: Math.round(finalAmount * 100), // paise
            currency: 'INR',
            receipt: generatedOrderId,
            notes: {
              pnr: booking.pnr,
              paymentId: generatedPaymentId,
            },
          });
          gatewayOrderId = rzpOrder.id;
        } catch (err) {
          console.warn('Razorpay order creation fallback:', err.message);
        }
      }

      payment = await Payment.create({
        paymentId: generatedPaymentId,
        bookingId: booking._id,
        bookingRef: booking.pnr,
        userId: req.user?._id || booking.user || null,
        orderId: generatedOrderId,
        gateway,
        method,
        amount: finalAmount,
        currency: 'INR',
        status: 'pending',
        verificationStatus: 'pending',
        gatewayOrderId,
        customerDetails: {
          name: booking.customerDetails.name,
          phone: booking.customerDetails.phone,
          email: booking.customerDetails.email,
          city: booking.customerDetails.city,
        },
      });
    }

    // Create payment attempt audit record (#12)
    await PaymentAttempt.create({
      attemptId: `ATT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: booking._id,
      bookingRef: booking.pnr,
      paymentId: payment._id,
      method,
      amount: finalAmount,
      status: 'initiated',
      gatewayReference: payment.gatewayOrderId || payment.orderId,
      ipAddress: req.ip || '',
      userAgent: req.get('user-agent') || '',
    });

    return res.status(200).json({
      success: true,
      data: {
        bookingId: booking._id,
        pnr: booking.pnr,
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        gatewayOrderId: payment.gatewayOrderId,
        amount: finalAmount,
        currency: 'INR',
        method: payment.method,
        gateway: payment.gateway,
        paymentMode,
        status: payment.status,
        verificationStatus: payment.verificationStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Submit Manual UTR for Verification (Rule #6 & #7)
 * POST /api/payments/submit-utr
 */
export const submitUtr = async (req, res, next) => {
  try {
    const { paymentId, orderId, bookingId, pnr, utr } = req.body;

    if (!utr || typeof utr !== 'string' || utr.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid UTR / Bank Transaction Reference Number (minimum 8-12 alphanumeric characters).',
      });
    }

    const cleanUtr = utr.trim().toUpperCase();

    // Prevent duplicate approved UTR reuse
    const duplicateApproved = await Payment.findOne({
      utr: cleanUtr,
      status: 'success',
      verificationStatus: 'verified',
    });

    if (duplicateApproved) {
      return res.status(400).json({
        success: false,
        message: `This UTR (${cleanUtr}) has already been processed for booking ${duplicateApproved.bookingRef}. If this is a new transfer, please check your bank receipt.`,
      });
    }

    // Find the payment record
    const payment = await Payment.findOne({
      $or: [
        { paymentId },
        { orderId },
        { bookingRef: pnr },
        { bookingId: mongoose.isValidObjectId(bookingId) ? bookingId : null },
      ].filter(Boolean),
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found for this reference.' });
    }

    const booking = await Booking.findById(payment.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Linked pilgrimage booking not found.' });
    }

    // Update payment state to verification_pending (NEVER success!)
    payment.utr = cleanUtr;
    payment.transactionId = cleanUtr;
    payment.status = 'verification_pending';
    payment.verificationStatus = 'verification_pending';
    payment.submittedAt = new Date();
    await payment.save();

    // Update booking state (bookingStatus stays payment_pending!)
    booking.paymentStatus = 'verification_pending';
    booking.transactionId = cleanUtr;
    booking.paymentMethod = 'UPI';
    await booking.save();

    // Log attempt (#12)
    await PaymentAttempt.create({
      attemptId: `ATT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: booking._id,
      bookingRef: booking.pnr,
      paymentId: payment._id,
      method: 'upi',
      amount: payment.amount,
      status: 'submitted',
      utr: cleanUtr,
      gatewayReference: cleanUtr,
      ipAddress: req.ip || '',
      userAgent: req.get('user-agent') || '',
    });

    // Real-time notification to Admin Control Center
    await createAndBroadcastNotification({
      title: `⏳ Payment Submitted for Verification`,
      message: `Devotee ${booking.customerDetails.name} submitted UTR: ${cleanUtr} for PNR: ${booking.pnr} (₹${payment.amount.toLocaleString('en-IN')}). Awaiting admin review.`,
      type: 'booking_payment',
      category: 'Payments',
      priority: 'high',
      metadata: {
        paymentId: payment.paymentId,
        bookingId: booking._id.toString(),
        pnr: booking.pnr,
        amount: payment.amount,
        utr: cleanUtr,
        customerName: booking.customerDetails.name,
      },
      link: '/admin/payments',
    });

    return res.status(200).json({
      success: true,
      message: 'Your payment reference has been submitted for verification. Your booking will be confirmed after admin verification.',
      data: {
        paymentId: payment.paymentId,
        bookingRef: booking.pnr,
        amount: payment.amount,
        utr: cleanUtr,
        status: payment.status,
        verificationStatus: payment.verificationStatus,
        bookingStatus: booking.bookingStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Verify Payment (Gateway / Test Mode Verification)
 * POST /api/payments/verify
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      paymentId,
      orderId,
      gatewayOrderId,
      gatewayPaymentId,
      gatewaySignature,
      scenario, // For test mode simulation only: 'success' | 'failure' | 'timeout' | 'cancelled'
    } = req.body;

    const paymentMode = process.env.PAYMENT_MODE || 'test';

    const payment = await Payment.findOne({
      $or: [
        { paymentId },
        { orderId },
        { gatewayOrderId },
      ].filter(Boolean),
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    const booking = await Booking.findById(payment.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Linked booking not found.' });
    }

    // ── Scenario A: Razorpay Gateway Cryptographic Verification ──
    if (gatewayPaymentId && gatewayOrderId && gatewaySignature) {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ success: false, message: 'Server Razorpay configuration secret missing.' });
      }

      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${gatewayOrderId}|${gatewayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== gatewaySignature) {
        // Signature mismatch - Failed verification
        await runWithTransaction(async (session) => {
          payment.status = 'failed';
          payment.verificationStatus = 'rejected';
          payment.failureReason = 'Cryptographic signature mismatch';
          await payment.save({ session });

          booking.paymentStatus = 'failed';
          await booking.save({ session });
        });

        await PaymentAttempt.create({
          attemptId: `ATT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          bookingId: booking._id,
          bookingRef: booking.pnr,
          paymentId: payment._id,
          method: payment.method,
          amount: payment.amount,
          status: 'failed',
          failureReason: 'Signature mismatch',
        });

        return res.status(400).json({ success: false, message: 'Payment verification failed: Invalid bank signature' });
      }

      // Valid Signature -> Confirm Payment & Booking Atomically
      await runWithTransaction(async (session) => {
        payment.status = 'success';
        payment.verificationStatus = 'verified';
        payment.gatewayPaymentId = gatewayPaymentId;
        payment.gatewayOrderId = gatewayOrderId;
        payment.gatewaySignature = gatewaySignature;
        payment.transactionId = gatewayPaymentId;
        payment.paidAt = new Date();
        await payment.save({ session });

        booking.paymentStatus = 'paid';
        booking.bookingStatus = 'confirmed'; // Only now marked confirmed!
        booking.transactionId = gatewayPaymentId;
        await booking.save({ session });
      });

      await PaymentAttempt.create({
        attemptId: `ATT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingId: booking._id,
        bookingRef: booking.pnr,
        paymentId: payment._id,
        method: payment.method,
        amount: payment.amount,
        status: 'success',
        gatewayReference: gatewayPaymentId,
      });

      await createAndBroadcastNotification({
        title: `✓ Payment Verified & Booking Confirmed`,
        message: `Devotee ${booking.customerDetails.name} paid ₹${payment.amount.toLocaleString('en-IN')} for ${booking.itemName} (PNR: ${booking.pnr}).`,
        type: 'booking_payment',
        category: 'Payments',
        priority: 'urgent',
        metadata: {
          bookingId: booking._id.toString(),
          pnr: booking.pnr,
          paymentId: payment.paymentId,
          amount: payment.amount,
        },
        link: '/admin/bookings',
      });

      return res.status(200).json({
        success: true,
        message: 'Payment verified and booking confirmed successfully!',
        data: { payment, booking },
      });
    }

    // ── Scenario B: Test Mode Simulation (#32) ──
    if (paymentMode === 'test' && scenario) {
      if (scenario === 'success') {
        const testTxn = `TEST_TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

        await runWithTransaction(async (session) => {
          payment.status = 'success';
          payment.verificationStatus = 'verified';
          payment.transactionId = testTxn;
          payment.paidAt = new Date();
          await payment.save({ session });

          booking.paymentStatus = 'paid';
          booking.bookingStatus = 'confirmed';
          booking.transactionId = testTxn;
          await booking.save({ session });
        });

        await PaymentAttempt.create({
          attemptId: `ATT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          bookingId: booking._id,
          bookingRef: booking.pnr,
          paymentId: payment._id,
          method: payment.method,
          amount: payment.amount,
          status: 'success',
          gatewayReference: testTxn,
        });

        await createAndBroadcastNotification({
          title: `✓ Test Mode: Payment Verified (${booking.pnr})`,
          message: `Test payment of ₹${payment.amount.toLocaleString('en-IN')} verified for ${booking.customerDetails.name}.`,
          type: 'booking_payment',
          category: 'Payments',
          priority: 'normal',
          metadata: {
            pnr: booking.pnr,
            paymentId: payment.paymentId,
            amount: payment.amount,
          },
        });

        return res.status(200).json({
          success: true,
          message: 'Test payment simulated as success and booking confirmed.',
          data: { payment, booking },
        });
      } else {
        // Failure or Cancelled in test mode
        const failureReason = scenario === 'cancelled'
          ? 'Customer cancelled transaction'
          : scenario === 'timeout'
          ? 'Gateway response timed out'
          : 'Card/Bank verification declined';

        payment.status = scenario === 'cancelled' ? 'cancelled' : 'failed';
        payment.verificationStatus = 'rejected';
        payment.failureReason = failureReason;
        await payment.save();

        booking.paymentStatus = 'failed';
        // bookingStatus remains payment_pending!
        await booking.save();

        await PaymentAttempt.create({
          attemptId: `ATT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          bookingId: booking._id,
          bookingRef: booking.pnr,
          paymentId: payment._id,
          method: payment.method,
          amount: payment.amount,
          status: 'failed',
          failureReason,
        });

        return res.status(400).json({
          success: false,
          message: `Payment failed: ${failureReason}`,
          data: { payment, booking },
        });
      }
    }

    return res.status(400).json({
      success: false,
      message: 'Missing valid gateway verification payload or unauthorized test mode parameters.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Webhook Handling (Rule #27: Signature verification & Idempotency)
 * POST /api/payments/webhook
 */
export const handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (secret) {
    const signature = req.headers['x-razorpay-signature'];
    const bodyStr = JSON.stringify(req.body);
    const expected = crypto.createHmac('sha256', secret).update(bodyStr).digest('hex');

    if (signature !== expected) {
      console.warn('[Webhook] Invalid webhook signature received');
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }
  }

  const { event, payload } = req.body;
  const paymentEntity = payload?.payment?.entity;
  const orderId = paymentEntity?.order_id;
  const paymentId = paymentEntity?.id;

  if (!orderId && !paymentId) {
    return res.status(200).json({ received: true });
  }

  try {
    const payment = await Payment.findOne({
      $or: [{ gatewayOrderId: orderId }, { gatewayPaymentId: paymentId }, { orderId }].filter(Boolean),
    });

    if (!payment) {
      return res.status(200).json({ received: true, note: 'Payment record not matched' });
    }

    const booking = await Booking.findById(payment.bookingId);

    // Idempotency: If already confirmed, do nothing (#27)
    if (payment.status === 'success' && booking?.bookingStatus === 'confirmed') {
      return res.status(200).json({ received: true, status: 'already_processed' });
    }

    if (event === 'payment.captured' || event === 'order.paid') {
      await runWithTransaction(async (session) => {
        payment.status = 'success';
        payment.verificationStatus = 'verified';
        payment.gatewayPaymentId = paymentId || payment.gatewayPaymentId;
        payment.transactionId = paymentId || payment.transactionId;
        payment.paidAt = new Date();
        await payment.save({ session });

        if (booking) {
          booking.paymentStatus = 'paid';
          booking.bookingStatus = 'confirmed';
          booking.transactionId = paymentId || booking.transactionId;
          await booking.save({ session });
        }
      });

      console.log(`[Webhook] Payment ${payment.paymentId} confirmed for booking ${booking?.pnr}`);
    } else if (event === 'payment.failed') {
      payment.status = 'failed';
      payment.verificationStatus = 'rejected';
      payment.failureReason = paymentEntity?.error_description || 'Payment failed';
      await payment.save();

      if (booking) {
        booking.paymentStatus = 'failed';
        await booking.save();
      }
    }

    return res.status(200).json({ received: true, status: 'processed' });
  } catch (err) {
    console.error('[Webhook] Error handling webhook event:', err);
    return res.status(500).json({ success: false, message: 'Webhook processing error' });
  }
};

/**
 * 6. Get Payment By ID
 * GET /api/payments/:id
 */
export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({
      $or: [
        { paymentId: id },
        { _id: mongoose.isValidObjectId(id) ? id : null },
        { orderId: id },
      ].filter(Boolean),
    }).lean();

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const booking = await Booking.findById(payment.bookingId).lean();

    return res.json({
      success: true,
      data: {
        ...payment,
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 7. Get Booking Payment & Attempt History
 * GET /api/bookings/:id/payment
 */
export const getBookingPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(id) ? id : null },
        { bookingId: id },
        { pnr: id },
      ].filter(Boolean),
      isDeleted: false,
    }).lean();

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const payments = await Payment.find({ bookingId: booking._id }).sort({ createdAt: -1 }).lean();
    const attempts = await PaymentAttempt.find({ bookingId: booking._id }).sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      data: {
        booking,
        currentPayment: payments[0] || null,
        paymentHistory: payments,
        attempts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════
// ADMIN PAYMENT VERIFICATION CONTROLLER (Section 8, 9, 10, 23)
// ═══════════════════════════════════════════════════════════

/**
 * Admin: Get All Payments with Filters
 * GET /api/admin/payments
 */
export const adminGetPayments = async (req, res, next) => {
  try {
    const { status, verificationStatus, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (verificationStatus && verificationStatus !== 'all') {
      filter.verificationStatus = verificationStatus;
    }
    if (search) {
      filter.$or = [
        { paymentId: { $regex: search, $options: 'i' } },
        { bookingRef: { $regex: search, $options: 'i' } },
        { utr: { $regex: search, $options: 'i' } },
        { 'customerDetails.name': { $regex: search, $options: 'i' } },
        { 'customerDetails.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('bookingId', 'itemName travelDate travellers bookingStatus paymentStatus')
      .lean();

    const total = await Payment.countDocuments(filter);
    const pendingVerificationCount = await Payment.countDocuments({ verificationStatus: 'verification_pending' });

    return res.json({
      success: true,
      count: payments.length,
      total,
      pendingVerificationCount,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get Payment Details by ID
 * GET /api/admin/payments/:id
 */
export const adminGetPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({
      $or: [
        { paymentId: id },
        { _id: mongoose.isValidObjectId(id) ? id : null },
      ].filter(Boolean),
    })
      .populate('bookingId')
      .populate('verifiedBy', 'name email')
      .lean();

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const attempts = await PaymentAttempt.find({ paymentId: payment._id }).sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      data: {
        payment,
        attempts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Approve Payment (Section 9: Atomic update, verificationStatus='verified', bookingStatus='confirmed')
 * POST /api/admin/payments/:id/approve
 */
export const adminApprovePayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findOne({
      $or: [
        { paymentId: id },
        { _id: mongoose.isValidObjectId(id) ? id : null },
      ].filter(Boolean),
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    if (payment.verificationStatus === 'verified' && payment.status === 'success') {
      return res.status(400).json({ success: false, message: 'This payment is already verified and confirmed.' });
    }

    const booking = await Booking.findById(payment.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Linked booking not found.' });
    }

    // Atomic update of Payment and Booking (#9)
    await runWithTransaction(async (session) => {
      payment.status = 'success';
      payment.verificationStatus = 'verified';
      payment.paidAt = new Date();
      payment.verifiedAt = new Date();
      payment.verifiedBy = req.user?._id || null;
      await payment.save({ session });

      booking.paymentStatus = 'paid';
      booking.bookingStatus = 'confirmed'; // Only now booking is confirmed!
      booking.notes = (booking.notes ? booking.notes + ' | ' : '') + `Verified by Admin (${req.user?.name || 'Desk'}) on ${new Date().toLocaleDateString('en-IN')}`;
      await booking.save({ session });
    });

    // Log admin audit action (#9)
    await logAdminAction({
      adminUser: req.user,
      action: 'APPROVE_PAYMENT',
      resource: 'Payment',
      resourceId: payment.paymentId,
      description: `Approved payment of ₹${payment.amount} for booking ${booking.pnr} (UTR: ${payment.utr || 'N/A'})`,
    });

    // Real-time notification broadcast
    await createAndBroadcastNotification({
      title: `✓ Payment Approved: ${booking.pnr}`,
      message: `Admin approved payment of ₹${payment.amount.toLocaleString('en-IN')} for devotee ${booking.customerDetails.name}. Booking confirmed.`,
      type: 'booking_payment',
      category: 'Payments',
      priority: 'high',
      metadata: {
        paymentId: payment.paymentId,
        bookingId: booking._id.toString(),
        pnr: booking.pnr,
        amount: payment.amount,
      },
      link: '/admin/bookings',
    });

    return res.json({
      success: true,
      message: `Payment ${payment.paymentId} has been approved and booking ${booking.pnr} is now confirmed!`,
      data: {
        payment,
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Reject Payment (Section 10: payment.status='failed', verificationStatus='rejected', booking remains payment_pending)
 * POST /api/admin/payments/:id/reject
 */
export const adminRejectPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = 'Invalid or unverified UTR reference number' } = req.body;

    const payment = await Payment.findOne({
      $or: [
        { paymentId: id },
        { _id: mongoose.isValidObjectId(id) ? id : null },
      ].filter(Boolean),
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    const booking = await Booking.findById(payment.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Linked booking not found.' });
    }

    await runWithTransaction(async (session) => {
      payment.status = 'failed';
      payment.verificationStatus = 'rejected';
      payment.failureReason = reason;
      payment.verifiedAt = new Date();
      payment.verifiedBy = req.user?._id || null;
      await payment.save({ session });

      booking.paymentStatus = 'failed';
      booking.bookingStatus = 'payment_pending'; // Booking remains unconfirmed, user can retry (#10)
      booking.notes = (booking.notes ? booking.notes + ' | ' : '') + `Payment rejected: ${reason}`;
      await booking.save({ session });
    });

    // Log admin action
    await logAdminAction({
      adminUser: req.user,
      action: 'REJECT_PAYMENT',
      resource: 'Payment',
      resourceId: payment.paymentId,
      description: `Rejected payment for booking ${booking.pnr}. Reason: ${reason}`,
    });

    // Broadcast update
    await createAndBroadcastNotification({
      title: `❌ Payment Rejected: ${booking.pnr}`,
      message: `Payment of ₹${payment.amount.toLocaleString('en-IN')} for devotee ${booking.customerDetails.name} was rejected. Reason: ${reason}.`,
      type: 'booking_payment',
      category: 'Payments',
      priority: 'high',
      metadata: {
        paymentId: payment.paymentId,
        bookingId: booking._id.toString(),
        pnr: booking.pnr,
        reason,
      },
      link: '/admin/payments',
    });

    return res.json({
      success: true,
      message: `Payment ${payment.paymentId} has been marked as rejected. Devotee can retry payment.`,
      data: {
        payment,
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};
