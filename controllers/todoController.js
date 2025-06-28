import Joi from "joi";

const todoSchema = Joi.object({
  content: Joi.string().min(1).max(255).required(),
});

/**
 * Create a new todo
 * @param { import("fastify").FastifyInstance } fastify
 * @param { import("fastify").FastifyRequest } req
 * @param { import("fastify").FastifyReply } reply
 */
export const create = async (fastify, req, reply) => {
    const { content } = req.body;
    const { id: userId } = req.user; // Extract user ID from the authenticated user
  
    // Validate the content using Joi schema
    const { error } = todoSchema.validate({ content });
    if (error) {
      return reply.status(400).send({ error: error.details[0].message });
    }
  
    try {
      const connection = await fastify.getDbClient();
      const { rows } = await connection.query(
        'INSERT INTO todos (content, userid) VALUES ($1, $2) RETURNING id',
        [content, userId]
      );
      connection.release();
  
      reply.status(201).send({ message: 'Todo created successfully', todoId: rows[0].id });
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  };
  
  /**
   * Get all todos for a user
   * @param { import("fastify").FastifyInstance } fastify
   * @param { import("fastify").FastifyRequest } req
   * @param { import("fastify").FastifyReply } reply
   */
  export const get = async (fastify, req, reply) => {
    const { id: userId } = req.user; // Extract user ID from the authenticated user
    const { id } = req.params; // Extract todo ID from the request params
  
    try {
      const connection = await fastify.getDbClient();
      const { rows } = await connection.query('SELECT * FROM todos WHERE id=$1 AND userid = $2', [id, userId]);
      connection.release();
  
      reply.send(rows[0] || { error: 'Todo not found' });
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  };
  
  /**
   * Update a todo
   * @param { import("fastify").FastifyInstance } fastify
   * @param { import("fastify").FastifyRequest } req
   * @param { import("fastify").FastifyReply } reply
   */
  export const update = async (fastify, req, reply) => {
    const { id } = req.params; // Extract todo ID from the request params
    const { content } = req.body;

    // Validate the content using Joi schema
    const { error } = todoSchema.validate({ content });
    if (error) {
      return reply.status(400).send({ error: error.details[0].message });
    }
  
    try {
      const connection = await fastify.getDbClient();
      const { rowCount } = await connection.query(
        'UPDATE todos SET content = $1 WHERE id = $2',
        [content, id]
      );
      connection.release();
  
      if (rowCount === 0) {
        return reply.status(404).send({ error: 'Todo not found' });
      }
  
      reply.send({ message: 'Todo updated successfully' });
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  };
  
  /**
   * Delete a todo
   * @param { import("fastify").FastifyInstance } fastify
   * @param { import("fastify").FastifyRequest } req
   * @param { import("fastify").FastifyReply } reply
   */
  export const destroy = async (fastify, req, reply) => {
    const { id } = req.params; // Extract todo ID from the request params
  
    try {
      const connection = await fastify.getDbClient();
      const { rowCount } = await connection.query('DELETE FROM todos WHERE id = $1', [id]);
      connection.release();
  
      if (rowCount === 0) {
        return reply.status(404).send({ error: 'Todo not found' });
      }
  
      reply.send({ message: 'Todo deleted successfully' });
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  };