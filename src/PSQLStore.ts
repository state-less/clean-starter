//@ts-nocheck
import { State, Store } from 'react-server/release/server/state';
import { Atomic } from 'react-server/release/server/state/Atomic';
import {
  UseStateOptions,
  CacheBehaviour,
} from 'react-server/release/interfaces';

import _pgp from 'pg-promise';
import baseLogger from './lib/logger';

const logger = baseLogger.scope('PSQLStore');
const pgp = _pgp();

class PSQLState extends Atomic {
  db: any;

  constructor(def, options) {
    super(def, options);
    const { db } = options;
    Object.assign(this, { db });
  }
  async getValue() {
    const { db, id } = this;
    const { key, scope } = this;
    try {
      const res = await db.any(
        `SELECT id, state FROM states WHERE state->>'key' = $1 AND state->>'scope' = $2`,
        [key, scope]
      );
      this.id = res[0].id;
      this.value = res[0].state.value;
      setTimeout(() => {
        State.sync(this);
      }, 10);
    } catch (e) {
      console.log('ERROR', e);
    }
    return this.value;
  }
  async setValue(value, initial) {
    const { db, id } = this;
    console.log('SETTING POSTGRES STATE VALUE');
    const { key, scope } = this;
    try {
      let res;
      if (initial || !id) {
        res = await db.any(`INSERT INTO states(id, state) VALUES($1, $2)`, [
          id,
          { key, scope, value },
        ]);
      } else if (id) {
        res = await db.any(`UPDATE states SET state = $1 WHERE id = $2`, [
          { key, scope, value },
          id,
        ]);
      }
      console.log('Inserted new state', res);
      this.value = value;

      setTimeout(() => {
        State.sync(this);
      }, 10);
      return value;
    } catch (e) {
      console.log('ERROR', e);
    }
  }
}
class AsyncStore extends Store {
  async get(key, ...args) {
    const [def, options] = args;
    const { cache = CacheBehaviour.CACHE_FIRST } = options;

    if (super.has(key)) {
      const state = super.get(key);
      if (cache !== CacheBehaviour.NETWORK_FIRST) {
        return state;
      } else {
        (await state).getValue();
        return state;
      }
    }

    const state = await this.createState(key, def, options, ...args);
    //TODO: Refactor. Make this a static method that writes to the instance from the outside.
    //Void!
    await state.getValue();

    return state;
  }

  async exists({ key, scope }): Promise<boolean> {
    throw new Error('Not implemented');
  }

  async has(stateKey, scope = 'base') {
    //???
    if (super.has(stateKey)) {
      return true;
    }
    const exists: boolean = await this.exists({ key: stateKey, scope: scope });
    return exists;
  }

  async useState(
    key,
    def,
    options: UseStateOptions = { throwIfNotAvailable: false },
    ...args
  ) {
    const { cache = CacheBehaviour.CACHE_FIRST } = options;
    this.validateUseStateArgs(key, def, options, ...args);
    const hasKey = await this.has(key, options.scope);

    if (hasKey) return await this.get(key, def, options, ...args);

    if (this.autoCreate) {
      const extra: any = { ...this, ...options };
      const state: any = await this.createState(key, def, extra, ...args);
      await state.setValue(def, true);
      return state;
    }
  }

  useStateSync(
    key,
    def,
    options: UseStateOptions = { throwIfNotAvailable: false },
    ...args
  ) {
    const state = super.useState(key, def, options, ...args);
    this.useState(key, def, options);
    return state;
  }
  async createState(key, def, ...args) {
    return super.createState(key, def, ...args);
  }
}

class PostgresStore extends AsyncStore {
  connectionString: any;
  db: any;
  StateConstructor: typeof PSQLState;
  constructor(options) {
    super(options);
    const { connectionString, StateConstructor = PSQLState } = options;
    Object.assign(this, { connectionString, StateConstructor });

    (async () => {
      await this.initConnection();
    })();
  }
  async initConnection() {
    try {
      const opt: any = this.connectionString;
      const db = pgp(opt);
      this.db = db;
    } catch (e) {
      logger.error`Error initializing PSQL connection.`;
    }
  }
  async exists({ key, scope }) {
    console.log('PSQL EXISTS???', key, scope);
    try {
      const query = `SELECT state FROM states WHERE state->>'key' = '${key}' AND state->>'scope' = '${scope}'`;
      logger.debug`Executing query ${query}`;
      const states = await this.db.any(query);
      console.log('STATES', states);
      return states.length > 0;
    } catch (e) {
      console.log('ERROR', e);

      throw e;
    }
    process.exit(0);
  }

  createStateSync(key, def, options, ...args): PSQLState {
    const { db } = this;
    const state = super.createStateSync(
      key,
      def,
      { ...options, db },
      ...args
    ) as unknown as PSQLState;

    return state;
  }

  async createState(key, def, options, ...args): Promise<PSQLState> {
    const { db } = this;
    const state = (await (super.createState(
      key,
      def,
      { ...options, db },
      ...args
    ) as unknown)) as PSQLState;
    const { scope, value } = state;
    console.log('CREATING STATE!!!!!', key, state.value, state.id);
    try {
      // const res = await db.any(`INSERT INTO states(id, state) VALUES($1, $2)`, [state.id, {key, scope, value}]);
      // console.log ("CREATING STATE!!!!!", res);
    } catch (e) {
      // console.log (e);
    }

    return state;
  }
}

export { PostgresStore, PSQLState };
