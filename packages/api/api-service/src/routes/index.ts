import { createHealthController } from '@/controllers/createHealthController';
import { createUserController } from '@/controllers/createUserController';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { validateBodyMiddleware } from '@/middlewares/validateBodyMiddleware';
import { createUserSchema, loginUserSchema, updateUserSchema } from '@/validators/userSchema';
import { Router } from 'express';

const publicRouter = Router();
const privateRouter = Router();
const healthController = createHealthController();
const userController = createUserController();

privateRouter.use(authMiddleware);

publicRouter.get('/health', healthController.read);
publicRouter.post('/login', validateBodyMiddleware(loginUserSchema), userController.login);
privateRouter.post('/users', validateBodyMiddleware(createUserSchema), userController.create);
privateRouter.get('/users', userController.list);
privateRouter.get('/users/:id', userController.read);
privateRouter.put('/users/:id', validateBodyMiddleware(updateUserSchema), userController.update);
privateRouter.delete('/users/:id', userController.delete);

export { privateRouter, publicRouter };
