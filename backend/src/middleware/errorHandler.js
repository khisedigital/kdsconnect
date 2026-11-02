import {ZodError} from 'zod';

import {env} from '../config/env.js';
import {AppError} from '../utils/errors.js';

export function notFoundHandler(req, res, next) {
  next(
    new AppError({
      message: `Route ${req.method} ${req.originalUrl} not found`,
      status: 404,
      code: 'NOT_FOUND',
    }),
  );
}

export function errorHandler(err, req, res, _next) {
  let status = 500;
  let code = 'HTTP_ERROR';
  let message = 'Internal server error';
  let details;

  if (err instanceof AppError) {
    status = err.status;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    status = 400;
    code = 'VALIDATION';
    message = 'Request validation failed';
    details = err.flatten();
  } else if (err?.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    code = 'CONFLICT';
    message = 'A record with this value already exists';
    details = {fields: err.fields};
  } else if (err?.name === 'SequelizeValidationError') {
    status = 400;
    code = 'VALIDATION';
    message = err.errors?.[0]?.message ?? 'Validation failed';
  }

  if (!env.isProd && status >= 500 && !(err instanceof AppError)) {
    console.error(err);
  }

  res.status(status).json({
    code,
    message,
    ...(details ? {details} : {}),
    ...(!env.isProd && status >= 500 && !(err instanceof AppError)
      ? {stack: err.stack}
      : {}),
  });
}
