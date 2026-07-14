import { Client } from 'pg';

export const createDbClient = (client: Client) => {
  const connect = async () => client.connect();
  const disconnect = async () => client.end();

  return { connect, disconnect };
};
