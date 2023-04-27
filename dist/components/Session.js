"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Session = void 0;
var _reactServer = require("@state-less/react-server");
var _ServerSideProps = require("./ServerSideProps");
var _config = require("../config");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var Session = function Session(props, _ref) {
  var _ref$context = _ref.context,
    context = _ref$context === void 0 ? {
      headers: {}
    } : _ref$context;
  var headers = context.headers;
  if (!(0, _reactServer.isClientContext)(context)) {
    return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
      session: null
    });
  }
  var session = (0, _reactServer.authenticate)(headers, _config.JWT_SECRET);
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    session: session
  });
};
exports.Session = Session;