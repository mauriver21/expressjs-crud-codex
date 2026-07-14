import { db } from '@/db';
import { dataInitializers } from '@/db/schema/dataInitializers';
import { eq } from 'drizzle-orm';

export const selectDataInitializer = async (name: string) => {
  const [initializer] = await db.select().from(dataInitializers).where(eq(dataInitializers.name, name));
  return initializer;
};
