import { StrictMode } from 'react';
import './index.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { ThemeProvider } from './contexts/theme/ThemeContextProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/reactQuery';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './lib/apollo';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const AppComponent = () => {
  return (
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={apolloClient}>
            <RouterProvider router={router} />
          </ApolloProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
};
