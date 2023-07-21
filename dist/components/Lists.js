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
var Todo = function Todo(_ref, _ref2) {
  var _user;
  var id = _ref.id,
    completed = _ref.completed,
    title = _ref.title;
  var key = _ref2.key,
    context = _ref2.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState = (0, _reactServer.useState)({
      id: id,
      completed: completed,
      title: title
    }, {
      key: "todo-".concat(id),
      scope: "".concat(key, ".").concat(((_user = user) === null || _user === void 0 ? void 0 : _user.id) || _reactServer.Scopes.Client)
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
  }), (0, _reactServer.clientKey)("".concat(id, "-todo"), context));
};
exports.Todo = Todo;
var List = function List(_ref3, _ref4) {
  var _user2, _user3, _user4, _user5;
  var id = _ref3.id,
    initialTitle = _ref3.title,
    _ref3$todos = _ref3.todos,
    initialTodos = _ref3$todos === void 0 ? [] : _ref3$todos;
  var key = _ref4.key,
    context = _ref4.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState3 = (0, _reactServer.useState)(initialTodos, {
      key: 'todos',
      scope: "".concat(key, ".").concat(((_user2 = user) === null || _user2 === void 0 ? void 0 : _user2.id) || _reactServer.Scopes.Client)
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    todos = _useState4[0],
    setTodos = _useState4[1];
  var _useState5 = (0, _reactServer.useState)([], {
      key: 'labels',
      scope: "".concat(key, ".").concat(((_user3 = user) === null || _user3 === void 0 ? void 0 : _user3.id) || _reactServer.Scopes.Client)
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    labels = _useState6[0],
    setLabels = _useState6[1];
  var _useState7 = (0, _reactServer.useState)(initialTitle, {
      key: 'title',
      scope: "".concat(key, ".").concat(((_user4 = user) === null || _user4 === void 0 ? void 0 : _user4.id) || _reactServer.Scopes.Client)
    }),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    title = _useState8[0],
    setTitle = _useState8[1];
  var _useState9 = (0, _reactServer.useState)(initialTodos.map(function (todo) {
      return todo.id;
    }), {
      key: 'order',
      scope: "".concat(key, ".").concat(((_user5 = user) === null || _user5 === void 0 ? void 0 : _user5.id) || _reactServer.Scopes.Client)
    }),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    order = _useState10[0],
    setOrder = _useState10[1];
  (0, _reactServer.useClientEffect)(function () {
    console.log('CLIENT EFFECT');
    setTodos(initialTodos);
    setOrder(initialTodos.map(function (todo) {
      return todo.id;
    }));
  }, [initialTodos]);
  var addEntry = function addEntry(todo) {
    var todoId = (0, _uuid.v4)();
    var newTodo = _objectSpread(_objectSpread({}, todo), {}, {
      id: todoId
    });
    if (!isValidTodo(newTodo)) {
      throw new Error('Invalid todo');
    }
    setTodos([].concat((0, _toConsumableArray2["default"])(todos), [newTodo]));
    setOrder([].concat((0, _toConsumableArray2["default"])(todos), [newTodo]).map(function (list) {
      return list.id;
    }));
    return newTodo;
  };
  var removeEntry = function removeEntry(todoId) {
    setOrder(order.filter(function (id) {
      return id !== todoId;
    }));
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
    order: order,
    setOrder: setOrder,
    children: todos.map(function (todo) {
      return (0, _jsxRuntime.jsx)(Todo, _objectSpread({}, todo), todo.id);
    })
  }, (0, _reactServer.clientKey)("".concat(key, "-props"), context));
};
exports.List = List;
var exportData = function exportData(_ref5) {
  var key = _ref5.key,
    user = _ref5.user;
  var store = _reactServer.Dispatcher.getCurrent().getStore();
  var data = {};
  var lists = store.getState(null, {
    key: 'lists',
    scope: "".concat(key, ".").concat((user === null || user === void 0 ? void 0 : user.id) || _reactServer.Scopes.Client)
  });
  lists.value.forEach(function (list) {
    var todos = store.getState(null, {
      key: 'todos',
      scope: "".concat("list-".concat(list.id), ".", (user === null || user === void 0 ? void 0 : user.id) || _reactServer.Scopes.Client)
    });
    data[list.id] = _objectSpread(_objectSpread({}, list), {}, {
      todos: todos.value
    });
  });
  return data;
};
var MyLists = function MyLists(_, _ref6) {
  var _user6, _user7;
  var context = _ref6.context,
    key = _ref6.key;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState11 = (0, _reactServer.useState)([], {
      key: 'lists',
      scope: "".concat(key, ".").concat(((_user6 = user) === null || _user6 === void 0 ? void 0 : _user6.id) || _reactServer.Scopes.Client)
    }),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    lists = _useState12[0],
    setLists = _useState12[1];
  var _useState13 = (0, _reactServer.useState)([], {
      key: 'order',
      scope: "".concat(key, ".").concat(((_user7 = user) === null || _user7 === void 0 ? void 0 : _user7.id) || _reactServer.Scopes.Client)
    }),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    order = _useState14[0],
    setOrder = _useState14[1];
  var addEntry = function addEntry(todo) {
    var id = (0, _uuid.v4)();
    var newList = _objectSpread(_objectSpread({}, todo), {}, {
      id: id
    });
    setLists([].concat((0, _toConsumableArray2["default"])(lists), [newList]));
    setOrder([].concat((0, _toConsumableArray2["default"])(lists), [newList]).map(function (list) {
      return list.id;
    }));
  };
  var removeEntry = function removeEntry(id) {
    setLists(lists.filter(function (list) {
      return list.id !== id;
    }));
    setOrder(order.filter(function (listId) {
      return listId !== id;
    }));
  };
  var exportUserData = function exportUserData() {
    return exportData({
      key: key,
      user: user
    });
  };
  var importUserData = function importUserData(data) {
    var lists = Object.values(data);
    if (!lists.length || !lists.every(isValidList)) {
      throw new Error('Invalid list');
    }
    var order = lists.map(function (list) {
      return list.id;
    });
    setLists(lists);
    setOrder(order);
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    add: addEntry,
    remove: removeEntry,
    order: order,
    setOrder: setOrder,
    exportUserData: exportUserData,
    importUserData: importUserData,
    children: lists.map(function (list) {
      return (0, _jsxRuntime.jsx)(List, _objectSpread({}, list), "list-".concat(list.id));
    })
  }, (0, _reactServer.clientKey)('my-lists-props', context));
};
exports.MyLists = MyLists;
var isValidTodo = function isValidTodo(todo) {
  return todo.id && todo.title && 'completed' in todo;
};
var isValidLabel = function isValidLabel(label) {
  return label.id && label.title && Object.keys(label).length === 2;
};
var isValidList = function isValidList(list) {
  return list.id && list.title && list.todos && list.todos.every(function (todo) {
    return isValidTodo;
  });
};