import { and, eq, isNull, sql } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { User } from '@/interfaces/User';
import { UserCreate } from '@/interfaces/UserCreate';
import { UserUpdate } from '@/interfaces/UserUpdate';

export const createUserModel = () => {
  const create = async (payload: UserCreate): Promise<User> => {
    const [user] = await db.insert(users).values(payload).returning();
    return user;
  };

  const read = async (id: string): Promise<User | undefined> => {
    const [user] = await db.select().from(users).where(and(eq(users.id, id), isNull(users.deletedAt)));
    return user;
  };

  const findByEmail = async (email: string): Promise<User | undefined> => {
    const [user] = await db.select().from(users).where(and(eq(users.email, email), isNull(users.deletedAt)));
    return user;
  };

  const update = async (id: string, payload: UserUpdate): Promise<User | undefined> => {
    const [user] = await db
      .update(users)
      .set({ ...payload, updatedAt: new Date() })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning();
    return user;
  };

  const logicalDelete = async (id: string): Promise<User | undefined> => {
    const [user] = await db
      .update(users)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning();
    return user;
  };

  const list = async (page: number, pageSize: number) => {
    const offset = page * pageSize;
    const data = await db.select().from(users).where(isNull(users.deletedAt)).limit(pageSize).offset(offset);
    const [count] = await db.select({ count: sql<number>`count(*)` }).from(users).where(isNull(users.deletedAt));
    const totalElements = Number(count?.count || 0);
    return {
      data,
      pagination: {
        totalPages: pageSize > 0 ? Math.ceil(totalElements / pageSize) : 0,
        size: pageSize,
        page,
        totalElements,
      },
    };
  };

  return { create, read, findByEmail, update, delete: logicalDelete, list };
};
