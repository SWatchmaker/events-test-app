import { Inject, Injectable } from '@nestjs/common';
import type { EventRepositoryPort } from '../ports/event.repository.port';
import { EVENT_REPOSITORY } from '../ports/event.repository.port';

@Injectable()
export class FindEventByOrganicerUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepositoryPort,
  ) {}

  async execute(organizerId: string) {
    const events = await this.eventRepository.findByOrganizerId(organizerId);
    return events;
  }
}
