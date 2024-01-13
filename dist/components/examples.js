"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HelloWorldExample2 = exports.HelloWorldExample1 = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var HelloWorldExample1 = function HelloWorldExample1(props, _ref) {
  var key = _ref.key,
    context = _ref.context;
  var _useState = (0, _reactServer.useState)(0, {
      key: 'count',
      scope: 'global'
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 1),
    count = _useState2[0];
  var increase = function increase() {
    throw new Error('Not implemented');
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps
  // Needed for reactivity
  , {
    count: count,
    increase: increase
  }, (0, _reactServer.clientKey)('hello-world-1-props', context));
};
exports.HelloWorldExample1 = HelloWorldExample1;
<<<<<<< HEAD
var HelloWorldExample2 = function HelloWorldExample2(_props, _ref2) {
  var key = _ref2.key,
    context = _ref2.context;
=======
var HelloWorldExample2 = function HelloWorldExample2(props, _ref) {
  var key = _ref.key,
    context = _ref.context;
>>>>>>> 03c407037195270bc170ca100fdfb6f491246104
  var _useState3 = (0, _reactServer.useState)(0, {
      key: 'count',
      scope: _reactServer.Scopes.Global
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    count = _useState4[0],
    setState = _useState4[1];
  var increase = function increase() {
    setState(count + 1);
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    count: count,
    increase: increase
<<<<<<< HEAD
  }, (0, _reactServer.clientKey)('hello-world-2-props', context));
=======
  }, (0, _reactServer.clientKey)("".concat(key, "-props"), context));
>>>>>>> 03c407037195270bc170ca100fdfb6f491246104
};
exports.HelloWorldExample2 = HelloWorldExample2;