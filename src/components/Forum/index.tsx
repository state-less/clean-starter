/* eslint-disable no-unused-vars */
import {
    Initiator,
    authenticate,
    isClientContext,
    render,
    useState,
} from '@state-less/react-server';
import { v4 } from 'uuid';
import { ServerSideProps } from '../ServerSideProps';
import { Comments } from '../Comments';
import { VotingPolicies, Votings } from '../Votings';
import { admins } from '../../lib/permissions';
import { JWT_SECRET } from '../../config';
import { ViewCounter } from '../ViewCounter';

export type PostProps = {
    id: string;
    body: string;
    approved: boolean;
    deleted: boolean;
    approvePost: () => void;
    deletePost: () => void;
    owner: any;
};

export const Answer = (
    {
        id,
        deleteAnswer,
        ...initialAnswer
    }: PostProps & { deleteAnswer: () => void },
    { context }
) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const [post, setPost] = useState<Partial<PostProps>>(initialAnswer, {
        key: 'answer',
        scope: id,
    });
    const [deleted, setDeleted] = useState(false, {
        key: 'deleted',
        scope: id,
    });
    const setBody = (body) => {
        if (typeof body !== 'string') throw new Error('Body must be a string');
        if (deleted) throw new Error('Cannot edit a deleted post');
        setPost({ ...post, body });
    };
    const del = (id) => {
        setDeleted(true);
        deleteAnswer();
    };
    return (
        <ServerSideProps
            key={`answer-${id}-props`}
            {...post}
            deleted={deleted}
            setBody={setBody}
            owner={{
                id: post.owner?.id,
                name: post.owner?.strategies?.[user?.strategy]?.decoded.name,
                picture:
                    post.owner?.strategies?.[user?.strategy]?.decoded.picture,
                email: post.owner?.strategies?.[user?.strategy]?.email,
            }}
            del={del}
            canDelete={
                post?.owner?.id === user?.id ||
                admins.includes(user?.strategies?.[user?.strategy]?.email)
            }
        >
            <Votings
                key={`answer-${id}-votings`}
                policies={[VotingPolicies.SingleVote]}
            />
            <Comments key={`answer-${id}-comments`} />
        </ServerSideProps>
    );
};

export const Post = (
    { id, deletePost, approvePost, ...initialPost }: PostProps,
    { context }
) => {
    let user = null;
    const clientId = context?.headers?.['x-unique-id'] || 'server';
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const [post, setPost] = useState<Partial<PostProps>>(initialPost, {
        key: 'post',
        scope: id,
    });
    const [answers, setAnswers] = useState([], {
        key: 'answers',
        scope: id,
    });

    const createAnswer = ({ body }) => {
        const answer = {
            id: v4(),
            owner: user,
            body,
        };

        setAnswers([...answers, answer]);

        return answer;
    };

    const setBody = (body: string) => {
        if (typeof body !== 'string') throw new Error('Body must be a string');
        if (post.deleted) throw new Error('Cannot edit a deleted post');
        setPost({ ...post, body });
    };
    const del = (id: string) => {
        setPost({ ...post, deleted: true });
        deletePost();
    };

    const approve = () => {
        setPost({ ...post, approved: true });
        approvePost();
    };

    const deleteAnswer = (id: string) => {
        if (!answers.find((answer) => answer.id === id)) {
            throw new Error('Answer not found');
        }
        const deleted = answers.find((answer) => answer.id === id);
        const canDelete =
            deleted?.owner?.id === user?.id ||
            admins.includes(user?.strategies?.[user?.strategy]?.email);

        if (!canDelete) {
            throw new Error('Not authorized to delete this answer');
        }

        setAnswers(
            answers
                .filter((answer) => answer.id !== id)
                .concat([{ ...deleted, deleted: true }])
        );
    };

    const isAdmin = admins.includes(user?.strategies?.[user?.strategy]?.email);
    const isOwner = post?.owner?.id === (user?.id || clientId);
    const isApproved = post?.approved;

    const passProps = {
        approved: isApproved,
    };

    if (isAdmin || isOwner || isApproved) {
        Object.assign(passProps, post);
    }

    return (
        <ServerSideProps
            key={`post-${id}-props`}
            id={id}
            {...passProps}
            owner={{
                id: post.owner?.id,
                name: post.owner?.strategies?.[user?.strategy]?.decoded.name,
                picture:
                    post.owner?.strategies?.[user?.strategy]?.decoded.picture,
                email: post.owner?.strategies?.[user?.strategy]?.email,
            }}
            del={del}
            deleted={post.deleted}
            approve={approve}
            createAnswer={createAnswer}
            canDelete={
                // post?.owner?.id === user?.id ||
                // Only admins can delete posts...
                // TODO: add policies to toggle owner deletion
                admins.includes(user?.strategies?.[user?.strategy]?.email)
            }
            setBody={setBody}
            // TODO: Add renderWithoutEffects utility.
            viewCounter={render(
                <ViewCounter key={`post-${id}-view-counter`} />,
                {
                    clientProps: {},
                    initiator: Initiator.RenderServer,
                    context: null,
                },
                null
            )}
        >
            <Votings
                key={`post-${id}-votings`}
                policies={[VotingPolicies.SingleVote]}
            />
            {answers
                .filter(
                    (answer) => !answer.deleted || answer.owner?.id === user?.id
                )
                .map((answer) => (
                    <Answer
                        key={`answer-${answer.id}`}
                        {...answer}
                        deleteAnswer={() => deleteAnswer(answer.id)}
                    />
                ))}
        </ServerSideProps>
    );
};

