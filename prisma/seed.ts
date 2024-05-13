import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

async function seed() {
  const eventId = 'ee6c246a-649a-42a2-aa70-015f624ddfcf'

  await prisma.event.deleteMany()

  await prisma.event.create({
    data: {
      id: eventId,
      title: 'Create Event test 001',
      slug: 'create-event-test-001',
      details: 'CreateBy: Alexsandro dev',
      maximumAttendees: 80,
    },
  })

  const attendeesToInsert: Prisma.AttendeeUncheckedCreateInput[] = []

  for (let i = 0; i <= 80; i++) {
    attendeesToInsert.push({
      id: 10000 + i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventId,
      createdAt: faker.date.recent({
        days: 30,
        refDate: dayjs().subtract(8, 'days').toDate(),
      }),
      checkIn: faker.helpers.arrayElement<
        Prisma.CheckInUncheckedCreateNestedOneWithoutAttendeeInput | undefined
      >([
        undefined,
        {
          create: {
            createdAt: faker.date.recent({ days: 7 }),
          },
        },
      ]),
    })
  }
  await Promise.all(
    attendeesToInsert.map((data) => {
      return prisma.attendee.create({
        data,
      })
    }),
  )
}

seed().then(() => {
  console.log('Database seeded successfully! ✅')
  prisma.$disconnect()
})
