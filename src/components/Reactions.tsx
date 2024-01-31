import { clientKey, Scopes, useState } from '@state-less/react-server';
import { ServerSideProps } from './ServerSideProps';

type ReactionsState = Record<string, number>;
type ReactionsProps = {
    values: string[];
    key?: string;
    policies: ReactionPolicies[];
};

export const reactionsWhiteList = ['love', 'laugh', 'thumbs-up', 'thumbs-down'];

export enum ReactionPolicies {
    SingleVote = 'single-vote',
}

export const Reactions = (
    { policies = [], values = [] }: ReactionsProps,
    { context, key }
) => {
    const [reactions, setReactions] = useState<ReactionsState>(
        {},
        {
            key: `votings`,
            scope: key,
        }
    );

    const [voted, setVoted] = useState(null, {
        key: `voted-${key}`,
        scope: `${key}-${Scopes.Client}`,
    });

    const react = (reactionKey: string) => {
        if (!values.includes(reactionKey)) {
            throw new Error('Invalid reaction');
        }

        let newReactions;
        if (
            voted === reactionKey &&
            policies.includes(ReactionPolicies.SingleVote)
        ) {
            newReactions = {
                ...reactions,
                [reactionKey]: Number(reactions[reactionKey]) - 1,
            };
            setVoted(null);
        } else {
            newReactions = {
                ...reactions,
                [reactionKey]: Math.max(0, Number(reactions[reactionKey])) + 1,
            };
            if (voted) {
                newReactions[voted] = Math.max(0, Number(reactions[voted]) - 1);
            }
            setVoted(reactionKey);
        }
        setTimeout(() => {
            setReactions(newReactions);
        });
    };

    return (
        <ServerSideProps
            key={clientKey(`reactions-props-${key}`, context)}
            reactions={reactions}
            react={react}
            voted={voted}
            policies={policies}
        />
    );
};
