import { z } from 'zod'

export const CreateEventsSchema = z.object({
  title: z
    .string({ invalid_type_error: 'O Título precisa ser um texto' })
    .min(4),
  details: z.string().nullable(),
  maximumAttendees: z.number().positive().nullable(),
})

export const EventResponseSchema = z.object({
  message: z.string(),
  eventId: z.string().uuid(),
})

export type CreateEventData = z.infer<typeof CreateEventsSchema>
export type schemaEventsReply = z.infer<typeof EventResponseSchema>
