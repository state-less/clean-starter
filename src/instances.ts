import { PubSub } from 'graphql-subscriptions';
import { PostgresTransport } from '@state-less/react-server/dist/store/transport';
import { Store } from '@state-less/react-server';
import express from 'express';
import cors from 'cors';
import logger from './lib/logger';
import { NotificationEngine } from './lib/NotificationEngine';
import { PG_PASSWORD, PG_PORT } from './config';

export const pubsub = new PubSub();
export const store = new Store({
    transport: new PostgresTransport({
        connectionString: `postgres://postgres:${PG_PASSWORD}@localhost:${PG_PORT}/postgres`,
    }),
});

export const notificationEngine = new NotificationEngine({
    store,
    listsKey: 'my-lists',
    webpushKey: 'web-push',
    interval: 1 * 60 * 1000,
    logger,
});
export const app = express();
app.options('/*', cors({ origin: true }));
app.use(
    cors({
        origin: true,
    })
);
// store.sync(1 * 60 * 1000);
notificationEngine.start();
