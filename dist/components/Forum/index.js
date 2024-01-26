"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Post = exports.Platform = exports.Forum = exports.Answer = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _reactServer = require("@state-less/react-server");
var _uuid = require("uuid");
var _ServerSideProps = require("../ServerSideProps");
var _Comments = require("../Comments");
var _Votings = require("../Votings");
var _permissions = require("../../lib/permissions");
var _config = require("../../config");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var _excluded = ["id"],
  _excluded2 = ["id", "deletePost"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var Answer = function Answer(_ref) {
  var id = _ref.id,
    post = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
  return (0, _jsxRuntime.jsxs)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, post), {}, {
    children: [(0, _jsxRuntime.jsx)(_Votings.Votings, {
      policies: [_Votings.VotingPolicies.SingleVote]
    }, "answer-".concat(id, "-votings")), (0, _jsxRuntime.jsx)(_Comments.Comments, {}, "answer-".concat(id, "-comments"))]
  }), "answer-".concat(id, "-props"));
};
exports.Answer = Answer;
var Post = function Post(_ref2, _ref3) {
  var _post$owner, _post$owner2, _post$owner2$strategi, _post$owner2$strategi2, _user, _post$owner3, _post$owner3$strategi, _post$owner3$strategi2, _user2, _post$owner4, _post$owner4$strategi, _post$owner4$strategi2, _user3, _post$owner5, _user4, _user5, _user5$strategies, _user5$strategies$use, _user6;
  var id = _ref2.id,
    deletePost = _ref2.deletePost,
    initialPost = (0, _objectWithoutProperties2["default"])(_ref2, _excluded2);
  var context = _ref3.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState = (0, _reactServer.useState)(initialPost, {
      key: 'post',
      scope: id
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    post = _useState2[0],
    setPost = _useState2[1];
  var _useState3 = (0, _reactServer.useState)([], {
      key: 'answers',
      scope: id
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    answers = _useState4[0],
    setAnswers = _useState4[1];
  var _useState5 = (0, _reactServer.useState)(false, {
      key: 'deleted',
      scope: id
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    deleted = _useState6[0],
    setDeleted = _useState6[1];
  var createAnswer = function createAnswer(_ref4) {
    var body = _ref4.body;
    var answer = {
      id: (0, _uuid.v4)(),
      body: body
    };
    setAnswers([].concat((0, _toConsumableArray2["default"])(answers), [answer]));
    return answer;
  };
  var setBody = function setBody(body) {
    if (typeof body !== 'string') throw new Error('Body must be a string');
    if (deleted) throw new Error('Cannot edit a deleted post');
    setPost(_objectSpread(_objectSpread({}, post), {}, {
      body: body
    }));
  };
  var del = function del(id) {
    setDeleted(true);
    deletePost();
  };
  return (0, _jsxRuntime.jsxs)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({
    id: id
  }, post), {}, {
    owner: {
      id: (_post$owner = post.owner) === null || _post$owner === void 0 ? void 0 : _post$owner.id,
      name: (_post$owner2 = post.owner) === null || _post$owner2 === void 0 ? void 0 : (_post$owner2$strategi = _post$owner2.strategies) === null || _post$owner2$strategi === void 0 ? void 0 : (_post$owner2$strategi2 = _post$owner2$strategi[(_user = user) === null || _user === void 0 ? void 0 : _user.strategy]) === null || _post$owner2$strategi2 === void 0 ? void 0 : _post$owner2$strategi2.decoded.name,
      picture: (_post$owner3 = post.owner) === null || _post$owner3 === void 0 ? void 0 : (_post$owner3$strategi = _post$owner3.strategies) === null || _post$owner3$strategi === void 0 ? void 0 : (_post$owner3$strategi2 = _post$owner3$strategi[(_user2 = user) === null || _user2 === void 0 ? void 0 : _user2.strategy]) === null || _post$owner3$strategi2 === void 0 ? void 0 : _post$owner3$strategi2.decoded.picture,
      email: (_post$owner4 = post.owner) === null || _post$owner4 === void 0 ? void 0 : (_post$owner4$strategi = _post$owner4.strategies) === null || _post$owner4$strategi === void 0 ? void 0 : (_post$owner4$strategi2 = _post$owner4$strategi[(_user3 = user) === null || _user3 === void 0 ? void 0 : _user3.strategy]) === null || _post$owner4$strategi2 === void 0 ? void 0 : _post$owner4$strategi2.email
    },
    del: del,
    deleted: deleted,
    createAnswer: createAnswer,
    canDelete: (post === null || post === void 0 ? void 0 : (_post$owner5 = post.owner) === null || _post$owner5 === void 0 ? void 0 : _post$owner5.id) === ((_user4 = user) === null || _user4 === void 0 ? void 0 : _user4.id) || _permissions.admins.includes((_user5 = user) === null || _user5 === void 0 ? void 0 : (_user5$strategies = _user5.strategies) === null || _user5$strategies === void 0 ? void 0 : (_user5$strategies$use = _user5$strategies[(_user6 = user) === null || _user6 === void 0 ? void 0 : _user6.strategy]) === null || _user5$strategies$use === void 0 ? void 0 : _user5$strategies$use.email),
    setBody: setBody,
    children: [(0, _jsxRuntime.jsx)(_Votings.Votings, {
      policies: [_Votings.VotingPolicies.SingleVote]
    }, "post-".concat(id, "-votings")), answers.map(function (answer) {
      return (0, _jsxRuntime.jsx)(Answer, _objectSpread({}, answer), "answer-".concat(answer.id));
    })]
  }), "post-".concat(id, "-props"));
};
exports.Post = Post;
var Forum = function Forum(_ref5, _ref6) {
  var id = _ref5.id,
    name = _ref5.name;
  var key = _ref6.key,
    context = _ref6.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState7 = (0, _reactServer.useState)([], {
      key: 'posts',
      scope: id
    }),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    posts = _useState8[0],
    setPosts = _useState8[1];
  var createPost = function createPost(_ref7) {
    var title = _ref7.title,
      body = _ref7.body;
    var post = {
      id: (0, _uuid.v4)(),
      title: title,
      body: body,
      owner: user
    };
    setPosts([].concat((0, _toConsumableArray2["default"])(posts), [post]));
    return post;
  };
  var _deletePost = function deletePost(id) {
    var _owner$strategies, _owner$strategies$use, _user7, _user8, _user8$strategies, _user8$strategies$use, _user9, _user10, _user10$strategies, _user10$strategies$us, _user11;
    var deleted = posts.find(function (post) {
      return post.id === id;
    });
    var _ref8 = deleted || {},
      owner = _ref8.owner;
    if ((owner === null || owner === void 0 ? void 0 : (_owner$strategies = owner.strategies) === null || _owner$strategies === void 0 ? void 0 : (_owner$strategies$use = _owner$strategies[(_user7 = user) === null || _user7 === void 0 ? void 0 : _user7.strategy]) === null || _owner$strategies$use === void 0 ? void 0 : _owner$strategies$use.email) !== ((_user8 = user) === null || _user8 === void 0 ? void 0 : (_user8$strategies = _user8.strategies) === null || _user8$strategies === void 0 ? void 0 : (_user8$strategies$use = _user8$strategies[(_user9 = user) === null || _user9 === void 0 ? void 0 : _user9.strategy]) === null || _user8$strategies$use === void 0 ? void 0 : _user8$strategies$use.email) && !_permissions.admins.includes((_user10 = user) === null || _user10 === void 0 ? void 0 : (_user10$strategies = _user10.strategies) === null || _user10$strategies === void 0 ? void 0 : (_user10$strategies$us = _user10$strategies[(_user11 = user) === null || _user11 === void 0 ? void 0 : _user11.strategy]) === null || _user10$strategies$us === void 0 ? void 0 : _user10$strategies$us.email)) {
      throw new Error('Not an admin');
    }
    setPosts(posts.filter(function (post) {
      return post.id !== id;
    }).concat([_objectSpread(_objectSpread({}, deleted), {}, {
      deleted: true
    })]));
    return deleted;
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    id: id,
    name: name,
    createPost: createPost,
    deletePost: _deletePost,
    children: posts.filter(function (post) {
      return !post.deleted;
    }).map(function (post) {
      return (0, _jsxRuntime.jsx)(Post, _objectSpread(_objectSpread({}, post), {}, {
        deletePost: function deletePost() {
          return _deletePost(post.id);
        }
      }), 'post-' + post.id);
    })
  }, "forum-".concat(id, "-props"));
};
exports.Forum = Forum;
var Platform = function Platform() {
  var _useState9 = (0, _reactServer.useState)([], {
      key: 'forums',
      scope: 'platform'
    }),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    forums = _useState10[0],
    setForums = _useState10[1];
  var createForum = function createForum(_ref9) {
    var name = _ref9.name;
    var forum = {
      id: (0, _uuid.v4)(),
      name: name
    };
    setForums([].concat((0, _toConsumableArray2["default"])(forums), [forum]));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    createForum: createForum,
    children: forums.map(function (forum) {
      return (0, _jsxRuntime.jsx)(Forum, _objectSpread({}, forum));
    })
  });
};
exports.Platform = Platform;