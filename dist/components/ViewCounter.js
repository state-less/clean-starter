"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewCounter = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var ViewCounter = function ViewCounter(props, _ref) {
  var key = _ref.key;
  var _useState = (0, _reactServer.useState)(0, {
      key: 'views',
      scope: _reactServer.Scopes.Global
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    views = _useState2[0],
    setViews = _useState2[1];
  (0, _reactServer.useClientEffect)(function () {
    setViews(views + 1);
  }, []);
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    views: views
  }, "".concat(key, "-props"));
};
exports.ViewCounter = ViewCounter;