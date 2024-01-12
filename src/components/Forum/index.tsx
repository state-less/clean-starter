import { useState } from '@state-less/react-server';
import { v4 } from 'uuid';
import { ServerSideProps } from '../ServerSideProps';
import { Comments } from '../Comments';

export type PostProps = {
    id: string;
};

export const Post = ({ id }: PostProps) => {
    return (
        <ServerSideProps>
            <Comments key={`post-${id}-comments`} id={id} />
        </ServerSideProps>
    );
};

export type ForumProps = {
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
    };

    return (
        <ServerSideProps
            key={`forum-${id}-props`}
            id={id}
            name={name}
            createPost={createPost}
        >
            {posts.map((post) => (
                <Post {...post} />
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
