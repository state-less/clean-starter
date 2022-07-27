import { DynamoDBState, DynamodbStore } from 'react-server';
import {
  State,
  SocketIOBroker,
  Store,
} from 'react-server/release/server/state';
import { PG_PASSWORD, PG_USER, TABLE_NAME } from './config';
import { PostgresStore, PSQLState } from './PSQLStore';

/**
 * The root store is an in memory store (not persistent).
 * The root store shouldn't be exposed to the public.
 * Use a public scope instead.
 * */
const store = new Store({ autoCreate: true });

/**
 * We use an own store to store subscriptions
 * */
const subscriptionStore = store.scope('web-push');

/**
 * Create a scoped in memory store.
 * Can be used to store data that doesn't need to be persistent between server reboots
 */
const memoryStore = store.scope('memory');

/**
 * Use a Postgres database for component states.
 * If you plan on using serverless / lambda a DynamoDbStore would be better.
 */
const sqlStore = store.scope('public', {
  autoCreate: true,
  connectionString: `postgres://postgres:${PG_PASSWORD}@localhost:5432/postgres`,
  StoreConstructor: PostgresStore,
  StateConstructor: PSQLState,
});

/**
 * If you'd rather use dynamodb uncomment this section
 */
// const publicStore = store.scope('public', {
//   autoCreate: true,
//   StoreConstructor: DynamodbStore,
//   StateConstructor: DynamoDBState,
//   TableName: TABLE_NAME,
// });

export {
  store,
  sqlStore as publicStore,
  memoryStore,
  subscriptionStore,
  sqlStore,
};
