import { initializers } from '@/db/data-initializers';
import { pgClient } from '@/singletons/pgClient';

const runInitializers = async () => {
  await pgClient.connect();
  console.log('[db]: Running initializer scripts...');
  for (const initializer of initializers) {
    await initializer();
  }
  await pgClient.end();
};

runInitializers().catch(async (error) => {
  console.error('[db]: Initializers failed:', error);
  await pgClient.end();
  process.exit(1);
});
