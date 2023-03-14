"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = exports.pubsub = void 0;
var _graphqlSubscriptions = require("graphql-subscriptions");
var _reactServer = require("@state-less/react-server");
var pubsub = new _graphqlSubscriptions.PubSub();
exports.pubsub = pubsub;
var store = new _reactServer.Store({
  scope: 'root'
});
exports.store = store;