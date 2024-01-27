"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Room = exports.ChatApp = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _ServerSideProps = require("./ServerSideProps");
var _config = require("../config");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var tryGetUser = function tryGetUser(context) {
  try {
    return (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {
    return null;
  }
};
var ChatApp = function ChatApp(props, _ref) {
  var key = _ref.key;
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    children: (0, _jsxRuntime.jsx)(Room, {}, "room-global")
  }, "".concat(key, "-props"));
};
exports.ChatApp = ChatApp;
var Room = function Room(props, _ref2) {
  var key = _ref2.key,
    context = _ref2.context,
    initiator = _ref2.initiator,
    clientProps = _ref2.clientProps;
  var _useState = (0, _reactServer.useState)([], {
      key: "messages-".concat(key),
      scope: _reactServer.Scopes.Global
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    messages = _useState2[0],
    setMessages = _useState2[1];
  var _useState3 = (0, _reactServer.useState)([], {
      key: "clients-".concat(key),
      scope: _reactServer.Scopes.Global
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    clients = _useState4[0],
    setClients = _useState4[1];
  (0, _reactServer.useClientEffect)(function () {
    var user = tryGetUser(context);
    var client = {
      user: user,
      id: context.headers['x-unique-id']
    };
    if (!clients.find(function (c) {
      return c.id === client.id;
    })) setImmediate(setClients, [].concat((0, _toConsumableArray2["default"])(clients), [client]));
    return function () {
      setClients(clients.filter(function (c) {
        return c.id !== client.id;
      }));
    };
  });
  var sendMessage = function sendMessage(message) {
    if (typeof message !== 'string') {
      throw new Error('Invalid message');
    }
    if (message.length > 100) {
      throw new Error('Message too long');
    }
    var user = tryGetUser(context);
    var client = {
      user: user,
      id: context.headers['x-unique-id']
    };
    var messageObj = {
      author: client,
      message: message,
      timestamp: +new Date()
    };
    setMessages([].concat((0, _toConsumableArray2["default"])(messages), [messageObj]));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    total: messages.length,
    messages: messages.slice(((clientProps === null || clientProps === void 0 ? void 0 : clientProps.num) || 30) * -1),
    clients: clients,
    sendMessage: sendMessage
  }, (0, _reactServer.clientKey)("".concat(key, "-props"), context));
};
exports.Room = Room;