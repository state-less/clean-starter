import { PubSub } from 'graphql-subscriptions';
import { Store } from '@state-less/react-server';
import logger from './lib/logger';

export const pubsub = new PubSub();
export const store = new Store({ file: './store.json', logger });

store.sync(5 * 60 * 1000);
