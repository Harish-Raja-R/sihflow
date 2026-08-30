import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return sendError(res, err.code, err.message, err.statusCode, err.details);
  }

  // Handle Prisma Known Request Errors
  if (err.code === 'P2002') {
    return sendError(res, 'UNIQUE_CONSTRAINT_VIOLATION', 'A record with this identifier already exists', 409);
  }

  if (err.code === 'P2025') {
    return sendError(res, 'NOT_FOUND', 'Requested database record was not found', 404);
  }

  console.error('Unhandled Application Error:', err);
  return sendError(
    res,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred' : err.message || 'Internal Server Error',
    500
  );
}
