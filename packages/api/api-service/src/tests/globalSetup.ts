import path from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '@/db';
import { initializers } from '@/db/data-initializers';
import { pgClient } from '@/singletons/pgClient';

export const setup = async () => {
  console.log('[test setup]: Connecting to PostgreSQL, running migrations, and initializing data...');
  await pgClient.connect();
  try {
    await migrate(db, { migrationsFolder: path.resolve(__dirname, '..', '..', './drizzle') });
    for (const initializer of initializers) {
      await initializer();
    }
  } finally {
    await pgClient.end();
  }
};
