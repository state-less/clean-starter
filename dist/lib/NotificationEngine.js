"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTodoCompleted = exports.NotificationEngine = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _webPush = _interopRequireDefault(require("web-push"));
var _dateFns = require("date-fns");
var _jwtSimple = _interopRequireDefault(require("jwt-simple"));
var _config = require("../config");
var _templateObject, _templateObject2, _templateObject3, _templateObject4;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var itemTypeStateKeyMap = {
  Todo: 'todo',
  Counter: 'counter',
  Expense: 'expense'
};
var isTodoCompleted = function isTodoCompleted(todo) {
  var comp = todo.completed && (todo.reset === null || todo.lastModified + todo.reset > Date.now());
  return comp;
};
exports.isTodoCompleted = isTodoCompleted;
var checkTodo = function checkTodo(todo, client) {
  var _todo$lastNotified;
  var completed = isTodoCompleted(todo);
  var dueDate = todo.dueDate ? new Date(todo.dueDate) : new Date();
  var dueTime = todo.dueTime ? new Date(todo.dueTime) : null;
  if (!dueTime) return false;
  var sameDate = (0, _dateFns.format)(dueDate, 'dd.MM.yyyy') === (0, _dateFns.format)(new Date(), 'dd.MM.yyyy');
  var timeAtDueDate = new Date((0, _dateFns.getYear)(dueDate), (0, _dateFns.getMonth)(dueDate), (0, _dateFns.getDate)(dueDate), (0, _dateFns.getHours)(dueTime), (0, _dateFns.getMinutes)(dueTime), (0, _dateFns.getSeconds)(dueTime));
  var diff = (0, _dateFns.differenceInMinutes)(timeAtDueDate, new Date());
  var sameTime = diff > 0 && diff < 15;
  var lastNotifiedClient = (_todo$lastNotified = todo.lastNotified) === null || _todo$lastNotified === void 0 ? void 0 : _todo$lastNotified[client];
  var lastNotified = (0, _dateFns.differenceInMinutes)(new Date(lastNotifiedClient || 0), new Date());
  if (!completed && sameDate && sameTime && lastNotified < -15) {
    return true;
  }
};
var NotificationEngine = /*#__PURE__*/function () {
  function NotificationEngine(_ref) {
    var store = _ref.store,
      interval = _ref.interval,
      listsKey = _ref.listsKey,
      webpushKey = _ref.webpushKey,
      logger = _ref.logger;
    (0, _classCallCheck2["default"])(this, NotificationEngine);
    this._store = store;
    this._interval = interval;
    this._listsKey = listsKey;
    this._webpushKey = webpushKey;
    this._logger = logger;
    this._clients = [];
    this.loadStore();
  }
  (0, _createClass2["default"])(NotificationEngine, [{
    key: "loadStore",
    value: function loadStore() {
      var _this = this;
      if (!this._webpushKey) return;
      this._store.on('dehydrate', function () {
        try {
          var state = _this._store.getState(null, {
            key: 'subscribed',
            scope: "".concat(_this._webpushKey)
          });
          var subscribed = state.value || {};
          Object.entries(subscribed).forEach(function (_ref2) {
            var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
              clientId = _ref3[0],
              entry = _ref3[1];
            var sub = entry.sub,
              user = entry.user;
            _this.subscribe(clientId, user, sub);
          });
        } catch (e) {
          console.log(e);
        }
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(clientId, user, subscription) {
      this._clients.push({
        id: clientId,
        sub: subscription,
        user: user
      });
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(clientId, user) {
      this._clients = this._clients.filter(function (e) {
        return e.id !== clientId;
      });
    }
  }, {
    key: "run",
    value: function run() {
      var _this2 = this;
      this._logger.info(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["Running Notification Engine"])));
      var _iterator = _createForOfIteratorHelper(this._clients),
        _step;
      try {
        var _loop = function _loop() {
          var entry = _step.value;
          var sub = entry.sub,
            clientId = entry.id,
            user = entry.user;
          var state = _this2._store.getState(null, {
            key: 'state',
            scope: "".concat(_this2._listsKey, ".").concat((user === null || user === void 0 ? void 0 : user.id) || clientId)
          });
          var _state$value = state.value,
            lists = _state$value.lists,
            order = _state$value.order;
          _this2._logger.info(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["User has ", " lists."])), lists.length);
          lists.forEach(function (list) {
            var todos = _this2._store.getState(null, {
              key: 'todos',
              scope: "".concat("list-".concat(list.id), ".", (user === null || user === void 0 ? void 0 : user.id) || clientId)
            });
            console.log(clientId, 'User has ', todos.value.length, ' lists');
            todos.value.forEach(function (todo) {
              var stored = _this2._store.getState(null, {
                key: itemTypeStateKeyMap[todo.type] || 'todo',
                scope: "".concat(todo.id, ".").concat((user === null || user === void 0 ? void 0 : user.id) || clientId)
              });
              Object.assign(todo, stored.value);
              var token = _jwtSimple["default"].encode(user, _config.JWT_SECRET);
              if (checkTodo(stored.value, clientId)) {
                _this2.sendNotification(sub, {
                  token: token,
                  clientId: clientId,
                  id: stored.value.id,
                  actions: ['complete'],
                  title: stored.value.title,
                  body: "It's almost ".concat((0, _dateFns.format)(new Date(stored.value.dueTime), 'hh:mm'))
                });
                stored.value.lastNotified = _objectSpread(_objectSpread({}, stored.value.lastNotified), {}, (0, _defineProperty2["default"])({}, clientId, new Date().getTime()));
              }
            });
          });
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "sendNotification",
    value: function sendNotification(sub, body) {
      if (typeof body !== 'string') {
        body = JSON.stringify(body);
      }
      try {
        _webPush["default"].sendNotification(sub, body);
      } catch (e) {
        var client = this._clients.find(function (e) {
          return e.sub.endpoint === sub.endpoint;
        });
        this.unsubscribe(client.id, client.user);
        this._logger.error(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["Error sending notification: ", ""])), e);
      }
    }
  }, {
    key: "start",
    value: function start() {
      var _this3 = this;
      this._timeout = setInterval(function () {
        return _this3.run();
      }, this._interval);
      this._logger.info(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["Started Interval"])));
    }
  }]);
  return NotificationEngine;
}();
exports.NotificationEngine = NotificationEngine;