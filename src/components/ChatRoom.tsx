import {
    ClientContext,
    Initiator,
    RenderOptions,
    Scopes,
    authenticate,
    useClientEffect,
    useState,
} from '@state-less/react-server';
import { v4 } from 'uuid';
import { ServerSideProps } from './ServerSideProps';
import { JWT_SECRET } from '../config';

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
        let user = null;
        try {
            user = authenticate((context as ClientContext).headers, JWT_SECRET);
        } catch (e) {}
        const client = {
            user,
            id: (context as ClientContext).headers['x-unique-id'],
        };
        console.log('Initiator', initiator);
        if (initiator !== Initiator.Mount)
            return () => {
                console.log(
                    '!!! Unmounting client',
                    client.id,
                    clients.filter((c) => c.id !== client.id)
                );
                setClients(clients.filter((c) => c.id !== client.id));
            };

        if (!clients.find((c) => c.id === client.id))
            setImmediate(setClients([...clients, client]));

        return () => {
            console.log(
                '!!! Unmounting client',
                client.id,
                clients.filter((c) => c.id !== client.id)
            );
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
        let user = null;
        try {
            user = authenticate((context as ClientContext).headers, JWT_SECRET);
        } catch (e) {}
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
    console.log('Client Props', clientProps);
    return (
        <ServerSideProps
            key={`${key}-props`}
            total={messages.length}
            messages={messages.slice((clientProps?.num || 30) * -1)}
            clients={clients}
            sendMessage={sendMessage}
        />
    );
};

export const ChatApp = (props, { key, context }) => {
    const [rooms, setRooms] = useState([], {
        key: 'rooms',
        scope: Scopes.Global,
    });

    const addRoom = () => {
        let user = null;
        try {
            user = authenticate((context as ClientContext).headers, JWT_SECRET);
        } catch (e) {}
        const client = {
            user,
            id: (context as ClientContext).headers['x-unique-id'],
        };

        const room = {
            id: v4(),
            owner: client,
        };

        setRooms([...rooms, room]);
    };

    return (
        <ServerSideProps key={`${key}-props`} addRoom={addRoom}>
            <Room key="room-global" />
            {rooms.map((room) => {
                return <Room key={room.id} />;
            })}
        </ServerSideProps>
    );
};
