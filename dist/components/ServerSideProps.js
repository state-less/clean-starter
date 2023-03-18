"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerSideProps = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _excluded = ["children"];
var ServerSideProps = function ServerSideProps(props) {
  var children = props.children,
    rest = (0, _objectWithoutProperties2["default"])(props, _excluded);
  return {
    props: rest,
    children: children
  };
};
exports.ServerSideProps = ServerSideProps;