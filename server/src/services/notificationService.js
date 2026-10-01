import Notification from '../models/Notification.js';

// Active Server-Sent Events subscribers (Admin clients)
const sseClients = new Set();

/**
 * Register a new admin client for real-time Server-Sent Events
 */
export const registerNotificationStream = (res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // Send initial connected handshake
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Real-time admin notification stream active' })}\n\n`);

  sseClients.add(res);

  // Heartbeat ping every 25 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 25000);

  res.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
};

/**
 * Create a notification in MongoDB and broadcast it in real time to all connected admin clients
 */
export const createAndBroadcastNotification = async ({
  title,
  message,
  type = 'booking_payment',
  category = 'Payments',
  priority = 'urgent',
  metadata = {},
  link = '/admin/bookings',
}) => {
  try {
    const notif = await Notification.create({
      title,
      message,
      type,
      category,
      priority,
      metadata,
      link,
      read: false,
    });

    const payload = notif.toJSON();

    // Broadcast in real-time to all connected admin screens
    const eventData = `data: ${JSON.stringify({ type: 'NEW_NOTIFICATION', payload })}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(eventData);
      } catch (err) {
        console.warn('Failed to push to SSE client:', err.message);
        sseClients.delete(client);
      }
    }

    return notif;
  } catch (err) {
    console.error('Error creating/broadcasting notification:', err);
    return null;
  }
};

/**
 * Get active connection count
 */
export const getActiveSubscribersCount = () => sseClients.size;
