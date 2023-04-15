import { PubSub } from 'graphql-subscriptions';
import { Store, PostgresTransport } from '@state-less/react-server';

export const pubsub = new PubSub();
export const store = new Store({
    transport: new PostgresTransport({
        connectionString:
            'postgres://postgres:mysecretpassword@localhost:5433/postgres',
    }),
});
