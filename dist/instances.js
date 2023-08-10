"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = exports.pubsub = void 0;
var _graphqlSubscriptions = require("graphql-subscriptions");
var _reactServer = require("@state-less/react-server");
var _logger = _interopRequireDefault(require("./lib/logger"));
var pubsub = new _graphqlSubscriptions.PubSub();
exports.pubsub = pubsub;
var store = new _reactServer.Store({
  file: './store.json',
  logger: _logger["default"]
});
exports.store = store;
store.sync(20 * 1000);