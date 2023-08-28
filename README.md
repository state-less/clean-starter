# Lists App Backend 📡

Welcome to the backend repository of the Lists app, powered by [React Server](https://state-less.cloud)!

![Lists App Frontend](https://github.com/C5H8NNaO4/lists-app-frontend/raw/master/public/screenshot.png)

## Overview

The Lists app backend provides the robust server-side functionality needed to support the [Lists app](https://lists.state-less.cloud)'s seamless user experience. Built on the React Server framework, this backend code enables real-time synchronization, data storage, and interaction with the frontend.

## Key Features

- **Real-Time Sync**: Achieve real-time updates and synchronization across clients.
- **Data Storage**: Efficiently store task lists, reminders, and user data.
- **Server-Rendered**: Utilize server-rendering capabilities for enhanced performance.
- **Scalable Architecture**: Build a scalable backend for handling multiple users.
- **Clean Codebase**: Based on the clean-starter repo for a structured foundation.

## Getting Started
### Installation
#### Install the backend
```
git clone https://github.com/C5H8NNaO4/lists-app-backend.git
cd lists-app-backend
yarn install
yarn start
```
#### Install the frontend
```
git clone https://github.com/C5H8NNaO4/lists-app-frontend.git
cd lists-app-frontend
yarn install
yarn dev
```

## Contribute
* Fork the repository
* Create a branch
* Commit your changes
* Push to the branch
* Open a pull request

We welcome contributions from the community! Feel free to submit bug reports, feature requests, or pull requests to help make Lists even better.
## Learn More About React Server

Explore the power of [React Server](https://state-less.cloud), the framework used to develop this backend. With React Server, you can build reactive, server-rendered applications with ease.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

Empower Your Lists App with a Robust Backend 🚀

# React Server

![npm (scoped)](https://img.shields.io/npm/v/@state-less/react-server)

The @state-less/clean-starter repository is designed to provide a starting point for developers exploring React Server. It includes essential backend components, utilities, and examples that illustrate the fundamental concepts and capabilities of React Server.

React Server allows the creation of server-side React components using TSX, promoting a component-driven architecture for building robust and maintainable backend solutions. By using @state-less/clean-starter, developers can quickly get started with this innovative approach to full-stack development.

For detailed documentation and in-depth guides, please visit the official website at [state-less.cloud](https://state-less.cloud).

## Getting Started

### Backend

To get started on the backend, you can initialize a new project with the following commands:

```bash
git clone https://github.com/state-less/clean-starter.git -b react-server my-server
```

This command will set up a new project with the necessary dependencies and configuration files. Navigate into the newly created directory and start the development server:

```bash
cd my-server
git remote remove origin
yarn install
yarn start
```

This will launch the development server, allowing you to access your GraphQl endpoint at http://localhost:4000/graphql.

### Client

### Get a Client running

Create a new vite project and choose _React_ as framework and _TypeScript_ as variant.

```bash
yarn create vite
```

Now go to the newly created folder, install the dependencies and add `@apollo/client` and `state-less/react-client` to your project and start the server.

```bash
cd vite-project
yarn
yarn add @apollo/client state-less/react-client
yarn dev
```

![screenshot](https://raw.githubusercontent.com/state-less/react-server-docs-md/master/images/screenshot.jpg)

If you click the button, you will see the counter increase, but if you reload the page, the counter resets to 0. Let's connect the state to our backend to make it serverside and persist over page reloads.

#### Instantiate a GraphQl client

In order to connect to our backend, we need to create a GraphQl client. Create a new file under `/src/lib/client.ts` and paste the following content.

```ts
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Create an HTTP link
const localHttp = new HttpLink({
    uri: 'http://localhost:4000/graphql',
});

// Create a WebSocket link
const localWs = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
        reconnect: true,
    },
});

// Use the split function to direct traffic between the two links
const local = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    localWs,
    localHttp
);

// Create the Apollo Client instance
export const localClient = new ApolloClient({
    link: local,
    cache: new InMemoryCache(),
});

export default localClient;
```

This sets up a new GraphQl client with subscriptions which will be used by the React Server client. The subscriptions are needed in order to make your app _reactive_.

_Note: For now you need to manually create this file, but it will later be created by an initializer or react-client will provide a way to bootstrap the graphql client by providing a url pointing to a react server. For now you need to manually create and provide a GraphQl client._

### Edit `src/App.tsx`

It's been a long way, but all that's left to do is import the `client` and `useServerState` hook and find and replace the `useState` call with a `useServerState` call.

```ts
import { useServerState } from '@state-less/react-client';
import client from './lib/client';

// ...

const [count, setCount] = useServerState(0, {
    key: 'count',
    scope: 'global',
    client,
});
```

If you don't want to pass a client object to each query, you can wrap your application in an `<Apolloprovider client={client} />`. React Server will use the provided client.
_Note: You can still override the provided client if you pass one in the options_

That's it, your App is now powered by the same backend as the documentation under [state-less.cloud](https://state-less.cloud).

Happy Hacking!
