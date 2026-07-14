import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { db, dbClient } from '@/db';
import { users } from '@/db/schema/users';
import { app } from '@/singletons/app';
import { like } from 'drizzle-orm';

const prefix = 'integration-user';
let authorization: string;
let connected = false;

const payload = () => ({
  name: 'Integration User',
  email: `${prefix}-${randomUUID()}@example.test`,
  password: 'secure-password',
});

const cleanup = async () => {
  await db.delete(users).where(like(users.email, `${prefix}%`));
};

beforeAll(async () => {
  await dbClient.connect();
  connected = true;
  const bootstrap = payload();
  await db.insert(users).values({ ...bootstrap, password: await bcrypt.hash(bootstrap.password, 10) });
  const login = await request(app).post('/api/login').send({ email: bootstrap.email, password: bootstrap.password });
  authorization = `Bearer ${login.body.token}`;
});

afterAll(async () => {
  if (connected) {
    await cleanup();
    await dbClient.disconnect();
  }
});

describe('User Controller Integration Tests', () => {
  it('rejects unauthenticated private routes', async () => {
    expect((await request(app).get('/api/users')).status).toBe(401);
    expect((await request(app).get('/api/users').set('Authorization', 'Bearer invalid')).status).toBe(403);
  });

  it('logs in with valid credentials without returning a password', async () => {
    const user = payload();
    await db.insert(users).values({ ...user, password: await bcrypt.hash(user.password, 10) });
    const response = await request(app).post('/api/login').send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({ email: user.email });
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('creates, reads, updates, lists, and soft-deletes a user', async () => {
    const createPayload = payload();
    const created = await request(app).post('/api/users').set('Authorization', authorization).send(createPayload);

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: createPayload.name, email: createPayload.email });
    expect(created.body).not.toHaveProperty('password');

    const read = await request(app).get(`/api/users/${created.body.id}`).set('Authorization', authorization);
    expect(read.status).toBe(200);

    const update = await request(app)
      .put(`/api/users/${created.body.id}`)
      .set('Authorization', authorization)
      .send({ name: 'Updated Integration User' });
    expect(update.status).toBe(200);
    expect(update.body.name).toBe('Updated Integration User');

    const list = await request(app).get('/api/users?page=0&pageSize=50').set('Authorization', authorization);
    expect(list.status).toBe(200);
    expect(list.body.data).toEqual(expect.arrayContaining([expect.objectContaining({ id: created.body.id })]));
    expect(list.body.pagination).toMatchObject({ page: 0, size: 50 });

    const deleted = await request(app).delete(`/api/users/${created.body.id}`).set('Authorization', authorization);
    expect(deleted.status).toBe(200);
    expect(deleted.body.deletedAt).toBeTruthy();
  });

  it('validates user payloads', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', authorization)
      .send({ name: 'Invalid User' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeInstanceOf(Array);
  });
});
