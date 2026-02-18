import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';

export const SEARCH_EVENTS: TypedDocumentNode<{
  searchEvents: {
    id: string;
    organizer: { name: string; email: string };
    title: string;
    date: string;
    location: string;
    description: string;
    category: string;
    status: string;
  }[];
}> = gql`
  query SearchEvents($input: SearchEventsInput) {
    searchEvents(input: $input) {
      id
      organizer {
        name
        email
      }
      title
      date
      location
      description
      category
      status
    }
  }
`;
