import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [jwtClient()],
  baseURL: import.meta.env.VITE_BFF_BASE_URL || 'http://localhost:4000',
});
