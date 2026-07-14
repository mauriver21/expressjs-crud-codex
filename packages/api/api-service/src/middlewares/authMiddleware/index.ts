import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config } from '@/config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return res.sendStatus(401);

  const token = authorization.slice('Bearer '.length);
  if (!token) return res.sendStatus(401);
  if (!config.jwtSecretKey) return next(new Error('JWT secret is not configured'));

  try {
    jwt.verify(token, config.jwtSecretKey);
    return next();
  } catch {
    return res.sendStatus(403);
  }
};
