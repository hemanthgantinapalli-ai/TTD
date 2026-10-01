import app from '../server/src/app.js';
import connectDB from '../server/src/config/database.js';

let isConnected = false;

export default async function handler(req, res) {
  // Ensure MongoDB connection is active
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('MongoDB Atlas connection error in Vercel serverless handler:', err);
    }
  }

  // Delegate request to Express app
  return app(req, res);
}
