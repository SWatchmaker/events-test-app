import { Inject, Injectable } from '@nestjs/common';
import type { EventRepositoryPort } from '../ports/event.repository.port';
import { EVENT_REPOSITORY } from '../ports/event.repository.port';
import { CreateEventDto } from 'src/events/domain/dtos/event.dtos';

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepositoryPort,
  ) {}

  async execute(dto: CreateEventDto) {
    await this.eventRepository.create({
      title: dto.title,
      organizerId: dto.organizerId,
      date: dto.date,
      location: dto.location,
      description: dto.description,
      category: dto.category,
    });
  }
}
