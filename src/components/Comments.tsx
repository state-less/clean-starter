import {
    authenticate,
    ClientContext,
    IComponent,
    isClientContext,
    Scopes,
    useState,
} from '@state-less/react-server';
import { JWT_SECRET } from '../config';
import { ServerSideProps } from './ServerSideProps';
import { admins } from '../lib/permissions';

export enum CommentActions {
    Authenticate,
    AuthenticateRead,
    Delete,
}

export const Comments: IComponent<any> = (
    { policies = [] }: { policies: CommentActions[] },
    { context }
) => {
    if (
        isClientContext(context) &&
        policies.includes(CommentActions.AuthenticateRead)
    )
        authenticate(context.headers, JWT_SECRET);

    let user;
    try {
        user = authenticate(context.headers, JWT_SECRET);
    } catch (e) {
        console.log('Not authenticated');
    }

    const [comments, setComments] = useState([], {
        key: `comments`,
        scope: Scopes.Component,
    });

    const comment = (message) => {
        let decoded;
        if (policies.includes(CommentActions.Authenticate)) {
            decoded = authenticate(
                (context as ClientContext).headers,
                JWT_SECRET
            );
        }

        const { strategy } = decoded;
        const { email } = decoded.strategies[strategy];

        const commentObj = {
            message,
            identity: {
                email,
                strategy,
                name: decoded.strategies[strategy].decoded.name,
                picture: decoded.strategies[strategy].decoded.picture,
            },
        };
        const newComments = [...comments, commentObj];
        setComments(newComments);
    };

    const del = (index) => {
        if (!admins.includes(user?.strategies[user?.strategy].email)) {
            throw new Error('Not an admin');
        }
        const newComments = [...comments];
        newComments.splice(index, 1);
        setComments(newComments);
    };

    return (
        <ServerSideProps
            permissions={{
                comment: user?.id,
                delete: admins.includes(user?.strategies[user?.strategy].email),
            }}
            key="comments-props"
            comments={comments}
            comment={comment}
            del={del}
        />
    );
};
