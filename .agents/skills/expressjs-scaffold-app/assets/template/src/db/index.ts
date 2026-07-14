import { pgClient } from '@/singletons/pgClient';
import { createDbClient } from '@/utils/createDbClient';
import { drizzle } from 'drizzle-orm/node-postgres';

export const dbClient = createDbClient(pgClient);
export const db = drizzle(pgClient);
