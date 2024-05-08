import { z } from 'zod'

export const CreateEventsSchema = z.object({
  title: z.string().min(4),
  details: z.string().nullable(),
  maximumAttendees: z.number().positive().nullable(),
})

export const EventResponseSchema = z.object({
  message: z.string(),
  eventId: z.string().uuid(),
})

export type CreateEventData = z.infer<typeof CreateEventsSchema>
export type schemaEventsReply = z.infer<typeof EventResponseSchema>
