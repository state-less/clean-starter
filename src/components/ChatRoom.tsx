import {
    ClientContext,
    Initiator,
    RenderOptions,
    Scopes,
    authenticate,
    clientKey,
    useClientEffect,
    useState,
} from '@state-less/react-server';

import { ServerSideProps } from './ServerSideProps';
import { JWT_SECRET } from '../config';

const tryGetUser = (context) => {
    try {
        return authenticate((context as ClientContext).headers, JWT_SECRET);
    } catch (e) {
        return null;
    }
};

export const ChatApp = (props, { key }) => {
    return (
        <ServerSideProps key={`${key}-props`}>
            <Room key="room-global" />
        </ServerSideProps>
    );
};

export const Room = (
    props,
    { key, context, initiator, clientProps }: RenderOptions & { key: string }
) => {
    const [messages, setMessages] = useState([], {
        key: `messages-${key}`,
        scope: Scopes.Global,
    });
    const [clients, setClients] = useState([], {
        key: `clients-${key}`,
        scope: Scopes.Global,
    });

    useClientEffect(() => {
        const user = tryGetUser(context);
        const client = {
            user,
            id: (context as ClientContext).headers['x-unique-id'],
        };

        if (!clients.find((c) => c.id === client.id))
            setImmediate(setClients, [...clients, client]);

        return () => {
            setClients(clients.filter((c) => c.id !== client.id));
        };
    });

    const sendMessage = (message) => {
        if (typeof message !== 'string') {
            throw new Error('Invalid message');
        }
        if (message.length > 100) {
            throw new Error('Message too long');
        }
        const user = tryGetUser(context);
        const client = {
            user,
            id: (context as ClientContext).headers['x-unique-id'],
        };
        const messageObj = {
            author: client,
            message,
            timestamp: +new Date(),
        };
        setMessages([...messages, messageObj]);
    };

    return (
        <ServerSideProps
            key={clientKey(`${key}-props`, context)}
            total={messages.length}
            messages={messages.slice((clientProps?.num || 30) * -1)}
            clients={clients}
            sendMessage={sendMessage}
        />
    );
};
