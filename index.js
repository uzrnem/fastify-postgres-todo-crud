import Fastify from 'fastify';

import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';

import userRoute from './routes/userRoute.js';
import todoRoute from './routes/todoRoute.js';
dotenv.config();

const fastify = Fastify();

fastify.register(fastifyCors, { origin: '*' }); // Enable CORS
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET, sign: { expiresIn: '24h' } }); // Enable JWT
fastify.register(fastifyPostgres, {
    promise: true,
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});

fastify.addHook('onSend', (req, reply, body, next) => {
    console.log(reply.elapsedTime, reply.statusCode, req.method, req.url, `req: '${JSON.stringify(req.body)}', res:'${body}'`);
    next();
});

/*
    * Get a database client
    * This function connects to the PostgreSQL database and returns a client.
    * It is used to execute queries against the database.
    * @param {import('fastify').FastifyInstance} fastify - The Fastify instance.
    * 
    * In future if we want to change the database, we can modify this function to return a client for the new database.
    * without changing the rest of the codebase.
    * 
    * @returns {Promise<import('@fastify/postgres').Client>}
    */
fastify.decorate('getDbClient', async () => {
    return await fastify.pg.connect();
});

fastify.register(userRoute, { prefix: '/sign' });
fastify.register(todoRoute, { prefix: '/api/todo'});

fastify.get('/test', async (req, reply) => {
  try {
    const client = await fastify.getDbClient(); // Get a database client
    const {rows} = await client.query('SELECT 1 + 1 AS sum');

    client.release(); // Release the connection

    reply.send({ rows }); // Handle errors

  } catch (error) {
    reply.send({ error: error.message }); // Handle errors
  }
})

fastify.listen({ port: (process.env.PORT || 8000), host: '0.0.0.0'}, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
});