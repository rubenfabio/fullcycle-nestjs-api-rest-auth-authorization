# NestJS Auth com Prisma, RBAC e ABAC (CASL)

Este é um projeto de exemplo que demonstra como implementar um sistema de autenticação e autorização em uma aplicação NestJS, utilizando:
-   **Prisma** como ORM.
-   **Role-Based Access Control (RBAC)** para controle de acesso baseado em papéis.
-   **Attribute-Based Access Control (ABAC)** com **CASL** para um controle de permissões mais fino e granular.

Este projeto aplica os conceitos ensinados na aula de NestJS sobre autenticação e autorização da Full Cycle, disponível em: [https://www.youtube.com/watch?v=_ZyX4Vcofek](https://www.youtube.com/watch?v=_ZyX4Vcofek)

O repositório oficial do projeto pode ser encontrado em: [https://github.com/rubenfabio/fullcycle-nestjs-api-rest-auth-authorization](https://github.com/rubenfabio/fullcycle-nestjs-api-rest-auth-authorization)

## Features

-   Autenticação baseada em JWT (Access Token).
-   Controle de acesso por papéis (RBAC) com: `ADMIN`, `EDITOR`, `WRITER`, `READER`.
-   Gerenciamento de permissões dinâmicas e baseadas em atributos (ABAC) com CASL.
-   CRUD de Usuários e Posts.
-   Uso do Prisma como ORM para interação com o banco de dados PostgreSQL.
-   Configuração para desenvolvimento com Docker.

## Tecnologias Utilizadas

-   [NestJS](https://nestjs.com/)
-   [Prisma](https://www.prisma.io/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Docker](https://www.docker.com/)
-   [CASL (Attribute-Based Access Control)](https://casl.js.org/)
-   [JWT](https://jwt.io/)
-   [TypeScript](https://www.typescriptlang.org/)

## Começando

Siga as instruções abaixo para ter uma cópia do projeto rodando em sua máquina local para desenvolvimento e testes.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/)
-   [Docker](https://www.docker.com/get-started)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/rubenfabio/fullcycle-nestjs-api-rest-auth-authorization.git
    cd fullcycle-nestjs-api-rest-auth-authorization
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
    ```
    # String de conexão do seu banco de dados PostgreSQL
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

    # Chave secreta para a geração dos tokens JWT
    JWT_SECRET="your-secret-key"
    ```
    *Substitua os valores conforme necessário.*

4.  Inicie o container do PostgreSQL com Docker:
    ```bash
    docker-compose up -d
    ```

5.  Aplique as migrações do Prisma para criar as tabelas no banco de dados:
    ```bash
    npx prisma migrate dev
    ```

6.  Inicie a aplicação em modo de desenvolvimento:
    ```bash
    npm run start:dev
    ```

A aplicação estará disponível em `http://localhost:3000`.

## API Endpoints

O arquivo `api.http` na raiz do projeto contém exemplos de requisições para os principais endpoints da API. Você pode usá-lo com a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) do VS Code.

### Principais Endpoints

-   `POST /auth/login`: Autentica um usuário e retorna um token JWT.
-   `GET /users`, `POST /users`: Gerenciamento de usuários.
-   `GET /posts`, `POST /posts`: Gerenciamento de posts.

## Autenticação e Autorização

A segurança da aplicação é implementada com uma abordagem em camadas, combinando os conceitos de RBAC e ABAC.

-   **Autenticação**: O acesso às rotas protegidas é controlado pelo `AuthGuard`, que valida o JWT (JSON Web Token) enviado no cabeçalho `Authorization`.

-   **RBAC (Role-Based Access Control)**: Após a autenticação, o `RoleGuard` entra em ação. Ele verifica se o usuário possui o `role` (papel) necessário para acessar um determinado endpoint. Os papéis definidos no sistema são `ADMIN`, `EDITOR`, `WRITER` e `READER`. Essa é uma forma de controle de acesso mais ampla.

-   **ABAC (Attribute-Based Access Control) com CASL**: Para um controle mais granular, o projeto utiliza a biblioteca CASL. O ABAC não se baseia apenas no papel do usuário, mas também em atributos (do usuário, do recurso sendo acessado, do ambiente, etc.).
    -   No `CaslAbilityService`, as "habilidades" (abilities) de cada usuário são definidas. Por exemplo, um usuário com o papel `WRITER` pode ter permissão para `criar` e `ler` posts, mas só pode `atualizar` os posts que ele mesmo criou.
    -   Essa lógica permite regras complexas como: "Permitir que um usuário `READER` veja apenas os posts publicados (`published: true`)" ou "Permitir que um `ADMIN` gerencie todos os recursos (`manage all`)".
    -   Essa verificação é feita dinamicamente nos guards ou diretamente nos serviços, garantindo que as políticas de acesso sejam flexíveis e centralizadas.