import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { logger } from './utils';
import { apiRoutes, chatRoutes } from './routes';
import dotenv from 'dotenv';

dotenv.config();

// ---------------------
// Environment Validation
// ---------------------
if (!process.env.GEMINI_API_KEY) {
  logger.error('CRITICAL ERROR: GEMINI_API_KEY environment variable is missing.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

// ---------------------
// Security Middleware
// ---------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://apis.google.com', 'https://www.gstatic.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https://www.google.com', 'https://lh3.googleusercontent.com'],
        connectSrc: ["'self'", 'https://generativelanguage.googleapis.com', 'https://firestore.googleapis.com', 'https://identitytoolkit.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        frameSrc: ["'self'", 'https://maps.google.com', 'https://civicsync-844332838952.firebaseapp.com'],
      },
    },
    xContentTypeOptions: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);
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

/** Explicit root route handler to solve index.html serving issue */
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, 'index.html'));
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

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`CivicSync server running on port ${PORT}`);
    logger.info(`Static files served from: ${publicPath}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
