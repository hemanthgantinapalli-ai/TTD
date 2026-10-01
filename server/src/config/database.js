import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = '';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (cached.conn) {
    return true;
  }

  const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false,
    }).then((m) => {
      console.log(`MongoDB Connected: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return true;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
