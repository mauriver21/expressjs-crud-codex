import { databaseUrl } from '@/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const client = new Client({ connectionString: databaseUrl });

const run = async () => {
  await client.connect();
  await migrate(drizzle(client), { migrationsFolder: './drizzle' });
  await client.end();
};

run().catch((error) => {
  console.error('[database]: Migration failed:', error);
  process.exit(1);
});
