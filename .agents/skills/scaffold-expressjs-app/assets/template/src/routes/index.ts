import { createHealthController } from '@/controllers/createHealthController';
import { Router } from 'express';

const publicRouter = Router();
const privateRouter = Router();
const healthController = createHealthController();

publicRouter.get('/health', healthController.read);

export { privateRouter, publicRouter };
