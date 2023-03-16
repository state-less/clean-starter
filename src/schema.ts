import { gql } from 'apollo-server';

export const typeDefs = gql`
    scalar JSON

    union Components = Server | TestComponent | ServerSideProps | Provider

    type Query {
        hello: String
        getState(key: ID!, scope: String!): State
        renderComponent(key: ID!, props: JSON): Component
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
    }

    type Subscription {
        updateState(key: ID!, scope: String!): State!
    }

    type TestComponent {
        bar: String
        foo: String
    }

    type Server {
        version: String
        uptime: Int
        platform: String
        children: [Components]
    }

    type Provider {
        children: [Components]
    }

    type ServerSideProps {
        props: JSON
        children: JSON
    }
`;
