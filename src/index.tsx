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

import { pubsub, store } from './instances';

import { resolvers } from './resolvers';
import { typeDefs } from './schema';
import { Navigation } from './components/Navigation';
import { HelloWorldExample1, HelloWorldExample2 } from './components/examples';

Dispatcher.getCurrent().setStore(store);
Dispatcher.getCurrent().setPubSub(pubsub);

const app = express();
const PORT = 4000;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
        const { headers } = req;
        return { headers };
    },
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
        <Navigation key="navigation" />
        <HelloWorldExample1 key="hello-world-1" />
        <HelloWorldExample2 key="hello-world-2" />
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
