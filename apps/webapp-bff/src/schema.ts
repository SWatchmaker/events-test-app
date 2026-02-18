import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum EventCategory {
    WORKSHOP
    MEETUP
    TALK
    SOCIAL
  }

  enum EventStatus {
    DRAFT
    CONFIRMED
    CANCELLED
  }

  type Event {
    id: ID!
    organizer: User!
    title: String!
    date: String!
    location: String!
    description: String!
    category: EventCategory!
    status: EventStatus!
    attendees: [User!]!
  }

  type User {
    id: String!
    email: String!
    name: String!
  }

  input CreateEventInput {
    title: String!
    date: String!
    location: String!
    description: String!
    category: EventCategory!
  }

  input SearchEventsInput {
    category: EventCategory
    status: EventStatus
  }

  input MarkAttendanceInput {
    eventId: ID!
    willAttend: Boolean!
  }

  type Query {
    getEvent(id: ID!): Event
    getMyEvents: [Event!]!
    searchEvents(input: SearchEventsInput): [Event!]!
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Boolean
    confirmEvent(eventId: ID!): Boolean
    markAttendance(input: MarkAttendanceInput): Boolean
  }
`;
