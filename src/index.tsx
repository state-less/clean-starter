import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import {
    Server,
    TestComponent,
    render,
    Dispatcher,
    createContext,
} from '@state-less/react-server';

import { store } from './instances';

import { resolvers } from './resolvers';
import { typeDefs } from './schema';

Dispatcher.getCurrent().setStore(store);

const app = express();
const PORT = 4000;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const apolloServer = new ApolloServer({
    schema,
});

// const options = {
//     key: fs.readFileSync(path.resolve('./ssl/key.pem')),
//     cert: fs.readFileSync(path.resolve('./ssl/cert.pem')),
// };

// Create a HTTP server
const httpServer = createServer(app);

// Create a WebSocket server for subscriptions
SubscriptionServer.create(
    {
        schema,
        execute,
        subscribe,
        onConnect: () => {
            console.log('Client connected');
        },
        onDisconnect: () => {
            console.log('Client disconnected');
        },
    },
    {
        server: httpServer,
        path: apolloServer.graphqlPath,
    }
);

const context = createContext();

export const reactServer = (
    <Server key="server">
        <TestComponent key="test" />
    </Server>
);

const node = render(reactServer, null, null);
console.log('NODE', node);
(async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    httpServer.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}.`);
    });
})();
