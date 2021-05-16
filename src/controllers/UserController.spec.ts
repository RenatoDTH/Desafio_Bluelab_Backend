// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database/connection';

describe('UserController', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  describe('Create Method', () => {
    test('should return 201 if user is created', async () => {
      const response = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212361',
        cpf: '07921979092',
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    test('should return 400 cpf is invalid', async () => {
      const response = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212361',
        cpf: 'any_cpf',
      });
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'CPF Inválido',
        success: false,
      });
    });

    test('should return 400 phone is invalid', async () => {
      const response = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: 'any_phone',
        cpf: '07921979092',
      });
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'Telefone Inválido',
        success: false,
      });
    });

    test('should return 400 if firstname is not provided', async () => {
      const response = await request(app).post('/users').send({
        lastname: 'any_last_name',
        phone: '2130212361',
        cpf: '07921979092',
      });
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'Nome obrigatório',
        success: false,
      });
    });

    test('should return 400 if lastname is not provided', async () => {
      const response = await request(app).post('/users').send({
        firstname: 'any_first_name',
        phone: '2130212361',
        cpf: '07921979092',
      });
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'Sobreneme obrigatório',
        success: false,
      });
    });

    test('should return 400 if phone is not provided', async () => {
      const response = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        cpf: '07921979092',
      });
      expect(response.status).toBe(400);
    });

    test('should return 400 if cpf is not provided', async () => {
      const response = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212361',
      });
      expect(response.status).toBe(400);
    });

    test('should return 400 if there is a user with same phone', async () => {
      await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212361',
        cpf: '07921979092',
      });

      const response = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212361',
        cpf: '28946272031',
      });

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'Telefone já existente!',
        success: false,
      });
    });

    test('should return 400 if there is a user with same cpf', async () => {
      await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212361',
        cpf: '07921979092',
      });

      const response = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212362',
        cpf: '07921979092',
      });

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'CPF já existente!',
        success: false,
      });
    });
  });

  describe('Index method', () => {
    test('should be able to return all users', async () => {
      await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212361',
        cpf: '07921979092',
      });

      await request(app).post('/users').send({
        firstname: 'any_first_name2',
        lastname: 'any_last_name2',
        phone: '2130212362',
        cpf: '76643340047',
      });

      const response = await request(app).get('/users');
      expect(response.body.length).toBe(2);
    });
  });

  describe('ShowByUser method', () => {
    test('should be able to return the correct user', async () => {
      const user = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212367',
        cpf: '28946272031',
      });
      const response = await request(app).get(`/users/${user.body.id}`);
      expect(response.body.firstname).toBe('any_first_name');
      expect(response.statusCode).toBe(200);
    });

    test('should return error if no user is found', async () => {
      const response = await request(app).get('/users/any_id');
      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'Informações do usuário não armazenadas.',
        success: false,
      });
    });
  });

  describe('Delete method', () => {
    test('should be able delete user', async () => {
      const user = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212369',
        cpf: '28946272031',
      });
      const response = await request(app).delete(`/users/${user.body.id}`);

      expect(response.body).toBe('Usuário deletado com sucesso');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('Update method', () => {
    test('should be able update user', async () => {
      const user = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212369',
        cpf: '28946272031',
      });

      const response = await request(app).put(`/users/${user.body.id}`).send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '1130212462',
        cpf: '07921979092',
      });

      expect(response.body).not.toBe(user.body);
    });

    test('should returns error if no user is find', async () => {
      const response = await request(app).put('/users/any_id').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '1130212462',
        cpf: '07921979092',
      });

      expect(response.body).toStrictEqual({
        message: 'Usuário não encontrado!',
        success: false,
      });
    });

    test('should return 400 if phone is invalid', async () => {
      const user = await request(app).post('/users').send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '2130212369',
        cpf: '28946272031',
      });

      const response = await request(app).put(`/users/${user.body.id}`).send({
        firstname: 'any_first_name',
        lastname: 'any_last_name',
        phone: '111111111',
        cpf: '07921979092',
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
