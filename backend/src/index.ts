import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import chatRoutes from './routes/chatRoutes';
import apiRoutes from './routes/api';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 8080;

// ---------------------
// Security Middleware
// ---------------------
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Rate limiting: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ---------------------
// API Routes
// ---------------------
app.use('/api/chat', chatRoutes);
app.use('/api', apiRoutes);

// ---------------------
// Static File Serving
// ---------------------
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath, {
  maxAge: '1d',
  etag: true,
}));

/** Health check endpoint for Cloud Run */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/** Fallback: serve React app for client-side routing */
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

app.listen(PORT, () => {
  logger.info(`ElecGuide server running on port ${PORT}`);
  logger.info(`Static files served from: ${publicPath}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
