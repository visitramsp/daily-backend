import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
const allowed = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({ origin(origin, callback) {
  if (!origin || allowed.includes(origin)) return callback(null, true);
  callback(Object.assign(new Error('CORS origin is not allowed'), { status: 403 }));
} }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/tasks', taskRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);
