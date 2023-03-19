import { useState } from '@state-less/react-server';
import { ServerSideProps } from './ServerSideProps';

export const HelloWorld = () => {
    const [count, setCount] = useState(0, { key: 'count', scope: 'global' });

    const increase = () => {
        setCount(count + 1);
    };

    return <ServerSideProps count={count} increase={increase} />;
};
