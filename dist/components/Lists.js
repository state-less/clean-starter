"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Todo = exports.MyListsMeta = exports.MyLists = exports.List = exports.Expense = exports.Counter = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _uuid = require("uuid");
var _ServerSideProps = require("./ServerSideProps");
var _config = require("../config");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _ExpressServer = require("./ExpressServer");
var _instances = require("../instances");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var _excluded = ["order", "points", "iat"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var itemTypeStateKeyMap = {
  Todo: 'todo',
  Counter: 'counter',
  Expense: 'expense'
};
var DAY = 1000 * 60 * 60 * 24;
var DEFAULT_VALUE_POINTS = 0;

/**
 * Limits for how many times a todo can be completed within a given interval //[interval, times]
 */
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
  '1': [DAY, 20],
  '0': [DAY, 1000]
};

/**
 * Checks if a todo can be completed based on the limits
 */
var checkLimits = function checkLimits(items, todo) {
  var _ref = limits[todo.valuePoints] || [0, 1],
    _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
    interval = _ref2[0],
    times = _ref2[1];
  var within = (items || []).filter(function (i) {
    return i.lastModified + interval > Date.now();
  });
  var reachedLimit = within.length >= times;
  return !reachedLimit;
};
var Todo = function Todo(_ref3, _ref4) {
  var _context$headers, _user, _user2;
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
    lastModified = _ref3.lastModified,
    lastNotified = _ref3.lastNotified,
    _ref3$dueDate = _ref3.dueDate,
    dueDate = _ref3$dueDate === void 0 ? null : _ref3$dueDate,
    _ref3$dueTime = _ref3.dueTime,
    dueTime = _ref3$dueTime === void 0 ? null : _ref3$dueTime,
    _changeType = _ref3.changeType,
    createdAt = _ref3.createdAt,
    color = _ref3.color;
  var key = _ref4.key,
    context = _ref4.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var store = _reactServer.Dispatcher.getCurrent().getStore();
  var clientId = (context === null || context === void 0 ? void 0 : (_context$headers = context.headers) === null || _context$headers === void 0 ? void 0 : _context$headers['x-unique-id']) || 'server';

  // We need to obtain the client id manually since we are not using useState
  // We are not using use state because of a bug that prevents multiple state updates in the same function
  var points = store.getState(null, {
    key: "points",
    scope: "".concat(((_user = user) === null || _user === void 0 ? void 0 : _user.id) || clientId)
  });
  var _useState = (0, _reactServer.useState)({
      id: id,
      completed: completed,
      title: title,
      archived: archived,
      reset: reset,
      valuePoints: valuePoints,
      creditedValuePoints: creditedValuePoints,
      negativePoints: negativePoints,
      dueDate: dueDate,
      dueTime: dueTime,
      type: 'Todo',
      lastModified: lastModified,
      color: color
    }, {
      key: "todo",
      scope: "".concat(key, ".").concat(((_user2 = user) === null || _user2 === void 0 ? void 0 : _user2.id) || _reactServer.Scopes.Client)
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    todo = _useState2[0],
    setTodo = _useState2[1];
  var comp = todo.completed && (todo.reset === null || todo.lastModified + todo.reset > Date.now());
  var setColor = function setColor(color) {
    if (typeof color !== 'string') {
      throw new Error('Invalid color');
    }
    // if (!colors.includes(color)) {
    //     throw new Error('Invalid color');
    // }

    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      color: color
    }));
  };
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
      var _limits$valuePoints;
      return item.lastModified + (((_limits$valuePoints = limits[valuePoints]) === null || _limits$valuePoints === void 0 ? void 0 : _limits$valuePoints[0]) || 0) > Date.now();
    });
    lastCompleted.value = _objectSpread(_objectSpread({}, lastCompleted.value || {}), {}, (0, _defineProperty2["default"])({}, valuePoints, filtered));
    points.value += comp ? -todo.creditedValuePoints : valuePoints;
    return newTodo;
  };
  var archive = function archive() {
    if (todo.archived) return;
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      archived: true
    }));
    points.value += 1;
  };
  var setReset = function setReset(reset) {
    if (reset === 0 || reset === null || reset === undefined || reset === '' || reset === '-') {
      setTodo(_objectSpread(_objectSpread({}, todo), {}, {
        reset: null
      }));
      return;
    }
    if (reset < 0 || reset > 14 * 24) throw new Error('Invalid reset value');
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      reset: 1000 * 60 * 60 * reset
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
  var setTitle = function setTitle(title) {
    if (typeof title !== 'string') {
      throw new Error('Invalid title');
    }
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      title: title
    }));
  };
  var setDueDate = function setDueDate(dueDate) {
    if (isNaN(new Date(dueDate).getTime())) {
      throw new Error('Invalid due date');
    }
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      dueDate: dueDate
    }));
  };
  var setDueTime = function setDueTime(dueTime) {
    if (isNaN(new Date(dueTime).getTime())) {
      throw new Error('Invalid due date');
    }
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      dueTime: dueTime
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, todo), {}, {
    toggle: toggle,
    archive: archive,
    completed: comp,
    setReset: setReset,
    setValuePoints: setValuePoints,
    changeType: function changeType(type) {
      return _changeType(id, type);
    },
    setColor: setColor,
    setTitle: setTitle,
    setDueDate: setDueDate,
    setDueTime: setDueTime,
    type: "Todo",
    createdAt: createdAt,
    lastModified: todo.lastModified,
    children: (0, _jsxRuntime.jsx)(_ExpressServer.Route, {
      todo: todo,
      app: _instances.app,
      path: "/todos/".concat(id, "/toggle"),
      get: function get(req, res) {
        var todo = toggle();
        res.send(todo);
      },
      authenticate: function authenticate(req, res, next) {
        var _user4, _httpUser;
        var httpUser = null;
        try {
          // Authenticate the http request
          httpUser = (0, _reactServer.authenticate)(req.headers, _config.JWT_SECRET);
        } catch (e) {}
        // Make sure the client and user is the same as the one who rendered the component
        if (req.headers['x-unique-id'] !== clientId || ((_user4 = user) === null || _user4 === void 0 ? void 0 : _user4.id) !== ((_httpUser = httpUser) === null || _httpUser === void 0 ? void 0 : _httpUser.id)) {
          throw new Error('Unauthorized');
        }
        next();
      }
    }, "test")
  }), (0, _reactServer.clientKey)("".concat(id, "-todo"), context));
};
exports.Todo = Todo;
var Counter = function Counter(_ref5, _ref6) {
  var _context$headers2, _user5, _user6;
  var id = _ref5.id,
    _ref5$count = _ref5.count,
    count = _ref5$count === void 0 ? 0 : _ref5$count,
    title = _ref5.title,
    archived = _ref5.archived,
    _ref5$reset = _ref5.reset,
    reset = _ref5$reset === void 0 ? null : _ref5$reset,
    _ref5$defaultValuePoi = _ref5.defaultValuePoints,
    defaultValuePoints = _ref5$defaultValuePoi === void 0 ? 0 : _ref5$defaultValuePoi,
    _ref5$valuePoints = _ref5.valuePoints,
    valuePoints = _ref5$valuePoints === void 0 ? defaultValuePoints : _ref5$valuePoints,
    _ref5$creditedValuePo = _ref5.creditedValuePoints,
    creditedValuePoints = _ref5$creditedValuePo === void 0 ? 0 : _ref5$creditedValuePo,
    _ref5$negativePoints = _ref5.negativePoints,
    negativePoints = _ref5$negativePoints === void 0 ? 0 : _ref5$negativePoints,
    _ref5$dueDate = _ref5.dueDate,
    dueDate = _ref5$dueDate === void 0 ? null : _ref5$dueDate,
    _changeType2 = _ref5.changeType;
  var key = _ref6.key,
    context = _ref6.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var store = _reactServer.Dispatcher.getCurrent().getStore();
  var clientId = ((_context$headers2 = context.headers) === null || _context$headers2 === void 0 ? void 0 : _context$headers2['x-unique-id']) || 'server';

  // We need to obtain the client id manually since we are not using useState
  // We are not using use state because of a bug that prevents multiple state updates in the same function
  var points = store.getState(null, {
    key: "points",
    scope: "".concat(((_user5 = user) === null || _user5 === void 0 ? void 0 : _user5.id) || clientId)
  });
  var _useState3 = (0, _reactServer.useState)({
      id: id,
      count: count,
      title: title,
      archived: archived,
      reset: reset,
      valuePoints: valuePoints,
      creditedValuePoints: creditedValuePoints,
      negativePoints: negativePoints,
      dueDate: dueDate,
      type: 'Counter'
    }, {
      key: "counter",
      scope: "".concat(key, ".").concat(((_user6 = user) === null || _user6 === void 0 ? void 0 : _user6.id) || _reactServer.Scopes.Client)
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    counter = _useState4[0],
    setCounter = _useState4[1];
  var increase = function increase() {
    if (counter.archived) {
      throw new Error('Cannot increase archived counter');
    }
    var newTodo = _objectSpread(_objectSpread({}, counter), {}, {
      count: counter.count + 1,
      lastModified: Date.now()
    });
    setCounter(newTodo);
  };
  var decrease = function decrease() {
    if (counter.archived) {
      throw new Error('Cannot decrease archived counter');
    }
    var newTodo = _objectSpread(_objectSpread({}, counter), {}, {
      count: counter.count - 1,
      lastModified: Date.now()
    });
    setCounter(newTodo);
  };
  var archive = function archive() {
    setCounter(_objectSpread(_objectSpread({}, counter), {}, {
      archived: Date.now()
    }));
  };
  var setTitle = function setTitle(title) {
    if (typeof title !== 'string') {
      throw new Error('Invalid title');
    }
    setCounter(_objectSpread(_objectSpread({}, counter), {}, {
      title: title,
      lastModified: Date.now()
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, counter), {}, {
    archive: archive,
    increase: increase,
    decrease: decrease,
    setTitle: setTitle,
    changeType: function changeType(type) {
      return _changeType2(id, type);
    },
    type: "Counter"
  }), (0, _reactServer.clientKey)("".concat(id, "-counter"), context));
};
exports.Counter = Counter;
var Expense = function Expense(_ref7, _ref8) {
  var _user7;
  var id = _ref7.id,
    _ref7$value = _ref7.value,
    value = _ref7$value === void 0 ? 0 : _ref7$value,
    title = _ref7.title,
    archived = _ref7.archived,
    _ref7$reset = _ref7.reset,
    reset = _ref7$reset === void 0 ? null : _ref7$reset,
    _ref7$defaultValuePoi = _ref7.defaultValuePoints,
    defaultValuePoints = _ref7$defaultValuePoi === void 0 ? 0 : _ref7$defaultValuePoi,
    _ref7$valuePoints = _ref7.valuePoints,
    valuePoints = _ref7$valuePoints === void 0 ? defaultValuePoints : _ref7$valuePoints,
    _ref7$creditedValuePo = _ref7.creditedValuePoints,
    creditedValuePoints = _ref7$creditedValuePo === void 0 ? 0 : _ref7$creditedValuePo,
    _ref7$negativePoints = _ref7.negativePoints,
    negativePoints = _ref7$negativePoints === void 0 ? 0 : _ref7$negativePoints,
    _ref7$dueDate = _ref7.dueDate,
    dueDate = _ref7$dueDate === void 0 ? null : _ref7$dueDate,
    _changeType3 = _ref7.changeType;
  var key = _ref8.key,
    context = _ref8.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState5 = (0, _reactServer.useState)({
      id: id,
      value: value,
      title: title,
      archived: archived,
      reset: reset,
      valuePoints: valuePoints,
      creditedValuePoints: creditedValuePoints,
      negativePoints: negativePoints,
      dueDate: dueDate,
      type: 'Expense'
    }, {
      key: "expense",
      scope: "".concat(key, ".").concat(((_user7 = user) === null || _user7 === void 0 ? void 0 : _user7.id) || _reactServer.Scopes.Client)
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    expense = _useState6[0],
    setExpense = _useState6[1];
  var archive = function archive() {
    setExpense(_objectSpread(_objectSpread({}, expense), {}, {
      archived: Date.now()
    }));
  };
  var setValue = function setValue(val) {
    if (typeof +val !== 'number') {
      throw new Error('Invalid value');
    }
    setExpense(_objectSpread(_objectSpread({}, expense), {}, {
      value: val,
      lastModified: Date.now()
    }));
  };
  var setTitle = function setTitle(title) {
    if (typeof title !== 'string') {
      throw new Error('Invalid title');
    }
    setExpense(_objectSpread(_objectSpread({}, expense), {}, {
      title: title,
      lastModified: Date.now()
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, expense), {}, {
    archive: archive,
    changeType: function changeType(type) {
      return _changeType3(id, type);
    },
    setValue: setValue,
    setTitle: setTitle,
    type: "Expense"
  }), (0, _reactServer.clientKey)("".concat(id, "-expense"), context));
};
exports.Expense = Expense;
var List = function List(_ref9, _ref10) {
  var _context$headers3, _user8, _user9, _user10, _user11, _user12, _user13, _user14, _user15;
  var id = _ref9.id,
    initialTitle = _ref9.title,
    _ref9$todos = _ref9.todos,
    initialTodos = _ref9$todos === void 0 ? [] : _ref9$todos,
    initialOrder = _ref9.order,
    _ref9$archived = _ref9.archived,
    initialArchived = _ref9$archived === void 0 ? false : _ref9$archived,
    _ref9$color = _ref9.color,
    initialColor = _ref9$color === void 0 ? '' : _ref9$color,
    _ref9$points = _ref9.points,
    initialPoints = _ref9$points === void 0 ? 0 : _ref9$points,
    _ref9$labels = _ref9.labels,
    initialLabels = _ref9$labels === void 0 ? [] : _ref9$labels,
    initialSettings = _ref9.settings,
    createdAt = _ref9.createdAt;
  var key = _ref10.key,
    context = _ref10.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var store = _reactServer.Dispatcher.getCurrent().getStore();
  var clientId = (context === null || context === void 0 ? void 0 : (_context$headers3 = context.headers) === null || _context$headers3 === void 0 ? void 0 : _context$headers3['x-unique-id']) || 'server';
  var points = store.getState(initialPoints, {
    key: "points",
    scope: "".concat(((_user8 = user) === null || _user8 === void 0 ? void 0 : _user8.id) || clientId)
  });
  var _useState7 = (0, _reactServer.useState)(initialTodos, {
      key: 'todos',
      scope: "".concat(key, ".").concat(((_user9 = user) === null || _user9 === void 0 ? void 0 : _user9.id) || _reactServer.Scopes.Client)
    }),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    todos = _useState8[0],
    setTodos = _useState8[1];
  var _useState9 = (0, _reactServer.useState)(initialColor, {
      key: 'color',
      scope: "".concat(key, ".").concat(((_user10 = user) === null || _user10 === void 0 ? void 0 : _user10.id) || _reactServer.Scopes.Client)
    }),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    color = _useState10[0],
    _setColor = _useState10[1];
  var _useState11 = (0, _reactServer.useState)(initialArchived, {
      key: 'archived',
      scope: "".concat(key, ".").concat(((_user11 = user) === null || _user11 === void 0 ? void 0 : _user11.id) || _reactServer.Scopes.Client)
    }),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    archived = _useState12[0],
    setArchived = _useState12[1];
  var _useState13 = (0, _reactServer.useState)({
      defaultValuePoints: (initialSettings === null || initialSettings === void 0 ? void 0 : initialSettings.defaultValuePoints) || 0,
      pinned: (initialSettings === null || initialSettings === void 0 ? void 0 : initialSettings.pinned) || false,
      defaultType: (initialSettings === null || initialSettings === void 0 ? void 0 : initialSettings.defaultType) || 'Todo'
    }, {
      key: 'settings',
      scope: "".concat(key, ".").concat(((_user12 = user) === null || _user12 === void 0 ? void 0 : _user12.id) || _reactServer.Scopes.Client)
    }),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    settings = _useState14[0],
    setSettings = _useState14[1];
  var togglePinned = function togglePinned() {
    setSettings(_objectSpread(_objectSpread({}, settings), {}, {
      pinned: !settings.pinned
    }));
  };
  var setColor = function setColor(color) {
    var colors = ['white', 'darkred', 'blue', 'green', 'yellow', 'orange', 'purple'];
    if (typeof color !== 'string') {
      throw new Error('Invalid color');
    }
    // if (!colors.includes(color)) {
    //     throw new Error('Invalid color');
    // }

    _setColor(color);
  };
  var _useState15 = (0, _reactServer.useState)(initialLabels, {
      key: 'labels',
      scope: "".concat(key, ".").concat(((_user13 = user) === null || _user13 === void 0 ? void 0 : _user13.id) || _reactServer.Scopes.Client)
    }),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    labels = _useState16[0],
    setLabels = _useState16[1];
  var _useState17 = (0, _reactServer.useState)(initialTitle, {
      key: 'title',
      scope: "".concat(key, ".").concat(((_user14 = user) === null || _user14 === void 0 ? void 0 : _user14.id) || _reactServer.Scopes.Client)
    }),
    _useState18 = (0, _slicedToArray2["default"])(_useState17, 2),
    title = _useState18[0],
    setTitle = _useState18[1];
  var _useState19 = (0, _reactServer.useState)(initialOrder, {
      key: 'order',
      scope: "".concat(key, ".").concat(((_user15 = user) === null || _user15 === void 0 ? void 0 : _user15.id) || _reactServer.Scopes.Client)
    }),
    _useState20 = (0, _slicedToArray2["default"])(_useState19, 2),
    order = _useState20[0],
    setOrder = _useState20[1];
  var addEntry = function addEntry(todo) {
    var todoId = (0, _uuid.v4)();
    var newItem = _objectSpread(_objectSpread({}, todo), {}, {
      id: todoId,
      createdAt: Date.now(),
      type: todo.type || (settings === null || settings === void 0 ? void 0 : settings.defaultType) || 'Todo'
    });
    var isValid = validationFunctions[newItem.type];
    if (!isValid(newItem)) {
      throw new Error('Invalid item');
    }
    setTodos([].concat((0, _toConsumableArray2["default"])(todos), [newItem]));
    setOrder([].concat((0, _toConsumableArray2["default"])(order), [todoId]));
    points.value += 1;
    return newItem;
  };
  var removeEntry = function removeEntry(todoId) {
    var _user16, _todo$value, _todo$value2;
    var store = _reactServer.Dispatcher.getCurrent().getStore();
    var todo = store.getState(null, {
      key: "todo-".concat(todoId),
      scope: "".concat(todoId, ".").concat(((_user16 = user) === null || _user16 === void 0 ? void 0 : _user16.id) || _reactServer.Scopes.Client)
    });
    setOrder(order.filter(function (id) {
      return id !== todoId;
    }));
    setTodos(todos.filter(function (todo) {
      return todo.id !== todoId;
    }));
    points.value = points.value - 1 - (todo !== null && todo !== void 0 && (_todo$value = todo.value) !== null && _todo$value !== void 0 && _todo$value.archived ? 1 : 0) - ((todo === null || todo === void 0 ? void 0 : (_todo$value2 = todo.value) === null || _todo$value2 === void 0 ? void 0 : _todo$value2.valuePoints) || 0);
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
    points.value += 1;
    return newLabel;
  };
  var removeLabel = function removeLabel(labelId) {
    setLabels(labels.filter(function (label) {
      return label.id !== labelId;
    }));
    points.value = points.value - 1;
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
  var changeType = function changeType(id, type) {
    if (!['Todo', 'Counter', 'Expense'].includes(type)) {
      throw new Error('Invalid type');
    }
    var todo = todos.find(function (todo) {
      return todo.id === id;
    });
    if (!todo) {
      throw new Error('Invalid todo');
    }
    if (todo.type === type) {
      return;
    }
    if (type === 'Todo') {
      var newTodo = _objectSpread(_objectSpread({}, todo), {}, {
        completed: false,
        type: 'Todo'
      });
      if (!isValidTodo(newTodo)) {
        throw new Error('Invalid todo');
      }
      var newTodos = (0, _toConsumableArray2["default"])(todos);
      newTodos.splice(todos.findIndex(function (todo) {
        return todo.id === id;
      }), 1, newTodo);
      setTodos(newTodos);
    } else if (type === 'Counter') {
      var newCounter = _objectSpread(_objectSpread({}, todo), {}, {
        count: todo.count || 0,
        type: 'Counter'
      });
      if (!isValidCounter(newCounter)) {
        throw new Error('Invalid counter');
      }
      var _newTodos = (0, _toConsumableArray2["default"])(todos);
      _newTodos.splice(todos.findIndex(function (todo) {
        return todo.id === id;
      }), 1, newCounter);
      setTodos(_newTodos);
    } else if (type === 'Expense') {
      var _newTodo = _objectSpread(_objectSpread({}, todo), {}, {
        value: todo.value || 0,
        type: 'Expense'
      });
      if (!isValidExpense(_newTodo)) {
        throw new Error('Invalid counter');
      }
      var _newTodos2 = (0, _toConsumableArray2["default"])(todos);
      _newTodos2.splice(todos.findIndex(function (expense) {
        return expense.id === id;
      }), 1, _newTodo);
      setTodos(_newTodos2);
    }
  };
  var filtered = todos;
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
    togglePinned: togglePinned,
    createdAt: createdAt,
    children: filtered.map(function (item) {
      switch (item.type) {
        case 'Todo':
          {
            return (0, _jsxRuntime.jsx)(Todo, _objectSpread(_objectSpread({}, item), {}, {
              defaultValuePoints: settings === null || settings === void 0 ? void 0 : settings.defaultValuePoints,
              changeType: changeType
            }), item.id);
          }
        case 'Counter':
          {
            return (0, _jsxRuntime.jsx)(Counter, _objectSpread(_objectSpread({}, item), {}, {
              changeType: changeType
            }), item.id);
          }
        case 'Expense':
          {
            return (0, _jsxRuntime.jsx)(Expense, _objectSpread(_objectSpread({}, item), {}, {
              changeType: changeType
            }), item.id);
          }
        default:
          {
            return (0, _jsxRuntime.jsx)(Todo, _objectSpread(_objectSpread({}, item), {}, {
              defaultValuePoints: settings === null || settings === void 0 ? void 0 : settings.defaultValuePoints,
              changeType: changeType
            }), item.id);
          }
      }
    })
  }, (0, _reactServer.clientKey)("".concat(key, "-props"), context));
};
exports.List = List;
var exportData = function exportData(_ref11) {
  var key = _ref11.key,
    user = _ref11.user;
  var clientId = _reactServer.Dispatcher.getCurrent()._renderOptions.context.headers['x-unique-id'];
  var store = _reactServer.Dispatcher.getCurrent().getStore();
  var data = {};
  var state = store.getState(null, {
    key: 'state',
    scope: "".concat(key, ".").concat((user === null || user === void 0 ? void 0 : user.id) || clientId)
  });
  var _state$value = state.value,
    lists = _state$value.lists,
    order = _state$value.order;
  lists.forEach(function (list) {
    var todos = store.getState(null, {
      key: 'todos',
      scope: "".concat("list-".concat(list.id), ".", (user === null || user === void 0 ? void 0 : user.id) || clientId)
    });
    var order = store.getState(null, {
      key: 'order',
      scope: "".concat("list-".concat(list.id), ".", (user === null || user === void 0 ? void 0 : user.id) || clientId)
    });
    var labels = store.getState(null, {
      key: 'labels',
      scope: "".concat("list-".concat(list.id), ".", (user === null || user === void 0 ? void 0 : user.id) || clientId)
    });
    var color = store.getState(null, {
      key: 'color',
      scope: "".concat("list-".concat(list.id), ".", (user === null || user === void 0 ? void 0 : user.id) || clientId)
    });
    var settings = store.getState(null, {
      key: 'settings',
      scope: "".concat("list-".concat(list.id), ".", (user === null || user === void 0 ? void 0 : user.id) || clientId)
    });
    todos.value.forEach(function (todo) {
      var stored = store.getState(null, {
        key: itemTypeStateKeyMap[todo.type] || 'todo',
        scope: "".concat(todo.id, ".").concat((user === null || user === void 0 ? void 0 : user.id) || clientId)
      });
      Object.assign(todo, stored.value);
    });
    data[list.id] = _objectSpread(_objectSpread({}, list), {}, {
      color: color.value,
      order: order.value,
      todos: todos.value,
      settings: settings.value,
      labels: labels.value
    });
  });
  var points = store.getState(null, {
    key: 'points',
    scope: "".concat((user === null || user === void 0 ? void 0 : user.id) || clientId)
  });
  var signed = _jsonwebtoken["default"].sign(_objectSpread(_objectSpread({}, data), {}, {
    points: points.value,
    order: order
  }), _config.JWT_SECRET);
  return _objectSpread(_objectSpread({}, data), {}, {
    points: points.value,
    order: order,
    signed: signed
  });
};
var MyLists = function MyLists(_, _ref12) {
  var _context$headers4, _user17, _user18;
  var context = _ref12.context,
    key = _ref12.key;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var store = _reactServer.Dispatcher.getCurrent().getStore();
  var clientId = ((_context$headers4 = context.headers) === null || _context$headers4 === void 0 ? void 0 : _context$headers4['x-unique-id']) || 'server';
  var points = store.getState(null, {
    key: 'points',
    scope: "".concat(((_user17 = user) === null || _user17 === void 0 ? void 0 : _user17.id) || clientId)
  });
  var _useState21 = (0, _reactServer.useState)({
      lists: [],
      order: []
    }, {
      key: 'state',
      scope: "".concat(key, ".").concat(((_user18 = user) === null || _user18 === void 0 ? void 0 : _user18.id) || _reactServer.Scopes.Client)
    }),
    _useState22 = (0, _slicedToArray2["default"])(_useState21, 2),
    state = _useState22[0],
    setState = _useState22[1];
  var lists = state.lists,
    order = state.order;
  var addEntry = function addEntry(list) {
    var id = (0, _uuid.v4)();
    var newList = _objectSpread(_objectSpread({}, list), {}, {
      order: [],
      id: id,
      settings: {
        defaultValuePoints: DEFAULT_VALUE_POINTS,
        defaultType: 'Todo',
        pinned: false
      },
      createdAt: Date.now()
    });
    var newLists = [newList].concat((0, _toConsumableArray2["default"])(state.lists));
    setState({
      order: [id].concat((0, _toConsumableArray2["default"])(state.order)),
      lists: newLists
    });
  };
  var removeEntry = function removeEntry(id) {
    setState({
      lists: state.lists.filter(function (list) {
        return list.id !== id;
      }),
      order: state.order.filter(function (listId) {
        return listId !== id;
      })
    });
  };
  var exportUserData = function exportUserData() {
    return exportData({
      key: key,
      user: user
    });
  };
  var importUserData = function importUserData(raw) {
    var signed = raw.signed;
    if (!signed) {
      throw new Error('Unsigned data');
    }
    var _ref13 = _jsonwebtoken["default"].verify(signed, _config.JWT_SECRET),
      order = _ref13.order,
      storedPoints = _ref13.points,
      iat = _ref13.iat,
      data = (0, _objectWithoutProperties2["default"])(_ref13, _excluded);
    var lists = Object.values(data);
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
        todo.createdAt = todo.createdAt || Date.now();
        list.order[list.order.indexOf(oldId)] = newId;
      });
    });
    setState({
      lists: lists,
      order: order
    });
    points.value = storedPoints;
  };
  var setOrder = function setOrder(order) {
    if (!order.every(function (id) {
      return typeof id === 'string';
    })) {
      throw new Error('Invalid order');
    }
    setState({
      order: order,
      lists: state.lists
    });
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
  return todo.id && 'completed' in todo;
};
var isValidCounter = function isValidCounter(counter) {
  return counter.id && 'count' in counter && counter.type === 'Counter';
};
var isValidExpense = function isValidExpense(expense) {
  return expense.id && 'value' in expense;
};
var isValidLabel = function isValidLabel(label) {
  return label.id && label.title && Object.keys(label).length === 2;
};
var isValidList = function isValidList(list) {
  return list.id && list.todos && list.order && list.order.every(function (id) {
    return typeof id === 'string';
  }) && list.todos.every(function (todo) {
    return isValidItem(todo);
  });
};
var isValidSettings = function isValidSettings(settings) {
  return 'defaultValuePoints' in settings;
};
var MyListsMeta = function MyListsMeta(props, _ref14) {
  var _user19, _user20;
  var key = _ref14.key,
    context = _ref14.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState23 = (0, _reactServer.useState)(0, {
      key: "points",
      scope: "".concat(((_user19 = user) === null || _user19 === void 0 ? void 0 : _user19.id) || _reactServer.Scopes.Client)
    }),
    _useState24 = (0, _slicedToArray2["default"])(_useState23, 2),
    points = _useState24[0],
    setPoints = _useState24[1];
  var _useState25 = (0, _reactServer.useState)({}, {
      key: "lastCompleted",
      scope: "".concat(((_user20 = user) === null || _user20 === void 0 ? void 0 : _user20.id) || _reactServer.Scopes.Client)
    }),
    _useState26 = (0, _slicedToArray2["default"])(_useState25, 1),
    lastCompleted = _useState26[0];
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    points: points,
    lastCompleted: lastCompleted
  });
};
exports.MyListsMeta = MyListsMeta;
var validationFunctions = {
  Todo: isValidTodo,
  Counter: isValidCounter,
  Expense: isValidExpense
};
var isValidItem = function isValidItem(item) {
  var isValid = validationFunctions[item.type];
  return isValid && isValid(item);
};