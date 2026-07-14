import { NextFunction, Request, Response } from 'express';
import { AnySchema, ValidationError } from 'yup';

export const validateBodyMiddleware = (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  };
};
