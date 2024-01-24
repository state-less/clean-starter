"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebPushManager = void 0;
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _config = require("../config");
var _ServerSideProps = require("./ServerSideProps");
var _webPush = _interopRequireDefault(require("web-push"));
var _instances = require("../instances");
var _logger = _interopRequireDefault(require("../lib/logger"));
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var _templateObject;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; } // webpush.setGCMAPIKey(VAPID_PRIVATE);
_webPush["default"].setVapidDetails('mailto:moritz.roessler@gmail.com', _config.VAPID_PUBLIC, _config.VAPID_PRIVATE);
var WebPushManager = function WebPushManager(props, _ref) {
  var _context$headers;
  var key = _ref.key,
    context = _ref.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var clientId = ((_context$headers = context.headers) === null || _context$headers === void 0 ? void 0 : _context$headers['x-unique-id']) || 'server';
  var _useState = (0, _reactServer.useState)({}, {
      key: 'subscribed',
      scope: key
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    subscribed = _useState2[0],
    setSubscribed = _useState2[1];
  (0, _reactServer.useEffect)(function () {
    console.log('WEB PUSH', subscribed);
    Object.keys(subscribed).forEach(function (clientId) {
      var _ref2 = subscribed[clientId] || {},
        sub = _ref2.sub,
        user = _ref2.user;
      if (sub) {
        console.log('Resubscribing to Push Manager', clientId);
        _instances.notificationEngine.subscribe(clientId, user, sub);
      }
    });
  });
  var subscribe = function subscribe(subscription) {
    setSubscribed(_objectSpread(_objectSpread({}, subscribed), {}, (0, _defineProperty2["default"])({}, clientId, {
      sub: JSON.parse(subscription),
      user: user
    })));
    _instances.notificationEngine.subscribe(clientId, user, JSON.parse(subscription));
  };
  var unsubscribe = function unsubscribe() {
    setSubscribed(_objectSpread(_objectSpread({}, subscribed), {}, (0, _defineProperty2["default"])({}, clientId, null)));
    _instances.notificationEngine.unsubscribe(clientId, user);
  };
  var sendNotification = function sendNotification(body) {
    var _ref3 = (subscribed === null || subscribed === void 0 ? void 0 : subscribed[clientId]) || {},
      sub = _ref3.sub;
    if (typeof body !== 'string') {
      body = JSON.stringify(body);
    }
    if (sub) {
      try {
        _webPush["default"].sendNotification(sub, body);
      } catch (e) {
        _logger["default"].error(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["Error sending notification"])));
      }
    }
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    sendNotification: sendNotification,
    vapid: _config.VAPID_PUBLIC
  }, key + '-props');
};
exports.WebPushManager = WebPushManager;