import { clientKey, Scopes, useState } from '@state-less/react-server';
import { ServerSideProps } from './ServerSideProps';

type VotingObject = {
    title: string;
    upvotes: number;
    downvotes: number;
    key?: string;
};

type ScoreObject = {
    upvote: number[];
    downvote: number[];
};

export enum VotingPolicies {
    SingleVote = 'single-vote',
}

/* *
 * We use the wilson score to compute two bounds. One for the upvote proportion and one for the downvote proportion.
 * */
const wilsonScoreInterval = (n, votes) => {
    if (n === 0) return [0, 1]; // no votes yet

    const z = 1.96; // 95% probability
    const phat = (1 * votes) / n;
    const left = phat + (z * z) / (2 * n);
    const right = z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n);
    const leftBoundary = (left - right) / (1 + (z * z) / n);

    // We don't need the upper boundary of the score.
    const rightBoundary = (left + right) / (1 + (z * z) / n);

    return [leftBoundary, rightBoundary];
};

export const Votings = (
    {
        scope = Scopes.Global,
        policies = [],
    }: {
        scope?: Scopes;
        key: string;
        policies: VotingPolicies[];
    },
    { context, key }
) => {
    const [voting, setVoting] = useState<VotingObject>(
        {
            title: 'Voting',
            upvotes: 0,
            downvotes: 0,
        },
        {
            key: `votings-${key}`,
            scope,
        }
    );
    const [score, setScore] = useState<ScoreObject>(
        {
            upvote: [0, 0],
            downvote: [0, 0],
        },
        {
            key: 'score',
            scope,
        }
    );

    const [voted, setVoted] = useState(0, {
        key: `voted-${key}`,
        scope: Scopes.Client,
    });

    const storeWilsonScore = (newVoting) => {
        // We need to pass newVoting because variable in the scope will have an outdated value.
        const { upvotes, downvotes } = newVoting;
        const upvoteScore = wilsonScoreInterval(upvotes + downvotes, upvotes);
        const downvoteScore = wilsonScoreInterval(
            upvotes + downvotes,
            downvotes
        );
        setScore({ upvote: upvoteScore, downvote: downvoteScore });
    };

    const upvote = () => {
        if (policies.includes(VotingPolicies.SingleVote) && voted === -1) {
            throw new Error('Already voted');
        }
        let newVoting;
        if (voted === 1 && policies.includes(VotingPolicies.SingleVote)) {
            newVoting = { ...voting, upvotes: voting.upvotes - 1 };
            setVoted(0);
        } else {
            newVoting = { ...voting, upvotes: voting.upvotes + 1 };
            setVoted(1);
        }
        setVoting(newVoting);
        storeWilsonScore(newVoting);
    };

    const downvote = () => {
        if (policies.includes(VotingPolicies.SingleVote) && voted === 1) {
            throw new Error('Already voted');
        }
        let newVoting;
        if (voted === -1 && policies.includes(VotingPolicies.SingleVote)) {
            newVoting = { ...voting, downvotes: voting.downvotes - 1 };
            setVoted(0);
        } else {
            newVoting = { ...voting, downvotes: voting.downvotes + 1 };
            setVoted(-1);
        }
        setVoting(newVoting);
        storeWilsonScore(newVoting);
    };

    return (
        <ServerSideProps
            key={clientKey(`poll-props-${key}`, context)}
            {...voting}
            upvote={upvote}
            downvote={downvote}
            score={score}
            voted={voted}
            policies={policies}
        />
    );
};
