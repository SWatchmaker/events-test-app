import axios, { AxiosError } from 'axios';
import type {
  ApolloContext,
  CreateEventInput,
  SearchEventsInput,
} from './types.js';
import { GraphQLError } from 'graphql';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

export const resolvers = {
  Query: {
    getEvent: async (_: unknown, { id }: { id: string }) => {
      try {
        const response = await axios.get(`${API_URL}/events/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching event:', error);
        return null;
      }
    },
    searchEvents: async (
      _: unknown,
      { input }: { input?: SearchEventsInput },
      ctx: ApolloContext,
    ) => {
      if (!ctx.currentUser) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      try {
        const response = await axios.get(`${API_URL}/events/search`, {
          params: input,
        });
        return response.data.events;
      } catch (error) {
        console.error('Error searching events:', error);
        return [];
      }
    },
  },
  Mutation: {
    createEvent: async (
      _: unknown,
      { input }: { input: CreateEventInput },
      ctx: ApolloContext,
    ) => {
      if (!ctx.currentUser) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      try {
        await axios.post(`${API_URL}/events`, {
          ...input,
          organizerId: ctx.currentUser.id,
        });
        return true;
      } catch (error) {
        console.error('Error creating event:', (error as AxiosError).message);
        throw new GraphQLError('Failed to create event', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    },
  },
};
