"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reactionsWhiteList = exports.Reactions = exports.ReactionPolicies = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var reactionsWhiteList = ['love', 'laugh', 'thumbs-up', 'thumbs-down'];
exports.reactionsWhiteList = reactionsWhiteList;
var ReactionPolicies = /*#__PURE__*/function (ReactionPolicies) {
  ReactionPolicies["SingleVote"] = "single-vote";
  return ReactionPolicies;
}({});
exports.ReactionPolicies = ReactionPolicies;
var Reactions = function Reactions(_ref, _ref2) {
  var _ref$policies = _ref.policies,
    policies = _ref$policies === void 0 ? [] : _ref$policies,
    _ref$values = _ref.values,
    values = _ref$values === void 0 ? [] : _ref$values;
  var context = _ref2.context,
    key = _ref2.key;
  var _useState = (0, _reactServer.useState)({}, {
      key: "votings",
      scope: key
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    reactions = _useState2[0],
    setReactions = _useState2[1];
  var _useState3 = (0, _reactServer.useState)(null, {
      key: "voted-".concat(key),
      scope: "".concat(key, "-").concat(_reactServer.Scopes.Client)
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    voted = _useState4[0],
    setVoted = _useState4[1];
  var react = function react(reactionKey) {
    if (!values.includes(reactionKey)) {
      throw new Error('Invalid reaction');
    }
    var newReactions;
    if (voted === reactionKey && policies.includes(ReactionPolicies.SingleVote)) {
      newReactions = _objectSpread(_objectSpread({}, reactions), {}, (0, _defineProperty2["default"])({}, reactionKey, Math.max(1, Number(reactions[reactionKey])) - 1));
      setVoted(null);
    } else {
      newReactions = _objectSpread(_objectSpread({}, reactions), {}, (0, _defineProperty2["default"])({}, reactionKey, (reactions[reactionKey] || 0) + 1));
      if (voted) {
        newReactions[voted] = Math.max(1, Number(newReactions[voted]) - 1);
      }
      setVoted(reactionKey);
    }
    setReactions(newReactions);
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    reactions: reactions,
    react: react,
    voted: voted,
    policies: policies
  }, (0, _reactServer.clientKey)("reactions-props-".concat(key), context));
};
exports.Reactions = Reactions;