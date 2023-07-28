import {
    Dispatcher,
    Scopes,
    authenticate,
    clientKey,
    isClientContext,
    useState,
} from '@state-less/react-server';
import { v4 } from 'uuid';
import { ServerSideProps } from './ServerSideProps';
import { JWT_SECRET } from '../config';
import jwt, { decode } from 'jsonwebtoken';
type TodoObject = {
    key?: string;
    id: string | null;
    title: string;
    completed: boolean;
    archived: boolean;
    lastModified?: number;
    reset?: number;
    valuePoints?: number;
    negativePoints?: number;
    creditedValuePoints?: number;
    dueDate?: number | null;
    defaultValuePoints?: number;
    createdAt?: number;
    type: string;
    changeType?: (id: string, type: string) => void;
};

type CounterObject = {
    key?: string;
    id: string | null;
    title: string;
    count: number;
    archived: number;
    lastModified?: number;
    reset?: number;
    valuePoints?: number;
    negativePoints?: number;
    creditedValuePoints?: number;
    dueDate?: number | null;
    defaultValuePoints?: number;
    createdAt?: number;
    type: string;
    changeType?: (id: string, type: string) => void;
};

const DAY = 1000 * 60 * 60 * 24;
const DEFAULT_VALUE_POINTS = 0;

/**
 * Limits for how many times a todo can be completed within a given interval //[interval, times]
 */
const limits = {
    '100': [DAY * 90, 1],
    '65': [DAY * 30, 1],
    '44': [DAY * 14, 2],
    '21': [DAY * 7, 2],
    '13': [DAY * 7, 3],
    '8': [DAY * 7, 4],
    '5': [DAY * 7, 7],
    '3': [DAY, 1],
    '2': [DAY, 10],
    '1': [DAY, 20],
    '0': [DAY, 1000],
};

/**
 * Checks if a todo can be completed based on the limits
 */
const checkLimits = (items, todo) => {
    const [interval, times] = limits[todo.valuePoints] || [0, 1];
    const within = (items || []).filter(
        (i) => i.lastModified + interval > Date.now()
    );
    const reachedLimit = within.length >= times;

    return !reachedLimit;
};

export const Todo = (
    {
        id,
        completed,
        title,
        archived,
        reset = null,
        defaultValuePoints = 0,
        valuePoints = defaultValuePoints,
        creditedValuePoints = 0,
        negativePoints = 0,
        dueDate = null,
        changeType,
        createdAt,
    }: TodoObject,
    { key, context }
) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const store = Dispatcher.getCurrent().getStore();
    const clientId = context.headers['x-unique-id'];

    // We need to obtain the client id manually since we are not using useState
    // We are not using use state because of a bug that prevents multiple state updates in the same function
    const points = store.getState<number>(null, {
        key: `points`,
        scope: `${user?.id || clientId}`,
    });

    const [todo, setTodo] = useState<TodoObject>(
        {
            id,
            completed,
            title,
            archived,
            reset,
            valuePoints,
            creditedValuePoints,
            negativePoints,
            dueDate,
            type: 'Todo',
        },
        {
            key: `todo`,
            scope: `${key}.${user?.id || Scopes.Client}`,
        }
    );
    const comp =
        todo.completed &&
        (todo.reset === null || todo.lastModified + todo.reset > Date.now());

    const toggle = () => {
        const store = Dispatcher.getCurrent().getStore();
        const lastCompleted = store.getState(
            {},
            {
                key: `lastCompleted`,
                scope: `${user?.id || Scopes.Client}`,
            }
        );
        const { valuePoints } = todo;
        if (!comp && !checkLimits(lastCompleted.value[valuePoints], todo)) {
            throw new Error('Can be completed only n times within interval');
        }

        const newTodo = {
            ...todo,
            completed: !comp,
            lastModified: Date.now(),
            creditedValuePoints: comp ? 0 : valuePoints,
        };
        setTodo(newTodo);

        const newItems = !comp
            ? [...(lastCompleted.value[valuePoints] || []), newTodo]
            : (lastCompleted.value[valuePoints] || []).filter(
                  (i) => i.id !== todo.id
              );
        const filtered = newItems.filter((item) => {
            return (
                item.lastModified + (limits[valuePoints]?.[0] || 0) > Date.now()
            );
        });
        lastCompleted.value = {
            ...(lastCompleted.value || {}),
            [valuePoints]: filtered,
        };

        points.value += comp ? -todo.creditedValuePoints : valuePoints;
    };

    const archive = () => {
        if (todo.archived) return;
        setTodo({
            ...todo,
            archived: true,
        });
        points.value += 1;
    };

    const setReset = (reset) => {
        if (
            reset === 0 ||
            reset === null ||
            reset === undefined ||
            reset === '' ||
            reset === '-'
        ) {
            setTodo({
                ...todo,
                reset: null,
            });
            return;
        }

        if (reset < 0 || reset > 14 * 24)
            throw new Error('Invalid reset value');

        setTodo({
            ...todo,
            reset: 1000 * 60 * 60 * reset,
        });
    };

    const setValuePoints = (valuePoints) => {
        if (
            (typeof valuePoints !== 'number' && valuePoints < 0) ||
            valuePoints > 100
        ) {
            throw new Error('Invalid value points');
        }
        setTodo({
            ...todo,
            valuePoints,
            negativePoints: -valuePoints,
        });
    };
    return (
        <ServerSideProps
            key={clientKey(`${id}-todo`, context)}
            {...todo}
            toggle={toggle}
            archive={archive}
            completed={comp}
            setReset={setReset}
            setValuePoints={setValuePoints}
            changeType={(type) => changeType(id, type)}
            type="Todo"
            createdAt={createdAt}
        />
    );
};

