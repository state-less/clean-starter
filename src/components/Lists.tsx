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
import jwt from 'jsonwebtoken';
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
};

const DAY = 1000 * 60 * 60 * 24;
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
    }: TodoObject,
    { key, context }
) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const store = Dispatcher.getCurrent().getStore();
    const points = store.getState<number>(null, {
        key: `points`,
        scope: `${user?.id || Scopes.Client}`,
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

        if (reset < 0 || reset > 14) throw new Error('Invalid reset value');

        setTodo({
            ...todo,
            reset: 1000 * 60 * 60 * 24 * reset,
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
        />
    );
};

type ListSettings = {
    defaultValuePoints: number;
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
    }: {
        key?: string;
        id: string;
        title: string;
        todos: TodoObject[];
        archived: boolean;
        color: string;
        points: number;
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
    const points = store.getState<number>(initialPoints, {
        key: `points`,
        scope: `${user?.id || Scopes.Client}`,
    });

    const [todos, setTodos] = useState<TodoObject[]>(initialTodos, {
        key: 'todos',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

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
            defaultValuePoints: 1,
        },
        {
            key: 'settings',
            scope: `${key}.${user?.id || Scopes.Client}`,
        }
    );

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
    const [labels, setLabels] = useState<TodoObject[]>([], {
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
        const newTodo = { ...todo, id: todoId };

        if (!isValidTodo(newTodo)) {
            throw new Error('Invalid todo');
        }
        setTodos([...todos, newTodo]);
        setOrder([...todos, newTodo].map((list) => list.id));
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
        points.value += points.value + 1;
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
        >
            {todos.map((todo) => (
                <Todo
                    key={todo.id}
                    {...todo}
                    defaultValuePoints={settings?.defaultValuePoints}
                />
            ))}
        </ServerSideProps>
    );
};

const exportData = ({ key, user }) => {
    const clientId =
        Dispatcher.getCurrent()._renderOptions.context.headers['x-unique-id'];

    const store = Dispatcher.getCurrent().getStore();
    const data = {};
    const lists = store.getState(null, {
        key: 'lists',
        scope: `${key}.${user?.id || clientId}`,
    });
    const order = store.getState(null, {
        key: 'order',
        scope: `${key}.${user?.id || clientId}`,
    });
    lists.value.forEach((list) => {
        const todos = store.getState(null, {
            key: 'todos',
            scope: `${`list-${list.id}`}.${user?.id || clientId}`,
        });
        const order = store.getState(null, {
            key: 'order',
            scope: `${`list-${list.id}`}.${user?.id || clientId}`,
        });
        const color = store.getState(null, {
            key: 'color',
            scope: `${`list-${list.id}`}.${user?.id || clientId}`,
        });
        todos.value.forEach((todo) => {
            const stored = store.getState(null, {
                key: `todo`,
                scope: `${todo.id}.${user?.id || clientId}`,
            });
            Object.assign(todo, stored.value);
        });

        data[list.id] = {
            ...list,
            color: color.value,
            order: order.value,
            todos: todos.value,
        };
    });

    const points = store.getState(null, {
        key: 'points',
        scope: `${user?.id || clientId}`,
    });

    const signed = jwt.sign({ ...data, points }, JWT_SECRET);
    return { ...data, points: points.value, order: order.value, signed };
};

export const MyLists = (_: { key?: string }, { context, key }) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const store = Dispatcher.getCurrent().getStore();
    const points = store.getState<number>(null, {
        key: `points`,
        scope: `${user?.id || Scopes.Client}`,
    });

    const [lists, setLists] = useState([], {
        key: 'lists',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

    const [order, setOrder] = useState([], {
        key: 'order',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

    const addEntry = (todo: TodoObject) => {
        const id = v4();
        const newList = { ...todo, order: [], id };
        const newLists = [
            ...order.map((listId) => lists.find((list) => list.id === listId)),
            newList,
        ];
        setOrder([...order, id]);
        setLists(newLists);
    };

    const removeEntry = (id: string) => {
        setLists(lists.filter((list) => list.id !== id));
        setOrder(order.filter((listId) => listId !== id));
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
        const { signed, points: storedPoints, order, ...data } = raw;
        const lists = Object.values(data);

        if (!signed) {
            throw new Error('Unsigned data');
        }

        jwt.verify(signed, JWT_SECRET);

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

        console.log('List', order);

        setLists(lists);
        setOrder(order);
        points.value = storedPoints;
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
