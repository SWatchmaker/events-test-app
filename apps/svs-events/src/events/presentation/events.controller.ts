import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateEventUseCase } from '../application/use-cases/create-event.use-case';
import { CreateEventDto, SearchEventsDto } from '../domain/dtos/event.dtos';
import { SearchEventsUseCase } from '../application/use-cases/search-events.use-case';
import { FindEventByIdUseCase } from '../application/use-cases/find-event-by-id.use-case';

@Controller('events')
export class EventsController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly searchEventUseCase: SearchEventsUseCase,
    private readonly getEventByIdUseCase: FindEventByIdUseCase,
  ) {}

  @Post()
  async createEvent(@Body() newUser: CreateEventDto) {
    const createdUser = await this.createEventUseCase.execute(newUser);
    return createdUser;
  }

  @Get('search')
  async searchEvents(@Query() filters: SearchEventsDto) {
    const events = await this.searchEventUseCase.execute(filters);
    return {
      events,
    };
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    const event = await this.getEventByIdUseCase.execute(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }
}
