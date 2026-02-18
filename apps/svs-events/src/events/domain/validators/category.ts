import z from 'zod';

export const eventCategoryValidator = z.enum([
  'WORKSHOP',
  'MEETUP',
  'TALK',
  'SOCIAL',
]);
export type EventCategory = z.infer<typeof eventCategoryValidator>;

export const eventStatusValidator = z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED']);
export type EventStatus = z.infer<typeof eventStatusValidator>;
