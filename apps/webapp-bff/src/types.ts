export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  status: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
}

export interface SearchEventsInput {
  category?: string;
  status?: string;
}

export type ApolloContext = {
  currentUser:
    | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
      }
    | undefined;
};
