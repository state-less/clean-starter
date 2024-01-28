import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import {
    Server,
    render,
    Dispatcher,
    Initiator,
} from '@state-less/react-server';

import { app, pubsub, store } from './instances';

import { generatePubSubKey, resolvers } from './resolvers';
import { typeDefs } from './schema';
import logger from './lib/logger';
import { Forum, ForumPolicies } from './components/Forum';
import { FORUM_KEY } from './config';
import { ViewCounter } from './components/ViewCounter';

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
        keepAlive: 10000,
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
        <ViewCounter key="forum-views" />
        <Forum
            key={FORUM_KEY}
            id={FORUM_KEY}
            name="Community"
            policies={[ForumPolicies.PostsNeedApproval]}
        />
    </Server>
);

const node = render(
    reactServer,
    {
        initiator: Initiator.RenderServer,
        context: {
            __typename: 'ServerContext',
            headers: undefined,
            os: 'windows',
        },
        clientProps: {},
    },
    null
);

console.log('NODE', node);
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
