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
});
