import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequest } from '@/https/_errors/bad-request'
import { prisma } from '@/lib/prisma'

export async function attendeeRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/attendees',
    {
      schema: {
        summary: 'Register an attendee',
        tags: ['attendees'],
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
        throw new BadRequest('This email is already registered for this event.')
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
        throw new BadRequest(
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
    '/attendees/:attendeeId/badge',
    {
      schema: {
        summary: 'Get an attendee badge',
        tags: ['attendees'],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURL: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            },
          },
        },
        where: {
          id: attendeeId,
        },
      })

      if (attendee === null) {
        throw new BadRequest('Attendeee not found')
      }

      const baseURL = `${request.protocol}://${request.hostname}`

      console.log(baseURL)
      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

      return reply.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInURL: checkInURL.toString(),
        },
      })
    },
  )
}
