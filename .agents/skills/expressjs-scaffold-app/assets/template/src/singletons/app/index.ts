import { config } from '@/config';
import { dbClient } from '@/db';
import { privateRouter, publicRouter } from '@/routes';
import cors from 'cors';
import express from 'express';

export const app = express();

app.use(express.json());
app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use('/api', publicRouter);
app.use('/api', privateRouter);

export const startServer = async (params?: { port: number }) => {
  await dbClient.connect();
  const port = params?.port || config.port;

  app.listen(port, () => {
    console.log(`[server]: API running on port ${port}`);
  });
};
