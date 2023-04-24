"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comments = exports.CommentPolicies = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _config = require("../config");
var _ServerSideProps = require("./ServerSideProps");
var _permissions = require("../lib/permissions");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var CommentPolicies = /*#__PURE__*/function (CommentPolicies) {
  CommentPolicies[CommentPolicies["Authenticate"] = 0] = "Authenticate";
  CommentPolicies[CommentPolicies["AuthenticateRead"] = 1] = "AuthenticateRead";
  CommentPolicies[CommentPolicies["Delete"] = 2] = "Delete";
  return CommentPolicies;
}({});
exports.CommentPolicies = CommentPolicies;
var Comments = function Comments(_ref, _ref2) {
  var _user5, _user6, _user6$strategies, _user6$strategies$use, _user7;
  var _ref$policies = _ref.policies,
    policies = _ref$policies === void 0 ? [] : _ref$policies;
  var context = _ref2.context;
  if ((0, _reactServer.isClientContext)(context) && policies.includes(CommentPolicies.AuthenticateRead)) (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  var user;
  try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {
    user = null;
  }
  var _useState = (0, _reactServer.useState)([], {
      key: "comments",
      scope: _reactServer.Scopes.Component
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    comments = _useState2[0],
    setComments = _useState2[1];
  var comment = function comment(message) {
    var _decoded, _decoded$strategies;
    var decoded = null;
    try {
      decoded = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
    } catch (e) {
      decoded = null;
    }
    if (policies.includes(CommentPolicies.Authenticate)) {
      if (!decoded) {
        throw new Error('Not authenticated');
      }
    }
    if (!message) throw new Error('Message is required');
    var _ref3 = decoded || {
        strategy: 'anonymous'
      },
      strategy = _ref3.strategy;
    var _ref4 = ((_decoded = decoded) === null || _decoded === void 0 ? void 0 : (_decoded$strategies = _decoded.strategies) === null || _decoded$strategies === void 0 ? void 0 : _decoded$strategies[strategy]) || {
        email: null,
        decoded: {
          name: 'Anonymous',
          picture: null
        }
      },
      email = _ref4.email,
      _ref4$decoded = _ref4.decoded,
      name = _ref4$decoded.name,
      picture = _ref4$decoded.picture;
    var commentObj = {
      message: message,
      identity: {
        id: context.headers['x-unique-id'],
        email: email,
        strategy: strategy,
        name: name,
        picture: picture
      }
    };
    var newComments = [].concat((0, _toConsumableArray2["default"])(comments), [commentObj]);
    setComments(newComments);
  };
  var del = function del(index) {
    var _user, _user$strategies, _user$strategies$user, _user2, _user3, _user3$strategies, _user3$strategies$use, _user4;
    var commentToDelete = comments[index];
    if (!commentToDelete) throw new Error('Comment not found');
    var isOwnComment = commentToDelete.identity.email === ((_user = user) === null || _user === void 0 ? void 0 : (_user$strategies = _user.strategies) === null || _user$strategies === void 0 ? void 0 : (_user$strategies$user = _user$strategies[(_user2 = user) === null || _user2 === void 0 ? void 0 : _user2.strategy]) === null || _user$strategies$user === void 0 ? void 0 : _user$strategies$user.email) || commentToDelete.identity.id === context.headers['x-unique-id'] && commentToDelete.identity.strategy === 'anonymous';
    if (!isOwnComment && !_permissions.admins.includes((_user3 = user) === null || _user3 === void 0 ? void 0 : (_user3$strategies = _user3.strategies) === null || _user3$strategies === void 0 ? void 0 : (_user3$strategies$use = _user3$strategies[(_user4 = user) === null || _user4 === void 0 ? void 0 : _user4.strategy]) === null || _user3$strategies$use === void 0 ? void 0 : _user3$strategies$use.email)) {
      throw new Error('Not an admin');
    }
    var newComments = (0, _toConsumableArray2["default"])(comments);
    newComments.splice(index, 1);
    setComments(newComments);
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    permissions: {
      comment: policies.includes(CommentPolicies.Authenticate) ? !!((_user5 = user) !== null && _user5 !== void 0 && _user5.id) : true,
      "delete": _permissions.admins.includes((_user6 = user) === null || _user6 === void 0 ? void 0 : (_user6$strategies = _user6.strategies) === null || _user6$strategies === void 0 ? void 0 : (_user6$strategies$use = _user6$strategies[(_user7 = user) === null || _user7 === void 0 ? void 0 : _user7.strategy]) === null || _user6$strategies$use === void 0 ? void 0 : _user6$strategies$use.email)
    },
    comments: comments,
    comment: comment,
    del: del
  }, "comments-props");
};
exports.Comments = Comments;