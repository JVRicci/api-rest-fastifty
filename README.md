# Configuração inicial do projeto

Para criação do projeto foram necessários alguns comandos

Criar package.json

```bash
    npm init -y
```

Instalar typescript como dependencia de dev

```bash
    npm install -D typescript
```

Instalar types para compatibilidade

```bash
    npm install -D @types/node
```

Startar o TS e converter arquivos em js

```bash
    npx tsc --init
    npx tsc ./src/server.ts
```

Para evitar fazer o processo manual conversão e possivel usar a lib


```bash
    npm install tsx -D
```

Após isso é só executar normalmente com npm run dev, pois está configurado no package.json

## ESLINT

Para padronização de código, é utilizado o ESLint
A instalação é através do seguinte comando

```bash
    npm i eslint @rocketseat/eslint-config -D
```

Após isso é necessário criar um arquivo chamado 

.eslintrc.json

E colocar a configuração interna dele igual a do arquivo do projeto


# Banco de Dados

Para o banco de dados é utilizado o SQLite e como query builder Knex

```bash
    npm install knex sqlite3
    npm install --save-dev cross-env
```

Após criar o arquivo knexfile.ts e database.ts, igual ao do projeto, rodar o seguinte comando 

```bash
    npx tsx knexfile.ts
```

Por padrão o knex não suporta TS, sendo necessário criar o arquivo de configuração knexfile, para importar as config de conexão do banco. Além disso, no package.config, adcionar a linha 

```js
    "knex": "tsx ./node_modules/knex/bin/cli.js --knexfile knexfile.ts",
```
    
Com isso é possivel rodar os comandos do Knex através do seguinte comando

```bash
    npm run knex -- migrate:make create-document
```

Sendo que o npm run serve para rodar o Knex. O que vem após ' -- ' é o comando em si do Knex

Obs: após executar a primeira query, o banco é criado no diretório que foi configurado no database.ts

# Comandos Knex

Para criação de migrations. Sempre usar o padrão da seguinte forma: função da migration, no caso create, seguido pelo nome da tabela

```bash
    npm run knex -- migrate:make create-table-name
```

Para execução das migrations e efetivação no banco

```bash
    npm run knex -- migrate:latest
```

Desfazendo uma a ultima migration

```bash
    npm run knex -- migrate:rollback
```

# ENVs

Para leitura de de arquivos .env, é necessário instalar

```bash
    npm install dotenv
```

E após isso, importar o arquivo da seguinte forma

```js
    import 'dotenv/config'
```

# Zod

Lib responsável pela validação de dados da aplicação

```bash
    npm install zod
```

# Arquivos com extensão .d.ts

São arquivos dedicados a sobrescrever tipos já existentes. Por exemplo, como o knex não possui interfaces para tratamento das tabelas, é possivel criar um arquivo knex.d.ts e fazer isso (o nome pode ser qualquer um)

# Sistema de cookies no Fastify

Para autenticação e validação de usuários no projeto, é utilizado o o padrão de cookies. Quando um usuário efetua a primeira transação, é atribuido um cookie ao navegador. A lib responsável é a seguinte

```bash
    npm i @fastify/cookie
```

Para verificar se a requisição possui cookies

```js
    const { cookie_name } = session.cookies

    //ou 

    const cookie = session.cookies.cookie_name
```

# Middlares no Fastify

Também chamados de preHandler, pois ocorrem antes do metodo principal, o handler. Auxiliam na verificação antes da execução do código
Para utilizar, basta apenas criar uma função, como por exemplo as contidas na pasta middlewares e após isso, importar da seguinte forma na requisição

```js
    app.get('/',
        // Registra midlawares utilizados por essa rota
        {
            preHandler: [checkSessionIdExists]
        },
        ...
```

Também é possivel criar para contextos e globalmente da seguinte forma 

    	app.addHook('preHandler', async (request, reply) => {
            console.log(`[${request.method}] ${request.url} `)
        })

Criando dessa forma, o preHandler fica restrito ao arquivo que se encontra

# Testes Automatizados / DDD

Testes para auxilio na segurança da aplicação, prevenindo possiveis problemas que viriam a ocorrer em produção

São dividos em três tipos:

## Testes Unitários

Testes que validam o funcionamento o funcionamento de componentes isolados da aplicação

## Testes de Integração

Testes que validam a comunicação entre os componentes da aplicação

## E2E - Ponta a Ponta

Simulam um usuáruio operando a aplicação (O ponta a ponta seria desde a rota até o Banco no caso de back-end)

# Vitest

Para criação dos testes automatizados, a aplicação utiliza o Vitest

```bash
    npm install vitest -D
```

Após a instalacão, os testes são executados em arquivos de extensão .spec.ts ou test.ts

Para executar os testes apenas é necessário rodar o comando 

```bash
    npx vitest
```

É possivel realizar testes sem rodar o servidor, sem usar metodo listen do server

```bash
    npm i supertest -D
    npm i -D @types/supertest
```

Para executar testes de back end, é necessário fazer com que todos os plugins do fastify sejam carregado previamente. Normalmente isso é feito com uma função 

```js
    beforeAll( async ()=>{
        await app.ready()
    })

```

Para que o server não fique sendo executado permanentemente 

    afterAll( async () => {
        await app.close()
    })

Os testes são feitos com a função it ou test, ambas tem a mesma finalidade
Ficam da seguinte forma

```js
    it('User can create a new transaction', async () => {
        ...
    })
```

Obs: Testes devem ser totalmente idependentes, não podem necessitar de outros testes, ou seja: caso o teste seja um get para requisitar uma info, nesse mesmo teste é necessário que tenha uma inserção de valores, ela não pode ser efetuada em outro teste.

Para testes, o ideal é que os testes sejam executados em ambiente exclusivo para isso, dessa forma é isolado o banco de teste com variaveis especificas para testes no arquivo .env.test

# Deploy

O deploys pode ser efetuado de diversas formas, porém em praticamente todas elas, o código deve ser convertido em JS padrão antes, pois não há interpretação de ts em sua maioria. Para isso, inicialmente é necessário alterar o arquivo tsconfig, descomentando as linhas e mudar o valor de:

```js
    "rootDir" : "./src"
    // Diretório que irá ficar a versão convertida para js
    "outDir" : "./Build"
```

E após isso executar o comando 


```bash
    npx tsc
```

Porém o mais recomendado tanto po erro quanto por otimização de tempo é utilizar a lib tsup. Em caso de projetos grandes, pode gerar probllemas efetuar através do comando tsc

Após isso rodar o comando fazer instalação da lib

```bash
    npm i tsup -D
```

E após isso adcionar a seguinte linha nos scripts de package.json

```js
    //O build pode ser qualque nome de diretório
    "build" : "tsup src --out-dir build"
```

Após isso, basta apenas rodar o comando 

```js
    npm run build
```

Com isso, deve ser possivel rodar o arquivo com node puro

```bash
    node 'build/server.js'
```