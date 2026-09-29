import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    helplinePhone: '+91 91483 91081',
    whatsappNumber: '+91 91483 91081',
    supportEmail: 'darshan@ttdyatra.com',
    officeAddress: '19-3-2R, Renigunta Road, Korlagunta, Tirupati - 517501',
    paymentGatewayLive: true,
    enableSmsAlerts: true,
    enableWhatsAppAlerts: true,
    maxDailyBookingsLimit: 150,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res?.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.warn('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminService.updateSettings(settings);
      toast.success('Platform settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>⚙️</span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#4A0E1C', margin: 0, fontFamily: 'Cinzel, serif' }}>
              Platform Configuration & Support Settings
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#6B615C', marginTop: '4px' }}>
            Emergency helpline numbers, WhatsApp dispatch routing, and gateway parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E0D4C0', padding: '28px', maxWidth: '720px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h2 style={{ fontSize: '16px', color: '#4A0E1C', margin: '0 0 6px', borderBottom: '1px solid #E0D4C0', paddingBottom: '8px' }}>
            Pilgrim Support Routing
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                Helpline Phone Number
              </label>
              <input
                type="text"
                required
                value={settings.helplinePhone}
                onChange={(e) => setSettings({ ...settings, helplinePhone: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', fontSize: '13.5px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                Official WhatsApp Number
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', fontSize: '13.5px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
              Support Email Address
            </label>
            <input
              type="email"
              required
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', fontSize: '13.5px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
              Tirupati Local Help Desk Address
            </label>
            <input
              type="text"
              value={settings.officeAddress}
              onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', fontSize: '13.5px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
            />
          </div>

          <h2 style={{ fontSize: '16px', color: '#4A0E1C', margin: '14px 0 6px', borderBottom: '1px solid #E0D4C0', paddingBottom: '8px' }}>
            Booking Engine & Notification Controls
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer', color: '#2B2320' }}>
              <input
                type="checkbox"
                checked={settings.paymentGatewayLive}
                onChange={(e) => setSettings({ ...settings, paymentGatewayLive: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#4A0E1C' }}
              />
              <strong>Enable Instant Online Payment Gateway (Razorpay / UPI / NetBanking)</strong>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer', color: '#2B2320' }}>
              <input
                type="checkbox"
                checked={settings.enableWhatsAppAlerts}
                onChange={(e) => setSettings({ ...settings, enableWhatsAppAlerts: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#4A0E1C' }}
              />
              <strong>Dispatch Instant Booking Voucher to Devotee's WhatsApp</strong>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer', color: '#2B2320' }}>
              <input
                type="checkbox"
                checked={settings.enableSmsAlerts}
                onChange={(e) => setSettings({ ...settings, enableSmsAlerts: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#4A0E1C' }}
              />
              <strong>Send Hill Chauffeur Name & Vehicle AP Number SMS Alert 2 hours before pickup</strong>
            </label>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
              Maximum Daily Yatra Booking Capacity Limit
            </label>
            <input
              type="number"
              value={settings.maxDailyBookingsLimit}
              onChange={(e) => setSettings({ ...settings, maxDailyBookingsLimit: Number(e.target.value) })}
              style={{ width: '160px', padding: '9px 12px', fontSize: '13.5px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
            />
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 700,
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #4A0E1C 0%, #611626 100%)',
                color: '#F2DEA2',
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving...' : '💾 Save Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
