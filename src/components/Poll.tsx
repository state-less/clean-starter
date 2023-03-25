import {
    authenticate,
    isClientContext,
    Scopes,
    useState,
} from '@state-less/react-server';
import { JWT_SECRET } from '../config';
import { ServerSideProps } from './ServerSideProps';

export enum PollActions {
    Revert,
}

export const Poll = (
    {
        values,
        key,
        allow = [],
    }: { values: string[]; key: string; allow: PollActions[] },
    { context }
) => {
    if (isClientContext(context)) authenticate(context.headers, JWT_SECRET);
    const [votes, setVotes] = useState(
        values.map(() => 0),
        { key: `votes-${key}`, scope: 'global' }
    );

    const [voted, setVoted] = useState(-1, {
        key: 'voted',
        scope: Scopes.Client,
    });

    const unvote = (index) => {
        if (voted !== index) {
            throw new Error('Already voted');
        }
        const newVotes = [...votes];
        newVotes[index] -= 1;
        setVotes(newVotes);
        setVoted(-1);
    };

    const vote = (index) => {
        if (voted === index && allow.includes(PollActions.Revert)) {
            unvote(index);
            return;
        }
        if (voted !== -1) {
            throw new Error('Already voted');
        }
        const newVotes = [...votes];
        newVotes[index] += 1;
        setVotes(newVotes);
        setVoted(index);
    };

    return (
        <ServerSideProps
            key="poll-props"
            votes={votes}
            values={values}
            voted={voted}
            vote={vote}
        />
    );
};
