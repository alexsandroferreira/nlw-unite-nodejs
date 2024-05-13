import { FastifyReply, FastifyRequest } from 'fastify'

import { BadRequest } from '@/https/_errors/bad-request'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/utils/generete-slug'

import type { CreateEventData } from './create-event-schema'

export async function CreateEvent(
  request: FastifyRequest<{ Body: CreateEventData }>,
  reply: FastifyReply,
) {
  const { details, maximumAttendees, title } = request.body

  const slug = generateSlug(title)

  const eventWithSaneSlug = await prisma.event.findUnique({
    where: {
      slug,
    },
  })

  if (eventWithSaneSlug !== null) {
    throw new BadRequest('Another event with same title already exists.')
  }

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug,
    },
  })
  return reply.status(201).send({
    message: 'dados cadastrados com sucesso',
    eventId: event.id,
  })
}
