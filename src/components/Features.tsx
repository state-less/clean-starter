import {
    ClientContext,
    IComponent,
    Scopes,
    authenticate,
    useState,
} from '@state-less/react-server';
import { admins } from '../lib/permissions';
import { ServerSideProps } from './ServerSideProps';
import { JWT_SECRET } from '../config';
import { Session } from '../lib/types';

export const Features: IComponent<any> = (_, { context, key }) => {
    const [wilson, setWilson] = useState(false, {
        key: `wilson`,
        scope: Scopes.Global,
    });

    const [animated, setAnimated] = useState(false, {
        key: `animated`,
        scope: Scopes.Global,
    });

    const toggleWilson = () => {
        let user: Session | null = null;
        user = authenticate((context as ClientContext).headers, JWT_SECRET);

        if (!admins.includes(user?.strategies?.[user?.strategy]?.email)) {
            throw new Error('Not an admin');
        }

        setWilson(!wilson);
    };

    const toggleAnimated = () => {
        let user: Session | null = null;
        user = authenticate((context as ClientContext).headers, JWT_SECRET);

        if (!admins.includes(user?.strategies?.[user?.strategy]?.email)) {
            throw new Error('Not an admin');
        }
        setAnimated(!animated);
    };
    return (
        <ServerSideProps
            key={`${key}-props`}
            wilson={wilson}
            animated={animated}
            toggleAnimated={toggleAnimated}
            toggleWilson={toggleWilson}
        />
    );
};
