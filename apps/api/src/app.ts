import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { v1Router } from './routes/v1';
import { errorHandler } from './middleware/error.middleware';
import { sendError, sendSuccess } from './utils/response';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Mount API Version 1
  app.use('/api/v1', v1Router);

  // Backward compatibility alias for legacy /api routes
  app.use('/api', v1Router);

  // Serve Frontend static assets if dist directory exists
  const possibleDistPaths = [
    path.resolve(process.cwd(), 'apps/web/dist'),
    path.resolve(process.cwd(), 'dist'),
    path.resolve(__dirname, '../../web/dist'),
    path.resolve(__dirname, '../../../apps/web/dist'),
  ];
  const webDistPath = possibleDistPaths.find((p) => fs.existsSync(path.join(p, 'index.html')));

  if (webDistPath) {
    app.use(express.static(webDistPath));
    app.get('*', (req: Request, res: Response, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(webDistPath, 'index.html'));
    });
  } else {
    // Root Health fallback
    app.get('/', (req: Request, res: Response) => {
      return sendSuccess(res, {
        service: 'SihFlow ERP Backend',
        version: '2.0.0',
        apiDocs: '/api/v1/health',
      });
    });
  }

  // 404 Handler for API endpoints
  app.use((req: Request, res: Response) => {
    return sendError(res, 'ROUTE_NOT_FOUND', `Cannot ${req.method} ${req.originalUrl}`, 404);
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
