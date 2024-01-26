"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Post = exports.Platform = exports.Forum = exports.Answer = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _reactServer = require("@state-less/react-server");
var _uuid = require("uuid");
var _ServerSideProps = require("../ServerSideProps");
var _Comments = require("../Comments");
var _Votings = require("../Votings");
var _permissions = require("../../lib/permissions");
var _config = require("../../config");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var _excluded = ["id", "deleteAnswer"],
  _excluded2 = ["id", "deletePost"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var Answer = function Answer(_ref, _ref2) {
  var _post$owner, _post$owner2, _post$owner2$strategi, _post$owner2$strategi2, _user, _post$owner3, _post$owner3$strategi, _post$owner3$strategi2, _user2, _post$owner4, _post$owner4$strategi, _post$owner4$strategi2, _user3, _post$owner5, _user4, _user5, _user5$strategies, _user5$strategies$use, _user6;
  var id = _ref.id,
    deleteAnswer = _ref.deleteAnswer,
    initialAnswer = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
  var context = _ref2.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState = (0, _reactServer.useState)(initialAnswer, {
      key: 'answer',
      scope: id
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    post = _useState2[0],
    setPost = _useState2[1];
  var _useState3 = (0, _reactServer.useState)(false, {
      key: 'deleted',
      scope: id
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    deleted = _useState4[0],
    setDeleted = _useState4[1];
  var setBody = function setBody(body) {
    if (typeof body !== 'string') throw new Error('Body must be a string');
    if (deleted) throw new Error('Cannot edit a deleted post');
    setPost(_objectSpread(_objectSpread({}, post), {}, {
      body: body
    }));
  };
  var del = function del(id) {
    setDeleted(true);
    deleteAnswer();
  };
  return (0, _jsxRuntime.jsxs)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, post), {}, {
    deleted: deleted,
    setBody: setBody,
    owner: {
      id: (_post$owner = post.owner) === null || _post$owner === void 0 ? void 0 : _post$owner.id,
      name: (_post$owner2 = post.owner) === null || _post$owner2 === void 0 ? void 0 : (_post$owner2$strategi = _post$owner2.strategies) === null || _post$owner2$strategi === void 0 ? void 0 : (_post$owner2$strategi2 = _post$owner2$strategi[(_user = user) === null || _user === void 0 ? void 0 : _user.strategy]) === null || _post$owner2$strategi2 === void 0 ? void 0 : _post$owner2$strategi2.decoded.name,
      picture: (_post$owner3 = post.owner) === null || _post$owner3 === void 0 ? void 0 : (_post$owner3$strategi = _post$owner3.strategies) === null || _post$owner3$strategi === void 0 ? void 0 : (_post$owner3$strategi2 = _post$owner3$strategi[(_user2 = user) === null || _user2 === void 0 ? void 0 : _user2.strategy]) === null || _post$owner3$strategi2 === void 0 ? void 0 : _post$owner3$strategi2.decoded.picture,
      email: (_post$owner4 = post.owner) === null || _post$owner4 === void 0 ? void 0 : (_post$owner4$strategi = _post$owner4.strategies) === null || _post$owner4$strategi === void 0 ? void 0 : (_post$owner4$strategi2 = _post$owner4$strategi[(_user3 = user) === null || _user3 === void 0 ? void 0 : _user3.strategy]) === null || _post$owner4$strategi2 === void 0 ? void 0 : _post$owner4$strategi2.email
    },
    del: del,
    canDelete: (post === null || post === void 0 ? void 0 : (_post$owner5 = post.owner) === null || _post$owner5 === void 0 ? void 0 : _post$owner5.id) === ((_user4 = user) === null || _user4 === void 0 ? void 0 : _user4.id) || _permissions.admins.includes((_user5 = user) === null || _user5 === void 0 ? void 0 : (_user5$strategies = _user5.strategies) === null || _user5$strategies === void 0 ? void 0 : (_user5$strategies$use = _user5$strategies[(_user6 = user) === null || _user6 === void 0 ? void 0 : _user6.strategy]) === null || _user5$strategies$use === void 0 ? void 0 : _user5$strategies$use.email),
    children: [(0, _jsxRuntime.jsx)(_Votings.Votings, {
      policies: [_Votings.VotingPolicies.SingleVote]
    }, "answer-".concat(id, "-votings")), (0, _jsxRuntime.jsx)(_Comments.Comments, {}, "answer-".concat(id, "-comments"))]
  }), "answer-".concat(id, "-props"));
};
exports.Answer = Answer;
var Post = function Post(_ref3, _ref4) {
  var _post$owner6, _post$owner7, _post$owner7$strategi, _post$owner7$strategi2, _user10, _post$owner8, _post$owner8$strategi, _post$owner8$strategi2, _user11, _post$owner9, _post$owner9$strategi, _post$owner9$strategi2, _user12, _user13, _user13$strategies, _user13$strategies$us, _user14;
  var id = _ref3.id,
    deletePost = _ref3.deletePost,
    initialPost = (0, _objectWithoutProperties2["default"])(_ref3, _excluded2);
  var context = _ref4.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState5 = (0, _reactServer.useState)(initialPost, {
      key: 'post',
      scope: id
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    post = _useState6[0],
    setPost = _useState6[1];
  var _useState7 = (0, _reactServer.useState)([], {
      key: 'answers',
      scope: id
    }),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    answers = _useState8[0],
    setAnswers = _useState8[1];
  var _useState9 = (0, _reactServer.useState)(false, {
      key: 'deleted',
      scope: id
    }),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    deleted = _useState10[0],
    setDeleted = _useState10[1];
  var createAnswer = function createAnswer(_ref5) {
    var body = _ref5.body;
    var answer = {
      id: (0, _uuid.v4)(),
      owner: user,
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
  var _deleteAnswer = function deleteAnswer(id) {
    var _deleted$owner, _user7, _user8, _user8$strategies, _user8$strategies$use, _user9;
    if (!answers.find(function (answer) {
      return answer.id === id;
    })) {
      throw new Error('Answer not found');
    }
    var deleted = answers.find(function (answer) {
      return answer.id === id;
    });
    var canDelete = (deleted === null || deleted === void 0 ? void 0 : (_deleted$owner = deleted.owner) === null || _deleted$owner === void 0 ? void 0 : _deleted$owner.id) === ((_user7 = user) === null || _user7 === void 0 ? void 0 : _user7.id) || _permissions.admins.includes((_user8 = user) === null || _user8 === void 0 ? void 0 : (_user8$strategies = _user8.strategies) === null || _user8$strategies === void 0 ? void 0 : (_user8$strategies$use = _user8$strategies[(_user9 = user) === null || _user9 === void 0 ? void 0 : _user9.strategy]) === null || _user8$strategies$use === void 0 ? void 0 : _user8$strategies$use.email);
    if (!canDelete) {
      throw new Error('Not authorized to delete this answer');
    }
    setAnswers(answers.filter(function (answer) {
      return answer.id !== id;
    }).concat([_objectSpread(_objectSpread({}, deleted), {}, {
      deleted: true
    })]));
  };
  return (0, _jsxRuntime.jsxs)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({
    id: id
  }, post), {}, {
    owner: {
      id: (_post$owner6 = post.owner) === null || _post$owner6 === void 0 ? void 0 : _post$owner6.id,
      name: (_post$owner7 = post.owner) === null || _post$owner7 === void 0 ? void 0 : (_post$owner7$strategi = _post$owner7.strategies) === null || _post$owner7$strategi === void 0 ? void 0 : (_post$owner7$strategi2 = _post$owner7$strategi[(_user10 = user) === null || _user10 === void 0 ? void 0 : _user10.strategy]) === null || _post$owner7$strategi2 === void 0 ? void 0 : _post$owner7$strategi2.decoded.name,
      picture: (_post$owner8 = post.owner) === null || _post$owner8 === void 0 ? void 0 : (_post$owner8$strategi = _post$owner8.strategies) === null || _post$owner8$strategi === void 0 ? void 0 : (_post$owner8$strategi2 = _post$owner8$strategi[(_user11 = user) === null || _user11 === void 0 ? void 0 : _user11.strategy]) === null || _post$owner8$strategi2 === void 0 ? void 0 : _post$owner8$strategi2.decoded.picture,
      email: (_post$owner9 = post.owner) === null || _post$owner9 === void 0 ? void 0 : (_post$owner9$strategi = _post$owner9.strategies) === null || _post$owner9$strategi === void 0 ? void 0 : (_post$owner9$strategi2 = _post$owner9$strategi[(_user12 = user) === null || _user12 === void 0 ? void 0 : _user12.strategy]) === null || _post$owner9$strategi2 === void 0 ? void 0 : _post$owner9$strategi2.email
    },
    del: del,
    deleted: deleted,
    createAnswer: createAnswer,
    canDelete:
    // post?.owner?.id === user?.id ||
    // Only admins can delete posts...
    // TODO: add policies to toggle owner deletion
    _permissions.admins.includes((_user13 = user) === null || _user13 === void 0 ? void 0 : (_user13$strategies = _user13.strategies) === null || _user13$strategies === void 0 ? void 0 : (_user13$strategies$us = _user13$strategies[(_user14 = user) === null || _user14 === void 0 ? void 0 : _user14.strategy]) === null || _user13$strategies$us === void 0 ? void 0 : _user13$strategies$us.email),
    setBody: setBody,
    children: [(0, _jsxRuntime.jsx)(_Votings.Votings, {
      policies: [_Votings.VotingPolicies.SingleVote]
    }, "post-".concat(id, "-votings")), answers.filter(function (answer) {
      var _answer$owner, _user15;
      return !answer.deleted || ((_answer$owner = answer.owner) === null || _answer$owner === void 0 ? void 0 : _answer$owner.id) === ((_user15 = user) === null || _user15 === void 0 ? void 0 : _user15.id);
    }).map(function (answer) {
      return (0, _jsxRuntime.jsx)(Answer, _objectSpread(_objectSpread({}, answer), {}, {
        deleteAnswer: function deleteAnswer() {
          return _deleteAnswer(answer.id);
        }
      }), "answer-".concat(answer.id));
    })]
  }), "post-".concat(id, "-props"));
};
exports.Post = Post;
var Forum = function Forum(_ref6, _ref7) {
  var id = _ref6.id,
    name = _ref6.name;
  var key = _ref7.key,
    context = _ref7.context;
  var user = null;
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState11 = (0, _reactServer.useState)([], {
      key: 'posts',
      scope: id
    }),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    posts = _useState12[0],
    setPosts = _useState12[1];
  var createPost = function createPost(_ref8) {
    var title = _ref8.title,
      body = _ref8.body;
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
    var _owner$strategies, _owner$strategies$use, _user16, _user17, _user17$strategies, _user17$strategies$us, _user18, _user19, _user19$strategies, _user19$strategies$us, _user20;
    var deleted = posts.find(function (post) {
      return post.id === id;
    });
    var _ref9 = deleted || {},
      owner = _ref9.owner;
    if ((owner === null || owner === void 0 ? void 0 : (_owner$strategies = owner.strategies) === null || _owner$strategies === void 0 ? void 0 : (_owner$strategies$use = _owner$strategies[(_user16 = user) === null || _user16 === void 0 ? void 0 : _user16.strategy]) === null || _owner$strategies$use === void 0 ? void 0 : _owner$strategies$use.email) !== ((_user17 = user) === null || _user17 === void 0 ? void 0 : (_user17$strategies = _user17.strategies) === null || _user17$strategies === void 0 ? void 0 : (_user17$strategies$us = _user17$strategies[(_user18 = user) === null || _user18 === void 0 ? void 0 : _user18.strategy]) === null || _user17$strategies$us === void 0 ? void 0 : _user17$strategies$us.email) && !_permissions.admins.includes((_user19 = user) === null || _user19 === void 0 ? void 0 : (_user19$strategies = _user19.strategies) === null || _user19$strategies === void 0 ? void 0 : (_user19$strategies$us = _user19$strategies[(_user20 = user) === null || _user20 === void 0 ? void 0 : _user20.strategy]) === null || _user19$strategies$us === void 0 ? void 0 : _user19$strategies$us.email)) {
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
  var _useState13 = (0, _reactServer.useState)([], {
      key: 'forums',
      scope: 'platform'
    }),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    forums = _useState14[0],
    setForums = _useState14[1];
  var createForum = function createForum(_ref10) {
    var name = _ref10.name;
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