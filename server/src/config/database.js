import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = 'mongodb+srv://hemanthgantinapalli_db_user:HAzVE1OYaseF9WGc@cluster0.ymnaaho.mongodb.net/ttdyatra?retryWrites=true&w=majority&appName=Cluster0';

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
