import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const dataInitializers = pgTable('data_initializers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});
