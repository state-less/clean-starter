import { Scopes, useState } from '@state-less/react-server';
import { ServerSideProps } from './ServerSideProps';

type VotingObject = {
    title: string;
    upvotes: number;
    downvotes: number;
    key?: string;
};

type ScoreObject = {
    upvote: number;
    downvote: number;
};

export const Votings = ({ scope = Scopes.Global }: { scope?: Scopes }) => {
    const [voting, setVoting] = useState<VotingObject>(
        {
            title: 'Voting',
            upvotes: 0,
            downvotes: 0,
        },
        {
            key: 'votings',
            scope,
        }
    );
    const [score, setScore] = useState<ScoreObject>(
        {
            upvote: 0,
            downvote: 0,
        },
        {
            key: 'score',
            scope,
        }
    );

    /* *
     * We use the wilson score to compute two bounds. One for the upvote proportion and one for the downvote proportion.
     * */
    const wilsonScoreInterval = (n, votes) => {
        if (n === 0) return 0; // no votes yet

        const z = 1.96; // 95% probability
        const phat = (1 * votes) / n;
        const left = phat + (z * z) / (2 * n);
        const right =
            z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n);
        const leftBoundary = (left - right) / (1 + (z * z) / n);

        // We don't need the upper boundary of the score.
        // const rightBoundary = (left + right) / (1 + (z * z) / n);

        return leftBoundary;
    };

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
        const newVoting = { ...voting, upvotes: voting.upvotes + 1 };
        setVoting(newVoting);
        storeWilsonScore(newVoting);
    };

    const downvote = () => {
        const newVoting = { ...voting, downvotes: voting.downvotes + 1 };
        setVoting(newVoting);
        storeWilsonScore(newVoting);
    };

    return (
        <ServerSideProps
            key="votings-props"
            {...voting}
            upvote={upvote}
            downvote={downvote}
            score={score}
        />
    );
};
