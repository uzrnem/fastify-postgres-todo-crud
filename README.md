### Fastify Crud API with Postgres, Jwt, Knex Db Migration, Docker Compose


Init Commands
npm init -y
npm i fastify @fastify/cors @fastify/jwt @fastify/postgres dotenv pg
npm i -D nodemon knex

npx knex init # This will create a knexfile.js in the root directory
# Update knexfile.js to use postgres
# https://blog.openreplay.com/create-a-node-api-with-knex-and-postgresql/

npx knex migrate:make create_users_table # This will create a migration file in the migrations directory
npx knex migrate:make create_todos_table
npx knex migrate:latest # This will run the latest migration

npx knex seed:make users
npx knex seed:run # This will run the seed files