"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reactServer = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _apolloServerExpress = require("apollo-server-express");
var _graphqlTools = require("graphql-tools");
var _graphql = require("graphql");
var _http = require("http");
var _subscriptionsTransportWs = require("subscriptions-transport-ws");
var _reactServer = require("@state-less/react-server");
var _instances = require("./instances");
var _resolvers = require("./resolvers");
var _schema = require("./schema");
var _logger = _interopRequireDefault(require("./lib/logger"));
var _Forum = require("./components/Forum");
var _config = require("./config");
var _ViewCounter = require("./components/ViewCounter");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var _templateObject, _templateObject2;
_reactServer.Dispatcher.getCurrent().setStore(_instances.store);
_reactServer.Dispatcher.getCurrent().setPubSub(_instances.pubsub);
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
var httpServer = (0, _http.createServer)(_instances.app);
var connections = _instances.store.createState(0, {
  key: 'connections',
  scope: 'global'
});
// Create a WebSocket server for subscriptions
var clients = new WeakMap();
_subscriptionsTransportWs.SubscriptionServer.create({
  keepAlive: 10000,
  schema: schema,
  execute: _graphql.execute,
  subscribe: _graphql.subscribe,
  onConnect: function onConnect(params, socket) {
    var _socket$upgradeReq$he, _socket$upgradeReq$he2;
    _logger["default"].log(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["Client connected"])));
    connections.value += 1;
    _instances.pubsub.publish((0, _resolvers.generatePubSubKey)(connections), {
      updateState: connections
    });
    console.log('Connnect', (_socket$upgradeReq$he = socket.upgradeReq.headers.cookie) === null || _socket$upgradeReq$he === void 0 ? void 0 : (_socket$upgradeReq$he2 = _socket$upgradeReq$he.match(/x-react-server-id=(.+?);/)) === null || _socket$upgradeReq$he2 === void 0 ? void 0 : _socket$upgradeReq$he2[1]);
    return {
      headers: params.headers
    };
  },
  onDisconnect: function onDisconnect(params, socket) {
    var _socket$request$heade, _socket$request$heade2;
    connections.value = Math.max(0, connections.value - 1);
    _instances.pubsub.publish((0, _resolvers.generatePubSubKey)(connections), {
      updateState: connections
    });
    console.log('Disconnect', (_socket$request$heade = socket.request.headers.cookie) === null || _socket$request$heade === void 0 ? void 0 : (_socket$request$heade2 = _socket$request$heade.match(/x-react-server-id=(.+?);/)) === null || _socket$request$heade2 === void 0 ? void 0 : _socket$request$heade2[1]);
  }
}, {
  server: httpServer,
  path: apolloServer.graphqlPath
});
var reactServer = (0, _jsxRuntime.jsxs)(_reactServer.Server, {
  children: [(0, _jsxRuntime.jsx)(_ViewCounter.ViewCounter, {}, "forum-views"), (0, _jsxRuntime.jsx)(_Forum.Forum, {
    id: _config.FORUM_KEY,
    name: "Community",
    policies: [_Forum.ForumPolicies.PostsNeedApproval]
  }, _config.FORUM_KEY)]
}, "server");
exports.reactServer = reactServer;
var node = (0, _reactServer.render)(reactServer, {
  initiator: _reactServer.Initiator.RenderServer,
  context: {
    __typename: 'ServerContext',
    headers: undefined,
    os: 'windows'
  },
  clientProps: {}
}, null);
console.log('NODE', node);
(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return apolloServer.start();
      case 2:
        apolloServer.applyMiddleware({
          app: _instances.app,
          bodyParserConfig: {
            limit: '10mb'
          }
        });
        httpServer.listen(PORT, function () {
          _logger["default"].log(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["Server listening on port ", "."])), PORT);
        });
      case 4:
      case "end":
        return _context.stop();
    }
  }, _callee);
}))();