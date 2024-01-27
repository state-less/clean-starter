import {
    Initiator,
    RenderOptions,
    Scopes,
    clientKey,
    useClientEffect,
    useState,
} from '@state-less/react-server';
import { ServerSideProps } from './ServerSideProps';

export const ViewCounter = (
    props,
    { key, initiator, context }: RenderOptions
) => {
    const [views, setViews] = useState(0, {
        key: 'views',
        scope: `${key}-${Scopes.Global}`,
    });
    const [clients, setClients] = useState(0, {
        key: 'clients',
        scope: `${key}-${Scopes.Global}`,
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
        <ServerSideProps
            key={clientKey(`${key}-props`, context)}
            component={key}
            views={views}
            clients={clients}
        />
    );
};
