# Initializer Pattern

## Required infrastructure

The tracking table is `data_initializers` with a `name` column. Reuse:

- `selectDataInitializer(name)` to check completion.
- `insertDataInitializer(name)` to record completion.
- `src/db/data-initializers/index.ts` to sequence initializers.
- `src/db/initializeData.ts` to connect once and execute that sequence.

## Module shape

```ts
import { db } from '@/db';
import { targetTable } from '@/db/schema/targetTable';
import { insertDataInitializer } from '@/utils/insertDataInitializer';
import { selectDataInitializer } from '@/utils/selectDataInitializer';

const INITIALIZER_NAME = 'initializeTargets';

export const initializeTargets = async () => {
  if (await selectDataInitializer(INITIALIZER_NAME)) {
    console.log('[db]: Targets already initialized...');
    return;
  }

  const existing = await db.select({ code: targetTable.code }).from(targetTable);
  const existingCodes = new Set(existing.map(({ code }) => code.toUpperCase()));
  const toInsert = sourceRows.filter((row) => !existingCodes.has(row.code.toUpperCase()));

  if (toInsert.length === 0) {
    console.log('[db]: No target rows require initialization.');
    await insertDataInitializer(INITIALIZER_NAME);
    return;
  }

  await db.insert(targetTable).values(toInsert);
  await insertDataInitializer(INITIALIZER_NAME);
  console.log('[db]: Targets initialization completed successfully.');
};
```

## Ordering and completion

Register parents before children. Countries precede states, states precede cities, and roles precede users. When an initializer cannot run because parent rows or external source data are unavailable, log and return without adding the tracking row; the next run must be able to retry.

Use a database transaction when partial completion would leave an invalid result. For very large, independently idempotent datasets, batch inserts and log each batch; only insert the tracking record after the last batch succeeds.
