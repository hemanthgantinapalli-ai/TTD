import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('verification_pending'); // 'all' | 'verification_pending' | 'verified' | 'rejected'
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Modals
  const [approveModalPayment, setApproveModalPayment] = useState(null);
  const [rejectModalPayment, setRejectModalPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);

  // Metrics
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getPayments({
        verificationStatus: activeTab === 'all' ? undefined : activeTab,
        search,
      });

      if (res?.data) {
        setPayments(res.data);
        if (typeof res.pendingVerificationCount === 'number') {
          setPendingCount(res.pendingVerificationCount);
        }
      }
    } catch (err) {
      console.warn('Error fetching payments:', err);
      toast.error('Failed to load payments ledger');
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    fetchPayments();
    // Live refresh every 20 seconds
    const interval = setInterval(fetchPayments, 20000);
    return () => clearInterval(interval);
  }, [fetchPayments]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  // Open Full Details Modal (#23)
  const handleOpenDetails = async (payment) => {
    setSelectedPayment(payment);
    setDetailsLoading(true);
    try {
      const res = await adminService.getPaymentById(payment.paymentId || payment._id);
      if (res?.data) {
        setPaymentDetails(res.data);
      }
    } catch {
      setPaymentDetails({ payment });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle Approve Payment (#9)
  const handleConfirmApprove = async () => {
    if (!approveModalPayment) return;
    setActionProcessing(true);
    const toastId = toast.loading('Approving payment and confirming pilgrimage booking...');

    try {
      await adminService.approvePayment(approveModalPayment.paymentId || approveModalPayment._id);
      toast.dismiss(toastId);
      toast.success(`Payment ${approveModalPayment.paymentId} approved! Booking ${approveModalPayment.bookingRef} is now confirmed.`);
      setApproveModalPayment(null);
      fetchPayments();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'Failed to approve payment');
    } finally {
      setActionProcessing(false);
    }
  };

  // Handle Reject Payment (#10)
  const handleConfirmReject = async () => {
    if (!rejectModalPayment) return;
    if (!rejectReason.trim()) {
      toast.error('Please specify a rejection reason for the devotee');
      return;
    }

    setActionProcessing(true);
    const toastId = toast.loading('Recording rejection...');

    try {
      await adminService.rejectPayment(
        rejectModalPayment.paymentId || rejectModalPayment._id,
        rejectReason.trim()
      );
      toast.dismiss(toastId);
      toast.success(`Payment rejected. Booking ${rejectModalPayment.bookingRef} remains unconfirmed for retry.`);
      setRejectModalPayment(null);
      setRejectReason('');
      fetchPayments();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'Failed to reject payment');
    } finally {
      setActionProcessing(false);
    }
  };

  const getStatusBadge = (status, verificationStatus) => {
    if (verificationStatus === 'verified' || status === 'success') {
      return (
        <span style={{ background: '#E8F5EE', color: '#2E7D46', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
          ✓ Verified (Paid)
        </span>
      );
    }
    if (verificationStatus === 'verification_pending' || status === 'verification_pending') {
      return (
        <span style={{ background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, border: '1px solid #F59E0B' }}>
          ⏳ Verification Pending
        </span>
      );
    }
    if (verificationStatus === 'rejected' || status === 'failed') {
      return (
        <span style={{ background: '#FDECEA', color: '#B3261E', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
          ✕ Rejected / Failed
        </span>
      );
    }
    return (
      <span style={{ background: '#F3F4F6', color: '#6B7280', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
        {status?.toUpperCase() || 'PENDING'}
      </span>
    );
  };

  return (
    <div>
      {/* Title & Overview Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '26px' }}>💳</span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#4A0E1C', margin: 0, fontFamily: 'Cinzel, serif' }}>
              Payment Verification Center
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#6B615C', marginTop: '4px' }}>
            Verify manual UPI UTR reference submissions and manage real-time online transactions.
          </p>
        </div>

        {pendingCount > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            border: '1.5px solid #F59E0B',
            borderRadius: '10px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)',
          }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '13px', color: '#92400E' }}>
                {pendingCount} Payment{pendingCount > 1 ? 's' : ''} Awaiting Your Verification
              </div>
              <div style={{ fontSize: '11px', color: '#B45309' }}>
                Review customer UTRs below to approve and confirm bookings.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs & Search Filter */}
      <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #EAE0D5', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'verification_pending', label: `⏳ Verification Pending (${pendingCount})` },
              { id: 'verified', label: '✓ Verified & Confirmed' },
              { id: 'rejected', label: '✕ Rejected / Failed' },
              { id: 'all', label: 'All Transactions' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  border: '1px solid',
                  borderColor: activeTab === tab.id ? '#4A0E1C' : '#EAE0D5',
                  background: activeTab === tab.id ? '#4A0E1C' : '#FAF7F2',
                  color: activeTab === tab.id ? '#F2DEA2' : '#574C48',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '360px' }}>
            <input
              type="text"
              className="input"
              placeholder="Search by PNR, UTR, or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '13px', padding: '7px 12px' }}
            />
            <button type="submit" className="btn btn-outline btn-sm" style={{ padding: '7px 14px' }}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Payments Table (Section 8) */}
      <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAE0D5', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '1px solid #EAE0D5', color: '#4A0E1C', fontWeight: 700 }}>
                <th style={{ padding: '12px 16px' }}>Booking ID (PNR)</th>
                <th style={{ padding: '12px 16px' }}>Customer / Devotee</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Method</th>
                <th style={{ padding: '12px 16px' }}>UTR / Reference</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Submitted At</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#7A6E6A' }}>
                    Loading payments ledger...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#7A6E6A' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🕊️</div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#4A0E1C' }}>
                      No payments found in this view
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      New devotee UTR submissions will appear here for verification.
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const isPending = p.verificationStatus === 'verification_pending' || p.status === 'verification_pending';
                  return (
                    <tr
                      key={p.paymentId || p._id}
                      style={{
                        borderBottom: '1px solid #EDE6D9',
                        background: isPending ? '#FFFCF5' : '#FFFFFF',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* Booking ID */}
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#4A0E1C' }}>
                        <div>{p.bookingRef || p.bookingId?.pnr || 'N/A'}</div>
                        <div style={{ fontSize: '11px', color: '#7A6E6A', fontFamily: 'monospace' }}>
                          ID: {p.paymentId}
                        </div>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#2B2320' }}>
                          {p.customerDetails?.name || 'Devotee'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#7A6E6A' }}>
                          {p.customerDetails?.phone || 'No phone'}
                        </div>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#3B0A17', fontSize: '14px' }}>
                        ₹{p.amount?.toLocaleString('en-IN')}
                      </td>

                      {/* Method */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          textTransform: 'uppercase',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#F0E9DF',
                          color: '#4A0E1C',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}>
                          {p.method || 'UPI'}
                        </span>
                      </td>

                      {/* UTR */}
                      <td style={{ padding: '14px 16px' }}>
                        {p.utr ? (
                          <div style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#2E7D46',
                            background: '#E8F5EE',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            display: 'inline-block',
                            letterSpacing: '0.5px',
                          }}>
                            {p.utr}
                          </div>
                        ) : (
                          <span style={{ color: '#9A8580', fontStyle: 'italic', fontSize: '12px' }}>
                            Awaiting UTR
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        {getStatusBadge(p.status, p.verificationStatus)}
                      </td>

                      {/* Submitted At */}
                      <td style={{ padding: '14px 16px', color: '#6B615C', fontSize: '12px' }}>
                        {p.submittedAt ? new Date(p.submittedAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(p)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 10px', fontSize: '11.5px' }}
                          >
                            View
                          </button>

                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => setApproveModalPayment(p)}
                                style={{
                                  background: '#2E7D46',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '4px 10px',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                ✓ Approve
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setRejectModalPayment(p);
                                  setRejectReason('');
                                }}
                                style={{
                                  background: '#FDECEA',
                                  color: '#B3261E',
                                  border: '1px solid #F5C6CB',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
         1. PAYMENT DETAILS MODAL (Section 23)
         Never display sensitive payment secrets or passwords.
         ═══════════════════════════════════════════════════════════ */}
      {selectedPayment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', maxWidth: '580px', width: '100%', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #EAE0D5', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#C9A227', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Transaction Ledger Record
                </span>
                <h2 style={{ fontSize: '20px', color: '#4A0E1C', margin: '4px 0 0', fontFamily: 'Cinzel, serif' }}>
                  Payment: {selectedPayment.paymentId}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#7A6E6A' }}
              >✕</button>
            </div>

            {detailsLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7A6E6A' }}>Loading record...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#FAF7F2', padding: '14px', borderRadius: '10px' }}>
                  <div>
                    <span style={{ color: '#7A6E6A', fontSize: '11.5px', display: 'block' }}>Booking Reference (PNR)</span>
                    <strong style={{ color: '#4A0E1C', fontSize: '15px' }}>{selectedPayment.bookingRef}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#7A6E6A', fontSize: '11.5px', display: 'block' }}>Total Amount</span>
                    <strong style={{ color: '#2E7D46', fontSize: '17px' }}>₹{selectedPayment.amount?.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <span style={{ color: '#7A6E6A', fontSize: '11.5px', display: 'block' }}>Customer Name</span>
                    <strong>{selectedPayment.customerDetails?.name || 'N/A'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#7A6E6A', fontSize: '11.5px', display: 'block' }}>Phone</span>
                    <strong>{selectedPayment.customerDetails?.phone || 'N/A'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#7A6E6A', fontSize: '11.5px', display: 'block' }}>Payment Method</span>
                    <strong style={{ textTransform: 'uppercase' }}>{selectedPayment.method} ({selectedPayment.gateway})</strong>
                  </div>
                  <div>
                    <span style={{ color: '#7A6E6A', fontSize: '11.5px', display: 'block' }}>Reference / Order ID</span>
                    <strong style={{ fontFamily: 'monospace' }}>{selectedPayment.orderId}</strong>
                  </div>
                </div>

                <div style={{ background: '#F8F4EE', padding: '14px', borderRadius: '10px', border: '1px solid #EAE0D5' }}>
                  <span style={{ color: '#4A0E1C', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Bank UTR / Transaction Reference Number:
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'monospace', color: selectedPayment.utr ? '#2E7D46' : '#9A8580' }}>
                    {selectedPayment.utr || 'Not submitted yet'}
                  </div>
                  {selectedPayment.failureReason && (
                    <div style={{ marginTop: '8px', color: '#B3261E', fontSize: '12px' }}>
                      <strong>Rejection Reason:</strong> {selectedPayment.failureReason}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', color: '#6B615C' }}>
                  <div>Created: {new Date(selectedPayment.createdAt).toLocaleString('en-IN')}</div>
                  <div>Updated: {new Date(selectedPayment.updatedAt).toLocaleString('en-IN')}</div>
                  {selectedPayment.paidAt && (
                    <div style={{ gridColumn: 'span 2', color: '#2E7D46', fontWeight: 700 }}>
                      Paid At: {new Date(selectedPayment.paidAt).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                {/* Attempt History (#12) */}
                {paymentDetails?.attempts && paymentDetails.attempts.length > 0 && (
                  <div style={{ marginTop: '10px', borderTop: '1px solid #EAE0D5', paddingTop: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#4A0E1C', marginBottom: '8px', fontSize: '12.5px' }}>
                      Payment Attempt Audit Trail ({paymentDetails.attempts.length}):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {paymentDetails.attempts.map((att) => (
                        <div key={att.attemptId} style={{ display: 'flex', justifyContent: 'space-between', background: '#FAF7F2', padding: '6px 10px', borderRadius: '6px', fontSize: '11.5px' }}>
                          <span><strong>{att.attemptId}</strong> • {att.method}</span>
                          <span style={{ textTransform: 'uppercase', fontWeight: 700, color: att.status === 'success' ? '#2E7D46' : att.status === 'failed' ? '#B3261E' : '#92400E' }}>
                            {att.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #EAE0D5', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="btn btn-outline"
                style={{ padding: '8px 18px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
         2. APPROVE PAYMENT MODAL (#9)
         ═══════════════════════════════════════════════════════════ */}
      {approveModalPayment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', maxWidth: '460px', width: '100%', padding: '24px', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '42px' }}>✓</span>
              <h2 style={{ fontSize: '20px', color: '#2E7D46', margin: '8px 0 4px', fontFamily: 'Cinzel, serif' }}>
                Approve & Confirm Booking
              </h2>
              <p style={{ fontSize: '13px', color: '#6B615C', margin: 0 }}>
                Verify that you have received <strong>₹{approveModalPayment.amount?.toLocaleString('en-IN')}</strong> in the bank account for UTR:
              </p>
            </div>

            <div style={{ background: '#FAF7F2', padding: '14px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px', border: '1px solid #EAE0D5' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'monospace', color: '#4A0E1C' }}>
                {approveModalPayment.utr || 'N/A'}
              </div>
              <div style={{ fontSize: '12px', color: '#7A6E6A', marginTop: '4px' }}>
                Booking PNR: <strong>{approveModalPayment.bookingRef}</strong> • Devotee: <strong>{approveModalPayment.customerDetails?.name}</strong>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#574C48', marginBottom: '20px', lineHeight: 1.5 }}>
              ⚠️ Approving will update the payment status to <strong>Success (Verified)</strong> and change the pilgrimage booking status from <strong>Payment Pending</strong> to <strong>Confirmed</strong>.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                disabled={actionProcessing}
                onClick={() => setApproveModalPayment(null)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionProcessing}
                onClick={handleConfirmApprove}
                className="btn btn-gold"
                style={{ flex: 1, background: '#2E7D46', borderColor: '#2E7D46', color: '#FFFFFF' }}
              >
                {actionProcessing ? 'Processing...' : 'Confirm Approval →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
         3. REJECT PAYMENT MODAL (#10)
         ═══════════════════════════════════════════════════════════ */}
      {rejectModalPayment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', maxWidth: '460px', width: '100%', padding: '24px', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '18px', color: '#B3261E', margin: 0 }}>
                Reject Payment Verification
              </h2>
              <button
                type="button"
                onClick={() => setRejectModalPayment(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#7A6E6A' }}
              >✕</button>
            </div>

            <p style={{ fontSize: '13px', color: '#6B615C', margin: '0 0 14px 0' }}>
              Rejecting payment for booking <strong>{rejectModalPayment.bookingRef}</strong> (₹{rejectModalPayment.amount?.toLocaleString('en-IN')}). The booking will remain unconfirmed and the devotee will be allowed to retry.
            </p>

            <div style={{ marginBottom: '18px' }}>
              <label className="formLabel" style={{ fontSize: '12.5px', display: 'block', marginBottom: '6px' }}>
                Rejection Reason <span style={{ color: '#B3261E' }}>*</span>
              </label>
              <textarea
                className="input"
                rows={3}
                required
                placeholder="e.g. UTR not found in bank statement, amount mismatch, or incorrect reference"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ width: '100%', fontSize: '13px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                disabled={actionProcessing}
                onClick={() => setRejectModalPayment(null)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionProcessing || !rejectReason.trim()}
                onClick={handleConfirmReject}
                style={{
                  flex: 1,
                  background: '#B3261E',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '10px',
                }}
              >
                {actionProcessing ? 'Rejecting...' : 'Reject Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
