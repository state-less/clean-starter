"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Route = void 0;
var _reactServer = require("@state-less/react-server");
var _cors = _interopRequireDefault(require("cors"));
var latestHandlers = new Map();
var latestMiddleware = new Map();
function handlerProxy(req, res, next) {
  var currentPath = req.path;
  var handler = latestHandlers.get(currentPath);
  if (handler) {
    return handler(req, res, next);
  }
  next(); // Move on if no handler is found
}

function middlewareProxy(req, res, next) {
  var currentPath = req.path;
  var handler = latestMiddleware.get(currentPath);
  if (handler) {
    return handler(req, res, next);
  }
  next(); // Move on if no handler is found
}

function deleteRoute(router, path) {
  var _router$stack;
  var ind = (_router$stack = router.stack) === null || _router$stack === void 0 ? void 0 : _router$stack.findIndex(function (route) {
    return route.path === path;
  });
  if (ind !== -1) {
    router.stack.splice(ind, 1);
  }
}
var Route = function Route(props, _ref) {
  var key = _ref.key,
    context = _ref.context;
  var app = props.app,
    path = props.path,
    get = props.get,
    authenticate = props.authenticate;
  (0, _reactServer.useClientEffect)(function () {
    if ('get' in props) {
      deleteRoute(app._router, path);
      app.get(path, middlewareProxy, handlerProxy);
      app.options(path, (0, _cors["default"])({
        origin: true
      }));
      // Update the handler in our store
      if (authenticate) {
        latestMiddleware.set(path, authenticate);
      } else {
        latestMiddleware["delete"](path);
      }
      latestHandlers.set(path, get);
    }
  }, [path, get, app]);
};
exports.Route = Route;