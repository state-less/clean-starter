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

    return (
        <ServerSideProps
            key="comments-props"
            comments={comments}
            comment={comment}
        />
    );
};
