'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _l0g = require("l0g");
var _Color = require("l0g/formatters/Color");
var _ConsoleTransport = require("l0g/transports/ConsoleTransport");
var _ReloadConfigFeature = require("l0g/features/ReloadConfigFeature");
var _format = require("./format");
var _require = require('../../package.json'),
  packageName = _require.name;
var features = [];

/** The logger can watch the .env file to reload environment variables
 * This allows you to change the LOG_LEVEL SCOPE or FILTER during a debug session without restarting the process.
 * Applying a regex to the log levels helps a lot in scenarios where you can't use a debugger and can't restart the process.
 */
if (process.env.LOG_WATCH === 'true') {
  var reloadConfigFeature = new _ReloadConfigFeature.ReloadConfigFeature();
  features.push(reloadConfigFeature);
}

/**
 * Defines how specific objects are formatted. You can then log the entire object and it will be formatted by the formatter
 * This allows you to format objects in a way that's quickly recognizable.
 * If you need additional information during a debug session you can change the output for an object here and don't need to change the log calls.
 */
var formatMap = new Map([[_format.hasLogCfg, _format.formatLogCfg]].concat((0, _toConsumableArray2["default"])(_Color.Color.formatMap)));
var formatter = new _Color.Color(function (options) {
  var ts = options.ts,
    level = options.level,
    scope = options.scope,
    message = options.message;
  return "".concat(ts, " ").concat(scope, " ").concat(level, ": ").concat(message);
}, {
  formatMap: formatMap,
  chalkLevel: 3
});

/** Set the color for the notice level to yellow */
_Color.Color.colors.key.level.notice = 'yellow';

/** Define the used transports */
var transports = [new _ConsoleTransport.ConsoleTransport({
  formatter: formatter
})
/** Uncomment the line to output a log file */
// new FileTransport(`${packageName}.log`, { formatter: Formatter }),
];

/** Create the base logger instance. With a default LOG_LEVEL of 'debug' if no environment variable is present */
var logger = new _l0g.Logger('debug', {
  transports: transports,
  features: features
}).scope(packageName);
_l0g.Logger.scope = /.*/;

/** Export default logger instance */
var _default = logger;
exports["default"] = _default;