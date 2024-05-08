import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { home } from './home-controller'
import { homeSchema } from './home-schema'

export async function appRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/', homeSchema, home)
}
