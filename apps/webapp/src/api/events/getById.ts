import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';

export const GET_EVENT_BY_ID: TypedDocumentNode<{
  getEvent: {
    id: string;
    organizer: { id: string; name: string; email: string };
    title: string;
    date: string;
    location: string;
    description: string;
    category: string;
    status: string;
    attendees: { name: string; email: string }[] | null;
  };
}> = gql`
  query getEvent($getEventId: ID!) {
    getEvent(id: $getEventId) {
      id
      organizer {
        id
        name
        email
      }
      title
      date
      location
      description
      category
      status
      attendees {
        name
        email
      }
    }
  }
`;
