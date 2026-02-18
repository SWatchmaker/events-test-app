import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import dotenv from 'dotenv';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { auth } from './utils/auth.js';
import { ApolloContext } from './types.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<ApolloContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:63315'], // Replace with your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

app.all('/api/auth/*', toNodeHandler(auth));

app.use(
  '/graphql',
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      const currentUser = session?.user;
      return { currentUser };
    },
  }),
);

const PORT = process.env.PORT || 4000;

await new Promise<void>((resolve) =>
  httpServer.listen({ port: PORT }, () => resolve()),
);
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
