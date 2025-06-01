#Configuração inicial do projeto

Para criação do projeto foram necessários alguns comandos

    //Criar package.json
    npm init -y

    //Instalar typescript como dependencia de dev
    npm install -D typescript

    //Instalar types para compatibilidade
    npm install -D @types/node

    //Startar o TS e converter arquivos em js
    npx tsc --init
    npx tsc ./src/server.ts