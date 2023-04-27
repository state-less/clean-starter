"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Todos = exports.Todo = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _uuid = require("uuid");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var Todo = function Todo(_ref) {
  var id = _ref.id,
    completed = _ref.completed,
    title = _ref.title;
  var _useState = (0, _reactServer.useState)({
      id: id,
      completed: completed,
      title: title
    }, {
      key: "page".concat(id),
      scope: _reactServer.Scopes.Client
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    todo = _useState2[0],
    setTodo = _useState2[1];
  var toggle = function toggle() {
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      completed: !todo.completed
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, todo), {}, {
    toggle: toggle
  }), "".concat(id, "-todo"));
};
exports.Todo = Todo;
var Todos = function Todos() {
  var _useState3 = (0, _reactServer.useState)([], {
      key: 'todos',
      scope: _reactServer.Scopes.Client
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    todos = _useState4[0],
    setTodos = _useState4[1];
  var addTodo = function addTodo(todo) {
    var id = (0, _uuid.v4)();
    var newTodo = _objectSpread(_objectSpread({}, todo), {}, {
      id: id
    });
    if (!isValidTodo(newTodo)) {
      throw new Error('Invalid todo');
    }
    setTodos([].concat((0, _toConsumableArray2["default"])(todos), [newTodo]));
  };
  var removeTodo = function removeTodo(id) {
    setTodos(todos.filter(function (todo) {
      return todo.id !== id;
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    add: addTodo,
    remove: removeTodo,
    children: todos.map(function (todo) {
      return (0, _jsxRuntime.jsx)(Todo, _objectSpread({}, todo));
    })
  }, "todos-props");
};
exports.Todos = Todos;
var isValidTodo = function isValidTodo(todo) {
  return todo.id && todo.title && 'completed' in todo;
};