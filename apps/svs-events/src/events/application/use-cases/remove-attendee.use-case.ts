import { Inject, Injectable } from '@nestjs/common';
import type { EventRepositoryPort } from '../ports/event.repository.port';
import { EVENT_REPOSITORY } from '../ports/event.repository.port';

@Injectable()
export class RemoveAttendeeFromEventUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepositoryPort,
  ) {}

  async execute(eventId: string, userId: string) {
    await this.eventRepository.removeAttendee(eventId, userId);
  }
}
