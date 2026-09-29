import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { APP_CONFIG } from '../../config/appConfig';

const Support = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [tickets, setTickets] = useState([
    { id: 'TIC-1092', subject: 'Change pickup time to 04:30 AM', status: 'Resolved', date: 'Yesterday' }
  ]);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      toast.error('Please enter a subject and message');
      return;
    }

    const newTicket = {
      id: 'TIC-' + Math.floor(1000 + Math.random() * 9000),
      subject: ticketSubject,
      status: 'Open',
      date: 'Just now',
    };
    setTickets([newTicket, ...tickets]);
    setTicketSubject('');
    setTicketMessage('');
    toast.success('Support ticket created! A coordinator will respond within 15 minutes.');
  };

  return (
    <div className="card" style={{ padding: '32px' }}>
      <span className="eyebrow">24/7 Pilgrim Support</span>
      <h1 style={{ fontSize: '24px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '20px' }}>
        Help Desk & Support Tickets
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--color-sandal-100)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>📞</div>
          <strong>Immediate Phone Helpline</strong>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Speak directly to our Tirupati ground coordinator:
          </p>
          <a href={`tel:${APP_CONFIG.contact.phoneRaw}`} style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-maroon-900)' }}>
            {APP_CONFIG.contact.phone}
          </a>
        </div>

        <div style={{ background: 'var(--color-sandal-100)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>💬</div>
          <strong>WhatsApp Instant Support</strong>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Send a WhatsApp message for live location sharing and driver coordination:
          </p>
          <a href={APP_CONFIG.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>
            Chat on WhatsApp →
          </a>
        </div>
      </div>

      {/* New Ticket Form */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '14px' }}>
          Raise a Support Request
        </h3>
        <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '4px' }}>
              Subject
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Request wheelchair at Alipiri / Update pickup point"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '4px' }}>
              Message & Details
            </label>
            <textarea
              className="input"
              rows="3"
              placeholder="Describe what you need assistance with..."
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              required
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn btn-gold btn-sm" style={{ alignSelf: 'flex-start' }}>
            Submit Ticket →
          </button>
        </form>
      </div>

      {/* Existing Tickets */}
      <div>
        <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '12px' }}>
          Recent Support Tickets
        </h3>
        {tickets.map((t) => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '8px' }}>
            <div>
              <strong style={{ fontSize: '14px', color: 'var(--color-maroon-900)' }}>{t.subject}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ticket ID: {t.id} • {t.date}</div>
            </div>
            <span className={`badge ${t.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`}>
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
