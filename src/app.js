import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDatabase } from './config/database.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
// Public API: allow browser clients from any origin, without cookie credentials.
// Handle preflight before parsing, rate limiting, or connecting to the database.
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/tasks', async (_req, res, next) => {
  try {
    await connectDatabase(process.env.MONGODB_URI);
    next();
  } catch (error) {
    // Connection errors can contain credentials; log only the error type.
    console.error('Database connection failed:', error.name);
    res.status(503).json({ message: 'Database unavailable. Please try again later.' });
  }
});
app.use('/api/tasks', taskRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);
