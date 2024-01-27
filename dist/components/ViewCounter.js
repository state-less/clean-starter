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
  var key = _ref.key,
    initiator = _ref.initiator,
    context = _ref.context;
  var _useState = (0, _reactServer.useState)(0, {
      key: 'views',
      scope: "".concat(key, "-").concat(_reactServer.Scopes.Global)
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    views = _useState2[0],
    setViews = _useState2[1];
  var _useState3 = (0, _reactServer.useState)(0, {
      key: 'clients',
      scope: "".concat(key, "-").concat(_reactServer.Scopes.Global)
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    clients = _useState4[0],
    setClients = _useState4[1];
  (0, _reactServer.useClientEffect)(function () {
    if (initiator !== _reactServer.Initiator.RenderClient) return;
    setClients(clients + 1);
  }, []);
  (0, _reactServer.useClientEffect)(function () {
    if (initiator !== _reactServer.Initiator.RenderClient) return;
    setViews(views + 1);
  });
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    component: key,
    views: views,
    clients: clients
  }, (0, _reactServer.clientKey)("".concat(key, "-props"), context));
};
exports.ViewCounter = ViewCounter;