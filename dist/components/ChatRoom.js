"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Room = exports.ChatApp = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _uuid = require("uuid");
var _ServerSideProps = require("./ServerSideProps");
var _config = require("../config");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var Room = function Room(props, _ref) {
  var key = _ref.key,
    context = _ref.context,
    initiator = _ref.initiator,
    clientProps = _ref.clientProps;
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
    var user = null;
    try {
      user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
    } catch (e) {}
    var client = {
      user: user,
      id: context.headers['x-unique-id']
    };
    console.log('Initiator', initiator);
    if (initiator !== _reactServer.Initiator.Mount) return function () {
      console.log('!!! Unmounting client', client.id, clients.filter(function (c) {
        return c.id !== client.id;
      }));
      setClients(clients.filter(function (c) {
        return c.id !== client.id;
      }));
    };
    if (!clients.find(function (c) {
      return c.id === client.id;
    })) setImmediate(setClients([].concat((0, _toConsumableArray2["default"])(clients), [client])));
    return function () {
      console.log('!!! Unmounting client', client.id, clients.filter(function (c) {
        return c.id !== client.id;
      }));
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
    var user = null;
    try {
      user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
    } catch (e) {}
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
  console.log('Client Props', clientProps);
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    total: messages.length,
    messages: messages.slice(((clientProps === null || clientProps === void 0 ? void 0 : clientProps.num) || 30) * -1),
    clients: clients,
    sendMessage: sendMessage
  }, "".concat(key, "-props"));
};
exports.Room = Room;
var ChatApp = function ChatApp(props, _ref2) {
  var key = _ref2.key,
    context = _ref2.context;
  var _useState5 = (0, _reactServer.useState)([], {
      key: 'rooms',
      scope: _reactServer.Scopes.Global
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    rooms = _useState6[0],
    setRooms = _useState6[1];
  var addRoom = function addRoom() {
    var user = null;
    try {
      user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
    } catch (e) {}
    var client = {
      user: user,
      id: context.headers['x-unique-id']
    };
    var room = {
      id: (0, _uuid.v4)(),
      owner: client
    };
    setRooms([].concat((0, _toConsumableArray2["default"])(rooms), [room]));
  };
  return (0, _jsxRuntime.jsxs)(_ServerSideProps.ServerSideProps, {
    addRoom: addRoom,
    children: [(0, _jsxRuntime.jsx)(Room, {}, "room-global"), rooms.map(function (room) {
      return (0, _jsxRuntime.jsx)(Room, {}, room.id);
    })]
  }, "".concat(key, "-props"));
};
exports.ChatApp = ChatApp;