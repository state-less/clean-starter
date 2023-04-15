"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reactServer = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _apolloServerExpress = require("apollo-server-express");
var _graphqlTools = require("graphql-tools");
var _graphql = require("graphql");
var _http = require("http");
var _express = _interopRequireDefault(require("express"));
var _subscriptionsTransportWs = require("subscriptions-transport-ws");
var _reactServer = require("@state-less/react-server");
var _instances = require("./instances");
var _resolvers = require("./resolvers");
var _schema = require("./schema");
var _Poll = require("./components/Poll");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
_reactServer.Dispatcher.getCurrent().setStore(_instances.store);
_reactServer.Dispatcher.getCurrent().setPubSub(_instances.pubsub);
var app = (0, _express["default"])();
var PORT = 4000;
var schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: _schema.typeDefs,
  resolvers: _resolvers.resolvers
});
var apolloServer = new _apolloServerExpress.ApolloServer({
  schema: schema,
  context: function context(_ref) {
    var req = _ref.req;
    var headers = req.headers;
    return {
      headers: headers
    };
  }
});

// Create a HTTP server
var httpServer = (0, _http.createServer)(app);

// Create a WebSocket server for subscriptions
_subscriptionsTransportWs.SubscriptionServer.create({
  schema: schema,
  execute: _graphql.execute,
  subscribe: _graphql.subscribe,
  onConnect: function onConnect() {
    console.log('Client connected');
  },
  onDisconnect: function onDisconnect() {
    console.log('Client disconnected');
  }
}, {
  server: httpServer,
  path: apolloServer.graphqlPath
});
var reactServer = (0, _jsxRuntime.jsx)(_reactServer.Server, {
  children: (0, _jsxRuntime.jsx)(_Poll.Poll, {
    values: ['Where can I get this?', 'Meh...', 'Shut up and take my money.'],
    allow: [_Poll.PollActions.Revert]
  }, "poll")
}, "server");
exports.reactServer = reactServer;
var node = (0, _reactServer.render)(reactServer, null, null);
(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return apolloServer.start();
      case 2:
        apolloServer.applyMiddleware({
          app: app
        });
        httpServer.listen(PORT, function () {
          console.log("Server listening on port ".concat(PORT, "."));
        });
      case 4:
      case "end":
        return _context.stop();
    }
  }, _callee);
}))();