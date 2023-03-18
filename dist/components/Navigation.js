"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Navigation = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server/dist/lib/reactServer");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var Navigation = function Navigation() {
  var _useState = (0, _reactServer.useState)([], {
      key: 'entries'
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    entries = _useState2[0],
    setEntries = _useState2[1];
  var addEntry = function addEntry(entry) {
    console.log('Calling addEntry', entry);
    setEntries([].concat((0, _toConsumableArray2["default"])(entries), [entry]));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    entries: entries,
    addEntry: addEntry
  });
};
exports.Navigation = Navigation;