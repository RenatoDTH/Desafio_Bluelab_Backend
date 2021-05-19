import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUser1621095882710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'firstname',
            type: 'varchar',
          },
          {
            name: 'lastname',
            type: 'varchar',
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'cpf',
            type: 'varchar',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('users')
      .values([
        {
          id: '21ad9390-49da-4168-b511-55046c139d3b',
          firstname: 'Renato',
          lastname: 'Castro',
          phone: '11999199579',
          cpf: '25014966047',
          created_at: '2021-05-17T20:01:46.000Z',
          updated_at: '2021-05-17T20:01:46.000Z',
        },
        {
          id: 'e068cc73-859b-41fa-bb91-c317f0d335c5',
          firstname: 'Eduardo',
          lastname: 'Silva',
          phone: '11910345292',
          cpf: '18406097027',
          created_at: '2021-05-17T20:01:45.000Z',
          updated_at: '2021-05-17T20:01:45.000Z',
        },
        {
          id: 'eace4909-89b4-448d-8d4a-65eee3fe9229',
          firstname: 'Mario',
          lastname: 'Silva',
          phone: '11994345297',
          cpf: '05522221003',
          created_at: '2021-05-17T20:01:47.000Z',
          updated_at: '2021-05-17T20:01:47.000Z',
        },
        {
          id: 'b23c0ce5-52ae-4ab7-845c-fdd97d3e6fcd',
          firstname: 'Aline',
          lastname: 'Matos',
          phone: '11972345297',
          cpf: '45415359044',
          created_at: '2021-05-17T20:01:48.000Z',
          updated_at: '2021-05-17T20:01:48.000Z',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
