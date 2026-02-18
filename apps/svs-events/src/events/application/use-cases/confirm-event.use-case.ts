import { Inject, Injectable } from '@nestjs/common';
import type { EventRepositoryPort } from '../ports/event.repository.port';
import { EVENT_REPOSITORY } from '../ports/event.repository.port';

@Injectable()
export class ConfirmEventUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepositoryPort,
  ) {}

  async execute(id: string) {
    const event = await this.eventRepository.update(id, {
      status: 'CONFIRMED',
    });
    return event;
  }
}
