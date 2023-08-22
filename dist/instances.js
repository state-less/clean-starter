"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = exports.pubsub = exports.notificationEngine = exports.app = void 0;
var _graphqlSubscriptions = require("graphql-subscriptions");
var _reactServer = require("@state-less/react-server");
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _logger = _interopRequireDefault(require("./lib/logger"));
var _NotificationEngine = require("./lib/NotificationEngine");
var pubsub = new _graphqlSubscriptions.PubSub();
exports.pubsub = pubsub;
var store = new _reactServer.Store({
  file: './store.json',
  logger: _logger["default"]
});
exports.store = store;
var notificationEngine = new _NotificationEngine.NotificationEngine({
  store: store,
  listsKey: 'my-lists',
  webpushKey: 'web-push',
  interval: 1 * 60 * 1000,
  logger: _logger["default"]
});
exports.notificationEngine = notificationEngine;
var app = (0, _express["default"])();
exports.app = app;
app.options('/*', (0, _cors["default"])({
  origin: true
}));
app.use((0, _cors["default"])({
  origin: true
}));
store.sync(1 * 60 * 1000);
notificationEngine.start();