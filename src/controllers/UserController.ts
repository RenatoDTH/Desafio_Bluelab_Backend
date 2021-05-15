import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as Yup from 'yup';
import { validateCPF, validatePhone } from 'validations-br';
import { UserRepository } from '../repositories';
import { AppError } from '../errors/AppError';

class UserController {
  async create(request: Request, response: Response) {
    const { firstname, lastname, phone, cpf } = request.body;

    const schema = Yup.object().shape({
      firstname: Yup.string().required('Nome obrigatório'),
      lastname: Yup.string().required('Sobreneme obrigatório'),
      cpf: Yup.string()
        .required()
        .test('Validação de cpf', 'CPF inválido', value => validateCPF(value)),
      phone: Yup.string()
        .required()
        .test('Validação de telefone', 'Telefone inválido', value =>
          validatePhone(value),
        ),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new Error(err);
    }

    const usersRepository = getCustomRepository(UserRepository);
    const phoneAlreadyExists = await usersRepository.findOne({
      phone,
    });

    if (phoneAlreadyExists) {
      throw new AppError(false, 'Phone already exists!', 400);
    }

    const cpfAlreadyExists = await usersRepository.findOne({
      cpf,
    });

    if (cpfAlreadyExists) {
      throw new AppError(false, 'CPF already exists!', 400);
    }

    const user = usersRepository.create({
      firstname,
      lastname,
      phone,
      cpf,
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };
