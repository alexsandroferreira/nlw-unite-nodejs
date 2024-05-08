import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'

import { appRoutes } from './https/routes'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

const prisma = new PrismaClient({
  log: ['query'],
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'template-base-node',
      description: 'Api template base node',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(appRoutes)

app.post('/events', async (request, reply) => {
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().positive().nullable(),
  })

  const dataEvents = createEventSchema.parse(request.body)

  const event = await prisma.event.create({
    data: {
      title: dataEvents.title,
      details: dataEvents.details,
      maximumAttendees: dataEvents.maximumAttendees,
      slug: new Date().toISOString(),
    },
  })
  return reply.status(201).send({
    message: 'dados cadastrados com sucesso',
    eventId: event.id,
  })
})
