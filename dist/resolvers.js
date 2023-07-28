"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.generatePubSubKey = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _reactServer = require("@state-less/react-server");
var _reactServer2 = require("@state-less/react-server/dist/lib/reactServer");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _axios = _interopRequireDefault(require("axios"));
var _jwksRsa = _interopRequireDefault(require("jwks-rsa"));
var _instances = require("./instances");
var _TimestampType = _interopRequireDefault(require("./lib/TimestampType"));
var _config = require("./config");
var _logger = _interopRequireDefault(require("./lib/logger"));
var _templateObject, _templateObject2, _templateObject3;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var AuthStrategy = /*#__PURE__*/function (AuthStrategy) {
  AuthStrategy["Google"] = "google";
  return AuthStrategy;
}(AuthStrategy || {});
var authenticateGoogle = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var accessToken, idToken, decoded;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          accessToken = _ref.accessToken, idToken = _ref.idToken;
          _context.prev = 1;
          _context.next = 4;
          return verifyGoogleSignature(accessToken);
        case 4:
          _context.next = 10;
          break;
        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](1);
          console.log('Error verifying signature', _context.t0.message);
          throw _context.t0;
        case 10:
          _context.next = 12;
          return decodeGoogleToken(idToken);
        case 12:
          decoded = _context.sent;
          return _context.abrupt("return", {
            id: decoded.sub,
            email: decoded.email,
            token: idToken,
            decoded: decoded
          });
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 6]]);
  }));
  return function authenticateGoogle(_x) {
    return _ref2.apply(this, arguments);
  };
}();
var generatePubSubKey = function generatePubSubKey(state) {
  return "".concat(state.key, ":").concat(state.scope);
};
exports.generatePubSubKey = generatePubSubKey;
var generateComponentPubSubKey = function generateComponentPubSubKey(state) {
  return "component::".concat(state.id, "::").concat(state.key);
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
var lastClientProps = {};
var renderedComponents = {};
var unmountComponent = function unmountComponent(parent, args, context) {
  var key = args.key;
  var cleanup = _reactServer.Dispatcher.getCurrent().getCleanupFns((0, _reactServer.clientKey)(key, context));
  console.log('Unmounting', key, cleanup === null || cleanup === void 0 ? void 0 : cleanup.length);
  var len = (cleanup === null || cleanup === void 0 ? void 0 : cleanup.length) || 0;
  cleanup.forEach(function (fn) {
    return fn();
  });
  return len;
};
var mountComponent = function mountComponent(parent, args, context) {
  var key = args.key,
    props = args.props;
  console.log('Mountint', key);
  var component = _reactServer2.globalInstance.components.get(key);
  try {
    _logger["default"].log(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["Rendering compoenent ", " ."])), key);
    var rendered = (0, _reactServer.render)(component, {
      clientProps: props,
      context: context,
      initiator: _reactServer.Initiator.Mount
    });
    return true;
  } catch (e) {
    console.log('Error mounting component', e);
    throw e;
  }
};
var renderComponent = function renderComponent(parent, args, context) {
  var key = args.key,
    props = args.props;
  lastClientProps[(0, _reactServer.clientKey)(key, context)] = props;
  var component = _reactServer2.globalInstance.components.get(key);
  renderedComponents[(0, _reactServer.clientKey)('components-', context)] = renderedComponents[(0, _reactServer.clientKey)('components-', context)] || [];
  renderedComponents[(0, _reactServer.clientKey)('components-', context)].push(key);
  if (!component) {
    throw new Error('Component not found');
  }
  try {
    _logger["default"].log(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["Rendering compoenent ", " ."])), key);
    var rendered = (0, _reactServer.render)(component, {
      clientProps: props,
      context: context,
      initiator: _reactServer.Initiator.RenderClient
    });
    return {
      rendered: rendered
    };
  } catch (e) {
    console.log('Error rendering component', e);
    throw e;
  }
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
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(parent, args, context) {
    var key, prop, fnArgs, component, clientProps, rendered, fn, start, result, end;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          key = args.key, prop = args.prop, fnArgs = args.args;
          component = _reactServer2.globalInstance.components.get(key);
          clientProps = lastClientProps[(0, _reactServer.clientKey)(key, context)];
          rendered = (0, _reactServer.render)(component, {
            context: context,
            clientProps: clientProps,
            initiator: _reactServer.Initiator.FunctionCall
          });
          if (!rendered.props[prop]) {
            _context2.next = 13;
            break;
          }
          fn = rendered.props[prop].fn;
          _reactServer.Dispatcher.getCurrent().addCurrentComponent(component);
          start = Date.now();
          result = fn.apply(void 0, (0, _toConsumableArray2["default"])(fnArgs));
          end = Date.now();
          console.log('Function call took', end - start, 'ms');
          _reactServer.Dispatcher.getCurrent().popCurrentComponent();
          return _context2.abrupt("return", result);
        case 13:
          return _context2.abrupt("return", {
            rendered: rendered
          });
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function callFunction(_x2, _x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
var verifyGoogleSignature = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(token) {
    var response;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _axios["default"].get("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=".concat(token));
        case 3:
          response = _context3.sent;
          if (!response.data.error) {
            _context3.next = 6;
            break;
          }
          throw new Error(response.data.error);
        case 6:
          return _context3.abrupt("return", response.data);
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          throw new Error("Error verifying google signature: ".concat(_context3.t0.message || _context3.t0.toString()));
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function verifyGoogleSignature(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
var strategies = (0, _defineProperty2["default"])({}, AuthStrategy.Google, authenticateGoogle);
var decodeGoogleToken = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(token) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", new Promise(function (resolve, reject) {
            var client = (0, _jwksRsa["default"])({
              jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
            });

            // Find the key that matches the key ID in the JWT token header
            _jsonwebtoken["default"].verify(token, function (header, callback) {
              client.getSigningKey(header.kid, function (err, key) {
                var signingKey = key.publicKey || key.rsaPublicKey;
                callback(null, signingKey);
              });
            }, {}, function (err, decoded) {
              if (err) {
                reject(err);
              }
              resolve(decoded);
            });
          }));
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function decodeGoogleToken(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
var authenticate = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(parent, args) {
    var strategy, data, auth, id, payload;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          strategy = args.strategy, data = args.data;
          if (strategies[strategy]) {
            _context5.next = 3;
            break;
          }
          throw new Error('Invalid strategy');
        case 3:
          _context5.next = 5;
          return strategies[strategy](data);
        case 5:
          auth = _context5.sent;
          if (isValidAuthResponse(auth)) {
            _context5.next = 8;
            break;
          }
          throw new Error('Invalid auth response');
        case 8:
          id = "".concat(strategy, ":").concat(auth.id);
          payload = {
            id: id,
            strategy: strategy,
            strategies: (0, _defineProperty2["default"])({}, strategy, auth)
          };
          return _context5.abrupt("return", _objectSpread(_objectSpread({}, payload), {}, {
            token: _jsonwebtoken["default"].sign(payload, _config.JWT_SECRET)
          }));
        case 11:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function authenticate(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();
var isValidAuthResponse = function isValidAuthResponse(auth) {
  return auth && auth.id && auth.token;
};
var resolvers = {
  Query: {
    getState: useState,
    renderComponent: renderComponent,
    unmountComponent: unmountComponent,
    mountComponent: mountComponent
  },
  Mutation: {
    setState: setState,
    callFunction: callFunction,
    authenticate: authenticate
  },
  Subscription: {
    updateState: {
      subscribe: function subscribe(parent, args) {
        return _instances.pubsub.asyncIterator(generatePubSubKey(args));
      }
    },
    updateComponent: {
      subscribe: function subscribe(parent, args) {
        _logger["default"].log(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["Subscribing to component ", ""])), generateComponentPubSubKey(args));
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