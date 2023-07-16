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

export const List = (_, { key }) => {
    const [todos, setTodos] = useState<TodoObject[]>([], {
        key: 'todos',
        scope: `${key}.${Scopes.Client}`,
    });
    const [title, setTitle] = useState('My List', {
        key: 'title',
        scope: `${key}.${Scopes.Client}`,
    });
    const addEntry = (todo: TodoObject) => {
        const id = v4();
        const newTodo = { ...todo, id };

        if (!isValidTodo(newTodo)) {
            throw new Error('Invalid todo');
        }
        setTodos([...todos, newTodo]);

        return newTodo;
    };

    const removeEntry = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };
    return (
        <ServerSideProps
            key={`${key}-props`}
            add={addEntry}
            remove={removeEntry}
            title={title}
            setTitle={setTitle}
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
