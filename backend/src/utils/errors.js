export class AppError extends Error {
  constructor({
    message,
    status = 500,
    code = 'HTTP_ERROR',
    details,
    isOperational = true,
  }) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
  }
}

export function badRequest(message, details) {
  return new AppError({message, status: 400, code: 'VALIDATION', details});
}

export function unauthorized(message = 'Unauthorized') {
  return new AppError({message, status: 401, code: 'UNAUTHORIZED'});
}

export function forbidden(message = 'Forbidden') {
  return new AppError({message, status: 403, code: 'FORBIDDEN'});
}

export function notFound(message = 'Resource not found') {
  return new AppError({message, status: 404, code: 'NOT_FOUND'});
}

export function conflict(message, details) {
  return new AppError({message, status: 409, code: 'CONFLICT', details});
}
