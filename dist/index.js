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
var _express = _interopRequireDefault(require("express"));
var _subscriptionsTransportWs = require("subscriptions-transport-ws");
var _reactServer = require("@state-less/react-server");
var _instances = require("./instances");
var _resolvers = require("./resolvers");
var _schema = require("./schema");
var _Navigation = require("./components/Navigation");
var _examples = require("./components/examples");
var _Pages = require("./components/Pages");
var _Todos = require("./components/Todos");
var _Votings = require("./components/Votings");
var _Session = require("./components/Session");
var _Poll = require("./components/Poll");
var _Comments = require("./components/Comments");
var _logger = _interopRequireDefault(require("./lib/logger"));
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var _templateObject, _templateObject2, _templateObject3;
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
var connections = _instances.store.createState(0, {
  key: 'connections',
  scope: 'global'
});
// Create a WebSocket server for subscriptions
_subscriptionsTransportWs.SubscriptionServer.create({
  schema: schema,
  execute: _graphql.execute,
  subscribe: _graphql.subscribe,
  onConnect: function onConnect(params) {
    _logger["default"].log(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["Client connected"])));
    connections.value += 1;
    _instances.pubsub.publish((0, _resolvers.generatePubSubKey)(connections), {
      updateState: connections
    });
    return {
      headers: params.headers
    };
  },
  onDisconnect: function onDisconnect() {
    connections.value = Math.max(0, connections.value - 1);
    _instances.pubsub.publish((0, _resolvers.generatePubSubKey)(connections), {
      updateState: connections
    });
    _logger["default"].log(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["Client disconnected"])));
  }
}, {
  server: httpServer,
  path: apolloServer.graphqlPath
});
var reactServer = (0, _jsxRuntime.jsxs)(_reactServer.Server, {
  children: [(0, _jsxRuntime.jsx)(_reactServer.TestComponent, {}, "test"), (0, _jsxRuntime.jsx)(_Navigation.Navigation, {}, "navigation"), (0, _jsxRuntime.jsx)(_examples.HelloWorldExample1, {}, "hello-world-1"), (0, _jsxRuntime.jsx)(_examples.HelloWorldExample2, {}, "hello-world-2"), (0, _jsxRuntime.jsx)(_Pages.Pages, {}, "pages"), (0, _jsxRuntime.jsx)(_Pages.DynamicPage, {}, "page"), (0, _jsxRuntime.jsx)(_Todos.Todos, {}, "todos"), (0, _jsxRuntime.jsx)(_Votings.Votings, {}, "votings"), (0, _jsxRuntime.jsx)(_Session.Session, {}, "session"), (0, _jsxRuntime.jsx)(_Poll.Poll, {
    values: ['Where can I get this?', 'Meh...', 'Shut up and take my money.'],
    policies: [_Poll.PollActions.Revert, _Poll.PollActions.Authenticate]
  }, "poll"), (0, _jsxRuntime.jsx)(_Poll.Poll, {
    values: ['Nice!', 'Meh...', "It's not working", 'Add more features.', 'Add a comment section.', 'Shut up and take my money.'],
    policies: [_Poll.PollActions.Revert]
  }, "poll-open"), (0, _jsxRuntime.jsx)(_Comments.Comments, {
    policies: [_Comments.CommentPolicies.Authenticate]
  }, "comments")]
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
          _logger["default"].log(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["Server listening on port ", "."])), PORT);
        });
      case 4:
      case "end":
        return _context.stop();
    }
  }, _callee);
}))();