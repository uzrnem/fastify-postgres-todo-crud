const bcrypt = require('bcrypt');

/**
 * Signup method
 * @param { import("fastify").FastifyInstance } fastify
 * @param { import("fastify").FastifyRequest } req
 * @param { import("fastify").FastifyReply } reply
 */
exports.signup = async (fastify, req, reply) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return reply.status(400).send({ error: 'Email and password are required' });
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
exports.signin = async (fastify, req, reply) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return reply.status(400).send({ error: 'Email and password are required' });
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