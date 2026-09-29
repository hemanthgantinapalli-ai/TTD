import 'dotenv/config';
import app from './app.js';
import connectDB from './config/database.js';

const PORT = process.env.PORT || 5000;


// Connect to Database
connectDB().then(() => {
  // Start server only after DB connection
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server due to DB connection error:', err);
});
