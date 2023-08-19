import { useClientEffect } from '@state-less/react-server';
import express from 'express';

const latestHandlers = new Map();
const latestMiddleware = new Map();

function handlerProxy(req, res, next) {
    const currentPath = req.path;
    const handler = latestHandlers.get(currentPath);
    if (handler) {
        return handler(req, res, next);
    }
    next(); // Move on if no handler is found
}

function middlewareProxy(req, res, next) {
    const currentPath = req.path;
    const handler = latestMiddleware.get(currentPath);
    if (handler) {
        return handler(req, res, next);
    }
    next(); // Move on if no handler is found
}
function deleteRoute(router, path) {
    const ind = router.stack?.findIndex((route) => {
        return route.path === path;
    });
    if (ind !== -1) {
        router.stack.splice(ind, 1);
    }
}
export const Route = (props, { key, context }) => {
    const { app, path, get, authenticate } = props;

    useClientEffect(() => {
        if ('get' in props) {
            deleteRoute(app._router, path);
            app.get(path, middlewareProxy, handlerProxy);

            // Update the handler in our store
            if (authenticate) {
                latestMiddleware.set(path, authenticate);
            } else {
                latestMiddleware.delete(path);
            }

            latestHandlers.set(path, get);
        }
    }, [path, get, app]);
};
