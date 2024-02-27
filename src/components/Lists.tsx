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
import { Route } from './ExpressServer';
import { app } from '../instances';

const itemTypeStateKeyMap = {
    Todo: 'todo',
    Counter: 'counter',
    Expense: 'expense',
};

type TodoObject = {
    color?: string;
    key?: string;
    id?: string | null;
    title?: string;
    note?: string;
    completed?: boolean;
    archived?: number;
    lastModified?: number;
    lastNotified?: number;
    reset?: number;
    valuePoints?: number;
    negativePoints?: number;
    creditedValuePoints?: number;
    dueDate?: number | null;
    dueTime?: number | null;
    defaultValuePoints?: number;
    createdAt?: number;
    type?: string;
    changeType?: (id: string, type: string) => void;
    dependencies?: Dependency[];
};

type CounterObject = {
    key?: string;
    id: string | null;
    title: string;
    count: number;
    color?: string;
    archived: number;
    lastModified?: number;
    reset?: number;
    valuePoints?: number;
    negativePoints?: number;
    creditedValuePoints?: number;
    dueDate?: number | null;
    defaultValuePoints?: number;
    cost?: number;
    createdAt?: number;
    type: string;
    changeType?: (id: string, type: string) => void;
};

type ExpenseObject = {
    key?: string;
    id: string | null;
    title: string;
    value: number;
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
        lastModified,
        lastNotified,
        dueDate = null,
        dueTime = null,
        note,
        changeType,
        createdAt,
        color,
        dependencies: initialDependencies = [],
    }: TodoObject,
    { key, context }
) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const store = Dispatcher.getCurrent().getStore();
    const clientId = context?.headers?.['x-unique-id'] || 'server';

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
            note,
            dueDate,
            dueTime,
            type: 'Todo',
            lastModified,
            color,
            dependencies: initialDependencies,
        },
        {
            key: `todo`,
            scope: `${key}.${user?.id || Scopes.Client}`,
        }
    );
    const comp =
        todo.completed &&
        (todo.reset === null || todo.lastModified + todo.reset > Date.now());

    const setColor = (color: string) => {
        if (typeof color !== 'string') {
            throw new Error('Invalid color');
        }
        // if (!colors.includes(color)) {
        //     throw new Error('Invalid color');
        // }

        setTodo({
            ...todo,
            color,
        });
    };
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

        points.setValue(
            points.value + (comp ? -todo.creditedValuePoints : valuePoints)
        );

        return newTodo;
    };

    const archive = () => {
        if (todo.archived) return;
        setTodo({
            ...todo,
            archived: true,
        });
        points.setValue(points.value + 1);
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
    const setNote = (note) => {
        if (typeof note !== 'string' || note.length > 32000) {
            throw new Error('Invalid note');
        }
        setTodo({
            ...todo,
            note,
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

    const setTitle = (title) => {
        if (typeof title !== 'string') {
            throw new Error('Invalid title');
        }
        setTodo({
            ...todo,
            title,
        });
    };

    const setDueDate = (dueDate) => {
        if (isNaN(new Date(dueDate).getTime())) {
            throw new Error('Invalid due date');
        }
        setTodo({
            ...todo,
            dueDate,
        });
    };

    const setDueTime = (dueTime) => {
        if (isNaN(new Date(dueTime).getTime())) {
            throw new Error('Invalid due date');
        }

        setTodo({
            ...todo,
            dueTime,
        });
    };

    const addDependency = (dep: Dependency) => {
        if (!dep?.id || !dep?.title) {
            throw new Error('Invalid id');
        }
        if (todo.dependencies.some((a) => a.id === dep.id)) {
            return;
        }
        setTodo({ ...todo, dependencies: [...(todo.dependencies || []), dep] });
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
            setColor={setColor}
            setTitle={setTitle}
            setDueDate={setDueDate}
            setDueTime={setDueTime}
            setNote={setNote}
            type="Todo"
            createdAt={createdAt}
            lastModified={todo.lastModified}
            dependencies={(todo.dependencies || [])?.map((dep) => {
                const state = store.getState(null, {
                    key: 'todo',
                    scope: `${dep.id}.${user?.id || clientId}`,
                });
                return state.value;
            })}
            addDependency={addDependency}
        >
            <Route
                todo={todo}
                key="test"
                app={app}
                path={`/todos/${id}/toggle`}
                get={(req, res) => {
                    const todo = toggle();
                    res.send(todo);
                }}
                authenticate={(req, res, next) => {
                    let httpUser = null;
                    try {
                        // Authenticate the http request
                        httpUser = authenticate(req.headers, JWT_SECRET);
                    } catch (e) {}
                    // Make sure the client and user is the same as the one who rendered the component
                    if (
                        req.headers['x-unique-id'] !== clientId ||
                        user?.id !== httpUser?.id
                    ) {
                        throw new Error('Unauthorized');
                    }
                    next();
                }}
            />
        </ServerSideProps>
    );
};

export const Counter = (
    {
        id,
        count = 0,
        title,
        createdAt,
        archived,
        reset = null,
        defaultValuePoints = 0,
        valuePoints = defaultValuePoints,
        creditedValuePoints = 0,
        negativePoints = 0,
        cost = 0,
        dueDate = null,
        color,
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
    const clientId = context.headers?.['x-unique-id'] || 'server';

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
            createdAt,
            archived,
            reset,
            valuePoints,
            creditedValuePoints,
            negativePoints,
            cost,
            dueDate,
            color,
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

    const setArchived = (timestamp = Date.now()) => {
        const date = new Date(timestamp).getTime();
        if (date > Date.now()) {
            throw new Error('Invalid date');
        }

        setCounter({
            ...counter,
            archived: date,
        });
    };
    const setCreated = (timestamp = Date.now()) => {
        const date = new Date(timestamp).getTime();
        if (date > Date.now()) {
            throw new Error('Invalid date');
        }

        setCounter({
            ...counter,
            createdAt: date,
        });
    };
    const setTitle = (title) => {
        if (typeof title !== 'string') {
            throw new Error('Invalid title');
        }
        setCounter({
            ...counter,
            title,
            lastModified: Date.now(),
        });
    };

    const setCost = (cost) => {
        if (typeof cost !== 'number') {
            throw new Error('Expected a number.');
        }
        setCounter({
            ...counter,
            cost,
            lastModified: Date.now(),
        });
    };

    const setColor = (color: string) => {
        if (typeof color !== 'string') {
            throw new Error('Invalid color');
        }
        setCounter({
            ...counter,
            color,
            lastModified: Date.now(),
        });
    };
    return (
        <ServerSideProps
            key={clientKey(`${id}-counter`, context)}
            {...counter}
            archive={archive}
            increase={increase}
            decrease={decrease}
            setTitle={setTitle}
            setCost={setCost}
            setColor={setColor}
            setArchived={setArchived}
            setCreated={setCreated}
            changeType={(type) => changeType(id, type)}
            type="Counter"
        />
    );
};

export const Expense = (
    {
        id,
        value = 0,
        title,
        archived,
        reset = null,
        defaultValuePoints = 0,
        valuePoints = defaultValuePoints,
        creditedValuePoints = 0,
        negativePoints = 0,
        dueDate = null,
        changeType,
    }: ExpenseObject,
    { key, context }
) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const [expense, setExpense] = useState<ExpenseObject>(
        {
            id,
            value,
            title,
            archived,
            reset,
            valuePoints,
            creditedValuePoints,
            negativePoints,
            dueDate,
            type: 'Expense',
        },
        {
            key: `expense`,
            scope: `${key}.${user?.id || Scopes.Client}`,
        }
    );

    const archive = () => {
        setExpense({
            ...expense,
            archived: Date.now(),
        });
    };
    const setValue = (val: number) => {
        if (typeof +val !== 'number') {
            throw new Error('Invalid value');
        }
        setExpense({
            ...expense,
            value: val,
            lastModified: Date.now(),
        });
    };
    const setTitle = (title) => {
        if (typeof title !== 'string') {
            throw new Error('Invalid title');
        }
        setExpense({
            ...expense,
            title,
            lastModified: Date.now(),
        });
    };
    return (
        <ServerSideProps
            key={clientKey(`${id}-expense`, context)}
            {...expense}
            archive={archive}
            changeType={(type) => changeType(id, type)}
            setValue={setValue}
            setTitle={setTitle}
            type="Expense"
        />
    );
};
type ListSettings = {
    defaultValuePoints?: number;
    pinned?: boolean;
    defaultType?: string;
    startOfDay?: string;
    endOfDay?: string;
};

type Dependency = {
    id: string;
    title: string;
    list: string;
};
export const List = (
    {
        id,
        title: initialTitle,
        todos: initialTodos = [],
        order: initialOrder, // = initialTodos.map((_, i) => i),
        archived: initialArchived = false,
        color: initialColor = '',
        points: initialPoints = 0,
        labels: initialLabels = [],
        settings: initialSettings,
        createdAt,
    }: {
        key?: string;
        id: string;
        title: string;
        todos: TodoObject[];
        archived?: boolean;
        color?: string;
        pinned?: boolean;
        createdAt?: number;
        points?: number;
        labels?: string[];
        settings?: ListSettings;
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
    const clientId = context?.headers?.['x-unique-id'] || 'server';

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
            defaultType: initialSettings?.defaultType || 'Todo',
            startOfDay: initialSettings?.startOfDay || 6,
            endOfDay: initialSettings?.endOfDay || 22,
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

    const addEntry = (todo: TodoObject | CounterObject) => {
        const todoId = v4();
        const newItem = {
            ...todo,
            id: todoId,
            createdAt: Date.now(),
            type: todo.type || settings?.defaultType || 'Todo',
        };

        const isValid = validationFunctions[newItem.type];
        if (!isValid(newItem)) {
            throw new Error('Invalid item');
        }
        setTodos((todos) => [...todos, newItem]);
        setOrder((order) => [...order, todoId]);
        points.setValue(points.value + 1);
        return newItem;
    };

    const removeEntry = (todoId: string) => {
        const store = Dispatcher.getCurrent().getStore();
        const todo = store.getState<TodoObject>(null, {
            key: `todo`,
            scope: `${todoId}.${user?.id || Scopes.Client}`,
        });
        setOrder((order) => order.filter((id) => id !== todoId));
        setTodos((todos) => todos.filter((todo) => todo.id !== todoId));
        points.setValue(
            points.value -
                1 -
                (todo?.value?.archived ? 1 : 0) -
                (todo?.value?.valuePoints || 0)
        );
        return todo.value;
    };

    const addLabel = (label: TodoObject) => {
        const labelId = v4();
        const newLabel = { ...label, id: labelId };

        if (!isValidLabel(newLabel)) {
            throw new Error('Invalid todo');
        }

        setLabels([...labels, newLabel]);
        points.setValue(points.value + 1);
        return newLabel;
    };

    const removeLabel = (labelId: string) => {
        setLabels(labels.filter((label) => label.id !== labelId));
        points.setValue(points.value - 1);
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

    const recreate = () => {
        for (const todo of todos.filter((todo) => {
            const state = store.getState(null, {
                key: 'counter',
                scope: `${todo.id}.${user?.id || clientId}`,
            });

            return !state.value.archived && state.value.type === 'Counter';
        })) {
            const state = store.getState(null, {
                key: 'counter',
                scope: `${todo.id}.${user?.id || clientId}`,
            });
            state.setValue({
                ...state.value,
                archived: +new Date(),
            });
            addEntry({
                ...todo,
                count: 0,
            } as CounterObject);
        }
    };

    const changeType = (id: string, type: string) => {
        if (!['Todo', 'Counter', 'Expense'].includes(type)) {
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
        } else if (type === 'Expense') {
            const newTodo = {
                ...todo,
                value: (todo as ExpenseObject).value || 0,
                type: 'Expense',
            };
            if (!isValidExpense(newTodo)) {
                throw new Error('Invalid counter');
            }
            const newTodos = [...todos];
            newTodos.splice(
                todos.findIndex((expense) => expense.id === id),
                1,
                newTodo
            );
            setTodos(newTodos);
        }
    };

    const filtered = todos || [];
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
            recreate={recreate}
            createdAt={createdAt}
        >
            {filtered.map((item) => {
                switch (item.type) {
                    case 'Todo': {
                        return (
                            <Todo
                                key={item.id}
                                {...(item as TodoObject)}
                                defaultValuePoints={
                                    settings?.defaultValuePoints
                                }
                                changeType={changeType}
                            />
                        );
                    }
                    case 'Counter': {
                        return (
                            <Counter
                                key={item.id}
                                {...(item as CounterObject)}
                                changeType={changeType}
                            />
                        );
                    }
                    case 'Expense': {
                        return (
                            <Expense
                                key={item.id}
                                {...(item as CounterObject)}
                                changeType={changeType}
                            />
                        );
                    }
                    default: {
                        return (
                            <Todo
                                key={item.id}
                                {...(item as TodoObject)}
                                defaultValuePoints={
                                    settings?.defaultValuePoints
                                }
                                changeType={changeType}
                            />
                        );
                    }
                }
            })}
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
        const title = store.getState(null, {
            key: 'title',
            scope: `${`list-${list.id}`}.${user?.id || clientId}`,
        });
        const settings = store.getState(null, {
            key: 'settings',
            scope: `${`list-${list.id}`}.${user?.id || clientId}`,
        });
        todos.value.forEach((todo) => {
            const stored = store.getState(null, {
                key: itemTypeStateKeyMap[todo.type] || 'todo',
                scope: `${todo.id}.${user?.id || clientId}`,
            });
            Object.assign(todo, stored.value);
        });

        data[list.id] = {
            ...list,
            title: title.value,
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
        if (list.id && lists.some((existing) => list.id === existing.id)) {
            throw new Error('Cannot create a duplicate list');
        }
        const newList = {
            id,
            order: [],
            ...list,
            settings: {
                defaultValuePoints: DEFAULT_VALUE_POINTS,
                defaultType: 'Todo',
                pinned: false,
                ...list.settings,
            },
            createdAt: Date.now(),
        };
        const newLists = [newList, ...state.lists];
        setState({ order: [newList.id, ...state.order], lists: newLists });
    };

    const removeEntry = (id: string) => {
        const removed = state.lists.find((list) => list.id === id);
        setState({
            lists: state.lists.filter((list) => list.id !== id),
            order: state.order.filter((listId) => listId !== id),
        });
        return removed;
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
                todo.createdAt = todo.createdAt || Date.now();
                list.order[list.order.indexOf(oldId)] = newId;
            });
        });

        setState({ lists, order });
        points.setValue(storedPoints);
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
    return todo.id && 'completed' in todo;
};

const isValidCounter = (counter): counter is CounterObject => {
    return counter.id && 'count' in counter && counter.type === 'Counter';
};

const isValidExpense = (expense): expense is ExpenseObject => {
    return expense.id && 'value' in expense;
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
    settings: ListSettings;
};

const isValidList = (list: ListObject) => {
    return (
        list.id &&
        list.todos &&
        list.order &&
        list.order.every((id) => typeof id === 'string') &&
        list.todos.every((todo) => {
            return isValidItem(todo);
        })
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

    return (
        <ServerSideProps
            key={clientKey('my-lists-meta-props', context)}
            points={points}
            lastCompleted={lastCompleted}
        />
    );
};

const validationFunctions = {
    Todo: isValidTodo,
    Counter: isValidCounter,
    Expense: isValidExpense,
};

const isValidItem = (item) => {
    const isValid = validationFunctions[item.type];
    return isValid && isValid(item);
};
