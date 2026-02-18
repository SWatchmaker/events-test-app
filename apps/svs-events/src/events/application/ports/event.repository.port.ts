import { SearchEventsDto } from 'src/events/domain/dtos/event.dtos';
import { Event } from '../../domain/entities/event.entity';

export interface EventRepositoryPort {
  create(
    event: Omit<Event, 'id' | 'status' | 'organizer'> & { organizerId: string },
  ): Promise<Event>;
  findById(
    id: string,
  ): Promise<(Event & { atendees: { name: string; email: string }[] }) | null>;
  findByOrganizerId(organizerId: string): Promise<Event[]>;
  search(params: SearchEventsDto): Promise<Event[]>;
  update(
    id: string,
    updates: Partial<Partial<Omit<Event, 'id' | 'organizer'>>>,
  ): Promise<void>;
  // delete(id: string): Promise<void>;
}

export const EVENT_REPOSITORY = 'EVENT_REPOSITORY';
