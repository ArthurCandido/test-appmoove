import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateBody = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await schema.parseAsync(req.body);
    req.body = parsed;
    return next();
  } catch (err) {
    return next(err);
  }
};
