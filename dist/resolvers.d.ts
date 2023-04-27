import { StateValue } from '@state-less/react-server';
import { Resolver, State } from '@state-less/react-server/dist/types/graphql';
export declare const resolvers: {
    Query: {
        getState: Resolver<unknown, State & {
            initialValue: StateValue;
        }>;
        renderComponent: Resolver<unknown, State>;
    };
    Mutation: {
        setState: Resolver<unknown, State>;
        callFunction: (parent: any, args: any, context: any) => Promise<any>;
    };
    Subscription: {
        updateState: {
            subscribe: (parent: any, args: Pick<State, 'key' | 'scope'>) => AsyncIterator<unknown, any, undefined>;
        };
        updateComponent: {
            subscribe: (parent: any, args: Pick<State, 'key' | 'scope'>) => AsyncIterator<unknown, any, undefined>;
        };
    };
    Components: {
        __resolveType(obj: any): any;
    };
    Timestamp: import("graphql").GraphQLScalarType<Date, number>;
};
