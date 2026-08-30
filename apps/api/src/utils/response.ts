import { Response } from 'express';

export function sendSuccess<T = any>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendError(
  res: Response,
  code = 'INTERNAL_ERROR',
  message = 'An unexpected error occurred',
  statusCode = 500,
  details?: any
) {
  const payload: any = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details && process.env.NODE_ENV !== 'production') {
    payload.error.details = details;
  }

  return res.status(statusCode).json(payload);
}
