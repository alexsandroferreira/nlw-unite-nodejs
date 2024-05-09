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

      const attenddeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId,
          },
        },
      })

      if (attenddeFromEmail !== null) {
        throw new Error('This email is already registered for this event.')
      }

      const [event, amountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId,
          },
        }),

        prisma.attendee.count({
          where: {
            eventId,
          },
        }),
      ])

      if (
        event?.maximumAttendees &&
        amountOfAttendeesForEvent >= event.maximumAttendees
      ) {
        throw new Error(
          'The maximum number of attendees for this event has been exceeded.',
        )
      }

      const attendee = await prisma.attendee.create({
        data: { name, email, eventId },
      })

      reply.status(201).send({
        message: 'registro no evento concluido com sucesso.',
        attendeeId: attendee.id,
      })
    },
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId',
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {},
      },
    },
    async (request, reply) => {
      const { eventId } = request.params

      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      })

      if (event === null) {
        throw new Error('Event not found')
      }

      return reply.send({ event })
    },
  )
}
