import { Scopes, useState } from '@state-less/react-server';
import { ServerSideProps } from './ServerSideProps';

type VotingObject = {
    title: string;
    upvotes: number;
    downvotes: number;
    key?: string;
};

type ScoreObject = {
    leftBound: number;
    rightBound: number;
};

export const Votings = () => {
    const [voting, setVoting] = useState<VotingObject>(
        {
            title: 'Voting',
            upvotes: 0,
            downvotes: 0,
        },
        {
            key: 'votings',
            scope: Scopes.Global,
        }
    );
    const [score, setScore] = useState<ScoreObject>(
        {
            leftBound: 0,
            rightBound: 0,
        },
        {
            key: 'score',
            scope: Scopes.Global,
        }
    );

    const upvote = () => {
        setVoting({ ...voting, upvotes: voting.upvotes + 1 });
    };

    const downvote = () => {
        setVoting({ ...voting, downvotes: voting.downvotes + 1 });
    };

    const wilsonScoreInterval = () => {
        const { upvotes, downvotes } = voting;
        const n = upvotes + downvotes;
        if (n === 0) return 0; // no votes yet

        const z = 1.96; // 95% probability
        const phat = (1 * upvotes) / n;
        const left = phat + (z * z) / (2 * n);
        const right =
            z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n);
        const leftBoundary = (left - right) / (1 + (z * z) / n);
        const rightBoundary = (left + right) / (1 + (z * z) / n);
        setScore({ leftBound: leftBoundary, rightBound: rightBoundary });
    };

    return (
        <ServerSideProps
            key={`votings-props`}
            {...voting}
            upvote={upvote}
            downvote={downvote}
            score={score}
            wilsonScoreInterval={wilsonScoreInterval}
        />
    );
};
