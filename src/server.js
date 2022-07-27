import { WebSocketRenderer, Server, Router, Route } from 'react-server';
import { StoreProvider } from 'react-server/release/components';
import { Poll } from './components/Poll';
import { PORT } from './config';

import { store, publicStore } from './stores';

const Target = (props) => {
  const { children, ...rest } = props;
  const targets = Object.keys(rest);
  return (
    <Route key="route" target={targets}>
      {children}
    </Route>
  );
};

const prod = (
  <StoreProvider store={publicStore}>
    <Server>
      <Poll store={store} values={['foo', 'bar']} key="demo-poll" />
    </Server>
  </StoreProvider>
);

const router = (
  <Router key="router" target={process.env.TARGET}>
    <Target serverless>{prod}</Target>
    <Target actions={['call', 'render']} target="node">
      {/* Renderer needs access to the root store in order to access the subscopes. */}
      <WebSocketRenderer port={PORT} store={store}>
        {prod}
      </WebSocketRenderer>
    </Target>
  </Router>
);

/**
 * @description To make deployments to multiple targets easier, react-server expects a default export with the component you want to render
 */
export default router;
