import { Scopes, useState, clientKey } from '@state-less/react-server';
import { ServerSideProps } from './ServerSideProps';

export const HelloWorldExample1 = () => {
    const [count] = useState(0, { key: 'count', scope: 'global' });

    const increase = () => {
        throw new Error('Not implemented');
    };

    return (
        <ServerSideProps
            // Needed for reactivity
            key="hello-world-1-props"
            count={count}
            increase={increase}
        />
    );
};

export const HelloWorldExample2 = (props, { key, context }) => {
    const [count, setState] = useState(0, {
        key: 'count',
        scope: Scopes.Global,
    });

    const increase = () => {
        setState(count + 1);
    };

    return (
        <ServerSideProps
            key={clientKey(`${key}-props`, context)}
            count={count}
            increase={increase}
        />
    );
};
