import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepositoryPort } from '@/events/application/ports/event.repository.port';
import { PrismaService } from '@/shared/prisma.service';
import { Event } from '@/events/domain/entities/event.entity';
import { SearchEventsDto } from '@/events/domain/dtos/event.dtos';
import { Prisma } from '@/generated/prisma/client';

const prismaEventToEntity = (
  prisma: Prisma.EventModel & {
    organizer: Pick<Prisma.UserModel, 'name' | 'email' | 'id'>;
  },
): Event => {
  return Event.create(
    prisma.id,
    prisma.title,
    prisma.date,
    prisma.location,
    prisma.description,
    prisma.category,
    prisma.status,
    prisma.organizer,
  );
};

@Injectable()
export class MongoDbEventRepository implements EventRepositoryPort {
  constructor(private prisma: PrismaService) {}

  async create(
    event: Omit<Event, 'id' | 'status' | 'organizer'> & { organizerId: string },
  ): Promise<Event> {
    const existingOrganizer = await this.prisma.user.findUnique({
      where: { id: event.organizerId },
    });

    if (!existingOrganizer) {
      throw new NotFoundException('Organizer not found');
    }

    const createdUser = await this.prisma.event.create({
      data: {
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
        category: event.category,
        status: 'DRAFT',
        organizerId: event.organizerId,
      },
    });

    return prismaEventToEntity({
      ...createdUser,
      organizer: {
        id: existingOrganizer.id,
        name: existingOrganizer.name,
        email: existingOrganizer.email,
      },
    });
  }

  async findById(
    id: string,
  ): Promise<(Event & { atendees: { name: string; email: string }[] }) | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attendees: true,
      },
    });
    if (!event) return null;
    return {
      ...prismaEventToEntity(event),
      atendees: event.attendees.map((a) => ({ name: a.name, email: a.email })),
    };
  }

  async findByOrganizerId(organizerId: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return events.map((event) => prismaEventToEntity(event));
  }

  async search(params: SearchEventsDto): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: {
        category: params.category,
        status: params.status,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return events.map(prismaEventToEntity);
  }

  async update(
    id: string,
    updates: Partial<Omit<Event, 'id' | 'organizer'>>,
  ): Promise<void> {
    await this.prisma.event.update({
      where: { id },
      data: {
        ...updates,
      },
    });
  }
}
