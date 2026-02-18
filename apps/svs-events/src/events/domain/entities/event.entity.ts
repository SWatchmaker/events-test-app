import { EventCategory, EventStatus } from '../validators/category';

export class Event {
  constructor(
    public readonly id: string,

    public title: string,
    public date: Date,
    public location: string,
    public description: string,
    public category: EventCategory,
    public status: EventStatus,
    public organizer: { name: string; email: string } | undefined,
  ) {}

  static create(
    id: string,
    title: string,
    date: Date,
    location: string,
    description: string,
    category: EventCategory,
    status: EventStatus,
    organizer: { name: string; email: string } | undefined,
  ): Event {
    return new Event(
      id,
      title,
      date,
      location,
      description,
      category,
      status,
      organizer,
    );
  }
}
