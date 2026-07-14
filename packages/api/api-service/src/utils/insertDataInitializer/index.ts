import { db } from '@/db';
import { dataInitializers } from '@/db/schema/dataInitializers';

export const insertDataInitializer = (name: string) => {
  return db.insert(dataInitializers).values({ name });
};
