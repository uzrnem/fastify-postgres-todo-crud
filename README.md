### Fastify Crud API with Postgres, Jwt, Knex Db Migration, Joi Validation, Docker Compose


Project Start Commands
```
npx knex migrate:latest
npx knex seed:run
nodemon index.js
```


Init Commands
```
npm init -y
npm i fastify @fastify/cors @fastify/jwt @fastify/postgres dotenv pg
npm i -D nodemon knex
```


`npx knex init` # This will create a knexfile.js in the root directory

Update knexfile.js to use postgres
Tutorial: https://blog.openreplay.com/create-a-node-api-with-knex-and-postgresql/

```
npx knex migrate:make create_users_table # This will create a migration file in the migrations directory
npx knex migrate:make create_todos_table
npx knex migrate:latest # This will run the latest migration
```

```
npx knex seed:make users
npx knex seed:run # This will run the seed files
```

