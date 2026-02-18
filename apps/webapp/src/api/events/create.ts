import { gql } from '@apollo/client';

export const CREATE_EVENT = gql`
  mutation Mutation($input: CreateEventInput!) {
    createEvent(input: $input)
  }
`;
