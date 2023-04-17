"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comments = exports.CommentActions = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _config = require("../config");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var CommentActions = /*#__PURE__*/function (CommentActions) {
  CommentActions[CommentActions["Authenticate"] = 0] = "Authenticate";
  CommentActions[CommentActions["Delete"] = 1] = "Delete";
  return CommentActions;
}({});
exports.CommentActions = CommentActions;
var Comments = function Comments(_ref, _ref2) {
  var _ref$policies = _ref.policies,
    policies = _ref$policies === void 0 ? [] : _ref$policies;
  var context = _ref2.context;
  if ((0, _reactServer.isClientContext)(context) && policies.includes(CommentActions.Authenticate)) (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  var _useState = (0, _reactServer.useState)([], {
      key: "comments",
      scope: _reactServer.Scopes.Component
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    comments = _useState2[0],
    setComments = _useState2[1];
  var comment = function comment(message) {
    var decoded;
    if (policies.includes(CommentActions.Authenticate)) {
      decoded = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
    }
    var _decoded = decoded,
      strategy = _decoded.strategy;
    var email = decoded.strategies[strategy].email;
    var commentObj = {
      message: message,
      identity: {
        email: email,
        strategy: strategy,
        name: decoded.strategies[strategy].decoded.name,
        picture: decoded.strategies[strategy].decoded.picture
      }
    };
    var newComments = [].concat((0, _toConsumableArray2["default"])(comments), [commentObj]);
    setComments(newComments);
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    comments: comments,
    comment: comment
  }, "comments-props");
};
exports.Comments = Comments;