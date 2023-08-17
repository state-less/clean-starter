import { Store } from '@state-less/react-server';
import webpush from 'web-push';
import {
    differenceInMinutes,
    format,
    getDate,
    getDay,
    getHours,
    getMinutes,
    getMonth,
    getSeconds,
    getYear,
} from 'date-fns';
const itemTypeStateKeyMap = {
    Todo: 'todo',
    Counter: 'counter',
    Expense: 'expense',
};

export const isTodoCompleted = (todo) => {
    const comp =
        todo.completed &&
        (todo.reset === null || todo.lastModified + todo.reset > Date.now());
    return comp;
};

const checkTodo = (todo, client) => {
    const completed = isTodoCompleted(todo);
    const dueDate = todo.dueDate ? new Date(todo.dueDate) : new Date();
    const dueTime = todo.dueTime ? new Date(todo.dueTime) : null;

    if (!dueTime) return false;

    const sameDate =
        format(dueDate, 'dd.MM.yyyy') === format(new Date(), 'dd.MM.yyyy');

    const timeAtDueDate = new Date(
        getYear(dueDate),
        getMonth(dueDate),
        getDate(dueDate),
        getHours(dueTime),
        getMinutes(dueTime),
        getSeconds(dueTime)
    );
    const diff = differenceInMinutes(timeAtDueDate, new Date());
    const sameTime = diff > 0 && diff < 15;

    const lastNotifiedClient = todo.lastNotified?.[client];
    const lastNotified = differenceInMinutes(
        new Date(lastNotifiedClient || 0),
        new Date()
    );
    console.log('Todo', todo.title, timeAtDueDate, lastNotifiedClient);
    if (!completed && sameDate && sameTime && lastNotified < -15) {
        return true;
    }
};

export class NotificationEngine {
    _store: Store;
    _interval: number;
    _timeout: any;
    _listsKey: string;
    _webpushKey: string;
    _clients: Array<{ id: string; sub: any; user: any }>;
    _logger: any;

    constructor({ store, interval, listsKey, webpushKey, logger }) {
        this._store = store;
        this._interval = interval;
        this._listsKey = listsKey;
        this._webpushKey = webpushKey;
        this._logger = logger;
        this._clients = [];
        this.loadStore();
    }

    loadStore() {
        if (!this._webpushKey) return;

        this._store.on('dehydrate', () => {
            try {
                const state = this._store.getState(null, {
                    key: 'subscribed',
                    scope: `${this._webpushKey}`,
                });
                const subscribed = state.value || {};
                Object.entries(subscribed).forEach(
                    ([clientId, entry]: [string, { sub: any; user: any }]) => {
                        const { sub, user } = entry;
                        this.subscribe(clientId, user, sub);
                    }
                );
            } catch (e) {
                console.log(e);
            }
        });
    }

    subscribe(clientId, user, subscription) {
        this._clients.push({ id: clientId, sub: subscription, user });
    }

    unsubscribe(clientId, user) {
        this._clients = this._clients.filter((e) => e.id !== clientId);
    }

    run() {
        this._logger.info`Running Notification Engine`;
        for (const entry of this._clients) {
            const { sub, id: clientId, user } = entry;
            const state = this._store.getState(null, {
                key: 'state',
                scope: `${this._listsKey}.${user?.id || clientId}`,
            });
            const { lists, order } = state.value;
            this._logger.info`User has ${lists.length} lists.`;

            lists.forEach((list) => {
                const todos = this._store.getState(null, {
                    key: 'todos',
                    scope: `${`list-${list.id}`}.${user?.id || clientId}`,
                });
                console.log(
                    clientId,
                    'User has ',
                    todos.value.length,
                    ' lists'
                );

                todos.value.forEach((todo) => {
                    const stored = this._store.getState(null, {
                        key: itemTypeStateKeyMap[todo.type] || 'todo',
                        scope: `${todo.id}.${user?.id || clientId}`,
                    });
                    Object.assign(todo, stored.value);
                    console.log('Checking Todo', stored.value.title);
                    if (checkTodo(stored.value, clientId)) {
                        this.sendNotification(sub, {
                            title: stored.value.title,
                            body: `It's almost ${format(
                                new Date(stored.value.dueTime),
                                'hh:mm'
                            )}`,
                        });
                        stored.value.lastNotified = {
                            ...stored.value.lastModified,
                            [clientId]: new Date().getTime(),
                        };
                    }
                });
            });
        }
    }
    sendNotification(sub, body) {
        if (typeof body !== 'string') {
            body = JSON.stringify(body);
        }
        try {
            webpush.sendNotification(sub, body);
        } catch (e) {
            const client = this._clients.find(
                (e) => e.sub.endpoint === sub.endpoint
            );
            this.unsubscribe(client.id, client.user);
            this._logger.error`Error sending notification: ${e}`;
        }
    }
    start() {
        this._timeout = setInterval(() => this.run(), this._interval);
        this._logger.info`Started Interval`;
    }
}