export const Counter = (
    {
        id,
        count = 0,
        title,
        archived,
        reset = null,
        defaultValuePoints = 0,
        valuePoints = defaultValuePoints,
        creditedValuePoints = 0,
        negativePoints = 0,
        dueDate = null,
        changeType,
    }: CounterObject,
    { key, context }
) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const store = Dispatcher.getCurrent().getStore();
    const clientId = context.headers['x-unique-id'];

    // We need to obtain the client id manually since we are not using useState
    // We are not using use state because of a bug that prevents multiple state updates in the same function
    const points = store.getState<number>(null, {
        key: `points`,
        scope: `${user?.id || clientId}`,
    });

    const [counter, setCounter] = useState<CounterObject>(
        {
            id,
            count,
            title,
            archived,
            reset,
            valuePoints,
            creditedValuePoints,
            negativePoints,
            dueDate,
            type: 'Counter',
        },
        {
            key: `counter`,
            scope: `${key}.${user?.id || Scopes.Client}`,
        }
    );

    const increase = () => {
        if (counter.archived) {
            throw new Error('Cannot increase archived counter');
        }
        const newTodo = {
            ...counter,
            count: counter.count + 1,
            lastModified: Date.now(),
        };
        setCounter(newTodo);
    };

    const decrease = () => {
        if (counter.archived) {
            throw new Error('Cannot decrease archived counter');
        }
        const newTodo = {
            ...counter,
            count: counter.count - 1,
            lastModified: Date.now(),
        };
        setCounter(newTodo);
    };

    const archive = () => {
        setCounter({
            ...counter,
            archived: Date.now(),
        });
    };

    return (
        <ServerSideProps
            key={clientKey(`${id}-counter`, context)}
            {...counter}
            archive={archive}
            increase={increase}
            decrease={decrease}
            changeType={(type) => changeType(id, type)}
            type="Counter"
        />
    );
};
type ListSettings = {
    defaultValuePoints: number;
    pinned: boolean;
};
export const List = (
    {
        id,
        title: initialTitle,
        todos: initialTodos = [],
        order: initialOrder, // = initialTodos.map((_, i) => i),
        archived: initialArchived = false,
        color: initialColor = 'white',
        points: initialPoints = 0,
        labels: initialLabels = [],
        settings: initialSettings,
        createdAt,
    }: {
        key?: string;
        id: string;
        title: string;
        todos: TodoObject[];
        archived: boolean;
        color: string;
        pinned: boolean;
        createdAt: number;
        points: number;
        labels: string[];
        settings: ListSettings;
        order: string[];
    },
    { key, context }
) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const store = Dispatcher.getCurrent().getStore();
    const clientId = context.headers['x-unique-id'];

    const points = store.getState<number>(initialPoints, {
        key: `points`,
        scope: `${user?.id || clientId}`,
    });

    const [todos, setTodos] = useState<Array<TodoObject | CounterObject>>(
        initialTodos,
        {
            key: 'todos',
            scope: `${key}.${user?.id || Scopes.Client}`,
        }
    );

    const [color, _setColor] = useState(initialColor, {
        key: 'color',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

    const [archived, setArchived] = useState(initialArchived, {
        key: 'archived',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

    const [settings, setSettings] = useState(
        {
            defaultValuePoints: initialSettings?.defaultValuePoints || 0,
            pinned: initialSettings?.pinned || false,
        },
        {
            key: 'settings',
            scope: `${key}.${user?.id || Scopes.Client}`,
        }
    );

    const togglePinned = () => {
        setSettings({
            ...settings,
            pinned: !settings.pinned,
        });
    };
    const setColor = (color: string) => {
        const colors = [
            'white',
            'darkred',
            'blue',
            'green',
            'yellow',
            'orange',
            'purple',
        ];

        if (typeof color !== 'string') {
            throw new Error('Invalid color');
        }
        // if (!colors.includes(color)) {
        //     throw new Error('Invalid color');
        // }

        _setColor(color);
    };
    const [labels, setLabels] = useState<TodoObject[]>(initialLabels, {
        key: 'labels',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

    const [title, setTitle] = useState(initialTitle, {
        key: 'title',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

    const [order, setOrder] = useState(initialOrder, {
        key: 'order',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

    const addEntry = (todo: TodoObject) => {
        const todoId = v4();
        const newTodo = {
            ...todo,
            id: todoId,
            createdAt: Date.now(),
            type: todo.type || 'Todo',
        };

        if (!isValidTodo(newTodo)) {
            throw new Error('Invalid todo');
        }
        setTodos([...todos, newTodo]);
        setOrder([todoId, ...order]);
        points.value += 1;
        return newTodo;
    };

    const removeEntry = (todoId: string) => {
        const store = Dispatcher.getCurrent().getStore();
        const todo = store.getState<TodoObject>(null, {
            key: `todo-${todoId}`,
            scope: `${todoId}.${user?.id || Scopes.Client}`,
        });
        setOrder(order.filter((id) => id !== todoId));
        setTodos(todos.filter((todo) => todo.id !== todoId));
        points.value =
            points.value -
            1 -
            (todo?.value?.archived ? 1 : 0) -
            (todo?.value?.valuePoints || 0);
    };

    const addLabel = (label: TodoObject) => {
        const labelId = v4();
        const newLabel = { ...label, id: labelId };

        if (!isValidLabel(newLabel)) {
            throw new Error('Invalid todo');
        }

        setLabels([...labels, newLabel]);
        points.value += 1;
        return newLabel;
    };

    const removeLabel = (labelId: string) => {
        setLabels(labels.filter((label) => label.id !== labelId));
        points.value = points.value - 1;
    };

    const archive = () => {
        setArchived(true);
    };

    const updateSettings = (settings) => {
        if (!isValidSettings(settings)) {
            throw new Error('Invalid settings');
        }
        setSettings(settings);
    };

    const changeType = (id: string, type: string) => {
        if (!['Todo', 'Counter'].includes(type)) {
            throw new Error('Invalid type');
        }

        const todo = todos.find((todo) => todo.id === id);
        if (!todo) {
            throw new Error('Invalid todo');
        }
        if (todo.type === type) {
            return;
        }
        if (type === 'Todo') {
            const newTodo = { ...todo, completed: false, type: 'Todo' };
            if (!isValidTodo(newTodo)) {
                throw new Error('Invalid todo');
            }
            const newTodos = [...todos];
            newTodos.splice(
                todos.findIndex((todo) => todo.id === id),
                1,
                newTodo
            );
            setTodos(newTodos);
        } else if (type === 'Counter') {
            const newCounter = {
                ...todo,
                count: (todo as CounterObject).count || 0,
                type: 'Counter',
            };
            if (!isValidCounter(newCounter)) {
                throw new Error('Invalid counter');
            }
            const newTodos = [...todos];
            newTodos.splice(
                todos.findIndex((todo) => todo.id === id),
                1,
                newCounter
            );
            setTodos(newTodos);
        }
    };
    const filtered = todos.filter(
        (todo) =>
            !(
                todo.createdAt < Date.now() - DAY * 90 &&
                'completed' in todo &&
                todo.completed
            )
    );
    return (
        <ServerSideProps
            key={clientKey(`${key}-props`, context)}
            add={addEntry}
            remove={removeEntry}
            addLabel={addLabel}
            removeLabel={removeLabel}
            title={title}
            setTitle={setTitle}
            labels={labels}
            setLabels={setLabels}
            id={id}
            order={order}
            setOrder={setOrder}
            color={color}
            setColor={setColor}
            archived={archived}
            archive={archive}
            settings={settings}
            updateSettings={updateSettings}
            togglePinned={togglePinned}
            createdAt={createdAt}
        >
            {filtered.map((item) =>
                item.type !== 'Counter' ? (
                    <Todo
                        key={item.id}
                        {...(item as TodoObject)}
                        defaultValuePoints={settings?.defaultValuePoints}
                        changeType={changeType}
                    />
                ) : (
                    <Counter
                        key={item.id}
                        {...(item as CounterObject)}
                        changeType={changeType}
                    />
                )
            )}
        </ServerSideProps>
    );
};

const exportData = ({ key, user }) => {
    const clientId =
        Dispatcher.getCurrent()._renderOptions.context.headers['x-unique-id'];

    const store = Dispatcher.getCurrent().getStore();
    const data = {};
    const state = store.getState(null, {
        key: 'state',
        scope: `${key}.${user?.id || clientId}`,
    });
    const { lists, order } = state.value;
    console.log('Lists', lists);
    lists.forEach((list) => {
        const todos = store.getState(null, {
            key: 'todos',
            scope: `${`list-${list.id}`}.${user?.id || clientId}`,
        });
        const order = store.getState(null, {
            key: 'order',
            scope: `${`list-${list.id}`}.${user?.id || clientId}`,
        });
        const labels = store.getState(null, {
            key: 'labels',
            scope: `${`list-${list.id}`}.${user?.id || clientId}`,
        });
        const color = store.getState(null, {
            key: 'color',
            scope: `${`list-${list.id}`}.${user?.id || clientId}`,
        });
        const settings = store.getState(null, {
            key: 'settings',
            scope: `${`list-${list.id}`}.${user?.id || clientId}`,
        });
        todos.value.forEach((todo) => {
            const stored = store.getState(null, {
                key: todo.type !== 'Counter' ? `todo` : 'counter',
                scope: `${todo.id}.${user?.id || clientId}`,
            });
            Object.assign(todo, stored.value);
        });

        data[list.id] = {
            ...list,
            color: color.value,
            order: order.value,
            todos: todos.value,
            settings: settings.value,
            labels: labels.value,
        };
    });

    const points = store.getState(null, {
        key: 'points',
        scope: `${user?.id || clientId}`,
    });

    const signed = jwt.sign(
        { ...data, points: points.value, order },
        JWT_SECRET
    );
    return { ...data, points: points.value, order, signed };
};

export const MyLists = (_: { key?: string }, { context, key }) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const store = Dispatcher.getCurrent().getStore();
    const clientId = context.headers?.['x-unique-id'] || 'server';

    const points = store.getState(null, {
        key: 'points',
        scope: `${user?.id || clientId}`,
    });

    const [state, setState] = useState(
        {
            lists: [],
            order: [],
        },
        {
            key: 'state',
            scope: `${key}.${user?.id || Scopes.Client}`,
        }
    );
    const { lists, order } = state;
    const addEntry = (list: ListObject) => {
        const id = v4();
        const newList = {
            ...list,
            order: [],
            id,
            settings: {
                defaultValuePoints: DEFAULT_VALUE_POINTS,
                pinned: false,
            },
            createdAt: Date.now(),
        };
        const newLists = [newList, ...state.lists];
        setState({ order: [id, ...state.order], lists: newLists });
    };

    const removeEntry = (id: string) => {
        setState({
            lists: state.lists.filter((list) => list.id !== id),
            order: state.order.filter((listId) => listId !== id),
        });
    };

    const exportUserData = () => {
        return exportData({ key, user });
    };

    const importUserData = (
        raw: { signed: string; points: number; order: string[] } & Record<
            string,
            ListObject
        >
    ) => {
        const { signed } = raw;
        if (!signed) {
            throw new Error('Unsigned data');
        }
        const {
            order,
            points: storedPoints,
            iat,
            ...data
        } = jwt.verify(signed, JWT_SECRET) as any;

        const lists = Object.values(data);

        if (!lists.length || !lists.every(isValidList)) {
            throw new Error('Invalid data');
        }

        if (!order?.every((id) => typeof id === 'string')) {
            throw new Error('Invalid order');
        }

        lists.forEach((list) => {
            const newId = v4();
            const oldId = list.id;

            list.id = newId;
            order[order.indexOf(oldId)] = newId;
            list.todos.forEach((todo) => {
                const oldId = todo.id;
                const newId = v4();
                todo.id = newId;
                list.order[list.order.indexOf(oldId)] = newId;
            });
        });

        setState({ lists, order });
        points.value = storedPoints;
    };
    const setOrder = (order) => {
        if (!order.every((id) => typeof id === 'string')) {
            throw new Error('Invalid order');
        }
        setState({ order, lists: state.lists });
    };
    return (
        <ServerSideProps
            key={clientKey('my-lists-props', context)}
            add={addEntry}
            remove={removeEntry}
            order={order}
            setOrder={setOrder}
            exportUserData={exportUserData}
            importUserData={importUserData}
        >
            {lists.map((list) => (
                <List key={`list-${list.id}`} {...list} />
            ))}
        </ServerSideProps>
    );
};
const isValidTodo = (todo): todo is TodoObject => {
    return todo.id && todo.title && 'completed' in todo;
};

const isValidCounter = (counter): counter is CounterObject => {
    return counter.id && 'count' in counter && counter.type === 'Counter';
};
type LabelObjext = {
    id: string;
    title: string;
};

const isValidLabel = (label): label is LabelObjext => {
    return label.id && label.title && Object.keys(label).length === 2;
};

type ListObject = {
    id: string;
    title: string;
    todos: TodoObject[];
    order: string[];
};

const isValidList = (list: ListObject) => {
    return (
        list.id &&
        list.title &&
        list.todos &&
        list.order &&
        list.order.every((id) => typeof id === 'string') &&
        list.todos.every((todo) => isValidTodo(todo))
    );
};

const isValidSettings = (settings: ListSettings): settings is ListSettings => {
    return 'defaultValuePoints' in settings;
};

export const MyListsMeta = (props, { key, context }) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const [points, setPoints] = useState(0, {
        key: `points`,
        scope: `${user?.id || Scopes.Client}`,
    });

    const [lastCompleted] = useState(
        {},
        {
            key: `lastCompleted`,
            scope: `${user?.id || Scopes.Client}`,
        }
    );

    return <ServerSideProps points={points} lastCompleted={lastCompleted} />;
};
