//@ts-nocheck

import { Component } from 'react-server/release/server/component';
import { ClientComponent, Action } from 'react-server/release/components';
import { publicStore } from '../stores';
import logger from '../lib/logger';
import { authenticate, getId } from '../lib/middleware';

const Poll = async (props, clientProps, socket) => {
  let jwt;
  try {
    jwt = authenticate({ data: socket });
  } catch (e) {}
  const { ip } = socket;
  const { values, title, temp, key } = props;

  const defaultValues: number[] = values.map(() => 0);
  const [votes, setVotes] = await Component.useState(
    defaultValues,
    'votes-' + key,
    { atomic: 'value=ans+x' }
  );
  const [voted, setVoted] = await Component.useState(-1, 'voted-' + key, {
    scope: getId(jwt) || ip || 'anonymous',
  });

  const vote = async (_conn, option: number) => {
    if (!values[option]) {
      throw new Error(`Unsupported value. Supported values are ${values}`);
    }

    // logger.warning`VOTING ${socket.id}`;
    // logger.scope('foo').error`vote ${socket}`

    let _votes = [...votes];
    _votes[option]++;

    if (voted) _votes[voted]--;

    await setVotes(_votes);
    await setVoted(option === voted ? -1 : option);
    return { success: true };
  };

  return (
    <ClientComponent
      values={values}
      title={title}
      //authenticated={authenticated} voted={hasVoted}
      votes={votes}
      voted={voted}
    >
      <Action use={authenticate} onClick={vote}>
        vote
      </Action>
      {/* <Action onClick={authenticate}>authenticate</Action>
      <Action onBeforeUnload={logout} /> */}
    </ClientComponent>
  );
};

export { Poll };
