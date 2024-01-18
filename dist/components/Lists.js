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
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
  var _context$headers, _user, _user2, _ref5;
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
    note = _ref3.note,
    _changeType = _ref3.changeType,
    createdAt = _ref3.createdAt,
    color = _ref3.color,
    _ref3$dependencies = _ref3.dependencies,
    initialDependencies = _ref3$dependencies === void 0 ? [] : _ref3$dependencies;
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
      note: note,
      dueDate: dueDate,
      dueTime: dueTime,
      type: 'Todo',
      lastModified: lastModified,
      color: color,
      dependencies: initialDependencies
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
    points.setValue(points.value + (comp ? -todo.creditedValuePoints : valuePoints));
    return newTodo;
  };
  var archive = function archive() {
    if (todo.archived) return;
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      archived: true
    }));
    points.setValue(points.value + 1);
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
  var setNote = function setNote(note) {
    if (typeof note !== 'string' || note.length > 32000) {
      throw new Error('Invalid note');
    }
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      note: note
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
  var addDependency = function addDependency(dep) {
    if (!(dep !== null && dep !== void 0 && dep.id) || !(dep !== null && dep !== void 0 && dep.title)) {
      throw new Error('Invalid id');
    }
    if (todo.dependencies.some(function (a) {
      return a.id === dep.id;
    })) {
      return;
    }
    setTodo(_objectSpread(_objectSpread({}, todo), {}, {
      dependencies: [].concat((0, _toConsumableArray2["default"])(todo.dependencies || []), [dep])
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
    setNote: setNote,
    type: "Todo",
    createdAt: createdAt,
    lastModified: todo.lastModified,
    dependencies: (_ref5 = todo.dependencies || []) === null || _ref5 === void 0 ? void 0 : _ref5.map(function (dep) {
      var _user4;
      var state = store.getState(null, {
        key: 'todo',
        scope: "".concat(dep.id, ".").concat(((_user4 = user) === null || _user4 === void 0 ? void 0 : _user4.id) || clientId)
      });
      return state.value;
    }),
    addDependency: addDependency,
    children: (0, _jsxRuntime.jsx)(_ExpressServer.Route, {
      todo: todo,
      app: _instances.app,
      path: "/todos/".concat(id, "/toggle"),
      get: function get(req, res) {
        var todo = toggle();
        res.send(todo);
      },
      authenticate: function authenticate(req, res, next) {
        var _user5, _httpUser;
        var httpUser = null;
        try {
          // Authenticate the http request
          httpUser = (0, _reactServer.authenticate)(req.headers, _config.JWT_SECRET);
        } catch (e) {}
        // Make sure the client and user is the same as the one who rendered the component
        if (req.headers['x-unique-id'] !== clientId || ((_user5 = user) === null || _user5 === void 0 ? void 0 : _user5.id) !== ((_httpUser = httpUser) === null || _httpUser === void 0 ? void 0 : _httpUser.id)) {
          throw new Error('Unauthorized');
        }
        next();
      }
    }, "test")
  }), (0, _reactServer.clientKey)("".concat(id, "-todo"), context));
};
exports.Todo = Todo;
var Counter = function Counter(_ref6, _ref7) {
  var _context$headers2, _user6, _user7;
  var id = _ref6.id,
    _ref6$count = _ref6.count,
    count = _ref6$count === void 0 ? 0 : _ref6$count,
    title = _ref6.title,
    createdAt = _ref6.createdAt,
    archived = _ref6.archived,
    _ref6$reset = _ref6.reset,
    reset = _ref6$reset === void 0 ? null : _ref6$reset,
    _ref6$defaultValuePoi = _ref6.defaultValuePoints,
    defaultValuePoints = _ref6$defaultValuePoi === void 0 ? 0 : _ref6$defaultValuePoi,
    _ref6$valuePoints = _ref6.valuePoints,
    valuePoints = _ref6$valuePoints === void 0 ? defaultValuePoints : _ref6$valuePoints,
    _ref6$creditedValuePo = _ref6.creditedValuePoints,
    creditedValuePoints = _ref6$creditedValuePo === void 0 ? 0 : _ref6$creditedValuePo,
    _ref6$negativePoints = _ref6.negativePoints,
    negativePoints = _ref6$negativePoints === void 0 ? 0 : _ref6$negativePoints,
    _ref6$cost = _ref6.cost,
    cost = _ref6$cost === void 0 ? 0 : _ref6$cost,
    _ref6$dueDate = _ref6.dueDate,
    dueDate = _ref6$dueDate === void 0 ? null : _ref6$dueDate,
    color = _ref6.color,
    _changeType2 = _ref6.changeType;
  var key = _ref7.key,
    context = _ref7.context;
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
    scope: "".concat(((_user6 = user) === null || _user6 === void 0 ? void 0 : _user6.id) || clientId)
  });
  var _useState3 = (0, _reactServer.useState)({
      id: id,
      count: count,
      title: title,
      createdAt: createdAt,
      archived: archived,
      reset: reset,
      valuePoints: valuePoints,
      creditedValuePoints: creditedValuePoints,
      negativePoints: negativePoints,
      cost: cost,
      dueDate: dueDate,
      color: color,
      type: 'Counter'
    }, {
      key: "counter",
      scope: "".concat(key, ".").concat(((_user7 = user) === null || _user7 === void 0 ? void 0 : _user7.id) || _reactServer.Scopes.Client)
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
  var setCost = function setCost(cost) {
    if (typeof cost !== 'number') {
      throw new Error('Expected a number.');
    }
    setCounter(_objectSpread(_objectSpread({}, counter), {}, {
      cost: cost,
      lastModified: Date.now()
    }));
  };
  var setColor = function setColor(color) {
    if (typeof color !== 'string') {
      throw new Error('Invalid color');
    }
    setCounter(_objectSpread(_objectSpread({}, counter), {}, {
      color: color,
      lastModified: Date.now()
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, counter), {}, {
    archive: archive,
    increase: increase,
    decrease: decrease,
    setTitle: setTitle,
    setCost: setCost,
    setColor: setColor,
    changeType: function changeType(type) {
      return _changeType2(id, type);
    },
    type: "Counter"
  }), (0, _reactServer.clientKey)("".concat(id, "-counter"), context));
};
exports.Counter = Counter;
var Expense = function Expense(_ref8, _ref9) {
  var _user8;
  var id = _ref8.id,
    _ref8$value = _ref8.value,
    value = _ref8$value === void 0 ? 0 : _ref8$value,
    title = _ref8.title,
    archived = _ref8.archived,
    _ref8$reset = _ref8.reset,
    reset = _ref8$reset === void 0 ? null : _ref8$reset,
    _ref8$defaultValuePoi = _ref8.defaultValuePoints,
    defaultValuePoints = _ref8$defaultValuePoi === void 0 ? 0 : _ref8$defaultValuePoi,
    _ref8$valuePoints = _ref8.valuePoints,
    valuePoints = _ref8$valuePoints === void 0 ? defaultValuePoints : _ref8$valuePoints,
    _ref8$creditedValuePo = _ref8.creditedValuePoints,
    creditedValuePoints = _ref8$creditedValuePo === void 0 ? 0 : _ref8$creditedValuePo,
    _ref8$negativePoints = _ref8.negativePoints,
    negativePoints = _ref8$negativePoints === void 0 ? 0 : _ref8$negativePoints,
    _ref8$dueDate = _ref8.dueDate,
    dueDate = _ref8$dueDate === void 0 ? null : _ref8$dueDate,
    _changeType3 = _ref8.changeType;
  var key = _ref9.key,
    context = _ref9.context;
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
      scope: "".concat(key, ".").concat(((_user8 = user) === null || _user8 === void 0 ? void 0 : _user8.id) || _reactServer.Scopes.Client)
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
var List = function List(_ref10, _ref11) {
  var _context$headers3, _user9, _user10, _user11, _user12, _user13, _user14, _user15, _user16;
  var id = _ref10.id,
    initialTitle = _ref10.title,
    _ref10$todos = _ref10.todos,
    initialTodos = _ref10$todos === void 0 ? [] : _ref10$todos,
    initialOrder = _ref10.order,
    _ref10$archived = _ref10.archived,
    initialArchived = _ref10$archived === void 0 ? false : _ref10$archived,
    _ref10$color = _ref10.color,
    initialColor = _ref10$color === void 0 ? '' : _ref10$color,
    _ref10$points = _ref10.points,
    initialPoints = _ref10$points === void 0 ? 0 : _ref10$points,
    _ref10$labels = _ref10.labels,
    initialLabels = _ref10$labels === void 0 ? [] : _ref10$labels,
    initialSettings = _ref10.settings,
    createdAt = _ref10.createdAt;
  var key = _ref11.key,
    context = _ref11.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var store = _reactServer.Dispatcher.getCurrent().getStore();
  var clientId = (context === null || context === void 0 ? void 0 : (_context$headers3 = context.headers) === null || _context$headers3 === void 0 ? void 0 : _context$headers3['x-unique-id']) || 'server';
  var points = store.getState(initialPoints, {
    key: "points",
    scope: "".concat(((_user9 = user) === null || _user9 === void 0 ? void 0 : _user9.id) || clientId)
  });
  var _useState7 = (0, _reactServer.useState)(initialTodos, {
      key: 'todos',
      scope: "".concat(key, ".").concat(((_user10 = user) === null || _user10 === void 0 ? void 0 : _user10.id) || _reactServer.Scopes.Client)
    }),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    todos = _useState8[0],
    setTodos = _useState8[1];
  var _useState9 = (0, _reactServer.useState)(initialColor, {
      key: 'color',
      scope: "".concat(key, ".").concat(((_user11 = user) === null || _user11 === void 0 ? void 0 : _user11.id) || _reactServer.Scopes.Client)
    }),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    color = _useState10[0],
    _setColor = _useState10[1];
  var _useState11 = (0, _reactServer.useState)(initialArchived, {
      key: 'archived',
      scope: "".concat(key, ".").concat(((_user12 = user) === null || _user12 === void 0 ? void 0 : _user12.id) || _reactServer.Scopes.Client)
    }),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    archived = _useState12[0],
    setArchived = _useState12[1];
  var _useState13 = (0, _reactServer.useState)({
      defaultValuePoints: (initialSettings === null || initialSettings === void 0 ? void 0 : initialSettings.defaultValuePoints) || 0,
      pinned: (initialSettings === null || initialSettings === void 0 ? void 0 : initialSettings.pinned) || false,
      defaultType: (initialSettings === null || initialSettings === void 0 ? void 0 : initialSettings.defaultType) || 'Todo',
      startOfDay: (initialSettings === null || initialSettings === void 0 ? void 0 : initialSettings.startOfDay) || 6,
      endOfDay: (initialSettings === null || initialSettings === void 0 ? void 0 : initialSettings.endOfDay) || 22
    }, {
      key: 'settings',
      scope: "".concat(key, ".").concat(((_user13 = user) === null || _user13 === void 0 ? void 0 : _user13.id) || _reactServer.Scopes.Client)
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
      scope: "".concat(key, ".").concat(((_user14 = user) === null || _user14 === void 0 ? void 0 : _user14.id) || _reactServer.Scopes.Client)
    }),
    _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
    labels = _useState16[0],
    setLabels = _useState16[1];
  var _useState17 = (0, _reactServer.useState)(initialTitle, {
      key: 'title',
      scope: "".concat(key, ".").concat(((_user15 = user) === null || _user15 === void 0 ? void 0 : _user15.id) || _reactServer.Scopes.Client)
    }),
    _useState18 = (0, _slicedToArray2["default"])(_useState17, 2),
    title = _useState18[0],
    setTitle = _useState18[1];
  var _useState19 = (0, _reactServer.useState)(initialOrder, {
      key: 'order',
      scope: "".concat(key, ".").concat(((_user16 = user) === null || _user16 === void 0 ? void 0 : _user16.id) || _reactServer.Scopes.Client)
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
    setTodos(function (todos) {
      return [].concat((0, _toConsumableArray2["default"])(todos), [newItem]);
    });
    setOrder(function (order) {
      return [].concat((0, _toConsumableArray2["default"])(order), [todoId]);
    });
    points.setValue(points.value + 1);
    return newItem;
  };
  var removeEntry = function removeEntry(todoId) {
    var _user17, _todo$value, _todo$value2;
    var store = _reactServer.Dispatcher.getCurrent().getStore();
    var todo = store.getState(null, {
      key: "todo",
      scope: "".concat(todoId, ".").concat(((_user17 = user) === null || _user17 === void 0 ? void 0 : _user17.id) || _reactServer.Scopes.Client)
    });
    setOrder(function (order) {
      return order.filter(function (id) {
        return id !== todoId;
      });
    });
    setTodos(function (todos) {
      return todos.filter(function (todo) {
        return todo.id !== todoId;
      });
    });
    points.setValue(points.value - 1 - (todo !== null && todo !== void 0 && (_todo$value = todo.value) !== null && _todo$value !== void 0 && _todo$value.archived ? 1 : 0) - ((todo === null || todo === void 0 ? void 0 : (_todo$value2 = todo.value) === null || _todo$value2 === void 0 ? void 0 : _todo$value2.valuePoints) || 0));
    return todo.value;
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
    points.setValue(points.value + 1);
    return newLabel;
  };
  var removeLabel = function removeLabel(labelId) {
    setLabels(labels.filter(function (label) {
      return label.id !== labelId;
    }));
    points.setValue(points.value - 1);
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
  var recreate = function recreate() {
    var _iterator = _createForOfIteratorHelper(todos.filter(function (todo) {
        var _user18;
        var state = store.getState(null, {
          key: 'counter',
          scope: "".concat(todo.id, ".").concat(((_user18 = user) === null || _user18 === void 0 ? void 0 : _user18.id) || clientId)
        });
        return !state.value.archived && state.value.type === 'Counter';
      })),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _user19;
        var todo = _step.value;
        var state = store.getState(null, {
          key: 'counter',
          scope: "".concat(todo.id, ".").concat(((_user19 = user) === null || _user19 === void 0 ? void 0 : _user19.id) || clientId)
        });
        state.setValue(_objectSpread(_objectSpread({}, state.value), {}, {
          archived: +new Date()
        }));
        addEntry(_objectSpread(_objectSpread({}, todo), {}, {
          count: 0
        }));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
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
  var filtered = todos || [];
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
    recreate: recreate,
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
var exportData = function exportData(_ref12) {
  var key = _ref12.key,
    user = _ref12.user;
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
    var title = store.getState(null, {
      key: 'title',
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
      title: title.value,
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
var MyLists = function MyLists(_, _ref13) {
  var _context$headers4, _user20, _user21;
  var context = _ref13.context,
    key = _ref13.key;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var store = _reactServer.Dispatcher.getCurrent().getStore();
  var clientId = ((_context$headers4 = context.headers) === null || _context$headers4 === void 0 ? void 0 : _context$headers4['x-unique-id']) || 'server';
  var points = store.getState(null, {
    key: 'points',
    scope: "".concat(((_user20 = user) === null || _user20 === void 0 ? void 0 : _user20.id) || clientId)
  });
  var _useState21 = (0, _reactServer.useState)({
      lists: [],
      order: []
    }, {
      key: 'state',
      scope: "".concat(key, ".").concat(((_user21 = user) === null || _user21 === void 0 ? void 0 : _user21.id) || _reactServer.Scopes.Client)
    }),
    _useState22 = (0, _slicedToArray2["default"])(_useState21, 2),
    state = _useState22[0],
    setState = _useState22[1];
  var lists = state.lists,
    order = state.order;
  var addEntry = function addEntry(list) {
    var id = (0, _uuid.v4)();
    var newList = _objectSpread(_objectSpread({
      id: id
    }, list), {}, {
      order: [],
      settings: {
        defaultValuePoints: DEFAULT_VALUE_POINTS,
        defaultType: 'Todo',
        pinned: false
      },
      createdAt: Date.now()
    });
    var newLists = [newList].concat((0, _toConsumableArray2["default"])(state.lists));
    setState({
      order: [newList.id].concat((0, _toConsumableArray2["default"])(state.order)),
      lists: newLists
    });
  };
  var removeEntry = function removeEntry(id) {
    var removed = state.lists.find(function (list) {
      return list.id === id;
    });
    setState({
      lists: state.lists.filter(function (list) {
        return list.id !== id;
      }),
      order: state.order.filter(function (listId) {
        return listId !== id;
      })
    });
    return removed;
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
    var _ref14 = _jsonwebtoken["default"].verify(signed, _config.JWT_SECRET),
      order = _ref14.order,
      storedPoints = _ref14.points,
      iat = _ref14.iat,
      data = (0, _objectWithoutProperties2["default"])(_ref14, _excluded);
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
    points.setValue(storedPoints);
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
var MyListsMeta = function MyListsMeta(props, _ref15) {
  var _user22, _user23;
  var key = _ref15.key,
    context = _ref15.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState23 = (0, _reactServer.useState)(0, {
      key: "points",
      scope: "".concat(((_user22 = user) === null || _user22 === void 0 ? void 0 : _user22.id) || _reactServer.Scopes.Client)
    }),
    _useState24 = (0, _slicedToArray2["default"])(_useState23, 2),
    points = _useState24[0],
    setPoints = _useState24[1];
  var _useState25 = (0, _reactServer.useState)({}, {
      key: "lastCompleted",
      scope: "".concat(((_user23 = user) === null || _user23 === void 0 ? void 0 : _user23.id) || _reactServer.Scopes.Client)
    }),
    _useState26 = (0, _slicedToArray2["default"])(_useState25, 1),
    lastCompleted = _useState26[0];
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    points: points,
    lastCompleted: lastCompleted
  }, (0, _reactServer.clientKey)('my-lists-meta-props', context));
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