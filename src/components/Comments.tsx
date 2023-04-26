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
import { Session } from '../lib/types';
import { VotingPolicies, Votings } from './Votings';

export enum CommentPolicies {
    Authenticate,
    AuthenticateRead,
    Delete,
}

export const Comments: IComponent<any> = (
    { policies = [] }: { policies: CommentPolicies[] },
    { context }
) => {
    if (
        isClientContext(context) &&
        policies.includes(CommentPolicies.AuthenticateRead)
    )
        authenticate(context.headers, JWT_SECRET);

    let user: Session | null;
    try {
        user = authenticate((context as ClientContext).headers, JWT_SECRET);
    } catch (e) {
        user = null;
    }

    const [comments, setComments] = useState([], {
        key: `comments`,
        scope: Scopes.Component,
    });

    const comment = (message) => {
        let decoded: Session | null = null;
        try {
            decoded = authenticate(
                (context as ClientContext).headers,
                JWT_SECRET
            );
        } catch (e) {
            decoded = null;
        }

        if (policies.includes(CommentPolicies.Authenticate)) {
            if (!decoded) {
                throw new Error('Not authenticated');
            }
        }

        if (!message) throw new Error('Message is required');

        const { strategy } = decoded || { strategy: 'anonymous' };
        const {
            email,
            decoded: { name, picture },
        } = decoded?.strategies?.[strategy] || {
            email: null,
            decoded: { name: 'Anonymous', picture: null },
        };

        const commentObj = {
            message,
            identity: {
                id: (context as ClientContext).headers['x-unique-id'],
                email,
                strategy,
                name,
                picture,
            },
        };
        const newComments = [...comments, commentObj];
        setComments(newComments);
    };

    const del = (index) => {
        const commentToDelete = comments[index];
        if (!commentToDelete) throw new Error('Comment not found');
        const isOwnComment =
            commentToDelete.identity.email ===
                user?.strategies?.[user?.strategy]?.email ||
            (commentToDelete.identity.id ===
                (context as ClientContext).headers['x-unique-id'] &&
                commentToDelete.identity.strategy === 'anonymous');

        if (
            !isOwnComment &&
            !admins.includes(user?.strategies?.[user?.strategy]?.email)
        ) {
            throw new Error('Not an admin');
        }

        const newComments = [...comments];
        newComments.splice(index, 1);
        setComments(newComments);
    };

    return (
        <ServerSideProps
            permissions={{
                comment: policies.includes(CommentPolicies.Authenticate)
                    ? !!user?.id
                    : true,
                delete: admins.includes(
                    user?.strategies?.[user?.strategy]?.email
                ),
            }}
            key="comments-props"
            comments={comments}
            comment={comment}
            del={del}
        >
            {comments.map((cmt, i) => {
                return <Comment key={`comment-${i}`} {...cmt} />;
            })}
        </ServerSideProps>
    );
};

export const Comment = (props, { key }) => {
    return (
        <ServerSideProps key={`${key}-comment.props`} {...props}>
            <Votings
                key={`votings-${key}`}
                policies={[VotingPolicies.SingleVote]}
            />
        </ServerSideProps>
    );
};
