import { FastifyReply, FastifyRequest } from 'fastify'

export async function home(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send({
    message: 'Hello, World!!!',
  })
}
