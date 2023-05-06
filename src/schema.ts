import { gql } from 'apollo-server';

export const typeDefs = gql`
    scalar JSON
    scalar Timestamp

    union Components = Server | TestComponent | ServerSideProps | Provider

    type Query {
        hello: String
        getState(key: ID!, scope: String!): State
        renderComponent(key: ID!, props: JSON): Component
        unmountComponent(key: ID!): Int
        mountComponent(key: ID!, props: JSON): Boolean
    }

    type Component {
        id: ID!
        props: JSON
        clientProps: JSON
        rendered: Components
    }

    type State {
        id: ID!
        key: ID!
        scope: String!
        value: JSON
    }

    type Mutation {
        setState(key: ID!, scope: String!, value: JSON): State!
        callFunction(key: ID!, prop: String!, args: JSON): JSON
        authenticate(strategy: String!, data: JSON): AuthenticationResult
    }

    type Subscription {
        updateState(key: ID!, scope: String!): State!
        updateComponent(
            key: ID!
            scope: String!
            id: String!
            bearer: String
        ): Component!
    }

    type TestComponent {
        bar: String
        foo: String
    }

    type Server {
        version: String
        uptime: Timestamp
        platform: String
        children: [Components]
    }

    type Provider {
        children: [Components]
    }

    type ServerSideProps {
        key: ID!
        props: JSON!
        children: JSON
    }

    type AuthenticationResult {
        id: ID!
        email: String
        strategy: String!
        strategies: JSON!
        token: String!
    }
`;
