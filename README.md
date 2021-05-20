<h1 align="center">
    <img alt="BluelabLogo" title="Bluelab" src=".github/bluelab.png" />
</h1>

# Api do desafio da Bluelab

Api desenvolvido como parte do processo seletivo em que é necessário realizar um projeto fullstack.

## Sobre a api

Esta aplicação é uma api rest onde conecta com o banco de dados sqlite3 em ambiente de desenvolvimento para fazer poder introduzir informações a respeito do usuário.

Este usuário apresenta primeiro nome, sobrenome, telefone e cpf e sua criação necessita obritatoriamente que tanto cpf e telefone sejão valores válidos para assim poder ser introduizdo no banco de dados.

A api ainda apresenta métodos com requisição GET, PUT, DELETE, de forma que possa resgatar as informações de todos (e um) usuário, atualização e exclusão dos mesmos.

Ainda é apresentável testes que ajudam a verificar se há vulnerabilidades e bugs.

## Dependências

Para o funcionamento da aplicação é necessário primeiro baixar as dependências com:

```
npm install
ou
yarn
```

## Migrations

Neste projeto foi utlizado o [TypeORM](https://typeorm.io/#/using-ormconfig) e é necessário rodar as migrations de forma que as tabelas possam ser criados no banco de dados

```
npm run typeorm migration:run
ou
yarn typeorm migration:run
```

## Rodando a api

Instalado as dependências e rodado as migrations, você pode simplesmente rodar:

```
npm run dev
ou
yarn dev
```

Para rodar o servidor na porta 3333.

## Testes

Para rodar os testes, basta rodar:

```
npm run test
ou
yarn test
```

E o [Jest](https://jestjs.io/pt-BR/) vai criar um banco de dados de testes e realizar os todos os testes do controller da aplicação, deletando as informações do banco teste após a requisição.

## Swagger e requisições

Além dos testes práticos e pelo jest, também está documentado os métodos através do link do
<a href="https://app.swaggerhub.com/apis-docs/RenatoDTH/Bluelab_Desafio/1.0.0-oas3" target="_blank">Swagger</a> onde poderá visualizar cada um das requisições da api. ( Caso o site não abra, o html dele está na pasta public e pode ser vista <a href="https://htmlpreview.github.io/?https://github.com/RenatoDTH/Desafio_Bluelab_Backend/blob/master/src/public/SwaggerDocumentation.html" target="_blank">aqui</a> ).

Entre as requisições temos o

- POST

  Onde se recebe um body com as informações de firstname, lastname, phone e cpf, tomando cuidado com os campos de telefone e cpf para que sejam campos válidos.

  ```
  {
  "firstname": "Test1",
  "lastname": "Test1",
  "cpf": "35203794499",
  "phone": "42940403291"
  }
  ```

  E sua resposta será um json com novos campos:

  ```
  {
  "id": "d81dbb6b-b48c-4cba-a60c-7eba4d77f922",
  "firstname": "Test1",
  "lastname": "Test1",
  "phone": "42940403291",
  "cpf": "35203794499",
  "updated_at": "2021-05-15T22:38:45.000Z",
  "created_at": "2021-05-15T22:38:45.000Z"
  }
  ```

  Onde o id é gerado de forma única pela biblioteca do [uuid](https://github.com/uuidjs/uuid#readme).

- GET

  Uma Requisição simples que retorna todos os usuários da api:

  ```
  {
    "id": "2d3ed8fc-830e-4e26-9c9b-2e9dc6a158a4",
    "firstname": "Test1",
    "lastname": "Test1",
    "phone": "12972487718",
    "cpf": "75429947008",
    "updated_at": "2021-05-15T19:54:55.000Z",
    "created_at": "2021-05-15T19:54:55.000Z"
  },
  {
    "id": "e394b660-184c-4313-bd75-1bac56f85ddc",
    "firstname": "Test2",
    "lastname": "Test2",
    "phone": "2130212361",
    "cpf": "55487731780",
    "updated_at": "2021-05-15T22:37:39.000Z",
    "created_at": "2021-05-15T22:37:39.000Z"
  }
  ```

- GET (1 usuário)

  Necessitando do parâmetro id na rota da requisição, ele retornará somente o usuário do correspondente id, ou retornará erro por não ter nenhum usuário com tal id.

- PUT

  Necessitando do parâmetro id na rota da requisição, ele irá atualizar o somente o campo do telefone.

  Ele inicialmente recebe um body com o campo phone preenchido e retorna o usuário atualizado.

  ```
  body:

  {
    "phone": "49972488820"
  }

  resposta:

  {
    "id": "119025a4-ace6-416d-9eac-17a7806629a5",
    "firstname": "Test",
    "lastname": "1",
    "phone": "49972488820",
    "cpf": "56559613003",
    "created_at": "2021-05-15T19:52:31.000Z",
    "updated_at": "2021-05-16T02:35:46.000Z"
  }
  ```

- DELETE

  Recebendo o id como parâmetro de rota, ele simplesmente delta o usuário do banco de dados.

Para estes testes em específico, ao longo do projeto, foi utilizado além dos testes, o [Insomnia](https://insomnia.rest/download) e seu arquivo está na pasta public para importação.
