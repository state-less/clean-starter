import { useState } from '@state-less/react-server';
import { v4 } from 'uuid';
import { ServerSideProps } from '../ServerSideProps';
import { Comments } from '../Comments';
import { VotingPolicies, Votings } from '../Votings';

export type PostProps = {
    id: string;
};

export const Answer = ({ id, ...post }: PostProps) => {
    return (
        <ServerSideProps key={`answer-${id}-props`} {...post}>
            <Votings
                key={`answer-${id}-votings`}
                policies={[VotingPolicies.SingleVote]}
            />
            <Comments key={`answer-${id}-comments`} />
        </ServerSideProps>
    );
};

export const Post = ({ id, ...post }: PostProps) => {
    const [answers, setAnswers] = useState([], {
        key: 'answers',
        scope: id,
    });

    const createAnswer = ({ body }) => {
        const answer = {
            id: v4(),

            body,
        };

        setAnswers([...answers, answer]);

        return answer;
    };
    return (
        <ServerSideProps
            key={`post-${id}-props`}
            {...post}
            createAnswer={createAnswer}
        >
            <Votings
                key={`post-${id}-votings`}
                policies={[VotingPolicies.SingleVote]}
            />
            {answers.map((answer) => (
                <Answer key={`answer-${answer.id}`} {...answer} />
            ))}
        </ServerSideProps>
    );
};

export type ForumProps = {
    key: string;
    id: string;
    name: string;
};

export const Forum = ({ id, name }: ForumProps) => {
    const [posts, setPosts] = useState([], {
        key: 'posts',
        scope: id,
    });

    const createPost = ({ title, body }) => {
        const post = {
            id: v4(),
            title,
            body,
        };

        setPosts([...posts, post]);

        console.log('POST', post);
        return post;
    };

    return (
        <ServerSideProps
            key={`forum-${id}-props`}
            id={id}
            name={name}
            createPost={createPost}
        >
            {posts.map((post) => (
                <Post key={'post-' + post.id} {...post} />
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
