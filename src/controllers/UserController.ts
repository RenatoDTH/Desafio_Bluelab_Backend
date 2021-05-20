import { Request, Response } from 'express';
import { UserService } from '../services';

class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    const { firstname, lastname, phone, cpf } = request.body;

    const userService = new UserService();

    const user = await userService.create(firstname, lastname, phone, cpf);

    return response.status(201).json(user);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const userService = new UserService();

    const userList = await userService.index();

    return response.status(200).json(userList);
  }

  async showByUser(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const userService = new UserService();

    const oneUser = await userService.showByUser(id);

    return response.status(200).json(oneUser);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const userService = new UserService();

    await userService.delete(id);

    return response.json('Usuário deletado com sucesso');
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { phone } = request.body;

    const userService = new UserService();

    const updateUser = await userService.update(id, phone);

    return response.json(updateUser);
  }
}

export { UserController };
