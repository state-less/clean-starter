"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Todo = exports.MyLists = exports.List = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _uuid = require("uuid");
var _ServerSideProps = require("./ServerSideProps");
var _config = require("../config");
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
var List = function List(_ref2, _ref3) {
  var id = _ref2.id,
    initialTitle = _ref2.title;
  var key = _ref3.key;
  var _useState3 = (0, _reactServer.useState)([], {
      key: 'todos',
      scope: "".concat(key, ".").concat(_reactServer.Scopes.Client)
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    todos = _useState4[0],
    setTodos = _useState4[1];
  var _useState5 = (0, _reactServer.useState)([], {
      key: 'labels',
      scope: "".concat(key, ".").concat(_reactServer.Scopes.Client)
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    labels = _useState6[0],
    setLabels = _useState6[1];
  var _useState7 = (0, _reactServer.useState)(initialTitle, {
      key: 'title',
      scope: "".concat(key, ".").concat(_reactServer.Scopes.Client)
    }),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    title = _useState8[0],
    setTitle = _useState8[1];
  var addEntry = function addEntry(todo) {
    var todoId = (0, _uuid.v4)();
    var newTodo = _objectSpread(_objectSpread({}, todo), {}, {
      id: todoId
    });
    if (!isValidTodo(newTodo)) {
      throw new Error('Invalid todo');
    }
    setTodos([].concat((0, _toConsumableArray2["default"])(todos), [newTodo]));
    return newTodo;
  };
  var removeEntry = function removeEntry(todoId) {
    setTodos(todos.filter(function (todo) {
      return todo.id !== todoId;
    }));
  };
  var addLabel = function addLabel(label) {
    var labelId = (0, _uuid.v4)();
    var newLabel = _objectSpread(_objectSpread({}, label), {}, {
      id: labelId
    });
    if (!isValidLabel(newLabel)) {
      throw new Error('Invalid todo');
    }
    setLabels([].concat((0, _toConsumableArray2["default"])(labels), [newLabel]));
    return newLabel;
  };
  var removeLabel = function removeLabel(labelId) {
    setLabels(labels.filter(function (label) {
      return label.id !== labelId;
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    add: addEntry,
    remove: removeEntry,
    addLabel: addLabel,
    removeLabel: removeLabel,
    title: title,
    setTitle: setTitle,
    labels: labels,
    setLabels: setLabels,
    id: id,
    children: todos.map(function (todo) {
      return (0, _jsxRuntime.jsx)(Todo, _objectSpread({}, todo));
    })
  }, "".concat(key, "-props"));
};
exports.List = List;
var MyLists = function MyLists(_, _ref4) {
  var _user;
  var context = _ref4.context,
    key = _ref4.key;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState9 = (0, _reactServer.useState)([], {
      key: 'lists',
      scope: "".concat(key, ".").concat(((_user = user) === null || _user === void 0 ? void 0 : _user.id) || _reactServer.Scopes.Client)
    }),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    lists = _useState10[0],
    setLists = _useState10[1];
  var addEntry = function addEntry(todo) {
    var id = (0, _uuid.v4)();
    var newList = _objectSpread(_objectSpread({}, todo), {}, {
      id: id
    });
    setLists([].concat((0, _toConsumableArray2["default"])(lists), [newList]));
  };
  var removeEntry = function removeEntry(id) {
    setLists(lists.filter(function (list) {
      return list.id !== id;
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    add: addEntry,
    remove: removeEntry,
    children: lists.map(function (list) {
      return (0, _jsxRuntime.jsx)(List, _objectSpread({}, list), "list-".concat(list.id));
    })
  }, "my-lists-props");
};
exports.MyLists = MyLists;
var isValidTodo = function isValidTodo(todo) {
  return todo.id && todo.title && 'completed' in todo;
};
var isValidLabel = function isValidLabel(label) {
  return label.id && label.title && Object.keys(label).length === 2;
};