import { signin, signup } from '../controllers/userController.js';

export default async function userRoute(fastify) {

  // Register User
  fastify.post('/in', async (req, reply) => {
    await signin(fastify, req, reply); // Pass the Fastify instance to the controller
  });

  // Login User
  fastify.post('/up', async (req, reply) => {
    await signup(fastify, req, reply); // Pass the Fastify instance to the controller
  });
}