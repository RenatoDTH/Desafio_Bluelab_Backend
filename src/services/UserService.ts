import { getCustomRepository, Repository } from 'typeorm';
import * as Yup from 'yup';
import { validateCPF, validatePhone } from 'validations-br';
import { UserRepository } from '../repositories';
import { AppError } from '../errors/AppError';
import { User } from '../entities';

class UserService {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getCustomRepository(UserRepository);
  }

  async create(
    firstname: string,
    lastname: string,
    phone: string,
    cpf: string,
  ): Promise<User> {
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

    const phoneAlreadyExists = await this.usersRepository.findOne({
      phone,
    });

    if (phoneAlreadyExists) {
      throw new AppError('Telefone já existente!');
    }

    const cpfAlreadyExists = await this.usersRepository.findOne({
      cpf,
    });

    if (cpfAlreadyExists) {
      throw new AppError('CPF já existente!');
    }

    const user = this.usersRepository.create(data);

    await this.usersRepository.save(user);

    return user;
  }

  async index(): Promise<User[]> {
    const userList = await this.usersRepository.find();

    return userList;
  }

  async showByUser(id: string): Promise<User> {
    const oneUser = await this.usersRepository.findOne(id);

    if (!oneUser) {
      throw new AppError('Informações de CPF não armazenadas.');
    }

    return oneUser;
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update(id: string, phone: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);

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

    const updateUser = await this.usersRepository.save(updatedUser);

    return updateUser;
  }
}

export { UserService };
