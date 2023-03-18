import { render, StateValue, Dispatcher } from '@state-less/react-server';

import { globalInstance } from '@state-less/react-server/dist/lib/reactServer';

import { Resolver, State } from '@state-less/react-server/dist/types/graphql';
import { pubsub, store } from './instances';
import TimestampType from './lib/TimestampType';

const generatePubSubKey = (state: Pick<State, 'key' | 'scope'>) => {
    return `${state.key}:${state.scope}`;
};

const generateComponentPubSubKey = (state: Pick<State, 'key' | 'scope'>) => {
    return `component::${state.key}`;
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
    console.log('ABOUT TO RENDER COMPONENT', key, component);
    const rendered = render(component, context);
    console.log('RENDERING COMPONENT', rendered, props);
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

const callFunction = async (parent, args, context) => {
    const { key, scope, prop, args: fnArgs } = args;
    const component = globalInstance.components.get(key);
    const rendered = render(component, context);
    console.log(
        'CALLING FUNCTION',
        component,
        rendered,
        prop,
        rendered.props[prop].fn
    );
    if (rendered.props[prop]) {
        const { fn } = rendered.props[prop];
        const result = fn(fnArgs);
        return result;
    }

    return {
        rendered,
    };
};

export const resolvers = {
    Query: {
        getState: useState,
        renderComponent,
    },
    Mutation: {
        setState,
        callFunction,
    },
    Subscription: {
        updateState: {
            subscribe: (parent, args: Pick<State, 'key' | 'scope'>) => {
                return pubsub.asyncIterator(generatePubSubKey(args));
            },
        },
        updateComponent: {
            subscribe: (parent, args: Pick<State, 'key' | 'scope'>) => {
                console.log(
                    'Subscribing to component',
                    generateComponentPubSubKey(args)
                );
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
