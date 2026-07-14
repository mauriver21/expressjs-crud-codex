# Initializer Contract

Track initializer identity in a `data_initializers` table. Each initializer should first check its tracking record, seed only if missing, then record completion. Keep the aggregator array ordered by foreign-key dependencies.

`initializeData.ts` connects the shared PostgreSQL client, runs the ordered initializer list sequentially, and disconnects in success/failure handlers. Add `db-initialize: tsx src/db/initializeData.ts`.

Reset scripts are development/test maintenance tools, not normal application behavior. Prompt for the environment before importing configuration, truncate only explicit known tables with `RESTART IDENTITY CASCADE`, and disconnect even after errors.
