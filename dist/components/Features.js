"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Features = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _permissions = require("../lib/permissions");
var _ServerSideProps = require("./ServerSideProps");
var _config = require("../config");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var Features = function Features(_, _ref) {
  var context = _ref.context,
    key = _ref.key;
  var _useState = (0, _reactServer.useState)(false, {
      key: "wilson",
      scope: _reactServer.Scopes.Global
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    wilson = _useState2[0],
    setWilson = _useState2[1];
  var _useState3 = (0, _reactServer.useState)(false, {
      key: "animated",
      scope: _reactServer.Scopes.Global
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    animated = _useState4[0],
    setAnimated = _useState4[1];
  var toggleWilson = function toggleWilson() {
    var _user, _user$strategies, _user$strategies$user, _user2;
    var user = null;
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
    if (!_permissions.admins.includes((_user = user) === null || _user === void 0 ? void 0 : (_user$strategies = _user.strategies) === null || _user$strategies === void 0 ? void 0 : (_user$strategies$user = _user$strategies[(_user2 = user) === null || _user2 === void 0 ? void 0 : _user2.strategy]) === null || _user$strategies$user === void 0 ? void 0 : _user$strategies$user.email)) {
      throw new Error('Not an admin');
    }
    setWilson(!wilson);
  };
  var toggleAnimated = function toggleAnimated() {
    var _user3, _user3$strategies, _user3$strategies$use, _user4;
    var user = null;
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
    if (!_permissions.admins.includes((_user3 = user) === null || _user3 === void 0 ? void 0 : (_user3$strategies = _user3.strategies) === null || _user3$strategies === void 0 ? void 0 : (_user3$strategies$use = _user3$strategies[(_user4 = user) === null || _user4 === void 0 ? void 0 : _user4.strategy]) === null || _user3$strategies$use === void 0 ? void 0 : _user3$strategies$use.email)) {
      throw new Error('Not an admin');
    }
    setAnimated(!animated);
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    wilson: wilson,
    animated: animated,
    toggleAnimated: toggleAnimated,
    toggleWilson: toggleWilson
  }, "".concat(key, "-props"));
};
exports.Features = Features;