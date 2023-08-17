import { PubSub } from 'graphql-subscriptions';
import { Store } from '@state-less/react-server';
import logger from './lib/logger';
import { NotificationEngine } from './lib/NotificationEngine';

export const pubsub = new PubSub();
export const store = new Store({ file: './store.json', logger });
export const notificationEngine = new NotificationEngine({
    store,
    listsKey: 'my-lists',
    webpushKey: 'web-push',
    interval: 1 * 60 * 1000,
    logger,
});

store.sync(20 * 1000);
notificationEngine.start();
