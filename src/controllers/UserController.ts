import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as Yup from 'yup';
import { validateCPF, validatePhone } from 'validations-br';
import { UserRepository } from '../repositories';
import { AppError } from '../errors/AppError';

class UserController {
  async create(request: Request, response: Response) {
    const { firstname, lastname, phone, cpf } = request.body;

    const data = {
      firstname,
      lastname,
      phone,
      cpf,
    };

    const schema = Yup.object().shape({
      firstname: Yup.string().required('Nome obrigatório'),
      lastname: Yup.string().required('Sobreneme obrigatório'),
      cpf: Yup.string()
        .required('CPF obrigatório')
        .test('validação do cpf', 'CPF Inválido', value => validateCPF(value)),
      phone: Yup.string()
        .required('Telefone obrigatório')
        .test('validação do telefone', 'Telefone Inválido', value =>
          validatePhone(value),
        ),
    });

    try {
      await schema.validate(data, { abortEarly: false });
    } catch (err) {
      throw new AppError(err.message);
    }

    const usersRepository = getCustomRepository(UserRepository);
    const phoneAlreadyExists = await usersRepository.findOne({
      phone,
    });

    if (phoneAlreadyExists) {
      throw new AppError('Telefone já existente!');
    }

    const cpfAlreadyExists = await usersRepository.findOne({
      cpf,
    });

    if (cpfAlreadyExists) {
      throw new AppError('CPF já existente!');
    }

    const user = usersRepository.create(data);

    await usersRepository.save(user);

    return response.status(201).json(user);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const usersRepository = getCustomRepository(UserRepository);

    const userList = await usersRepository.find();

    return response.status(200).json(userList);
  }

  async showByUser(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const usersRepository = getCustomRepository(UserRepository);

    const oneUser = await usersRepository.findOne(id);

    if (!oneUser) {
      throw new AppError('Informações do usuário não armazenadas.');
    }

    return response.status(200).json(oneUser);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const usersRepository = getCustomRepository(UserRepository);

    await usersRepository.delete(id);

    return response.json('Usuário deletado com sucesso');
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { phone } = request.body;

    const usersRepository = getCustomRepository(UserRepository);

    const user = await usersRepository.findOne(id);

    if (!user) {
      throw new AppError('Usuário não encontrado!');
    }

    const isValid = validatePhone(phone);

    if (!isValid) {
      throw new AppError('Telefone Inválido');
    }

    const updatedUser = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      phone,
      cpf: user.cpf,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const updateUser = await usersRepository.save(updatedUser);

    return response.json(updateUser);
  }
}

export { UserController };
