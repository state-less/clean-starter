"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HelloWorld = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var HelloWorld = function HelloWorld() {
  var _useState = (0, _reactServer.useState)(0, {
      key: 'count',
      scope: 'global'
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    count = _useState2[0],
    setCount = _useState2[1];
  var increase = function increase() {
    setCount(count + 1);
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    count: count,
    increase: increase
  });
};
exports.HelloWorld = HelloWorld;