import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { config } from '@/config';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { insertDataInitializer } from '@/utils/insertDataInitializer';
import { selectDataInitializer } from '@/utils/selectDataInitializer';

const INITIALIZER_NAME = 'initializeDefaultAdmin';

export const initializeDefaultAdmin = async () => {
  if (await selectDataInitializer(INITIALIZER_NAME)) {
    console.log('[db]: Default administrator already initialized...');
    return;
  }

  const email = config.defaultAdmin.email?.trim().toLowerCase();
  const password = config.defaultAdmin.password;
  if (!email || !password) {
    console.warn('[db]: DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD are required; skipping default administrator.');
    return;
  }

  const [existingUser] = await db.select().from(users).where(eq(users.email, email));
  if (existingUser) {
    if (existingUser.deletedAt) {
      console.warn('[db]: A deleted user already uses DEFAULT_ADMIN_EMAIL; skipping default administrator.');
      return;
    }
    await insertDataInitializer(INITIALIZER_NAME);
    console.log('[db]: Default administrator already exists.');
    return;
  }

  await db.insert(users).values({
    name: config.defaultAdmin.name,
    email,
    password: await bcrypt.hash(password, 10),
  });
  await insertDataInitializer(INITIALIZER_NAME);
  console.log('[db]: Default administrator initialization completed successfully.');
};
