import bcrypt from 'bcrypt';
import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(6).max(50).required()
});

/**
 * Signup method
 * @param { import("fastify").FastifyInstance } fastify
 * @param { import("fastify").FastifyRequest } req
 * @param { import("fastify").FastifyReply } reply
 */
export const signup = async (fastify, req, reply) => {
  const { email, password } = req.body;

  // Validate the request body
  const { error } = userSchema.validate({ email, password });
  if (error) {
    return reply.status(400).send({ error: error.details[0].message });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const connection = await fastify.getDbClient();

    const { rows } = await connection.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );

    connection.release(); // Release the connection
    if (rows.length === 0) {
      return reply.status(500).send({ error: 'User creation failed' });
    }
    const token = fastify.jwt.sign({ user: { id: rows[0].id, email }});
    reply.status(201).send({ message: 'User created successfully', token });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};

/**
 * Signin method
 * @param { import("fastify").FastifyInstance } fastify
 * @param { import("fastify").FastifyRequest } req
 * @param { import("fastify").FastifyReply } reply
 */
export const signin = async (fastify, req, reply) => {
  const { email, password } = req.body;

  // Validate the request body
  const { error } = userSchema.validate({ email, password });
  if (error) {
    return reply.status(400).send({ error: error.details[0].message });
  }

  try {
    const connection = await fastify.getDbClient();

    const { rows } = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
    connection.release(); // Release the connection

    if (rows.length === 0) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const token = fastify.jwt.sign({ user: { id: user.id, email: user.email }});
    reply.send({ message: 'Signin successful', token });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};