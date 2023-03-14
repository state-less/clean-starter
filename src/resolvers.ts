import { render, StateValue } from '@state-less/react-server';

import { globalInstance } from '@state-less/react-server/dist/lib/reactServer';
import { Resolver, State } from '@state-less/react-server/dist/types/graphql';
import { pubsub, store } from './instances';

const generatePubSubKey = (state: Pick<State, 'key' | 'scope'>) => {
    return `${state.key}:${state.scope}`;
};

const useState: Resolver<unknown, State & { initialValue: StateValue }> = (
    parent,
    args
) => {
    const { initialValue, key, scope } = args;
    const state = store.getState(initialValue, { key, scope });

    return {
        ...state,
    };
};

const renderComponent: Resolver<unknown, State> = (parent, args, context) => {
    const { key, scope, props } = args;
    const component = globalInstance.components.get(key);
    const rendered = render(component, context);

    return {
        rendered,
    };
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

export const resolvers = {
    Query: {
        getState: useState,
        renderComponent,
    },
    Mutation: {
        setState,
    },
    Subscription: {
        updateState: {
            subscribe: (parent, args: Pick<State, 'key' | 'scope'>) => {
                return pubsub.asyncIterator(generatePubSubKey(args));
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
};
