import { existsSync } from 'fs';
import path from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '@/db';
import { pgClient } from '@/singletons/pgClient';

export const setup = async () => {
  const migrationsFolder = path.resolve(__dirname, '..', '..', './drizzle');
  if (!existsSync(migrationsFolder)) {
    return;
  }

  console.log('[test setup]: Connecting to PostgreSQL and running migrations...');
  await pgClient.connect();
  try {
    await migrate(db, { migrationsFolder });
  } finally {
    await pgClient.end();
  }
};
