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

  test('should be able to return the correct user', async () => {
    const user = await request(app).post('/users').send({
      firstname: 'any_first_name',
      lastname: 'any_last_name',
      phone: '2130212367',
      cpf: '28946272031',
    });
    const response = await request(app).get(`/users/${user.body.id}`);
    expect(response.body.firstname).toBe('any_first_name');
  });

  test('should be able delete user', async () => {
    const user = await request(app).post('/users').send({
      firstname: 'any_first_name',
      lastname: 'any_last_name',
      phone: '2130212369',
      cpf: '28946272031',
    });
    const response = await request(app).delete(`/users/${user.body.id}`);

    expect(response.body).toBe('Usuário deletado com sucesso');
  });
});
