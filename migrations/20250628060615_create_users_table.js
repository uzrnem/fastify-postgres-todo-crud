/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary(); // Auto-incrementing primary key
        table.string('email').notNullable().unique(); // User's email
        table.string('password').nullable(); // User's name
        table.timestamps(true, true); // created_at and updated_at with default values
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users'); // Drop the users table
};
