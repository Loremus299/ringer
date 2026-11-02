import { defineConfig } from 'drizzle-kit';
import env from './src/env';

export default defineConfig({
  out: './migrations',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.database,
  },
});
