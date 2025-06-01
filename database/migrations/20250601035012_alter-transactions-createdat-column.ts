import { table } from "console";
import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions_temp', (table) => {
        table.uuid('id').primary()
        table.text('title').notNullable()
        table.decimal('amount', 10, 2).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })

    //  Remover tabela antiga
    await knex.schema.dropTable('transactions');

    //  Renomear nova tabela
    await knex.schema.renameTable('transactions_temp', 'transactions');
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions_original', (table) => {
        table.uuid('id').primary()
        table.text('title').notNullable()
        table.decimal('amount', 10, 2).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })

    //  Remover tabela antiga
    await knex.schema.dropTable('transactions');

    //  Renomear nova tabela
    await knex.schema.renameTable('transactions_original', 'transactions');
}

