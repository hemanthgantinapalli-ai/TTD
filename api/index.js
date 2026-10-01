import app from '../server/src/app.js';
import connectDB from '../server/src/config/database.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in Vercel handler:', err);
    return res.status(503).json({
      status: 'error',
      message: 'Database connection temporarily unavailable. Please retry in a few seconds.',
      details: err.message,
    });
  }

  return app(req, res);
}
