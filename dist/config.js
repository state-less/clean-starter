"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VAPID_PUBLIC = exports.VAPID_PRIVATE = exports.PORT = exports.PG_PASSWORD = exports.LOG_LEVEL = exports.JWT_SECRET = exports.FORUM_KEY = exports.ADMIN_EMAIL = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
_dotenv["default"].config();
var _process$env = process.env,
  LOG_LEVEL = _process$env.LOG_LEVEL,
  PORT = _process$env.PORT,
  _process$env$JWT_SECR = _process$env.JWT_SECRET,
  JWT_SECRET = _process$env$JWT_SECR === void 0 ? 'secret' : _process$env$JWT_SECR,
  PG_PASSWORD = _process$env.PG_PASSWORD,
  VAPID_PRIVATE = _process$env.VAPID_PRIVATE,
  VAPID_PUBLIC = _process$env.VAPID_PUBLIC,
  _process$env$FORUM_KE = _process$env.FORUM_KEY,
  FORUM_KEY = _process$env$FORUM_KE === void 0 ? 'my-forum' : _process$env$FORUM_KE,
  ADMIN_EMAIL = _process$env.ADMIN_EMAIL;
exports.ADMIN_EMAIL = ADMIN_EMAIL;
exports.FORUM_KEY = FORUM_KEY;
exports.VAPID_PUBLIC = VAPID_PUBLIC;
exports.VAPID_PRIVATE = VAPID_PRIVATE;
exports.PG_PASSWORD = PG_PASSWORD;
exports.JWT_SECRET = JWT_SECRET;
exports.PORT = PORT;
exports.LOG_LEVEL = LOG_LEVEL;