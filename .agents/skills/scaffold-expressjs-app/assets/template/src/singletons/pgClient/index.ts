import { config } from '@/config';
import { Client } from 'pg';

export const pgClient = new Client(config.db);
