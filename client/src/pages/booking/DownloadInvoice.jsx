import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Logo from '../../components/common/Logo/Logo';

const DownloadInvoice = () => {
  const { id } = useParams();
  const invoiceId = id || 'INV-2026-9812';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="section" style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card" style={{ padding: '40px', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
            <Logo size="md" variant="default" showWordmark />
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '20px', color: 'var(--color-maroon-900)' }}>TAX INVOICE</h2>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Invoice #: {invoiceId}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Date: {new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', fontSize: '13px' }}>
            <div>
              <strong style={{ color: 'var(--color-maroon-900)' }}>Billed From:</strong><br />
              TTDYATRA Pilgrimage Services Pvt Ltd<br />
              Alipiri Bypass Road, Tirupati - 517501<br />
              GSTIN: 37AAACT1234F1Z5
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ color: 'var(--color-maroon-900)' }}>Billed To:</strong><br />
              Registered Devotee Guest<br />
              Tirumala Yatra Passenger
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--color-sandal-100)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', border: '1px solid var(--border-color)' }}>Description</th>
                <th style={{ padding: '10px 12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>SAC Code</th>
                <th style={{ padding: '10px 12px', border: '1px solid var(--border-color)', textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 12px', border: '1px solid var(--border-color)' }}>
                  Tirupati & Tirumala Pilgrimage Package & Transport Logistics
                </td>
                <td style={{ padding: '10px 12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>998555</td>
                <td style={{ padding: '10px 12px', border: '1px solid var(--border-color)', textAlign: 'right' }}>2,499.00</td>
              </tr>
              <tr>
                <td colSpan="2" style={{ padding: '8px 12px', border: '1px solid var(--border-color)', textAlign: 'right', fontWeight: 600 }}>
                  CGST (2.5%) + SGST (2.5%)
                </td>
                <td style={{ padding: '8px 12px', border: '1px solid var(--border-color)', textAlign: 'right' }}>125.00</td>
              </tr>
              <tr style={{ background: 'var(--color-gold-tint)', fontWeight: 700 }}>
                <td colSpan="2" style={{ padding: '10px 12px', border: '1px solid var(--border-color)', textAlign: 'right' }}>
                  Total Paid
                </td>
                <td style={{ padding: '10px 12px', border: '1px solid var(--border-color)', textAlign: 'right', color: 'var(--color-maroon-900)', fontSize: '15px' }}>
                  ₹2,624.00
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button type="button" onClick={handlePrint} className="btn btn-gold btn-sm">
              🖨️ Print Invoice
            </button>
            <Link to={ROUTES.HOME} className="btn btn-outline btn-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadInvoice;
