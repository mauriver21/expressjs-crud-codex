import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@/config': path.resolve(__dirname, './src/config'),
      '@/controllers': path.resolve(__dirname, './src/controllers'),
      '@/db': path.resolve(__dirname, './src/db'),
      '@/interfaces': path.resolve(__dirname, './src/interfaces'),
      '@/middlewares': path.resolve(__dirname, './src/middlewares'),
      '@/models': path.resolve(__dirname, './src/models'),
      '@/providers': path.resolve(__dirname, './src/providers'),
      '@/repositories': path.resolve(__dirname, './src/repositories'),
      '@/routes': path.resolve(__dirname, './src/routes'),
      '@/schemas': path.resolve(__dirname, './src/db/schema'),
      '@/singletons': path.resolve(__dirname, './src/singletons'),
      '@/tests': path.resolve(__dirname, './src/tests'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/validators': path.resolve(__dirname, './src/validators'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    globalSetup: [path.resolve(__dirname, './src/tests/globalSetup.ts')],
  },
});
