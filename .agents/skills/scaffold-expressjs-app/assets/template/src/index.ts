import { startServer } from '@/singletons/app';

startServer().catch((error) => {
  console.error('[server]: Bootstrapping error:', error);
  process.exit(1);
});
