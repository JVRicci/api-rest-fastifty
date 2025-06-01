# Configuração inicial do projeto

Para criação do projeto foram necessários alguns comandos

Criar package.json

    npm init -y

Instalar typescript como dependencia de dev

    npm install -D typescript

Instalar types para compatibilidade

    npm install -D @types/node

Startar o TS e converter arquivos em js

    npx tsc --init
    npx tsc ./src/server.ts

Para evitar fazer o processo manual conversão e possivel usar a lib

    npm install tsx -D

Após isso é só executar normalmente com npm run dev, pois está configurado no package.json

## ESLINT

Para padronização de código, é utilizado o ESLint
A instalação é através do seguinte comando

    npm i eslint @rocketseat/eslint-config -D

Após isso é necessário criar um arquivo chamado 

.eslintrc.json

E colocar a configuração interna dele igual a do arquivo do projeto


# Banco de Dados

Para o banco de dados é utilizado o SQLite e como query builder Knex

    npm install knex sqlite3