import { create, get, update, destroy } from '../controllers/todoController.js';

export default async function userRoute(fastify) {
  fastify.addHook('onRequest', async (req) => {
    try {
      const decoded = await req.jwtVerify();
      req.payload = decoded;
      req.user = decoded.user;
    } catch (err) {
      throw fastify.httpErrors.unauthorized('Invalid token');
    }
  });

  // Create a new todo
  fastify.post('/', async (req, reply) => {
    await create(fastify, req, reply);
  });

  // Get all todos for a user
  fastify.get('/:id', async (req, reply) => {
    await get(fastify, req, reply);
  });

  // Update a todo
  fastify.put('/:id', async (req, reply) => {
    await update(fastify, req, reply);
  });

  // Delete a todo
  fastify.delete('/:id', async (req, reply) => {
    await destroy(fastify, req, reply);
  });
}