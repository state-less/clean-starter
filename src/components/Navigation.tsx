import { Scopes, useState } from '@state-less/react-server';
import { ServerSideProps } from './ServerSideProps';
import { v4 } from 'uuid';

type NavigationEntry = {
    id: string;
    path: string;
    title: string;
};

export const isEntry = (entry: any): entry is NavigationEntry => {
    return entry.id && entry.path && entry.title;
};

/** This should check if the path contains a / and also that it doesn't contain any special characters */
export const isValidPath = (path: string) => {
    return /^\/([0-9A-Za-z_\-][\/]?)*$/.test(path);
};

export const Navigation = () => {
    const [entries, setEntries] = useState<NavigationEntry[]>([], {
        key: 'entries',
        scope: Scopes.Client,
    });

    const addEntry = (entry) => {
        const id = v4();
        const newEntry = { ...entry, id };

        if (!isEntry(newEntry)) {
            throw new Error('Invalid entry');
        }

        if (!isValidPath(newEntry.path)) {
            throw new Error('Invalid path');
        }

        if (entries.find((e) => e.path === entry.path)) {
            throw new Error('Entry already exists');
        }
        setEntries([...entries, newEntry]);
    };

    const removeEntry = (id) => {
        setEntries(entries.filter((entry) => entry.id !== id));
    };

    return (
        <ServerSideProps
            // Needed for reactivity
            key="navigation-props"
            entries={entries}
            addEntry={addEntry}
            removeEntry={removeEntry}
        />
    );
};
