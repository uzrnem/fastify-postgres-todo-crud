/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('todos', (table) => {
        table.increments('id').primary(); // Auto-incrementing primary key
        table.string('content').notNullable(); // Content of the todo
        table.integer('userid').unsigned().notNullable(); // Foreign key referencing users table
        table.foreign('userid').references('id').inTable('users').onDelete('CASCADE'); // Foreign key constraint
        table.timestamps(true, true); // created_at and updated_at with default values
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('todos'); // Drop the todos table
};
