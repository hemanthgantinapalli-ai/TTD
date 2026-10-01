import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();

// Enable trust proxy for reverse proxies like Vercel and Heroku
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const configuredOrigins = (process.env.FRONTEND_URL || '')
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);

    const allowed = [
      ...configuredOrigins,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:4173',
      'https://ttd-sable.vercel.app',
    ];

    const isVercelDomain = /^https:\/\/[a-z0-9-]+(\.vercel\.app)$/i.test(origin);

    if (allowed.includes(origin) || isVercelDomain) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error in request:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;
