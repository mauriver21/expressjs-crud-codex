import { Request, Response } from 'express';

export const createHealthController = () => {
  const read = (_req: Request, res: Response) => {
    return res.status(200).json({ status: 'ok' });
  };

  return { read };
};
