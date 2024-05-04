import { FastifyInstance } from 'fastify'

import { home } from './controllers/home-controller'
import { homeSchema } from './controllers/home-schema'

export async function appRoutes(app: FastifyInstance) {
  app.get('/', homeSchema, home)
}
