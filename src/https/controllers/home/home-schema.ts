import { z } from 'zod'

export const homeSchema = {
  schema: {
    tags: ['home'],
    summary: 'Get home page',
    response: {
      200: z.object({
        message: z.string().nullable(),
      }),
    },
  },
}
