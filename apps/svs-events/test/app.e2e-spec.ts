import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/shared/prisma.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { Prisma } from '@/generated/prisma/client';

// Define a type for the response body that mimics the Event entity but with string dates
interface EventResponse {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  status: string;
  organizer?: {
    name: string;
    email: string;
  };
  attendees?: any[];
}

describe('EventsController (E2E with Mock DB)', () => {
  let app: INestApplication;
  let createdEventId: string;

  // In-memory data store
  const mockUsers = new Map<string, Prisma.UserModel>();
  const mockEvents = new Map<
    string,
    Prisma.EventModel & { attendees: Prisma.UserModel[] }
  >();

  // Pre-populate a valid organizer
  const validOrganizerId = '507f1f77bcf86cd799439011';
  // @ts-expect-error - Partial mock data for testing
  mockUsers.set(validOrganizerId, {
    id: validOrganizerId,
    name: 'Test Organizer',
    email: 'test@organizer.com',
    eventsToAttendIds: [],
  });

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(async (args: Prisma.UserFindUniqueArgs) => {
        return mockUsers.get(args.where.id || '') || null;
      }),
    },
    event: {
      create: jest.fn(async (args: Prisma.EventCreateArgs) => {
        const id = 'test-event-id-' + Date.now();
        const data = args.data as Prisma.EventUncheckedCreateInput;
        const newEvent = {
          id,
          title: data.title,
          description: data.description,
          category: data.category,
          date: new Date(data.date as string | Date),
          location: data.location,
          status: data.status || 'DRAFT',
          organizerId: data.organizerId,
          attendeesIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          attendees: [],
        };
        mockEvents.set(id, newEvent as any);
        return newEvent;
      }),
      findUnique: jest.fn(async (args: Prisma.EventFindUniqueArgs) => {
        const event = mockEvents.get(args.where.id || '');
        if (!event) return null;

        // Simulate 'include' behavior manually for the test
        const result: any = { ...event };
        if (args.include?.organizer) {
          result.organizer = mockUsers.get(event.organizerId);
        }
        if (args.include?.attendees) {
          // Mock attendees list (empty for this test scope)
          result.attendees = [];
        }
        return result;
      }),
      findMany: jest.fn(async (args: Prisma.EventFindManyArgs) => {
        const where = args.where || {};
        const results = Array.from(mockEvents.values()).filter((e) => {
          if (where.category && e.category !== where.category) return false;
          if (where.status && e.status !== where.status) return false;
          return true;
        });

        // Simulate 'include'
        if (args.include?.organizer) {
          return results.map((e) => ({
            ...e,
            organizer: mockUsers.get(e.organizerId),
          }));
        }
        return results;
      }),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/events (POST)', () => {
    it('should create a new event when organizer exists', async () => {
      const createEventDto = {
        title: 'DB E2E Test Event',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'In-Memory Location',
        description: 'Testing the repository logic with mock Prisma',
        category: 'MEETUP',
        organizerId: validOrganizerId,
      };

      await request(app.getHttpServer())
        .post('/events')
        .send(createEventDto)
        .expect(201);

      // Verify it was actually stored in our map
      const events = Array.from(mockEvents.values());
      const createdEvent = events[events.length - 1];
      expect(createdEvent).toBeDefined();
      expect(createdEvent.title).toBe(createEventDto.title);
      expect(createdEvent.status).toBe('DRAFT'); // Default value check
      createdEventId = createdEvent.id;
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = {
        title: 'Short', // Invalid length
      };

      await request(app.getHttpServer())
        .post('/events')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 404 when organizer is not found (Repository Logic)', async () => {
      const nonExistentId = '000000000000000000000000'; // Valid 24 chars, but not in map

      const createEventDto = {
        title: 'No Organizer Event',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Void',
        description: 'This event has no valid organizer',
        category: 'MEETUP',
        organizerId: nonExistentId,
      };

      await request(app.getHttpServer())
        .post('/events')
        .send(createEventDto)
        .expect(404);
    });
  });

  describe('/events/:id (GET)', () => {
    it('should return the event by ID with mapped data', async () => {
      const response = (await request(app.getHttpServer())
        .get(`/events/${createdEventId}`)
        .expect(200)) as { body: EventResponse };

      expect(response.body.id).toBe(createdEventId);
      expect(response.body.title).toBe('DB E2E Test Event');
      expect(response.body.organizer).toBeDefined();
      expect(response.body.organizer?.name).toBe('Test Organizer');
    });

    it('should return 404 for non-existent ID', async () => {
      await request(app.getHttpServer())
        .get('/events/non-existent-id')
        .expect(404);
    });
  });

  describe('/events/search (GET)', () => {
    it('should return events matching the category', async () => {
      const response = (await request(app.getHttpServer())
        .get('/events/search')
        .query({ category: 'MEETUP' })
        .expect(200)) as { body: { events: EventResponse[] } };

      expect(response.body.events).toBeDefined();
      expect(response.body.events.length).toBeGreaterThan(0);
      expect(response.body.events[0].category).toBe('MEETUP');
      expect(response.body.events[0].organizer).toBeDefined();
    });

    it('should return empty list for non-matching category', async () => {
      const response = (await request(app.getHttpServer())
        .get('/events/search')
        .query({ category: 'WORKSHOP' })
        .expect(200)) as { body: { events: EventResponse[] } };

      expect(response.body.events.length).toBe(0);
    });
  });
});
