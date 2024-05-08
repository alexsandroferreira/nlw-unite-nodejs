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

import { appRoutes } from './https/controllers/home/routes'
import { generateSlug } from './utils/generete-slug'

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

app.withTypeProvider<ZodTypeProvider>().post(
  '/events',
  {
    schema: {
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().positive().nullable(),
      }),
      response: {
        201: z.object({
          message: z.string(),
          eventId: z.string().uuid(),
        }),
      },
    },
  },
  async (request, reply) => {
    const { details, maximumAttendees, title } = request.body

    const slug = generateSlug(title)

    const eventWithSaneSlug = await prisma.event.findUnique({
      where: {
        slug,
      },
    })

    if (eventWithSaneSlug !== null) {
      throw new Error('Another event with same title already exists.')
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
  },
)
