"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Votings = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var Votings = function Votings() {
  var _useState = (0, _reactServer.useState)({
      title: 'Voting',
      upvotes: 0,
      downvotes: 0
    }, {
      key: 'votings',
      scope: _reactServer.Scopes.Global
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    voting = _useState2[0],
    setVoting = _useState2[1];
  var _useState3 = (0, _reactServer.useState)({
      leftBound: 0,
      rightBound: 0
    }, {
      key: 'score',
      scope: _reactServer.Scopes.Global
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    score = _useState4[0],
    setScore = _useState4[1];
  var upvote = function upvote() {
    setVoting(_objectSpread(_objectSpread({}, voting), {}, {
      upvotes: voting.upvotes + 1
    }));
  };
  var downvote = function downvote() {
    setVoting(_objectSpread(_objectSpread({}, voting), {}, {
      downvotes: voting.downvotes + 1
    }));
  };
  var wilsonScoreInterval = function wilsonScoreInterval() {
    var upvotes = voting.upvotes,
      downvotes = voting.downvotes;
    var n = upvotes + downvotes;
    if (n === 0) return 0; // no votes yet

    var z = 1.96; // 95% probability
    var phat = 1 * upvotes / n;
    var left = phat + z * z / (2 * n);
    var right = z * Math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n);
    var leftBoundary = (left - right) / (1 + z * z / n);
    var rightBoundary = (left + right) / (1 + z * z / n);
    setScore({
      leftBound: leftBoundary,
      rightBound: rightBoundary
    });
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, voting), {}, {
    upvote: upvote,
    downvote: downvote,
    score: score,
    wilsonScoreInterval: wilsonScoreInterval
  }), "votings-props");
};
exports.Votings = Votings;