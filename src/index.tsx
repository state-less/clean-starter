import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import {
    Server,
    TestComponent,
    render,
    Dispatcher,
    Initiator,
} from '@state-less/react-server';

import { Forum, ForumPolicies, Platform } from '@state-less/leap-backend';
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
// import { Forum, ForumPolicies, Platform } from './components/Forum';
import { List, MyLists, MyListsMeta } from './components/Lists';
import { WebPushManager } from './components/WebPushManager';
import { admins } from './lib/permissions';

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

const landingList1 = {
    id: 'landing-list-1',
    title: 'Hello World',
    todos: [
        {
            id: 'todo-0',
            title: 'Hello World',
            completed: true,
        },
        {
            id: 'todo-1',
            title: 'Add your first Todo Item',
            completed: false,
        },
        {
            id: 'todo-2',
            title: 'Add a counter item by clicking +',
            completed: false,
        },
    ],
    order: ['todo-0', 'todo-1', 'todo-2'],
};

const landingList2 = {
    id: 'landing-list-2',
    title: 'Colors',
    color: '#ABDDA477',
    todos: [
        {
            id: 'counter-0',
            type: 'Counter',
            count: 3,
            title: 'Glasses of water',
        },
    ],
    order: ['counter-0'],
};
const landingList3 = {
    id: 'landing-list-3',
    title: 'History',
    settings: {
        defaultType: 'Counter',
    },
    todos: [
        {
            id: 'history-1',
            createdAt: +new Date('2024-01-01'),
            count: 3,
            type: 'Counter',
            title: 'Joy',
            archived: +new Date('2024-01-01'),
        },
        {
            id: 'history-2',
            createdAt: +new Date('2024-01-01'),
            count: 2,
            type: 'Counter',
            title: 'Coffee',
            archived: +new Date('2024-01-01'),
        },
        {
            id: 'history-3',
            createdAt: +new Date('2024-01-02'),
            count: 1,
            type: 'Counter',
            title: 'Joy',
            archived: +new Date('2024-01-02'),
        },
        {
            id: 'history-4',
            createdAt: +new Date('2024-01-02'),
            count: 4,
            type: 'Counter',
            title: 'Coffee',
            archived: +new Date('2024-01-02'),
        },
        {
            id: 'history-5',
            createdAt: +new Date('2024-01-03'),
            count: 0,
            type: 'Counter',
            title: 'Joy',
            archived: +new Date('2024-01-03'),
        },
        {
            id: 'history-6',
            createdAt: +new Date('2024-01-03'),
            count: 0,
            type: 'Counter',
            title: 'Coffee',
            archived: +new Date('2024-01-03'),
        },
        {
            id: 'history-7',
            createdAt: +new Date('2024-01-04'),
            count: 2,
            type: 'Counter',
            title: 'Joy',
            archived: +new Date('2024-01-04'),
        },
        {
            id: 'history-8',
            createdAt: +new Date('2024-01-04'),
            count: 2,
            type: 'Counter',
            title: 'Coffee',
            archived: +new Date('2024-01-04'),
        },
        {
            id: 'history-9',
            createdAt: +new Date('2024-01-05'),
            count: 5,
            type: 'Counter',
            title: 'Joy',
            archived: +new Date('2024-01-05'),
        },
        {
            id: 'history-10',
            createdAt: +new Date('2024-01-05'),
            count: 2,
            type: 'Counter',
            title: 'Coffee',
            archived: +new Date('2024-01-05'),
        },
        {
            id: 'history-11',
            createdAt: +new Date('2024-01-06'),
            count: 3,
            type: 'Counter',
            title: 'Joy',
            archived: +new Date('2024-01-06'),
        },
        {
            id: 'history-12',
            createdAt: +new Date('2024-01-06'),
            count: 1,
            type: 'Counter',
            title: 'Coffee',
            archived: +new Date('2024-01-06'),
        },
        {
            id: 'history-13',
            createdAt: +new Date('2024-01-07'),
            count: 1,
            type: 'Counter',
            title: 'Joy',
            archived: +new Date('2024-01-07'),
        },
        {
            id: 'history-14',
            createdAt: +new Date('2024-01-07'),
            count: 1,
            type: 'Counter',
            title: 'Coffee',
            archived: +new Date('2024-01-07'),
        },
        {
            id: 'history-15',
            createdAt: +new Date('2024-01-08'),
            count: 1,
            type: 'Counter',
            title: 'Joy',
        },
        {
            id: 'history-16',
            createdAt: +new Date('2024-01-08'),
            count: 1,
            type: 'Counter',
            title: 'Coffee',
        },
    ],
    order: [...Array(16)].map((_, i) => `history-${i + 1}`),
};
const demoList1 = {
    id: 'demo-list-1',
    title: 'Todos',
    order: ['todo-0'],
    todos: [
        {
            id: 'todo-0',
            title: 'Todo',
            type: 'Todo',
            completed: false,
        },
    ],
};
export const reactServer = (
    <Server key="server">
        <ChatApp key="chat" />
        <ViewCounter key="view-counter" />
        <ViewCounter key="lists-views" />
        <ViewCounter key="js-forum-views" />
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
        <List key="landing-list-1" {...landingList1} />
        <List key="landing-list-2" {...landingList2} />
        <List key="landing-list-3" {...landingList3} />
        <List key="todos" {...demoList1} />
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
        <Forum
            key="community-forum"
            id="community-forum"
            name="Community"
            policies={[ForumPolicies.PostsNeedApproval]}
            users={admins}
        />
        <Forum
            key="lists-forum"
            id="lists-forum"
            name="Lists Forum"
            policies={[ForumPolicies.PostsNeedApproval]}
            users={admins}
        />
        <Forum
            key="javascript-forum"
            id="javascript-forum"
            name="JavaScript Forum"
            policies={[ForumPolicies.PostsNeedApproval]}
            users={admins}
        />
        <WebPushManager key="web-push" />
    </Server>
);

render(
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
