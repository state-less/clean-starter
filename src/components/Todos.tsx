import { Scopes, useState } from '@state-less/react-server';
import { v4 } from 'uuid';
import { ServerSideProps } from './ServerSideProps';

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

export const Todos = () => {
    const [todos, setTodos] = useState<TodoObject[]>([], {
        key: 'todos',
        scope: Scopes.Client,
    });

    const addTodo = (todo: TodoObject) => {
        const id = v4();
        const newTodo = { ...todo, id };

        if (!isValidTodo(newTodo)) {
            throw new Error('Invalid todo');
        }
        setTodos([...todos, newTodo]);
    };

    const removeTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };
    return (
        <ServerSideProps key="todos-props" add={addTodo} remove={removeTodo}>
            {todos.map((todo) => (
                <Todo {...todo} />
            ))}
        </ServerSideProps>
    );
};

const isValidTodo = (todo): todo is TodoObject => {
    return todo.id && todo.title && 'completed' in todo;
};
