"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Post = exports.Platform = exports.Forum = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _uuid = require("uuid");
var _ServerSideProps = require("../ServerSideProps");
var _Comments = require("../Comments");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var Post = function Post(_ref) {
  var id = _ref.id;
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    children: (0, _jsxRuntime.jsx)(_Comments.Comments, {
      id: id
    }, "post-".concat(id, "-comments"))
  });
};
exports.Post = Post;
var Forum = function Forum(_ref2) {
  var id = _ref2.id,
    name = _ref2.name;
  var _useState = (0, _reactServer.useState)([], {
      key: 'posts',
      scope: id
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    posts = _useState2[0],
    setPosts = _useState2[1];
  var createPost = function createPost(_ref3) {
    var title = _ref3.title,
      body = _ref3.body;
    var post = {
      id: (0, _uuid.v4)(),
      title: title,
      body: body
    };
    setPosts([].concat((0, _toConsumableArray2["default"])(posts), [post]));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    id: id,
    name: name,
    createPost: createPost,
    children: posts.map(function (post) {
      return (0, _jsxRuntime.jsx)(Post, _objectSpread({}, post));
    })
  }, "forum-".concat(id, "-props"));
};
exports.Forum = Forum;
var Platform = function Platform() {
  var _useState3 = (0, _reactServer.useState)([], {
      key: 'forums',
      scope: 'platform'
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    forums = _useState4[0],
    setForums = _useState4[1];
  var createForum = function createForum(_ref4) {
    var name = _ref4.name;
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