export type ForumProps = {
    key: string;
    id: string;
    name: string;
    policies?: ForumPolicies[];
};

export enum ForumPolicies {
    PostsNeedApproval = 'PostsNeedApproval',
}

export const Forum = (
    { id, name, policies }: ForumProps,
    { key, context, clientProps }
) => {
    let user = null;
    const clientId = context?.headers?.['x-unique-id'] || 'server';
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const [posts, setPosts] = useState([], {
        key: 'posts',
        scope: id,
    });

    const createPost = ({ title, body, tags }) => {
        console.log('CREATE POST', user, clientId);
        const post = {
            id: v4(),
            title,
            body,
            tags,
            deleted: false,
            approved: false,
            owner: user || { id: clientId },
        };

        setPosts([...posts, post]);

        return post;
    };

    const deletePost = (id) => {
        const deleted = posts.find((post) => post.id === id);
        const { owner } = deleted || {};
        if (
            owner?.strategies?.[user?.strategy]?.email !==
                user?.strategies?.[user?.strategy]?.email &&
            !admins.includes(user?.strategies?.[user?.strategy]?.email)
        ) {
            throw new Error('Not an admin');
        }

        setPosts(
            posts
                .filter((post) => post.id !== id)
                .concat([{ ...deleted, deleted: true }])
        );

        return deleted;
    };
    const approvePost = (id) => {
        const post = posts.find((post) => post.id === id);
        if (!admins.includes(user?.strategies?.[user?.strategy]?.email)) {
            throw new Error('Not an admin');
        }

        setPosts(
            [{ ...post, approved: true }].concat(
                posts.filter((p) => p.id !== id)
            )
        );
    };

    console.log('CLIENT PROPS', clientProps);
    const filtered = posts
        .filter((post) => !post.deleted)
        .filter((post) => {
            if (policies?.includes(ForumPolicies.PostsNeedApproval)) {
                return (
                    post.approved ||
                    post?.owner?.id === (user?.id || clientId) ||
                    admins.includes(user?.strategies?.[user?.strategy]?.email)
                );
            }
            return true;
        });
    const { page = 1, pageSize = 25, compound = false } = clientProps || {};
    const start = !compound ? (page - 1) * pageSize : 0;
    const end = page * pageSize;
    return (
        <ServerSideProps
            key={`forum-${id}-props`}
            id={id}
            name={name}
            createPost={createPost}
            deletePost={deletePost}
            totalCount={filtered.length}
            page={page}
        >
            {filtered.slice(start, end).map((post) => (
                <Post
                    key={`post-${post.id}`}
                    {...post}
                    deletePost={() => deletePost(post.id)}
                    approvePost={() => approvePost(post.id)}
                />
            ))}
        </ServerSideProps>
    );
};

export const Platform = () => {
    const [forums, setForums] = useState([], {
        key: 'forums',
        scope: 'platform',
    });

    const createForum = ({ name }) => {
        const forum = {
            id: v4(),
            name,
        };

        setForums([...forums, forum]);
    };

    return (
        <ServerSideProps createForum={createForum}>
            {forums.map((forum) => (
                <Forum {...forum} />
            ))}
        </ServerSideProps>
    );
};
