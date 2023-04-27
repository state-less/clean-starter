"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PollActions = exports.Poll = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _config = require("../config");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var PollActions = /*#__PURE__*/function (PollActions) {
  PollActions[PollActions["Authenticate"] = 0] = "Authenticate";
  PollActions[PollActions["Revert"] = 1] = "Revert";
  return PollActions;
}({});
exports.PollActions = PollActions;
var Poll = function Poll(_ref, _ref2) {
  var values = _ref.values,
    _ref$policies = _ref.policies,
    policies = _ref$policies === void 0 ? [] : _ref$policies;
  var context = _ref2.context,
    key = _ref2.key;
  if ((0, _reactServer.isClientContext)(context) && policies.includes(PollActions.Authenticate)) (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  var _useState = (0, _reactServer.useState)(values.map(function () {
      return 0;
    }), {
      key: "votes-".concat(key),
      scope: 'global'
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    votes = _useState2[0],
    setVotes = _useState2[1];
  var _useState3 = (0, _reactServer.useState)(-1, {
      key: "voted-".concat(key),
      scope: _reactServer.Scopes.Client
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    voted = _useState4[0],
    setVoted = _useState4[1];
  var unvote = function unvote(index) {
    if (voted !== index) {
      throw new Error('Already voted');
    }
    var newVotes = (0, _toConsumableArray2["default"])(votes);
    newVotes[index] -= 1;
    setVotes(newVotes);
    setVoted(-1);
  };
  var vote = function vote(index) {
    if (voted === index && policies.includes(PollActions.Revert)) {
      unvote(index);
      return;
    }
    if (voted !== -1) {
      throw new Error('Already voted');
    }
    var newVotes = (0, _toConsumableArray2["default"])(votes);
    newVotes[index] += 1;
    setVotes(newVotes);
    setVoted(index);
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    votes: votes,
    values: values,
    voted: voted,
    vote: vote
  }, (0, _reactServer.clientKey)("poll-props-".concat(key), context));
};
exports.Poll = Poll;