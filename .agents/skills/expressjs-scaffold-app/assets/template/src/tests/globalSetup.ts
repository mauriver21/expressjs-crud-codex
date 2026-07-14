import path from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '@/db';
import { pgClient } from '@/singletons/pgClient';

export const setup = async () => {
  if (process.env.TEST_DATABASE_SETUP !== 'true') {
    return;
  }

  console.log('[test setup]: Connecting to PostgreSQL and running migrations...');
  await pgClient.connect();
  try {
    await migrate(db, { migrationsFolder: path.resolve(__dirname, '..', '..', './drizzle') });
  } finally {
    await pgClient.end();
  }
};
