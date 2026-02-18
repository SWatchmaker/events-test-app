import { gql } from '@apollo/client';

export const CONFIRM_EVENT = gql`
  mutation Mutation($eventId: ID!) {
    confirmEvent(eventId: $eventId)
  }
`;
