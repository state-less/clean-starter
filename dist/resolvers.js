"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _reactServer = require("@state-less/react-server");
var _reactServer2 = require("@state-less/react-server/dist/lib/reactServer");
var _instances = require("./instances");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var generatePubSubKey = function generatePubSubKey(state) {
  return "".concat(state.key, ":").concat(state.scope);
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
var resolvers = {
  Query: {
    getState: useState,
    renderComponent: renderComponent
  },
  Mutation: {
    setState: setState
  },
  Subscription: {
    updateState: {
      subscribe: function subscribe(parent, args) {
        return _instances.pubsub.asyncIterator(generatePubSubKey(args));
      }
    }
  },
  Components: {
    // eslint-disable-next-line no-underscore-dangle
    __resolveType: function __resolveType(obj) {
      // eslint-disable-next-line no-underscore-dangle
      return obj.__typename || null;
    }
  }
};
exports.resolvers = resolvers;