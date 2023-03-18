import { useState } from '@state-less/react-server/dist/lib/reactServer';
import { ServerSideProps } from './ServerSideProps';

export const Navigation = () => {
    const [entries, setEntries] = useState([], { key: 'entries' });

    const addEntry = (entry) => {
        console.log('Calling addEntry', entry);
        setEntries([...entries, entry]);
    };

    return <ServerSideProps entries={entries} addEntry={addEntry} />;
};
