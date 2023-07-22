import {
    Dispatcher,
    Scopes,
    authenticate,
    clientKey,
    isClientContext,
    useClientEffect,
    useEffect,
    useState,
} from '@state-less/react-server';
import { v4 } from 'uuid';
import { ServerSideProps } from './ServerSideProps';
import { JWT_SECRET } from '../config';
import { store } from '../instances';

type TodoObject = {
    key?: string;
    id: string | null;
    title: string;
    completed: boolean;
    archived: boolean;
    lastModified?: number;
    reset?: number;
};

export const Todo = (
    { id, completed, title, archived, reset = null }: TodoObject,
    { key, context }
) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const [todo, setTodo] = useState<TodoObject>(
        {
            id,
            completed,
            title,
            archived,
            reset,
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
        setTodo({
            ...todo,
            completed: !comp,
            lastModified: Date.now(),
        });
    };

    const archive = () => {
        setTodo({
            ...todo,
            archived: true,
        });
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
    return (
        <ServerSideProps
            key={clientKey(`${id}-todo`, context)}
            {...todo}
            toggle={toggle}
            archive={archive}
            completed={comp}
            setReset={setReset}
        />
    );
};

export const List = (
    {
        id,
        title: initialTitle,
        todos: initialTodos = [],
        archived: initialArchived = false,
    }: {
        key?: string;
        id: string;
        title: string;
        todos: TodoObject[];
        archived: boolean;
    },
    { key, context }
) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

    const [todos, setTodos] = useState<TodoObject[]>(initialTodos, {
        key: 'todos',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

    const [color, _setColor] = useState('white', {
        key: 'color',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

    const [archived, setArchived] = useState(initialArchived, {
        key: 'archived',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

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

    const [order, setOrder] = useState(
        initialTodos.map((todo) => todo.id),
        {
            key: 'order',
            scope: `${key}.${user?.id || Scopes.Client}`,
        }
    );

    const addEntry = (todo: TodoObject) => {
        const todoId = v4();
        const newTodo = { ...todo, id: todoId };

        if (!isValidTodo(newTodo)) {
            throw new Error('Invalid todo');
        }
        setTodos([...todos, newTodo]);
        setOrder([...todos, newTodo].map((list) => list.id));

        return newTodo;
    };

    const removeEntry = (todoId: string) => {
        setOrder(order.filter((id) => id !== todoId));
        setTodos(todos.filter((todo) => todo.id !== todoId));
    };

    const addLabel = (label: TodoObject) => {
        const labelId = v4();
        const newLabel = { ...label, id: labelId };

        if (!isValidLabel(newLabel)) {
            throw new Error('Invalid todo');
        }

        setLabels([...labels, newLabel]);

        return newLabel;
    };

    const removeLabel = (labelId: string) => {
        setLabels(labels.filter((label) => label.id !== labelId));
    };

    const archive = () => {
        setArchived(true);
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
        >
            {todos.map((todo) => (
                <Todo key={todo.id} {...todo} />
            ))}
        </ServerSideProps>
    );
};

const exportData = ({ key, user }) => {
    const store = Dispatcher.getCurrent().getStore();
    const data = {};
    const lists = store.getState(null, {
        key: 'lists',
        scope: `${key}.${user?.id || Scopes.Client}`,
    });

    lists.value.forEach((list) => {
        const todos = store.getState(null, {
            key: 'todos',
            scope: `${`list-${list.id}`}.${user?.id || Scopes.Client}`,
        });

        todos.value.forEach((todo) => {
            const stored = store.getState(null, {
                key: `todo`,
                scope: `${todo.id}.${user?.id || Scopes.Client}`,
            });
            Object.assign(todo, stored.value);
        });

        data[list.id] = { ...list, todos: todos.value };
    });

    return data;
};

export const MyLists = (_: { key?: string }, { context, key }) => {
    let user = null;
    if (isClientContext(context))
        try {
            user = authenticate(context.headers, JWT_SECRET);
        } catch (e) {}

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
        const newList = { ...todo, id };
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

    const importUserData = (data: Record<string, ListObject>) => {
        const lists = Object.values(data);

        if (!lists.length || !lists.every(isValidList)) {
            throw new Error('Invalid list');
        }

        lists.forEach((list) => {
            list.id = v4();
            list.todos.forEach((todo) => {
                todo.id = v4();
            });
        });
        const order = lists.map((list) => list.id);

        setLists(lists);
        setOrder(order);
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
};

const isValidList = (list: ListObject) => {
    return (
        list.id &&
        list.title &&
        list.todos &&
        list.todos.every((todo) => isValidTodo)
    );
};
