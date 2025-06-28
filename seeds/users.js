const { password } = require("pg/lib/defaults");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  return knex('users')
  .del()
  .insert([
    {email: 'uzrnem@gmail.com', password: 'changeme'}
  ]);
};
