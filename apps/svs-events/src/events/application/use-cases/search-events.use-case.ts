import { Inject, Injectable } from '@nestjs/common';
import type { EventRepositoryPort } from '../ports/event.repository.port';
import { EVENT_REPOSITORY } from '../ports/event.repository.port';
import { SearchEventsDto } from 'src/events/domain/dtos/event.dtos';

@Injectable()
export class SearchEventsUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepositoryPort,
  ) {}

  async execute(seachParams: SearchEventsDto) {
    const events = await this.eventRepository.search(seachParams);
    return events;
  }
}
