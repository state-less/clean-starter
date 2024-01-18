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
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
var _excluded = ["id"],
  _excluded2 = ["id"];
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
var Post = function Post(_ref2) {
  var id = _ref2.id,
    post = (0, _objectWithoutProperties2["default"])(_ref2, _excluded2);
  var _useState = (0, _reactServer.useState)([], {
      key: 'answers',
      scope: id
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    answers = _useState2[0],
    setAnswers = _useState2[1];
  var createAnswer = function createAnswer(_ref3) {
    var body = _ref3.body;
    var answer = {
      id: (0, _uuid.v4)(),
      body: body
    };
    setAnswers([].concat((0, _toConsumableArray2["default"])(answers), [answer]));
    return answer;
  };
  return (0, _jsxRuntime.jsxs)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, post), {}, {
    createAnswer: createAnswer,
    children: [(0, _jsxRuntime.jsx)(_Votings.Votings, {
      policies: [_Votings.VotingPolicies.SingleVote]
    }, "post-".concat(id, "-votings")), answers.map(function (answer) {
      return (0, _jsxRuntime.jsx)(Answer, _objectSpread({}, answer), "answer-".concat(answer.id));
    })]
  }), "post-".concat(id, "-props"));
};
exports.Post = Post;
var Forum = function Forum(_ref4) {
  var id = _ref4.id,
    name = _ref4.name;
  var _useState3 = (0, _reactServer.useState)([], {
      key: 'posts',
      scope: id
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    posts = _useState4[0],
    setPosts = _useState4[1];
  var createPost = function createPost(_ref5) {
    var title = _ref5.title,
      body = _ref5.body;
    var post = {
      id: (0, _uuid.v4)(),
      title: title,
      body: body
    };
    setPosts([].concat((0, _toConsumableArray2["default"])(posts), [post]));
    console.log('POST', post);
    return post;
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    id: id,
    name: name,
    createPost: createPost,
    children: posts.map(function (post) {
      return (0, _jsxRuntime.jsx)(Post, _objectSpread({}, post), 'post-' + post.id);
    })
  }, "forum-".concat(id, "-props"));
};
exports.Forum = Forum;
var Platform = function Platform() {
  var _useState5 = (0, _reactServer.useState)([], {
      key: 'forums',
      scope: 'platform'
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    forums = _useState6[0],
    setForums = _useState6[1];
  var createForum = function createForum(_ref6) {
    var name = _ref6.name;
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