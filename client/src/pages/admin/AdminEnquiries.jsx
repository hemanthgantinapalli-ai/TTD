import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await adminService.getEnquiries();
      if (res?.data) {
        setEnquiries(res.data);
      }
    } catch (err) {
      console.warn('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateEnquiry(id, { status: newStatus });
      toast.success(`Enquiry marked as ${newStatus}`);
      fetchEnquiries();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📩</span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#4A0E1C', margin: 0, fontFamily: 'Cinzel, serif' }}>
              Devotee Inquiries & Leads
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#6B615C', marginTop: '4px' }}>
            Custom yatra packages, wheelchair elder care requests, and phone assistance leads.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {enquiries.map((enq) => (
          <div
            key={enq.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E0D4C0',
              padding: '20px 24px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '17px', color: '#4A0E1C', margin: 0 }}>
                    {enq.name}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#6B615C' }}>
                    ({enq.city})
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#6B615C', marginTop: '4px' }}>
                  📞 <strong>{enq.phone}</strong> • ✉️ {enq.email || 'N/A'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                  value={enq.status}
                  onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: '1px solid #D8CBB8',
                    background:
                      enq.status === 'New'
                        ? '#FFF8E6'
                        : enq.status === 'Contacted'
                        ? '#EBF1FB'
                        : enq.status === 'Converted'
                        ? '#EBF5EF'
                        : '#F3DEE2',
                    color:
                      enq.status === 'New'
                        ? '#B97A00'
                        : enq.status === 'Contacted'
                        ? '#1E5AA8'
                        : enq.status === 'Converted'
                        ? '#2E7D46'
                        : '#8C2A3B',
                    cursor: 'pointer',
                  }}
                >
                  <option value="New">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Converted">Converted to Booking</option>
                  <option value="Closed">Closed</option>
                </select>

                <a
                  href={`https://wa.me/${(enq.phone || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    background: '#25D366',
                    color: '#fff',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  WhatsApp Lead ↗
                </a>
              </div>
            </div>

            <div style={{ background: '#FAF0F2', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <strong>Requested Service:</strong> <span style={{ color: '#8C2A3B', fontWeight: 600 }}>{enq.serviceType}</span>
              </div>
              <div>
                <strong>Preferred Date:</strong> {enq.preferredDate}
              </div>
              <div>
                <strong>Devotees:</strong> {enq.travellersCount || 2} Persons
              </div>
            </div>

            {enq.message && (
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: '13px', color: '#4A3F3A', background: '#F8F2E4', padding: '12px', borderRadius: '6px' }}>
                "{enq.message}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEnquiries;
