import {badRequest} from '../utils/errors.js';

/**
 * Validates req.body / query / params with a Zod schema.
 * @param {'body'|'query'|'params'} source
 * @param {import('zod').ZodTypeAny} schema
 */
export function validate(source, schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(
        badRequest('Request validation failed', result.error.flatten()),
      );
    }
    req[source] = result.data;
    return next();
  };
}
