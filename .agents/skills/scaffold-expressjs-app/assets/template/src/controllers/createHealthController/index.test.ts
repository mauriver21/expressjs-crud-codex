import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '@/singletons/app';

describe('Health Controller Integration Tests', () => {
  it('GET /health should return the service status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
