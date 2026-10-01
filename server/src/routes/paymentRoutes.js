import { Router } from 'express';
import {
  getPaymentConfig,
  createPaymentOrder,
  submitUtr,
  verifyPayment,
  handleWebhook,
  getPaymentById,
  getBookingPayment,
} from '../controllers/paymentController.js';

const router = Router();

// Public Payment Configuration & Gateway state
router.get('/config', getPaymentConfig);

// 1. Create Payment Order & initialize booking if needed
router.post('/create-order', createPaymentOrder);

// 2. Submit Manual UTR for Admin Verification (Rule #6 & #7)
router.post('/submit-utr', submitUtr);

// 3. Verify Gateway / Test Mode Payment
router.post('/verify', verifyPayment);

// 4. Webhook for asynchronous gateway callbacks (Idempotent, signature checked)
router.post('/webhook', handleWebhook);

// 5. Get Payment by ID
router.get('/:id', getPaymentById);

export default router;
