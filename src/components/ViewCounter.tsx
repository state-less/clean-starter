import { Scopes, useClientEffect, useState } from '@state-less/react-server';
import { ServerSideProps } from './ServerSideProps';

export const ViewCounter = (props, { key }) => {
    const [views, setViews] = useState(0, {
        key: 'views',
        scope: Scopes.Global,
    });

    useClientEffect(() => {
        setViews(views + 1);
    }, []);

    return <ServerSideProps key={`${key}-props`} views={views} />;
};
