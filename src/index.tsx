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

import { app, pubsub, store } from './instances';

import { generatePubSubKey, resolvers } from './resolvers';
import { typeDefs } from './schema';
import { Navigation } from './components/Navigation';
import { HelloWorldExample1, HelloWorldExample2 } from './components/examples';
import { DynamicPage, Pages } from './components/Pages';
import { VotingPolicies, Votings } from './components/Votings';
import { Session } from './components/Session';
import { Poll, PollActions } from './components/Poll';
import { CommentPolicies, Comments } from './components/Comments';
import logger from './lib/logger';
import { Features } from './components/Features';
import { ViewCounter } from './components/ViewCounter';
import { ChatApp } from './components/ChatRoom';
import { Platform } from './components/Forum';
import { MyLists, MyListsMeta } from './components/Lists';
import { WebPushManager } from './components/WebPushManager';

Dispatcher.getCurrent().setStore(store);
Dispatcher.getCurrent().setPubSub(pubsub);

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
// Create a HTTP server
const httpServer = createServer(app);

const connections = store.createState(0, {
    key: 'connections',
    scope: 'global',
});
// Create a WebSocket server for subscriptions
const clients = new WeakMap();
SubscriptionServer.create(
    {
        schema,
        execute,
        subscribe,
        onConnect: (params, socket) => {
            logger.log`Client connected`;
            connections.value += 1;
            pubsub.publish(generatePubSubKey(connections), {
                updateState: connections,
            });

            console.log(
                'Connnect',
                socket.upgradeReq.headers.cookie?.match(
                    /x-react-server-id=(.+?);/
                )?.[1]
            );
            return { headers: params.headers };
        },
        onDisconnect: (params, socket) => {
            connections.value = Math.max(0, connections.value - 1);
            pubsub.publish(generatePubSubKey(connections), {
                updateState: connections,
            });

            console.log(
                'Disconnect',
                socket.request.headers.cookie?.match(
                    /x-react-server-id=(.+?);/
                )?.[1]
            );
        },
    },
    {
        server: httpServer,
        path: apolloServer.graphqlPath,
    }
);

export const reactServer = (
    <Server key="server">
        <ChatApp key="chat" />
        <ViewCounter key="view-counter" />
        <Features key="features" />
        <TestComponent key="test" />
        <Navigation key="navigation" />
        <HelloWorldExample1 key="hello-world-1" />
        <HelloWorldExample2 key="hello-world-2" />
        <Pages key="pages" />
        <DynamicPage key="page" />
        <MyLists key="my-lists" />
        <MyListsMeta key="my-lists-points" />
        <Votings key="votings" policies={[VotingPolicies.SingleVote]} />
        <Votings key="votings-multiple" policies={[]} />
        <Session key="session" />
        <Poll
            key="poll"
            values={[
                'Where can I get this?',
                'Meh...',
                'Shut up and take my money.',
            ]}
            policies={[PollActions.Revert, PollActions.Authenticate]}
        />
        <Poll
            key="poll-open"
            values={[
                'Nice!',
                'Meh...',
                "It's not working",
                'Add more features.',
                'Add a comment section.',
                'Shut up and take my money.',
            ]}
            policies={[PollActions.Revert]}
        />
        <Comments key="comments" policies={[CommentPolicies.Authenticate]} />
        <Platform key="platform" />
        <WebPushManager key="web-push" />
    </Server>
);

const node = render(reactServer, null, null);

(async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        bodyParserConfig: {
            limit: '10mb',
        },
    });
    httpServer.listen(PORT, () => {
        logger.log`Server listening on port ${PORT}.`;
    });
})();
