import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { ROUTES } from '../../constants/routes';

function timeAgo(dateString) {
  if (!dateString) return 'Just now';
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  return `${diffDay}d ago`;
}

// Synthesize pleasant 2-tone divine alert chime using Web Audio API
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // First bell tone (880Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second bell tone (1320Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.12);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // Audio context may require user interaction
  }
}

const CATEGORY_STYLES = {
  booking_payment: {
    badgeBg: '#FEF3C7',
    badgeColor: '#92400E',
    iconColor: '#D97706',
    icon: '💰',
    tag: 'Payment Received',
    borderLeft: '4px solid #D97706',
  },
  booking_pending: {
    badgeBg: '#FFF8E6',
    badgeColor: '#B97A00',
    iconColor: '#B97A00',
    icon: '⏳',
    tag: 'Pending Approval',
    borderLeft: '4px solid #E3C05C',
  },
  booking_new: {
    badgeBg: '#E8F5EE',
    badgeColor: '#2E7D46',
    iconColor: '#2E7D46',
    icon: '🎟️',
    tag: 'New Booking',
    borderLeft: '4px solid #2E7D46',
  },
  lead_new: {
    badgeBg: '#EAF0FB',
    badgeColor: '#1E5AA8',
    iconColor: '#1E5AA8',
    icon: '✉️',
    tag: 'Pilgrim Enquiry',
    borderLeft: '4px solid #1E5AA8',
  },
  system_alert: {
    badgeBg: '#FDF2F4',
    badgeColor: '#8C2A3B',
    iconColor: '#8C2A3B',
    icon: '🛕',
    tag: 'Temple Advisory',
    borderLeft: '4px solid #8C2A3B',
  },
};

const SOUND_PREF_KEY = 'ttd_admin_sound_alert';

const AdminNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'payments' | 'bookings' | 'inquiries' | 'unread'
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem(SOUND_PREF_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle sound alert
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_PREF_KEY, String(next));
      } catch {}
      if (next) playNotificationChime();
      return next;
    });
  };

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await adminService.getNotifications();
      if (res?.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.warn('Error fetching notifications:', err);
    }
  }, []);

  // 1. Initial Load & Background Polling fallback
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 25000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // 2. Real-Time Server-Sent Events (SSE) Stream
  useEffect(() => {
    let eventSource = null;
    let reconnectTimeout = null;

    const connectSSE = () => {
      try {
        const token = localStorage.getItem('ttd_token') || sessionStorage.getItem('ttd_token') || '';
        const streamUrl = `/api/admin/notifications/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;

        eventSource = new EventSource(streamUrl);

        eventSource.onopen = () => {
          console.debug('[SSE] Admin notification stream connected');
        };

        eventSource.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.type === 'NEW_NOTIFICATION' && data.payload) {
              const newNotif = data.payload;

              // Prepend new notification immediately to state
              setNotifications((prev) => [
                {
                  id: newNotif._id || newNotif.id || `notif_${Date.now()}`,
                  type: newNotif.type || 'booking_payment',
                  category: newNotif.category || 'Payments',
                  priority: newNotif.priority || 'urgent',
                  title: newNotif.title,
                  message: newNotif.message,
                  amount: newNotif.metadata?.amount,
                  metadata: newNotif.metadata,
                  link: newNotif.link || '/admin/bookings',
                  timestamp: newNotif.createdAt || new Date().toISOString(),
                  read: false,
                },
                ...prev.filter((n) => n.id !== (newNotif._id || newNotif.id)),
              ]);

              // Play chime if enabled
              if (soundEnabled) {
                playNotificationChime();
              }

              // Show prominent interactive Toast
              toast.custom((t) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#3B0A17',
                    color: '#FAF0F2',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                    border: '1.5px solid #E3C05C',
                    animation: t.visible ? 'fadeInSlide 0.3s ease' : 'fadeOut 0.3s ease',
                    maxWidth: '440px',
                    zIndex: 99999,
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🔔</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#F2DEA2' }}>
                      {newNotif.title || 'New Payment Received!'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#E8D5D8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {newNotif.message}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toast.dismiss(t.id);
                      navigate(ROUTES.ADMIN_BOOKINGS);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #F2DEA2, #E3C05C)',
                      color: '#3B0A17',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    View
                  </button>
                </div>
              ), { duration: 6000 });
            }
          } catch (err) {
            console.debug('[SSE] Parse message warning:', err);
          }
        };

        eventSource.onerror = () => {
          eventSource.close();
          // Attempt reconnect after 5s
          reconnectTimeout = setTimeout(connectSSE, 5000);
        };
      } catch (err) {
        console.warn('[SSE] Connection initialization failed:', err);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [soundEnabled, navigate]);

  // Close dropdown on outside click or Esc
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id, link) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await adminService.markNotificationRead(id);
    } catch {}
    if (link) {
      setIsOpen(false);
      navigate(link);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await adminService.markAllNotificationsRead();
      toast.success('All notifications marked as read');
    } catch {}
  };

  const handleDeleteNotif = async (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await adminService.deleteNotification(id);
    } catch {}
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'payments' && n.category !== 'Payments' && n.type !== 'booking_payment') return false;
    if (activeTab === 'bookings' && n.category !== 'Bookings' && n.type !== 'booking_new') return false;
    if (activeTab === 'inquiries' && n.category !== 'Inquiries' && n.type !== 'lead_new') return false;
    if (activeTab === 'unread' && n.read) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title?.toLowerCase().includes(q);
      const matchMsg = n.message?.toLowerCase().includes(q);
      const matchPnr = n.metadata?.pnr?.toLowerCase().includes(q);
      const matchCust = n.metadata?.customerName?.toLowerCase().includes(q);
      return matchTitle || matchMsg || matchPnr || matchCust;
    }
    return true;
  });

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Notification Bell Icon */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Admin Real-Time Notifications"
        title="Real-Time Admin Notifications"
        style={{
          background: isOpen ? '#F0E9DF' : 'transparent',
          border: '1px solid',
          borderColor: isOpen ? '#D8CBB8' : 'transparent',
          borderRadius: '8px',
          padding: '6px 8px',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.background = '#F6F2EC';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'transparent';
        }}
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke={unreadCount > 0 ? '#3B0A17' : '#7A6E6A'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Live Pulse Badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: 'linear-gradient(135deg, #B3261E, #8C0E1C)',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 800,
              borderRadius: '12px',
              padding: '1px 6px',
              lineHeight: '15px',
              minWidth: '18px',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(140, 14, 28, 0.45)',
              border: '1.5px solid #FFFFFF',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Advanced Notification Flyout Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: '-10px',
            width: '420px',
            maxWidth: 'calc(100vw - 32px)',
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #EAE0D5',
            boxShadow: '0 16px 40px rgba(43, 10, 18, 0.18), 0 4px 12px rgba(0,0,0,0.06)',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '82vh',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #3B0A17 0%, #1A0308 100%)',
              color: '#FAF0F2',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🔔</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#F2DEA2', fontFamily: 'Cinzel, serif' }}>
                  Admin Notification Center
                </div>
                <div style={{ fontSize: '10.5px', color: '#D8CCD0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#25D366' }} />
                  Live SSE Connected • {unreadCount} Unread
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Sound Alert Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                title={soundEnabled ? 'Sound alert enabled (Click to mute)' : 'Sound alert muted (Click to unmute)'}
                style={{
                  background: soundEnabled ? 'rgba(242, 222, 162, 0.2)' : 'rgba(255,255,255,0.1)',
                  border: '1px solid',
                  borderColor: soundEnabled ? '#F2DEA2' : 'rgba(255,255,255,0.2)',
                  color: soundEnabled ? '#F2DEA2' : '#D8CCD0',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{soundEnabled ? '🔊' : '🔇'}</span>
              </button>

              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F2DEA2',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '4px 6px',
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Quick Search */}
          <div style={{ padding: '8px 14px', background: '#FAF7F2', borderBottom: '1px solid #EAE0D5' }}>
            <input
              type="text"
              placeholder="Search by PNR, Devotee, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#FFFFFF',
                border: '1px solid #D8CBB8',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              background: '#FAF7F2',
              borderBottom: '1px solid #EAE0D5',
              padding: '4px 10px',
              gap: '4px',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'all', label: `All (${notifications.length})` },
              { id: 'payments', label: '💰 Payments' },
              { id: 'bookings', label: '🎟️ Bookings' },
              { id: 'inquiries', label: '✉️ Inquiries' },
              { id: 'unread', label: `Unread (${unreadCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? '#3B0A17' : 'transparent',
                  color: activeTab === tab.id ? '#F2DEA2' : '#6B615C',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div style={{ overflowY: 'auto', maxHeight: '420px', padding: '6px 0' }}>
            {filteredNotifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', color: '#9A8580' }}>
                <span style={{ fontSize: '32px' }}>🕊️</span>
                <div style={{ fontWeight: 600, fontSize: '13.5px', marginTop: '6px', color: '#4A0E1C' }}>
                  No notifications in this view
                </div>
                <div style={{ fontSize: '11.5px', marginTop: '2px' }}>
                  Real-time updates will automatically appear here when new bookings or payments occur.
                </div>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const styleConfig = CATEGORY_STYLES[notif.type] || CATEGORY_STYLES.booking_confirmed;
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id, notif.link || ROUTES.ADMIN_BOOKINGS)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #F0EAE1',
                      borderLeft: styleConfig.borderLeft,
                      background: notif.read ? '#FFFFFF' : '#FEFAF0',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F7F2E8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = notif.read ? '#FFFFFF' : '#FEFAF0';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            background: styleConfig.badgeBg,
                            color: styleConfig.badgeColor,
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px',
                          }}
                        >
                          {styleConfig.icon} {styleConfig.tag}
                        </span>

                        {!notif.read && (
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: '#B3261E',
                              display: 'inline-block',
                            }}
                          />
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10.5px', color: '#9A8580', whiteSpace: 'nowrap' }}>
                          {timeAgo(notif.timestamp)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteNotif(notif.id, e)}
                          title="Dismiss"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#9A8580',
                            fontSize: '13px',
                            cursor: 'pointer',
                            padding: '0 2px',
                            lineHeight: 1,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div style={{ fontWeight: notif.read ? 600 : 700, fontSize: '13px', color: '#3B0A17', marginTop: '6px', lineHeight: 1.3 }}>
                      {notif.title}
                    </div>

                    <div style={{ fontSize: '12px', color: '#574C48', marginTop: '3px', lineHeight: 1.4 }}>
                      {notif.message}
                    </div>

                    {/* Metadata details if available */}
                    {notif.metadata && (notif.metadata.amount || notif.metadata.pnr) && (
                      <div
                        style={{
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '11px',
                          color: '#7A6E6A',
                          background: '#FAF7F2',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          width: 'fit-content',
                        }}
                      >
                        {notif.metadata.amount && (
                          <span style={{ fontWeight: 700, color: '#2E7D46' }}>
                            Amount: ₹{Number(notif.metadata.amount).toLocaleString('en-IN')}
                          </span>
                        )}
                        {notif.metadata.pnr && (
                          <span>PNR: <strong>{notif.metadata.pnr}</strong></span>
                        )}
                        {notif.metadata.transactionId && (
                          <span>Txn: <strong style={{ fontFamily: 'monospace' }}>{notif.metadata.transactionId}</strong></span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Action */}
          <div
            style={{
              padding: '10px 16px',
              background: '#FAF7F2',
              borderTop: '1px solid #EAE0D5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(ROUTES.ADMIN_BOOKINGS);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#4A0E1C',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Open Full Bookings Ledger →
            </button>

            <span style={{ fontSize: '10.5px', color: '#9A8580' }}>
              Real-time WebSocket/SSE active
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
