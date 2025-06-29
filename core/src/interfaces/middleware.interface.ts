import { FastifyReply, FastifyRequest } from 'fastify';

export interface IMiddleware {
  handle(req: FastifyRequest, reply: FastifyReply): void | Promise<void>;
}
