"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Votings = exports.VotingPolicies = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var VotingPolicies = /*#__PURE__*/function (VotingPolicies) {
  VotingPolicies["SingleVote"] = "single-vote";
  return VotingPolicies;
}({});
/* *
 * We use the wilson score to compute two bounds. One for the upvote proportion and one for the downvote proportion.
 * */
exports.VotingPolicies = VotingPolicies;
var wilsonScoreInterval = function wilsonScoreInterval(n, votes) {
  if (n === 0) return [0, 1]; // no votes yet

  var z = 1.96; // 95% probability
  var phat = 1 * votes / n;
  var left = phat + z * z / (2 * n);
  var right = z * Math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n);
  var leftBoundary = (left - right) / (1 + z * z / n);

  // We don't need the upper boundary of the score.
  var rightBoundary = (left + right) / (1 + z * z / n);
  return [leftBoundary, rightBoundary];
};
var Votings = function Votings(_ref, _ref2) {
  var _ref$scope = _ref.scope,
    scope = _ref$scope === void 0 ? _reactServer.Scopes.Global : _ref$scope,
    _ref$policies = _ref.policies,
    policies = _ref$policies === void 0 ? [] : _ref$policies;
  var context = _ref2.context,
    key = _ref2.key;
  var _useState = (0, _reactServer.useState)({
      title: 'Voting',
      upvotes: 0,
      downvotes: 0
    }, {
      key: "votings-".concat(key),
      scope: scope
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    voting = _useState2[0],
    setVoting = _useState2[1];
  var _useState3 = (0, _reactServer.useState)({
      upvote: [0, 0],
      downvote: [0, 0]
    }, {
      key: 'score',
      scope: scope
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    score = _useState4[0],
    setScore = _useState4[1];
  var _useState5 = (0, _reactServer.useState)(0, {
      key: "voted-".concat(key),
      scope: _reactServer.Scopes.Client
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    voted = _useState6[0],
    setVoted = _useState6[1];
  var storeWilsonScore = function storeWilsonScore(newVoting) {
    // We need to pass newVoting because variable in the scope will have an outdated value.
    var upvotes = newVoting.upvotes,
      downvotes = newVoting.downvotes;
    var upvoteScore = wilsonScoreInterval(upvotes + downvotes, upvotes);
    var downvoteScore = wilsonScoreInterval(upvotes + downvotes, downvotes);
    setScore({
      upvote: upvoteScore,
      downvote: downvoteScore
    });
  };
  var upvote = function upvote() {
    if (policies.includes(VotingPolicies.SingleVote) && voted === -1) {
      throw new Error('Already voted');
    }
    var newVoting;
    if (voted === 1 && policies.includes(VotingPolicies.SingleVote)) {
      newVoting = _objectSpread(_objectSpread({}, voting), {}, {
        upvotes: voting.upvotes - 1
      });
      setVoted(0);
    } else {
      newVoting = _objectSpread(_objectSpread({}, voting), {}, {
        upvotes: voting.upvotes + 1
      });
      setVoted(1);
    }
    setVoting(newVoting);
    storeWilsonScore(newVoting);
  };
  var downvote = function downvote() {
    if (policies.includes(VotingPolicies.SingleVote) && voted === 1) {
      throw new Error('Already voted');
    }
    var newVoting;
    if (voted === -1 && policies.includes(VotingPolicies.SingleVote)) {
      newVoting = _objectSpread(_objectSpread({}, voting), {}, {
        downvotes: voting.downvotes - 1
      });
      setVoted(0);
    } else {
      newVoting = _objectSpread(_objectSpread({}, voting), {}, {
        downvotes: voting.downvotes + 1
      });
      setVoted(-1);
    }
    setVoting(newVoting);
    storeWilsonScore(newVoting);
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, voting), {}, {
    upvote: upvote,
    downvote: downvote,
    score: score,
    voted: voted,
    policies: policies
  }), (0, _reactServer.clientKey)("poll-props-".concat(key), context));
};
exports.Votings = Votings;