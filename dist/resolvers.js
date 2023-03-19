"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _reactServer = require("@state-less/react-server");
var _reactServer2 = require("@state-less/react-server/dist/lib/reactServer");
var _instances = require("./instances");
var _TimestampType = _interopRequireDefault(require("./lib/TimestampType"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var generatePubSubKey = function generatePubSubKey(state) {
  return "".concat(state.key, ":").concat(state.scope);
};
var generateComponentPubSubKey = function generateComponentPubSubKey(state) {
  return "component::".concat(state.key);
};
var useState = function useState(parent, args) {
  var initialValue = args.initialValue,
    key = args.key,
    scope = args.scope;
  var state = _instances.store.getState(initialValue, {
    key: key,
    scope: scope
  });
  return _objectSpread({}, state);
};
var renderComponent = function renderComponent(parent, args, context) {
  var key = args.key,
    scope = args.scope,
    props = args.props;
  var component = _reactServer2.globalInstance.components.get(key);
  if (!component) {
    throw new Error('Component not found');
  }
  var rendered = (0, _reactServer.render)(component, context);
  return {
    rendered: rendered
  };
};
var setState = function setState(parent, args) {
  var scope = args.scope,
    value = args.value,
    key = args.key;
  var state = _instances.store.getState(null, {
    key: key,
    scope: scope
  });
  state.value = value;
  _instances.pubsub.publish(generatePubSubKey(state), {
    updateState: state
  });
  return _objectSpread({}, state);
};
var callFunction = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(parent, args, context) {
    var key, scope, prop, fnArgs, component, rendered, fn, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          key = args.key, scope = args.scope, prop = args.prop, fnArgs = args.args;
          component = _reactServer2.globalInstance.components.get(key);
          rendered = (0, _reactServer.render)(component, context);
          if (!rendered.props[prop]) {
            _context.next = 7;
            break;
          }
          fn = rendered.props[prop].fn;
          result = fn.apply(void 0, (0, _toConsumableArray2["default"])(fnArgs));
          return _context.abrupt("return", result);
        case 7:
          return _context.abrupt("return", {
            rendered: rendered
          });
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function callFunction(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var resolvers = {
  Query: {
    getState: useState,
    renderComponent: renderComponent
  },
  Mutation: {
    setState: setState,
    callFunction: callFunction
  },
  Subscription: {
    updateState: {
      subscribe: function subscribe(parent, args) {
        return _instances.pubsub.asyncIterator(generatePubSubKey(args));
      }
    },
    updateComponent: {
      subscribe: function subscribe(parent, args) {
        console.log('Subscribing to component', generateComponentPubSubKey(args));
        return _instances.pubsub.asyncIterator(generateComponentPubSubKey(args));
      }
    }
  },
  Components: {
    // eslint-disable-next-line no-underscore-dangle
    __resolveType: function __resolveType(obj) {
      // eslint-disable-next-line no-underscore-dangle
      return obj.__typename || null;
    }
  },
  Timestamp: _TimestampType["default"]
};
exports.resolvers = resolvers;