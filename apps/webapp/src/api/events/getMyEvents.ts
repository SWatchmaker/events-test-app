import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';

export const MY_EVENTS: TypedDocumentNode<{
  getMyEvents: {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    category: string;
    status: string;
  }[];
}> = gql`
  query GetMyEvents {
    getMyEvents {
      id
      title
      date
      location
      description
      category
      status
    }
  }
`;
