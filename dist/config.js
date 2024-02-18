"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VAPID_PUBLIC = exports.VAPID_PRIVATE = exports.PORT = exports.PG_PORT = exports.PG_PASSWORD = exports.LOG_LEVEL = exports.JWT_SECRET = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
_dotenv["default"].config();
var _process$env = process.env,
  LOG_LEVEL = _process$env.LOG_LEVEL,
  PORT = _process$env.PORT,
  _process$env$JWT_SECR = _process$env.JWT_SECRET,
  JWT_SECRET = _process$env$JWT_SECR === void 0 ? 'secret' : _process$env$JWT_SECR,
  PG_PASSWORD = _process$env.PG_PASSWORD,
  _process$env$PG_PORT = _process$env.PG_PORT,
  PG_PORT = _process$env$PG_PORT === void 0 ? 5433 : _process$env$PG_PORT,
  VAPID_PRIVATE = _process$env.VAPID_PRIVATE,
  VAPID_PUBLIC = _process$env.VAPID_PUBLIC;
exports.VAPID_PUBLIC = VAPID_PUBLIC;
exports.VAPID_PRIVATE = VAPID_PRIVATE;
exports.PG_PORT = PG_PORT;
exports.PG_PASSWORD = PG_PASSWORD;
exports.JWT_SECRET = JWT_SECRET;
exports.PORT = PORT;
exports.LOG_LEVEL = LOG_LEVEL;