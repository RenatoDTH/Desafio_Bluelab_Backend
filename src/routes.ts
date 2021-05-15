import { Router } from 'express';
import { UserController } from './controllers';

const routes = Router();
const useController = new UserController();

routes.post('/users', useController.create);
routes.get('/users', (request, response) => {
  return response.json({ message: 'Hello Word - NLW04' });
});

export { routes };
