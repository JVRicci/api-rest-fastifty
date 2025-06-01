import { knex as setupKnex, Knex } from 'knex' 

const configurations: { [key: string]: Knex.Config } = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./database/app.db"
        },
        // Faz com que todos os valores do banco por padrão sejam nulos
        useNullAsDefault: true,
        migrations: {
            extension: "ts",
            directory: "./database/migrations"
        }
    }
};

const environment = process.env.NODE_ENV || 'development';
const config = configurations[environment];

export default config;
export const knex = setupKnex (config)