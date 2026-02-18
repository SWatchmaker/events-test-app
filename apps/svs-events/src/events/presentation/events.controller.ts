import {
  Body,
  Controller,
  Delete,
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
import { FindEventByOrganicerUseCase } from '../application/use-cases/find-event-by-organizer.use-case';
import { ConfirmEventUseCase } from '../application/use-cases/confirm-event.use-case';
import { AddAttendeeEventUseCase } from '../application/use-cases/add-attendee-use-case';
import { RemoveAttendeeFromEventUseCase } from '../application/use-cases/remove-attendee.use-case';

@Controller('events')
export class EventsController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly searchEventUseCase: SearchEventsUseCase,
    private readonly getEventByIdUseCase: FindEventByIdUseCase,
    private readonly getEventsByOrganizerIdUseCase: FindEventByOrganicerUseCase,
    private readonly confirmEventUseCase: ConfirmEventUseCase,
    private readonly addAttendeeToEventUseCase: AddAttendeeEventUseCase,
    private readonly removeAttendeeFromEventUseCase: RemoveAttendeeFromEventUseCase,
  ) {}

  @Post()
  async createEvent(@Body() newUser: CreateEventDto) {
    const createdUser = await this.createEventUseCase.execute(newUser);
    return createdUser;
  }

  @Post(':id/confirm')
  async confirmEvent(@Param('id') id: string) {
    await this.confirmEventUseCase.execute(id);
    return;
  }

  @Post(':id/attendees/:userId')
  async addAttendeeToEvent(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    await this.addAttendeeToEventUseCase.execute(id, userId);
    return;
  }

  @Delete(':id/attendees/:userId')
  async removeAttendeeFromEvent(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    await this.removeAttendeeFromEventUseCase.execute(id, userId);
    return;
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

  @Get('byOrganizer/:organizerId')
  async getEventsByOrganizerId(@Param('organizerId') organizerId: string) {
    const events =
      await this.getEventsByOrganizerIdUseCase.execute(organizerId);
    return {
      events,
    };
  }
}
