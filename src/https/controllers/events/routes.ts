import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { CreateEvent } from './create-event-controller'
import { CreateEventsSchema, EventResponseSchema } from './create-event-schema'

export async function eventsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/events', {
    schema: {
      body: CreateEventsSchema,
      response: {
        201: EventResponseSchema,
      },
    },
    handler: CreateEvent,
  })
}
