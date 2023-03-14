import { State } from '@state-less/react-server/dist/types/graphql';
export declare const resolvers: {
    Query: {
        getState: Resolver<unknown, any>;
        renderComponent: Resolver<unknown, State>;
    };
    Mutation: {
        setState: Resolver<unknown, State>;
    };
    Subscription: {
        updateState: {
            subscribe: (parent: any, args: Pick<State, 'key' | 'scope'>) => AsyncIterator<unknown, any, undefined>;
        };
    };
    Components: {
        __resolveType(obj: any): any;
    };
};
