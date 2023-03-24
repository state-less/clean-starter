import { Scopes, useState } from '@state-less/react-server';
import { v4 } from 'uuid';
import { isValidPath } from './Navigation';
import { ServerSideProps } from './ServerSideProps';

type PageObject = {
    id: string | null;
    path: string;
    content: string[];
};

export const DynamicPage = (props, { clientProps }) => {
    const [pages] = useState([], {
        key: 'pages',
        scope: Scopes.Client,
    });

    if (!clientProps?.path) {
        return <Page id="404" content={['404']} path="/404" />;
    }
    const page = pages.find((p) => p.path === clientProps.path);
    if (!page) {
        return <Page id="404" content={['404']} path={clientProps.path} />;
    }

    return <Page {...page} />;
};

export const Page = ({ id, content, path }: PageObject) => {
    const [page, setPage] = useState<PageObject>(
        {
            id,
            content,
            path,
        },
        {
            key: `page${id}`,
            scope: Scopes.Client,
        }
    );

    const setContent = (newContent) => {
        setPage({ ...page, content: newContent });
    };

    return <ServerSideProps key={page.id} {...page} setContent={setContent} />;
};

export const Pages = () => {
    const [pages, setPages] = useState([], {
        key: 'pages',
        scope: Scopes.Client,
    });

    const addPage = (page) => {
        const id = v4();
        const newPage = { ...page, id };
        if (pages.find((p) => p.path === page.path)) {
            throw new Error('Page already exists');
        }
        if (!isValidPath(newPage.path)) {
            throw new Error('Invalid path');
        }
        if (!isValidPage(newPage)) {
            throw new Error('Invalid page');
        }
        setPages([...pages, newPage]);
    };

    return (
        <ServerSideProps
            // Needed for reactivity
            key="pages-props"
            addPage={addPage}
        >
            {pages.map((page) => (
                <Page {...page} />
            ))}
        </ServerSideProps>
    );
};

const isValidPage = (page): page is PageObject => {
    return page.id && page.path && page.content;
};
