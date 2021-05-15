import { Router } from 'express';
import { UserController } from './controllers';

const routes = Router();
const userController = new UserController();

routes.post('/users', userController.create);
routes.get('/users', userController.index);
routes.get('/users/:id', userController.showByUser);
routes.delete('/users/:id', userController.delete);

export { routes };
