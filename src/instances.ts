import { PubSub } from 'graphql-subscriptions';
import { Store } from '@state-less/react-server';

export const pubsub = new PubSub();
export const store = new Store({ scope: 'root' });
