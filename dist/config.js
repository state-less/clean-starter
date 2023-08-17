"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VAPID_PUBLIC = exports.VAPID_PRIVATE = exports.PORT = exports.LOG_LEVEL = exports.JWT_SECRET = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
_dotenv["default"].config();
var _process$env = process.env,
  LOG_LEVEL = _process$env.LOG_LEVEL,
  PORT = _process$env.PORT,
  _process$env$JWT_SECR = _process$env.JWT_SECRET,
  JWT_SECRET = _process$env$JWT_SECR === void 0 ? 'secret' : _process$env$JWT_SECR,
  VAPID_PRIVATE = _process$env.VAPID_PRIVATE,
  VAPID_PUBLIC = _process$env.VAPID_PUBLIC;
exports.VAPID_PUBLIC = VAPID_PUBLIC;
exports.VAPID_PRIVATE = VAPID_PRIVATE;
exports.JWT_SECRET = JWT_SECRET;
exports.PORT = PORT;
exports.LOG_LEVEL = LOG_LEVEL;