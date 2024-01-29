import {
    Dispatcher,
    Scopes,
    authenticate,
    isClientContext,
    useEffect,
    useState,
} from '@state-less/react-server';
import { JWT_SECRET, VAPID_PUBLIC, VAPID_PRIVATE } from '../config';
import { ServerSideProps } from './ServerSideProps';
import webpush from 'web-push';
import { notificationEngine } from '../instances';
import logger from '../lib/logger';

// webpush.setGCMAPIKey(VAPID_PRIVATE);
webpush.setVapidDetails(
    'mailto:moritz.roessler@gmail.com',
    VAPID_PUBLIC,
    VAPID_PRIVATE
);

export const WebPushManager = (props, { key, context }) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const clientId = context.headers?.['x-unique-id'] || 'server';

    const [subscribed, setSubscribed] = useState(
        {},
        {
            key: 'subscribed',
            scope: key,
        }
    );

    useEffect(() => {
        Object.keys(subscribed).forEach((clientId) => {
            const { sub, user } = subscribed[clientId] || {};
            if (sub) {
                console.log('Resubscribing to Push Manager', clientId);
                notificationEngine.subscribe(clientId, user, sub);
            }
        });
    });

    const subscribe = (subscription) => {
        setSubscribed({
            ...subscribed,
            [clientId]: {
                sub: JSON.parse(subscription),
                user,
            },
        });
        notificationEngine.subscribe(clientId, user, JSON.parse(subscription));
    };

    const unsubscribe = () => {
        setSubscribed({
            ...subscribed,
            [clientId]: null,
        });
        notificationEngine.unsubscribe(clientId, user);
    };

    const sendNotification = (body) => {
        const { sub } = subscribed?.[clientId] || {};
        if (typeof body !== 'string') {
            body = JSON.stringify(body);
        }
        if (sub) {
            try {
                webpush.sendNotification(sub, body);
            } catch (e) {
                logger.error`Error sending notification`;
            }
        }
    };

    return (
        <ServerSideProps
            subscribe={subscribe}
            unsubscribe={unsubscribe}
            sendNotification={sendNotification}
            vapid={VAPID_PUBLIC}
            key={key + '-props'}
        ></ServerSideProps>
    );
};
