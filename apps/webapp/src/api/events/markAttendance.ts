import { gql } from '@apollo/client';

export const MARK_ATTENDANCE_TO_EVENT = gql`
  mutation Mutation($input: MarkAttendanceInput!) {
    markAttendance(input: $input)
  }
`;
