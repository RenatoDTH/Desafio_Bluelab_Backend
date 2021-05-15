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
      throw new AppError(err);
    }

    const usersRepository = getCustomRepository(UserRepository);
    const phoneAlreadyExists = await usersRepository.findOne({
      phone,
    });

    if (phoneAlreadyExists) {
      throw new AppError('Phone already exists!');
    }

    const cpfAlreadyExists = await usersRepository.findOne({
      cpf,
    });

    if (cpfAlreadyExists) {
      throw new AppError('CPF already exists!');
    }

    const user = usersRepository.create(data);

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };
