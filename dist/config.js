"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PORT = exports.LOG_LEVEL = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
_dotenv["default"].config();
var _process$env = process.env,
  LOG_LEVEL = _process$env.LOG_LEVEL,
  PORT = _process$env.PORT;
exports.PORT = PORT;
exports.LOG_LEVEL = LOG_LEVEL;