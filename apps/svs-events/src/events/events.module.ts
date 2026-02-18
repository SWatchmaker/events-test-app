import { Module } from '@nestjs/common';
import { EventsController } from './presentation/events.controller';
import { CreateEventUseCase } from './application/use-cases/create-event.use-case';
import { EVENT_REPOSITORY } from './application/ports/event.repository.port';
import { MongoDbEventRepository } from './infrastructure/adapters/mongodb-event.repository';
import { PrismaService } from '../shared/prisma.service';
import { SearchEventsUseCase } from './application/use-cases/search-events.use-case';
import { FindEventByIdUseCase } from './application/use-cases/find-event-by-id.use-case';
import { FindEventByOrganicerUseCase } from './application/use-cases/find-event-by-organizer.use-case';
import { ConfirmEventUseCase } from './application/use-cases/confirm-event.use-case';

@Module({
  controllers: [EventsController],
  providers: [
    CreateEventUseCase,
    SearchEventsUseCase,
    FindEventByIdUseCase,
    FindEventByOrganicerUseCase,
    ConfirmEventUseCase,
    {
      provide: EVENT_REPOSITORY,
      useClass: MongoDbEventRepository,
    },
    PrismaService,
  ],
})
export class EventsModule {}
