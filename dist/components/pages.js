"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pages = exports.Page = exports.DynamicPage = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _reactServer = require("@state-less/react-server");
var _uuid = require("uuid");
var _Navigation = require("./Navigation");
var _ServerSideProps = require("./ServerSideProps");
var _jsxRuntime = require("@state-less/react-server/dist/jsxRenderer/jsx-runtime");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var DynamicPage = function DynamicPage(props, _ref) {
  var clientProps = _ref.clientProps;
  var _useState = (0, _reactServer.useState)([], {
      key: 'pages',
      scope: _reactServer.Scopes.Client
    }),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 1),
    pages = _useState2[0];
  console.log('CLient Props', clientProps, pages);
  if (!(clientProps !== null && clientProps !== void 0 && clientProps.path)) {
    return (0, _jsxRuntime.jsx)(Page, {
      id: null,
      content: ['404'],
      path: "/404"
    });
  }
  var page = pages.find(function (p) {
    return p.path === clientProps.path;
  });
  if (!page) {
    return (0, _jsxRuntime.jsx)(Page, {
      id: null,
      content: ['404'],
      path: clientProps.path
    });
  }
  return (0, _jsxRuntime.jsx)(Page, _objectSpread({}, page));
};
exports.DynamicPage = DynamicPage;
var Page = function Page(_ref2) {
  var id = _ref2.id,
    content = _ref2.content,
    path = _ref2.path;
  var _useState3 = (0, _reactServer.useState)({
      id: id,
      content: content,
      path: path
    }, {
      key: "page".concat(id),
      scope: _reactServer.Scopes.Client
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    page = _useState4[0],
    setPage = _useState4[1];
  var setContent = function setContent(newContent) {
    setPage(_objectSpread(_objectSpread({}, page), {}, {
      content: newContent
    }));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, _objectSpread(_objectSpread({}, page), {}, {
    setContent: setContent
  }));
};
exports.Page = Page;
var Pages = function Pages() {
  var _useState5 = (0, _reactServer.useState)([], {
      key: 'pages',
      scope: _reactServer.Scopes.Client
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    pages = _useState6[0],
    setPages = _useState6[1];
  var addPage = function addPage(page) {
    var id = (0, _uuid.v4)();
    var newPage = _objectSpread(_objectSpread({}, page), {}, {
      id: id
    });
    if (pages.find(function (p) {
      return p.path === page.path;
    })) {
      throw new Error('Page already exists');
    }
    if (!(0, _Navigation.isValidPath)(newPage.path)) {
      throw new Error('Invalid path');
    }
    if (!isValidPage(newPage)) {
      throw new Error('Invalid page');
    }
    setPages([].concat((0, _toConsumableArray2["default"])(pages), [newPage]));
  };
  return (0, _jsxRuntime.jsx)(_ServerSideProps.ServerSideProps, {
    addPage: addPage,
    children: pages.map(function (page) {
      return (0, _jsxRuntime.jsx)(Page, _objectSpread({}, page));
    })
  });
};
exports.Pages = Pages;
var isValidPage = function isValidPage(page) {
  return page.id && page.path && page.content;
};