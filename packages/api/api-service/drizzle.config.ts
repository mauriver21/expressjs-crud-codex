import { defineConfig } from 'drizzle-kit';
import { databaseUrl } from './src/config';

export default defineConfig({
  schema: './src/db/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: databaseUrl },
});
