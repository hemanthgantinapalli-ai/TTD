import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = 'mongodb+srv://hemanthgantinapalli_db_user:HAzVE1OYaseF9WGc@cluster0.ymnaaho.mongodb.net/ttdyatra?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Warning] MongoDB not reachable (${error.message}). Running in-memory / mock mode for development.`);
    return false;
  }

};

export default connectDB;
