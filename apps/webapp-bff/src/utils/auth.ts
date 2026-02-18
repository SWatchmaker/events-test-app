import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { jwt } from 'better-auth/plugins/jwt';

const client = new MongoClient(
  process.env.DATABASE_URL || 'mongodb://localhost:27017',
);
const db = client.db();

export const auth = betterAuth({
  trustedOrigins: [
    'http://localhost:5173',
    'http://localhost:63315', // Replace with your frontend's origin
  ],
  database: mongodbAdapter(db, {
    client,
  }),
  plugins: [jwt()],
  experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
  },
});
