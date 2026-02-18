/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MongoDbEventRepository } from './mongodb-event.repository';
import { PrismaService } from '@/shared/prisma.service';
import { Event } from '@/events/domain/entities/event.entity';

describe('MongoDbEventRepository', () => {
  let repository: MongoDbEventRepository;
  let prismaService: PrismaService;

  const mockDate = new Date('2024-01-01T12:00:00Z');

  const mockOrganizer = {
    id: 'organizer-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed-password',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const mockAttendee = {
    id: 'attendee-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'hashed-password',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const mockPrismaEvent = {
    id: 'event-1',
    title: 'Test Event',
    date: mockDate,
    location: 'Test Location',
    description: 'Test Description',
    category: 'MEETUP' as const,
    status: 'DRAFT' as const,
    organizerId: 'organizer-1',
    createdAt: mockDate,
    updatedAt: mockDate,
    organizer: mockOrganizer,
    attendees: [mockAttendee],
  };

  const mockPrismaService = {
    event: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoDbEventRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<MongoDbEventRepository>(MongoDbEventRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an event entity if organizer exists', async () => {
      // Mock finding the organizer
      mockPrismaService.user.findUnique.mockResolvedValue(mockOrganizer);
      // Mock creating the event (Prisma create returns the event without relations unless included)
      mockPrismaService.event.create.mockResolvedValue({
        ...mockPrismaEvent,
        organizer: undefined, // Create implementation doesn't include organizer relation
      });

      const createEventDto = {
        title: 'Test Event',
        date: mockDate,
        location: 'Test Location',
        description: 'Test Description',
        category: 'MEETUP' as const,
        organizerId: 'organizer-1',
      };

      const result = await repository.create(createEventDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: createEventDto.organizerId },
      });

      expect(prismaService.event.create).toHaveBeenCalledWith({
        data: {
          title: createEventDto.title,
          date: createEventDto.date,
          location: createEventDto.location,
          description: createEventDto.description,
          category: createEventDto.category,
          status: 'DRAFT',
          organizerId: createEventDto.organizerId,
        },
      });

      expect(result).toBeInstanceOf(Event);
      expect(result.id).toBe(mockPrismaEvent.id);
      expect(result.title).toBe(mockPrismaEvent.title);
      expect(result.organizer).toEqual({
        name: mockOrganizer.name,
        email: mockOrganizer.email,
      });
    });

    it('should throw an error if organizer is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const createEventDto = {
        title: 'Test Event',
        date: mockDate,
        location: 'Test Location',
        description: 'Test Description',
        category: 'MEETUP' as const,
        organizerId: 'non-existent-organizer',
      };

      await expect(repository.create(createEventDto)).rejects.toThrow(
        'Organizer not found',
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: createEventDto.organizerId },
      });
      expect(prismaService.event.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return an event with attendees if found', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockPrismaEvent);

      const result = await repository.findById('event-1');

      expect(prismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'event-1' },
        include: {
          organizer: {
            select: {
              name: true,
              email: true,
            },
          },
          attendees: true,
        },
      });

      expect(result).toBeDefined();
      if (result) {
        expect(result.id).toBe(mockPrismaEvent.id);
        expect(result.atendees).toHaveLength(1);
        expect(result.atendees[0]).toEqual({
          name: mockAttendee.name,
          email: mockAttendee.email,
        });
      }
    });

    it('should return null if event is not found', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(prismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent' },
        include: {
          organizer: {
            select: {
              name: true,
              email: true,
            },
          },
          attendees: true,
        },
      });

      expect(result).toBeNull();
    });
  });

  describe('search', () => {
    it('should return an array of events matching filters', async () => {
      mockPrismaService.event.findMany.mockResolvedValue([mockPrismaEvent]);

      const filters = { category: 'MEETUP' as const, status: 'DRAFT' as const };
      const result = await repository.search(filters);

      expect(prismaService.event.findMany).toHaveBeenCalledWith({
        where: {
          category: filters.category,
          status: filters.status,
        },
        include: {
          organizer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Event);
      expect(result[0].category).toBe('MEETUP');
      expect(result[0].status).toBe('DRAFT');
    });

    it('should return an empty array if no events match', async () => {
      mockPrismaService.event.findMany.mockResolvedValue([]);

      const result = await repository.search({ category: 'WORKSHOP' });

      expect(result).toEqual([]);
    });
  });
});
