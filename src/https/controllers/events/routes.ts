import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

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

  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/attendees',
    {
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { name, email } = request.body

      const attendee = await prisma.attendee.create({
        data: { name, email, eventId },
      })

      reply.status(201).send({
        message: 'registro no evento concluido com sucesso.',
        attendeeId: attendee.id,
      })
    },
  )
}
