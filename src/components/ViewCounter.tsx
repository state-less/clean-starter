import {
    Initiator,
    RenderOptions,
    Scopes,
    useClientEffect,
    useState,
} from '@state-less/react-server';
import { ServerSideProps } from './ServerSideProps';

export const ViewCounter = (props, { key, initiator }: RenderOptions) => {
    const [views, setViews] = useState(0, {
        key: 'views',
        scope: Scopes.Global,
    });
    const [clients, setClients] = useState(0, {
        key: 'clients',
        scope: Scopes.Global,
    });

    useClientEffect(() => {
        if (initiator !== Initiator.RenderClient) return;
        setClients(clients + 1);
    }, []);

    useClientEffect(() => {
        if (initiator !== Initiator.RenderClient) return;
        setViews(views + 1);
    });

    return (
        <ServerSideProps key={`${key}-props`} views={views} clients={clients} />
    );
};
