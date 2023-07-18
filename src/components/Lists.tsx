import {
    Scopes,
    authenticate,
    isClientContext,
    useState,
} from '@state-less/react-server';
import { v4 } from 'uuid';
import { ServerSideProps } from './ServerSideProps';
import { JWT_SECRET } from '../config';

type TodoObject = {
    id: string | null;
    title: string;
    completed: boolean;
};

export const Todo = ({ id, completed, title }: TodoObject) => {
    const [todo, setTodo] = useState<TodoObject>(
        {
            id,
            completed,
            title,
        },
        {
            key: `page${id}`,
            scope: Scopes.Client,
        }
    );

    const toggle = () => {
        setTodo({ ...todo, completed: !todo.completed });
    };

    return <ServerSideProps key={`${id}-todo`} {...todo} toggle={toggle} />;
};

export const List = (
    { id, title: initialTitle }: { key?: string; id: string; title: string },
    { key }
) => {
    const [todos, setTodos] = useState<TodoObject[]>([], {
        key: 'todos',
        scope: `${key}.${Scopes.Client}`,
    });

    const [labels, setLabels] = useState<TodoObject[]>([], {
        key: 'labels',
        scope: `${key}.${Scopes.Client}`,
    });

    const [title, setTitle] = useState(initialTitle, {
        key: 'title',
        scope: `${key}.${Scopes.Client}`,
    });
    const addEntry = (todo: TodoObject) => {
        const todoId = v4();
        const newTodo = { ...todo, id: todoId };

        if (!isValidTodo(newTodo)) {
            throw new Error('Invalid todo');
        }
        setTodos([...todos, newTodo]);

        return newTodo;
    };

    const removeEntry = (todoId: string) => {
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

    return (
        <ServerSideProps
            key={`${key}-props`}
            add={addEntry}
            remove={removeEntry}
            addLabel={addLabel}
            removeLabel={removeLabel}
            title={title}
            setTitle={setTitle}
            labels={labels}
            setLabels={setLabels}
            id={id}
        >
            {todos.map((todo) => (
                <Todo {...todo} />
            ))}
        </ServerSideProps>
    );
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

    const addEntry = (todo: TodoObject) => {
        const id = v4();
        const newList = { ...todo, id };

        setLists([...lists, newList]);
    };

    const removeEntry = (id: string) => {
        setLists(lists.filter((list) => list.id !== id));
    };

    return (
        <ServerSideProps
            key="my-lists-props"
            add={addEntry}
            remove={removeEntry}
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
