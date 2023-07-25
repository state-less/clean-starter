"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Todo = exports.Store = exports.MyLists = exports.List = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _uuid = require("uuid");
var _ServerSideProps = require("./ServerSideProps");
var _config = require("../config");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var _excluded = ["signed", "points", "order"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var DAY = 1000 * 60 * 60 * 24;
var limits = {
  '100': [DAY * 90, 1],
  '65': [DAY * 30, 1],
  '44': [DAY * 14, 2],
  '21': [DAY * 7, 2],
  '13': [DAY * 7, 3],
  '8': [DAY * 7, 4],
  '5': [DAY * 7, 7],
  '3': [DAY, 1],
  '2': [DAY, 10],
  '1': [DAY, 20]
};
var checkLimits = function checkLimits(items, todo) {
  var _ref = limits[todo.valuePoints] || [0, 1],
    _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
    interval = _ref2[0],
    times = _ref2[1];
  var within = (items || []).filter(function (i) {
    return i.lastModified + interval > Date.now();
  });
  console.log('WIthin', within, [interval, times]);
  var reachedLimit = within.length >= times;
  return !reachedLimit;
};
var Todo = function Todo(_ref3, _ref4) {
  var _user, _user2;
  var id = _ref3.id,
    completed = _ref3.completed,
    title = _ref3.title,
    archived = _ref3.archived,
    _ref3$reset = _ref3.reset,
    reset = _ref3$reset === void 0 ? null : _ref3$reset,
    _ref3$defaultValuePoi = _ref3.defaultValuePoints,
    defaultValuePoints = _ref3$defaultValuePoi === void 0 ? 0 : _ref3$defaultValuePoi,
    _ref3$valuePoints = _ref3.valuePoints,
    valuePoints = _ref3$valuePoints === void 0 ? defaultValuePoints : _ref3$valuePoints,
    _ref3$creditedValuePo = _ref3.creditedValuePoints,
    creditedValuePoints = _ref3$creditedValuePo === void 0 ? 0 : _ref3$creditedValuePo,
    _ref3$negativePoints = _ref3.negativePoints,
    negativePoints = _ref3$negativePoints === void 0 ? 0 : _ref3$negativePoints,
    _ref3$dueDate = _ref3.dueDate,
    dueDate = _ref3$dueDate === void 0 ? null : _ref3$dueDate;
  var key = _ref4.key,
    context = _ref4.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState = (0, _reactServer.useState)(0, {
      key: "points",
      scope: "".concat(((_user = user) === null || _user === void 0 ? void 0 : _user.id) || _reactServer.Scopes.Client)
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    points = _useState2[0],
    setPoints = _useState2[1];
  var _useState3 = (0, _reactServer.useState)({
      id: id,
      completed: completed,
      title: title,
      archived: archived,
      reset: reset,
      valuePoints: valuePoints,
      creditedValuePoints: creditedValuePoints,
      negativePoints: negativePoints,
      dueDate: dueDate
    }, {
      key: "todo",
      scope: "".concat(key, ".").concat(((_user2 = user) === null || _user2 === void 0 ? void 0 : _user2.id) || _reactServer.Scopes.Client)
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    todo = _useState4[0],
    setTodo = _useState4[1];
  var comp = todo.completed && (todo.reset === null || todo.lastModified + todo.reset > Date.now());
  var toggle = function toggle() {
    var _user3;
    var store = _reactServer.Dispatcher.getCurrent().getStore();
    var lastCompleted = store.getState({}, {
      key: "lastCompleted",
      scope: "".concat(((_user3 = user) === null || _user3 === void 0 ? void 0 : _user3.id) || _reactServer.Scopes.Client)
    });
    var valuePoints = todo.valuePoints;
    if (!comp && !checkLimits(lastCompleted.value[valuePoints], todo)) {
      throw new Error('Can be completed only n times within interval');
    }
    var newTodo = _objectSpread(_objectSpread({}, todo), {}, {
      completed: !comp,
      lastModified: Date.now(),
      creditedValuePoints: comp ? 0 : valuePoints
    });
    setTodo(newTodo);
    var newItems = !comp ? [].concat((0, _toConsumableArray2["default"])(lastCompleted.value[valuePoints] || []), [newTodo]) : (lastCompleted.value[valuePoints] || []).filter(function (i) {
      return i.id !== todo.id;
    });
    var filtered = newItems.filter(function (item) {
      return item.lastModified + limits[valuePoints][0] > Date.now();
    });
    console.log('ITEMS', newItems, filtered);
    lastCompleted.setValue(_objectSpread(_objectSpread({}, lastCompleted.value || {}), {}, (0, _defineProperty2["default"])({}, valuePoints, filtered)));
    setPoints(points + (comp ? -todo.creditedValuePoints : valuePoints));
  };
  var archive = function archive() {
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      archived: true
    }));
    setPoints(points + 1);
  };
  var setReset = function setReset(reset) {
    if (reset === 0 || reset === null || reset === undefined || reset === '' || reset === '-') {
      setTodo(_objectSpread(_objectSpread({}, todo), {}, {
        reset: null
      }));
      return;
    }
    if (reset < 0 || reset > 14) throw new Error('Invalid reset value');
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      reset: 1000 * 60 * 60 * 24 * reset
    }));
  };
  var setValuePoints = function setValuePoints(valuePoints) {
    if (typeof valuePoints !== 'number' && valuePoints < 0 || valuePoints > 100) {
      throw new Error('Invalid value points');
    }
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      valuePoints: valuePoints,
      negativePoints: -valuePoints
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, todo), {}, {
    toggle: toggle,
    archive: archive,
    completed: comp,
    setReset: setReset,
    setValuePoints: setValuePoints
  }), (0, _reactServer.clientKey)("".concat(id, "-todo"), context));
};
exports.Todo = Todo;
var List = function List(_ref5, _ref6) {
  var _user4, _user5, _user6, _user7, _user8, _user9, _user10, _user11;
  var id = _ref5.id,
    initialTitle = _ref5.title,
    _ref5$todos = _ref5.todos,
    initialTodos = _ref5$todos === void 0 ? [] : _ref5$todos,
    initialOrder = _ref5.order,
    _ref5$archived = _ref5.archived,
    initialArchived = _ref5$archived === void 0 ? false : _ref5$archived,
    _ref5$color = _ref5.color,
    initialColor = _ref5$color === void 0 ? 'white' : _ref5$color,
    _ref5$points = _ref5.points,
    initialPoints = _ref5$points === void 0 ? 0 : _ref5$points;
  var key = _ref6.key,
    context = _ref6.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState5 = (0, _reactServer.useState)(0, {
      key: "points",
      scope: "".concat(((_user4 = user) === null || _user4 === void 0 ? void 0 : _user4.id) || _reactServer.Scopes.Client)
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    points = _useState6[0],
    setPoints = _useState6[1];
  var _useState7 = (0, _reactServer.useState)(initialTodos, {
      key: 'todos',
      scope: "".concat(key, ".").concat(((_user5 = user) === null || _user5 === void 0 ? void 0 : _user5.id) || _reactServer.Scopes.Client)
    }),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    todos = _useState8[0],
    setTodos = _useState8[1];
  var _useState9 = (0, _reactServer.useState)('white', {
      key: 'color',
      scope: "".concat(key, ".").concat(((_user6 = user) === null || _user6 === void 0 ? void 0 : _user6.id) || _reactServer.Scopes.Client)
    }),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    color = _useState10[0],
    _setColor = _useState10[1];
  var _useState11 = (0, _reactServer.useState)(initialArchived, {
      key: 'archived',
      scope: "".concat(key, ".").concat(((_user7 = user) === null || _user7 === void 0 ? void 0 : _user7.id) || _reactServer.Scopes.Client)
    }),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    archived = _useState12[0],
    setArchived = _useState12[1];
  var _useState13 = (0, _reactServer.useState)({
      defaultValuePoints: 1
    }, {
      key: 'settings',
      scope: "".concat(key, ".").concat(((_user8 = user) === null || _user8 === void 0 ? void 0 : _user8.id) || _reactServer.Scopes.Client)
    }),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    settings = _useState14[0],
    setSettings = _useState14[1];
  var setColor = function setColor(color) {
    var colors = ['white', 'darkred', 'blue', 'green', 'yellow', 'orange', 'purple'];

    // if (!colors.includes(color)) {
    //     throw new Error('Invalid color');
    // }

    _setColor(color);
  };
  var _useState15 = (0, _reactServer.useState)([], {
      key: 'labels',
      scope: "".concat(key, ".").concat(((_user9 = user) === null || _user9 === void 0 ? void 0 : _user9.id) || _reactServer.Scopes.Client)
    }),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    labels = _useState16[0],
    setLabels = _useState16[1];
  var _useState17 = (0, _reactServer.useState)(initialTitle, {
      key: 'title',
      scope: "".concat(key, ".").concat(((_user10 = user) === null || _user10 === void 0 ? void 0 : _user10.id) || _reactServer.Scopes.Client)
    }),
    _useState18 = (0, _slicedToArray2["default"])(_useState17, 2),
    title = _useState18[0],
    setTitle = _useState18[1];
  var _useState19 = (0, _reactServer.useState)(initialOrder, {
      key: 'order',
      scope: "".concat(key, ".").concat(((_user11 = user) === null || _user11 === void 0 ? void 0 : _user11.id) || _reactServer.Scopes.Client)
    }),
    _useState20 = (0, _slicedToArray2["default"])(_useState19, 2),
    order = _useState20[0],
    setOrder = _useState20[1];
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
    setPoints(points + 1);
    return newTodo;
  };
  var removeEntry = function removeEntry(todoId) {
    var _user12, _todo$value, _todo$value2;
    var store = _reactServer.Dispatcher.getCurrent().getStore();
    var todo = store.getState(null, {
      key: "todo-".concat(todoId),
      scope: "".concat(todoId, ".").concat(((_user12 = user) === null || _user12 === void 0 ? void 0 : _user12.id) || _reactServer.Scopes.Client)
    });
    setOrder(order.filter(function (id) {
      return id !== todoId;
    }));
    setTodos(todos.filter(function (todo) {
      return todo.id !== todoId;
    }));
    setPoints(points - 1 - (todo !== null && todo !== void 0 && (_todo$value = todo.value) !== null && _todo$value !== void 0 && _todo$value.archived ? 1 : 0) - (todo === null || todo === void 0 ? void 0 : (_todo$value2 = todo.value) === null || _todo$value2 === void 0 ? void 0 : _todo$value2.valuePoints) || 0);
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
    setPoints(points + 1);
    return newLabel;
  };
  var removeLabel = function removeLabel(labelId) {
    setLabels(labels.filter(function (label) {
      return label.id !== labelId;
    }));
    setPoints(points - 1);
  };
  var archive = function archive() {
    setArchived(true);
  };
  var updateSettings = function updateSettings(settings) {
    if (!isValidSettings(settings)) {
      throw new Error('Invalid settings');
    }
    setSettings(settings);
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
    color: color,
    setColor: setColor,
    archived: archived,
    archive: archive,
    settings: settings,
    updateSettings: updateSettings,
    children: todos.map(function (todo) {
      return (0, _jsxRuntime.jsx)(Todo, _objectSpread(_objectSpread({}, todo), {}, {
        defaultValuePoints: settings === null || settings === void 0 ? void 0 : settings.defaultValuePoints
      }), todo.id);
    })
  }, (0, _reactServer.clientKey)("".concat(key, "-props"), context));
};
exports.List = List;
var exportData = function exportData(_ref7) {
  var key = _ref7.key,
    user = _ref7.user;
  var store = _reactServer.Dispatcher.getCurrent().getStore();
  var data = {};
  var lists = store.getState(null, {
    key: 'lists',
    scope: "".concat(key, ".").concat((user === null || user === void 0 ? void 0 : user.id) || _reactServer.Scopes.Client)
  });
  var order = store.getState(null, {
    key: 'order',
    scope: "".concat(key, ".").concat((user === null || user === void 0 ? void 0 : user.id) || _reactServer.Scopes.Client)
  });
  lists.value.forEach(function (list) {
    var todos = store.getState(null, {
      key: 'todos',
      scope: "".concat("list-".concat(list.id), ".", (user === null || user === void 0 ? void 0 : user.id) || _reactServer.Scopes.Client)
    });
    var order = store.getState(null, {
      key: 'order',
      scope: "".concat("list-".concat(list.id), ".", (user === null || user === void 0 ? void 0 : user.id) || _reactServer.Scopes.Client)
    });
    var color = store.getState(null, {
      key: 'color',
      scope: "".concat("list-".concat(list.id), ".", (user === null || user === void 0 ? void 0 : user.id) || _reactServer.Scopes.Client)
    });
    todos.value.forEach(function (todo) {
      var stored = store.getState(null, {
        key: "todo",
        scope: "".concat(todo.id, ".").concat((user === null || user === void 0 ? void 0 : user.id) || _reactServer.Scopes.Client)
      });
      Object.assign(todo, stored.value);
    });
    data[list.id] = _objectSpread(_objectSpread({}, list), {}, {
      color: color.value,
      order: order.value,
      todos: todos.value
    });
  });
  var points = store.getState(null, {
    key: 'points',
    scope: "".concat((user === null || user === void 0 ? void 0 : user.id) || _reactServer.Scopes.Client)
  });
  var signed = _jsonwebtoken["default"].sign(_objectSpread(_objectSpread({}, data), {}, {
    points: points
  }), _config.JWT_SECRET);
  return _objectSpread(_objectSpread({}, data), {}, {
    points: points.value,
    order: order.value,
    signed: signed
  });
};
var MyLists = function MyLists(_, _ref8) {
  var _user13, _user14, _user15, _user16;
  var context = _ref8.context,
    key = _ref8.key;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState21 = (0, _reactServer.useState)(0, {
      key: "points",
      scope: "".concat(((_user13 = user) === null || _user13 === void 0 ? void 0 : _user13.id) || _reactServer.Scopes.Client)
    }),
    _useState22 = (0, _slicedToArray2["default"])(_useState21, 2),
    points = _useState22[0],
    setPoints = _useState22[1];
  var _useState23 = (0, _reactServer.useState)({}, {
      key: "lastCompleted",
      scope: "".concat(((_user14 = user) === null || _user14 === void 0 ? void 0 : _user14.id) || _reactServer.Scopes.Client)
    }),
    _useState24 = (0, _slicedToArray2["default"])(_useState23, 1),
    lastCompleted = _useState24[0];
  var _useState25 = (0, _reactServer.useState)([], {
      key: 'lists',
      scope: "".concat(key, ".").concat(((_user15 = user) === null || _user15 === void 0 ? void 0 : _user15.id) || _reactServer.Scopes.Client)
    }),
    _useState26 = (0, _slicedToArray2["default"])(_useState25, 2),
    lists = _useState26[0],
    setLists = _useState26[1];
  var _useState27 = (0, _reactServer.useState)([], {
      key: 'order',
      scope: "".concat(key, ".").concat(((_user16 = user) === null || _user16 === void 0 ? void 0 : _user16.id) || _reactServer.Scopes.Client)
    }),
    _useState28 = (0, _slicedToArray2["default"])(_useState27, 2),
    order = _useState28[0],
    setOrder = _useState28[1];
  var addEntry = function addEntry(todo) {
    var id = (0, _uuid.v4)();
    var newList = _objectSpread(_objectSpread({}, todo), {}, {
      id: id
    });
    var newLists = [].concat((0, _toConsumableArray2["default"])(order.map(function (listId) {
      return lists.find(function (list) {
        return list.id === listId;
      });
    })), [newList]);
    setOrder([].concat((0, _toConsumableArray2["default"])(order), [id]));
    setLists(newLists);
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
  var importUserData = function importUserData(raw) {
    var signed = raw.signed,
      points = raw.points,
      order = raw.order,
      data = (0, _objectWithoutProperties2["default"])(raw, _excluded);
    var lists = Object.values(data);
    if (!signed) {
      throw new Error('Unsigned data');
    }
    _jsonwebtoken["default"].verify(signed, _config.JWT_SECRET);
    if (!lists.length || !lists.every(isValidList)) {
      throw new Error('Invalid data');
    }
    if (!(order !== null && order !== void 0 && order.every(function (id) {
      return typeof id === 'string';
    }))) {
      throw new Error('Invalid order');
    }
    lists.forEach(function (list) {
      var newId = (0, _uuid.v4)();
      var oldId = list.id;
      list.id = newId;
      order[order.indexOf(oldId)] = newId;
      list.todos.forEach(function (todo) {
        var oldId = todo.id;
        var newId = (0, _uuid.v4)();
        todo.id = newId;
        list.order[list.order.indexOf(oldId)] = newId;
      });
    });
    console.log('List', order);
    setLists(lists);
    setOrder(order);
    setPoints(points);
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    add: addEntry,
    remove: removeEntry,
    order: order,
    setOrder: setOrder,
    exportUserData: exportUserData,
    importUserData: importUserData,
    points: points,
    lastCompleted: lastCompleted,
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
  return list.id && list.title && list.todos && list.order && list.order.every(function (id) {
    return typeof id === 'string';
  }) && list.todos.every(function (todo) {
    return isValidTodo;
  });
};
var isValidSettings = function isValidSettings(settings) {
  return 'defaultValuePoints' in settings;
};
var features = [{
  id: 1,
  name: 'Colors',
  desc: 'Choose colors for your lists',
  price: 1000
}, {
  id: 1,
  name: 'Labels',
  desc: 'Choose colors for your lists',
  price: 10
}, {
  id: 0,
  name: 'Reorder',
  desc: 'Create multiple lists and items',
  price: 200
}];
var Store = function Store(props, _ref9) {
  var _context$user, _context$user2;
  var context = _ref9.context;
  var _useState29 = (0, _reactServer.useState)(0, {
      key: "points",
      scope: "".concat((context === null || context === void 0 ? void 0 : (_context$user = context.user) === null || _context$user === void 0 ? void 0 : _context$user.id) || _reactServer.Scopes.Client)
    }),
    _useState30 = (0, _slicedToArray2["default"])(_useState29, 2),
    points = _useState30[0],
    setPoints = _useState30[1];
  var _useState31 = (0, _reactServer.useState)({
      key: 'features',
      scope: "".concat((context === null || context === void 0 ? void 0 : (_context$user2 = context.user) === null || _context$user2 === void 0 ? void 0 : _context$user2.id) || _reactServer.Scopes.Client)
    }),
    _useState32 = (0, _slicedToArray2["default"])(_useState31, 2),
    features = _useState32[0],
    setFeatures = _useState32[1];
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {}, (0, _reactServer.clientKey)('my-lists-props', context));
};
exports.Store = Store;