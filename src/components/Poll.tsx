import {
    authenticate,
    ClientContext,
    IComponent,
    isClientContext,
    Scopes,
    useState,
    clientKey,
} from '@state-less/react-server';
import { JWT_SECRET } from '../config';
import { ServerSideProps } from './ServerSideProps';

export enum PollActions {
    Authenticate,
    Revert,
}

export const Poll: IComponent<any> = (
    { values, policies = [] }: { values: string[]; policies: PollActions[] },
    { context, key }
) => {
    if (isClientContext(context) && policies.includes(PollActions.Authenticate))
        authenticate(context.headers, JWT_SECRET);

    const [votes, setVotes] = useState(
        values.map(() => 0),
        { key: `votes-${key}`, scope: 'global' }
    );

    const [voted, setVoted] = useState(-1, {
        key: `voted-${key}`,
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
        if (voted === index && policies.includes(PollActions.Revert)) {
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
            key={clientKey(`poll-props-${key}`, context)}
            votes={votes}
            values={values}
            voted={voted}
            vote={vote}
        />
    );
};
