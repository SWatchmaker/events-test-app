import z from 'zod';
import {
  eventCategoryValidator,
  eventStatusValidator,
} from '../validators/category';
import { createZodDto } from 'nestjs-zod';

const createEventSchemaValidator = z
  .object({
    title: z.string().min(3).max(100).trim(),
    category: eventCategoryValidator,
    date: z.coerce.date().min(new Date()),
    location: z.string().min(3).max(100).trim(),
    description: z.string().min(10).max(500).trim(),
    organizerId: z.string().trim().length(24),
  })
  .strict();

export class CreateEventDto extends createZodDto(createEventSchemaValidator) {}

const searchEventsSchemaValidator = z.object({
  category: eventCategoryValidator.optional(),
  status: eventStatusValidator.optional(),
});

export class SearchEventsDto extends createZodDto(
  searchEventsSchemaValidator,
) {}
