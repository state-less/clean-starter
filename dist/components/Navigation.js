"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidPath = exports.isEntry = exports.Navigation = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _ServerSideProps = require("./ServerSideProps");
var _uuid = require("uuid");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var isEntry = function isEntry(entry) {
  return entry.id && entry.path && entry.title;
};

/** This should check if the path contains a / and also that it doesn't contain any special characters */
exports.isEntry = isEntry;
var isValidPath = function isValidPath(path) {
  return /^\/([0-9A-Za-z_\-][\/]?)*$/.test(path);
};
exports.isValidPath = isValidPath;
var Navigation = function Navigation() {
  var _useState = (0, _reactServer.useState)([], {
      key: 'entries',
      scope: _reactServer.Scopes.Client
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    entries = _useState2[0],
    setEntries = _useState2[1];
  var addEntry = function addEntry(entry) {
    var id = (0, _uuid.v4)();
    var newEntry = _objectSpread(_objectSpread({}, entry), {}, {
      id: id
    });
    if (!isEntry(newEntry)) {
      throw new Error('Invalid entry');
    }
    if (!isValidPath(newEntry.path)) {
      throw new Error('Invalid path');
    }
    if (entries.find(function (e) {
      return e.path === entry.path;
    })) {
      throw new Error('Entry already exists');
    }
    setEntries([].concat((0, _toConsumableArray2["default"])(entries), [newEntry]));
  };
  var removeEntry = function removeEntry(id) {
    setEntries(entries.filter(function (entry) {
      return entry.id !== id;
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    entries: entries,
    addEntry: addEntry,
    removeEntry: removeEntry
  });
};
exports.Navigation = Navigation;