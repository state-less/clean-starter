import {
    clientKey,
    Dispatcher,
    Initiator,
    render,
    StateValue,
} from '@state-less/react-server';

import { globalInstance } from '@state-less/react-server/dist/lib/reactServer';

import { Resolver, State } from '@state-less/react-server/dist/types/graphql';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import jwksClient from 'jwks-rsa';
import { pubsub, store } from './instances';
import TimestampType from './lib/TimestampType';
import { JWT_SECRET } from './config';
import { GoogleToken } from './lib/types';
import logger from './lib/logger';

enum AuthStrategy {
    Google = 'google',
}

type PartialAuth<T> = {
    id: string;
    email?: string;
    token: string;
    decoded: T;
};

type CompoundAuth = PartialAuth<unknown> & {
    strategy;
    strategies: Record<AuthStrategy, PartialAuth<unknown>>;
};

type GoogleAuthData = {
    accessToken: string;
    idToken: string;
};

type AuthStrategyData = {
    [AuthStrategy.Google]: GoogleAuthData;
};

const authenticateGoogle = async ({
    accessToken,
    idToken,
}: GoogleAuthData): Promise<PartialAuth<GoogleToken>> => {
    try {
        await verifyGoogleSignature(accessToken);
    } catch (e) {
        console.log('Error verifying signature', e.message);
        throw e;
    }
    const decoded = await decodeGoogleToken(idToken);

    return {
        id: decoded.sub,
        email: decoded.email,
        token: idToken,
        decoded,
    };
};

export const generatePubSubKey = (state: Pick<State, 'key' | 'scope'>) => {
    return `${state.key}:${state.scope}`;
};

const generateComponentPubSubKey = (
    state: Pick<State, 'key' | 'scope'> & { id: string }
) => {
    return `component::${state.id}::${state.key}`;
};

const useState = (parent, args) => {
    const { initialValue, key, scope } = args;
    const state = store.getState(initialValue, { key, scope });

    return {
        ...state,
    };
};

const lastClientProps: Record<string, Record<string, any>> = {};
const renderedComponents: Record<string, string[]> = {};

const unmountComponent = (parent, args, context) => {
    const { key } = args;
    const cleanup = Dispatcher.getCurrent().getCleanupFns(
        clientKey(key, context)
    );
    console.log('Unmounting', key, cleanup?.length);
    const len = cleanup?.length || 0;
    cleanup.forEach((fn) => fn());
    return len;
};

const mountComponent = (parent, args, context) => {
    const { key, props } = args;

    console.log('Mountint', key);
    const component = globalInstance.components.get(key);

    try {
        logger.log`Rendering compoenent ${key} .`;

        const rendered = render(component, {
            clientProps: props,
            context,
            initiator: Initiator.Mount,
        });

        return true;
    } catch (e) {
        console.log('Error mounting component', e);
        throw e;
    }
};

const renderComponent = (parent, args, context) => {
    const { key, props } = args;
    lastClientProps[clientKey(key, context)] = props;
    const component = globalInstance.components.get(key);

    renderedComponents[clientKey('components-', context)] =
        renderedComponents[clientKey('components-', context)] || [];
    renderedComponents[clientKey('components-', context)].push(key);

    if (!component) {
        throw new Error('Component not found');
    }

    try {
        logger.log`Rendering compoenent ${key} .`;

        const rendered = render(component, {
            clientProps: props,
            context,
            initiator: Initiator.RenderClient,
        });
        return {
            rendered,
        };
    } catch (e) {
        console.log('Error rendering component', e);
        throw e;
    }
};

const setState: Resolver<unknown, State> = (parent, args) => {
    const { scope, value, key } = args;
    const state = store.getState(null, { key, scope });
    state.value = value;

    pubsub.publish(generatePubSubKey(state), { updateState: state });

    return {
        ...state,
    };
};

const callFunction = async (parent, args, context) => {
    const { key, prop, args: fnArgs } = args;
    const component = globalInstance.components.get(key);
    const clientProps = lastClientProps[clientKey(key, context)];
    const rendered = render(component, {
        context,
        clientProps,
        initiator: Initiator.FunctionCall,
    });
    if (rendered.props[prop]) {
        const { fn } = rendered.props[prop];
        Dispatcher.getCurrent().addCurrentComponent(component);
        const start = Date.now();
        const result = fn(...fnArgs);
        const end = Date.now();
        console.log('Function call took', end - start, 'ms');
        Dispatcher.getCurrent().popCurrentComponent();
        return result;
    }

    return {
        rendered,
    };
};

const verifyGoogleSignature = async (token: string) => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
        );

        if (response.data.error) {
            throw new Error(response.data.error);
        }

        return response.data;
    } catch (e) {
        throw new Error(
            `Error verifying google signature: ${e.message || e.toString()}`
        );
    }
};

const strategies: Record<
    AuthStrategy,
    (data: any) => Promise<PartialAuth<unknown>>
> = {
    [AuthStrategy.Google]: authenticateGoogle,
};

const decodeGoogleToken = async (token): Promise<GoogleOAuthToken> => {
    return new Promise((resolve, reject) => {
        const client = jwksClient({
            jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
        });

        // Find the key that matches the key ID in the JWT token header
        jwt.verify(
            token,
            (header, callback) => {
                client.getSigningKey(header.kid, (err, key: any) => {
                    const signingKey = key.publicKey || key.rsaPublicKey;
                    callback(null, signingKey);
                });
            },
            {},
            (err, decoded) => {
                if (err) {
                    reject(err);
                }
                resolve(decoded as GoogleToken);
            }
        );
    });
};

const authenticate = async <T extends AuthStrategy>(
    parent,
    args: { strategy: T; data: AuthStrategyData[T] }
): Promise<CompoundAuth> => {
    const { strategy, data } = args;

    if (!strategies[strategy]) {
        throw new Error('Invalid strategy');
    }

    const auth = await strategies[strategy](data);

    if (!isValidAuthResponse(auth)) {
        throw new Error('Invalid auth response');
    }

    const id = `${strategy}:${auth.id}`;
    const payload = {
        id,
        strategy,
        strategies: {
            [strategy as AuthStrategy]: auth,
        },
    };

    return {
        ...payload,
        token: jwt.sign(payload, JWT_SECRET),
    };
};

const isValidAuthResponse = (auth: any): auth is PartialAuth<any> => {
    return auth && auth.id && auth.token;
};

export const resolvers = {
    Query: {
        getState: useState,
        renderComponent,
        unmountComponent,
        mountComponent,
    },
    Mutation: {
        setState,
        callFunction,
        authenticate,
    },
    Subscription: {
        updateState: {
            subscribe: (parent, args: Pick<State, 'key' | 'scope'>) => {
                return pubsub.asyncIterator(generatePubSubKey(args));
            },
        },
        updateComponent: {
            subscribe: (
                parent,
                args: Pick<State, 'key' | 'scope'> & {
                    id: string;
                    bearer?: string;
                }
            ) => {
                logger.log`Subscribing to component ${generateComponentPubSubKey(
                    args
                )}`;
                return pubsub.asyncIterator(generateComponentPubSubKey(args));
            },
        },
    },
    Components: {
        // eslint-disable-next-line no-underscore-dangle
        __resolveType(obj) {
            // eslint-disable-next-line no-underscore-dangle
            return obj.__typename || null;
        },
    },
    Timestamp: TimestampType,
};
