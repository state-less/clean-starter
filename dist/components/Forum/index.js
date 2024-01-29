"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Post = exports.Platform = exports.ForumPolicies = exports.Forum = exports.Answer = void 0;
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
var _ViewCounter = require("../ViewCounter");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var _excluded = ["id", "deleteAnswer"],
  _excluded2 = ["id", "deletePost", "approvePost"];
/* eslint-disable no-unused-vars */
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
  var _context$headers, _user10, _user10$strategies, _user10$strategies$us, _user11, _post$owner6, _user12, _post$owner7, _post$owner8, _post$owner8$strategi, _post$owner8$strategi2, _user13, _post$owner9, _post$owner9$strategi, _post$owner9$strategi2, _user14, _post$owner10, _post$owner10$strateg, _post$owner10$strateg2, _user15, _user16, _user16$strategies, _user16$strategies$us, _user17;
  var id = _ref3.id,
    deletePost = _ref3.deletePost,
    approvePost = _ref3.approvePost,
    initialPost = (0, _objectWithoutProperties2["default"])(_ref3, _excluded2);
  var context = _ref4.context,
    initiator = _ref4.initiator;
  var user = null;
  var clientId = (context === null || context === void 0 ? void 0 : (_context$headers = context.headers) === null || _context$headers === void 0 ? void 0 : _context$headers['x-unique-id']) || 'server';
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
    if (post.deleted) throw new Error('Cannot edit a deleted post');
    setPost(_objectSpread(_objectSpread({}, post), {}, {
      body: body
    }));
  };
  var del = function del(id) {
    setPost(_objectSpread(_objectSpread({}, post), {}, {
      deleted: true
    }));
    deletePost();
  };
  var approve = function approve() {
    setPost(_objectSpread(_objectSpread({}, post), {}, {
      approved: true
    }));
    approvePost();
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
  var isAdmin = _permissions.admins.includes((_user10 = user) === null || _user10 === void 0 ? void 0 : (_user10$strategies = _user10.strategies) === null || _user10$strategies === void 0 ? void 0 : (_user10$strategies$us = _user10$strategies[(_user11 = user) === null || _user11 === void 0 ? void 0 : _user11.strategy]) === null || _user10$strategies$us === void 0 ? void 0 : _user10$strategies$us.email);
  var isOwner = (post === null || post === void 0 ? void 0 : (_post$owner6 = post.owner) === null || _post$owner6 === void 0 ? void 0 : _post$owner6.id) === (((_user12 = user) === null || _user12 === void 0 ? void 0 : _user12.id) || clientId);
  var isApproved = post === null || post === void 0 ? void 0 : post.approved;
  var passProps = {
    approved: isApproved
  };
  if (isAdmin || isOwner || isApproved) {
    Object.assign(passProps, post);
  }
  return (0, _jsxRuntime.jsxs)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({
    id: id
  }, passProps), {}, {
    owner: {
      id: (_post$owner7 = post.owner) === null || _post$owner7 === void 0 ? void 0 : _post$owner7.id,
      name: (_post$owner8 = post.owner) === null || _post$owner8 === void 0 ? void 0 : (_post$owner8$strategi = _post$owner8.strategies) === null || _post$owner8$strategi === void 0 ? void 0 : (_post$owner8$strategi2 = _post$owner8$strategi[(_user13 = user) === null || _user13 === void 0 ? void 0 : _user13.strategy]) === null || _post$owner8$strategi2 === void 0 ? void 0 : _post$owner8$strategi2.decoded.name,
      picture: (_post$owner9 = post.owner) === null || _post$owner9 === void 0 ? void 0 : (_post$owner9$strategi = _post$owner9.strategies) === null || _post$owner9$strategi === void 0 ? void 0 : (_post$owner9$strategi2 = _post$owner9$strategi[(_user14 = user) === null || _user14 === void 0 ? void 0 : _user14.strategy]) === null || _post$owner9$strategi2 === void 0 ? void 0 : _post$owner9$strategi2.decoded.picture,
      email: (_post$owner10 = post.owner) === null || _post$owner10 === void 0 ? void 0 : (_post$owner10$strateg = _post$owner10.strategies) === null || _post$owner10$strateg === void 0 ? void 0 : (_post$owner10$strateg2 = _post$owner10$strateg[(_user15 = user) === null || _user15 === void 0 ? void 0 : _user15.strategy]) === null || _post$owner10$strateg2 === void 0 ? void 0 : _post$owner10$strateg2.email
    },
    del: del,
    deleted: post.deleted,
    approve: approve,
    createAnswer: createAnswer,
    canDelete:
    // post?.owner?.id === user?.id ||
    // Only admins can delete posts...
    // TODO: add policies to toggle owner deletion
    _permissions.admins.includes((_user16 = user) === null || _user16 === void 0 ? void 0 : (_user16$strategies = _user16.strategies) === null || _user16$strategies === void 0 ? void 0 : (_user16$strategies$us = _user16$strategies[(_user17 = user) === null || _user17 === void 0 ? void 0 : _user17.strategy]) === null || _user16$strategies$us === void 0 ? void 0 : _user16$strategies$us.email),
    setBody: setBody
    // TODO: Add renderWithoutEffects utility.
    ,
    viewCounter: (0, _reactServer.render)((0, _jsxRuntime.jsx)(_ViewCounter.ViewCounter, {}, "post-".concat(id, "-view-counter")), {
      clientProps: {},
      initiator: _reactServer.Initiator.RenderServer,
      context: null
    }, null),
    children: [(0, _jsxRuntime.jsx)(_Votings.Votings, {
      policies: [_Votings.VotingPolicies.SingleVote]
    }, "post-".concat(id, "-votings")), answers.filter(function (answer) {
      var _answer$owner, _user18;
      return !answer.deleted || ((_answer$owner = answer.owner) === null || _answer$owner === void 0 ? void 0 : _answer$owner.id) === ((_user18 = user) === null || _user18 === void 0 ? void 0 : _user18.id);
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
var ForumPolicies = /*#__PURE__*/function (ForumPolicies) {
  ForumPolicies["PostsNeedApproval"] = "PostsNeedApproval";
  return ForumPolicies;
}({});
exports.ForumPolicies = ForumPolicies;
var Forum = function Forum(_ref6, _ref7) {
  var _context$headers2;
  var id = _ref6.id,
    name = _ref6.name,
    policies = _ref6.policies;
  var key = _ref7.key,
    context = _ref7.context,
    clientProps = _ref7.clientProps;
  var user = null;
  var clientId = (context === null || context === void 0 ? void 0 : (_context$headers2 = context.headers) === null || _context$headers2 === void 0 ? void 0 : _context$headers2['x-unique-id']) || 'server';
  if ((0, _reactServer.isClientContext)(context)) try {
    user = (0, _reactServer.authenticate)(context.headers, _config.JWT_SECRET);
  } catch (e) {}
  var _useState9 = (0, _reactServer.useState)([], {
      key: 'posts',
      scope: id
    }),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    posts = _useState10[0],
    setPosts = _useState10[1];
  var createPost = function createPost(_ref8) {
    var title = _ref8.title,
      body = _ref8.body,
      tags = _ref8.tags;
    var post = {
      id: (0, _uuid.v4)(),
      title: title,
      body: body,
      tags: tags,
      deleted: false,
      approved: false,
      owner: user || {
        id: clientId
      }
    };
    setPosts([].concat((0, _toConsumableArray2["default"])(posts), [post]));
    return post;
  };
  var _deletePost = function deletePost(id) {
    var _owner$strategies, _owner$strategies$use, _user19, _user20, _user20$strategies, _user20$strategies$us, _user21, _user22, _user22$strategies, _user22$strategies$us, _user23;
    var deleted = posts.find(function (post) {
      return post.id === id;
    });
    var _ref9 = deleted || {},
      owner = _ref9.owner;
    if ((owner === null || owner === void 0 ? void 0 : (_owner$strategies = owner.strategies) === null || _owner$strategies === void 0 ? void 0 : (_owner$strategies$use = _owner$strategies[(_user19 = user) === null || _user19 === void 0 ? void 0 : _user19.strategy]) === null || _owner$strategies$use === void 0 ? void 0 : _owner$strategies$use.email) !== ((_user20 = user) === null || _user20 === void 0 ? void 0 : (_user20$strategies = _user20.strategies) === null || _user20$strategies === void 0 ? void 0 : (_user20$strategies$us = _user20$strategies[(_user21 = user) === null || _user21 === void 0 ? void 0 : _user21.strategy]) === null || _user20$strategies$us === void 0 ? void 0 : _user20$strategies$us.email) && !_permissions.admins.includes((_user22 = user) === null || _user22 === void 0 ? void 0 : (_user22$strategies = _user22.strategies) === null || _user22$strategies === void 0 ? void 0 : (_user22$strategies$us = _user22$strategies[(_user23 = user) === null || _user23 === void 0 ? void 0 : _user23.strategy]) === null || _user22$strategies$us === void 0 ? void 0 : _user22$strategies$us.email)) {
      throw new Error('Not an admin');
    }
    setPosts(posts.filter(function (post) {
      return post.id !== id;
    }).concat([_objectSpread(_objectSpread({}, deleted), {}, {
      deleted: true
    })]));
    return deleted;
  };
  var _approvePost = function approvePost(id) {
    var _user24, _user24$strategies, _user24$strategies$us, _user25;
    var post = posts.find(function (post) {
      return post.id === id;
    });
    if (!_permissions.admins.includes((_user24 = user) === null || _user24 === void 0 ? void 0 : (_user24$strategies = _user24.strategies) === null || _user24$strategies === void 0 ? void 0 : (_user24$strategies$us = _user24$strategies[(_user25 = user) === null || _user25 === void 0 ? void 0 : _user25.strategy]) === null || _user24$strategies$us === void 0 ? void 0 : _user24$strategies$us.email)) {
      throw new Error('Not an admin');
    }
    var newPosts = [_objectSpread(_objectSpread({}, post), {}, {
      approved: true
    })].concat(posts.filter(function (p) {
      return p.id !== id;
    }));
    setPosts(newPosts);
  };
  var filtered = posts.filter(function (post) {
    return !post.deleted;
  }).filter(function (post) {
    if (policies !== null && policies !== void 0 && policies.includes(ForumPolicies.PostsNeedApproval)) {
      var _post$owner11, _user26, _user27, _user27$strategies, _user27$strategies$us, _user28;
      return post.approved || (post === null || post === void 0 ? void 0 : (_post$owner11 = post.owner) === null || _post$owner11 === void 0 ? void 0 : _post$owner11.id) === (((_user26 = user) === null || _user26 === void 0 ? void 0 : _user26.id) || clientId) || _permissions.admins.includes((_user27 = user) === null || _user27 === void 0 ? void 0 : (_user27$strategies = _user27.strategies) === null || _user27$strategies === void 0 ? void 0 : (_user27$strategies$us = _user27$strategies[(_user28 = user) === null || _user28 === void 0 ? void 0 : _user28.strategy]) === null || _user27$strategies$us === void 0 ? void 0 : _user27$strategies$us.email);
    }
    return true;
  });
  var _ref10 = clientProps || {},
    _ref10$page = _ref10.page,
    page = _ref10$page === void 0 ? 1 : _ref10$page,
    _ref10$pageSize = _ref10.pageSize,
    pageSize = _ref10$pageSize === void 0 ? 25 : _ref10$pageSize,
    _ref10$compound = _ref10.compound,
    compound = _ref10$compound === void 0 ? false : _ref10$compound;
  var start = !compound ? (page - 1) * pageSize : 0;
  var end = page * pageSize;
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    id: id,
    name: name,
    createPost: createPost,
    deletePost: _deletePost,
    totalCount: filtered.length,
    page: page,
    children: filtered.slice(start, end).map(function (post) {
      return (0, _jsxRuntime.jsx)(Post, _objectSpread(_objectSpread({}, post), {}, {
        deletePost: function deletePost() {
          return _deletePost(post.id);
        },
        approvePost: function approvePost() {
          return _approvePost(post.id);
        }
      }), "post-".concat(post.id));
    })
  }, (0, _reactServer.clientKey)("forum-".concat(id, "-props"), context));
};
exports.Forum = Forum;
var Platform = function Platform() {
  var _useState11 = (0, _reactServer.useState)([], {
      key: 'forums',
      scope: 'platform'
    }),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    forums = _useState12[0],
    setForums = _useState12[1];
  var createForum = function createForum(_ref11) {
    var name = _ref11.name;
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