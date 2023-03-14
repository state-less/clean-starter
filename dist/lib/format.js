"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isResponseTime = exports.hasLogCfg = exports.formatResponseTime = exports.formatLogCfg = void 0;
var _chalk = _interopRequireDefault(require("chalk"));
var statusColors = {
  200: 'green',
  300: 'blue',
  400: 'orange',
  500: 'red'
};
var timingColors = {
  0: 'green',
  200: 'yellow',
  500: 'orange',
  1000: 'red'
};
var isResponseTime = function isResponseTime(obj) {
  return obj && obj.req && obj.res && obj.time;
};
exports.isResponseTime = isResponseTime;
var getRangeValue = function getRangeValue(obj) {
  return function (value, def) {
    var key = Object.keys(obj).reduce(function (acc, cur) {
      return value > cur ? cur : acc;
    });
    return obj[key] || def;
  };
};
var getStatusColor = getRangeValue(statusColors);
var getTimingColor = getRangeValue(timingColors);
var formatResponseTime = function formatResponseTime(obj) {
  var req = obj.req,
    res = obj.res,
    time = obj.time;
  var method = req.method,
    url = req.url;
  var statusCode = res.statusCode;
  var statusColor = getStatusColor(statusCode);
  if (statusColor) {
    statusCode = _chalk["default"][statusColor](statusCode);
  }
  var timingColor = getTimingColor(time);
  if (timingColor) {
    time = _chalk["default"][timingColor](time.toFixed(2));
  }
  return "".concat(statusCode, " ").concat(method, " ").concat(url, " - ").concat(time, "ms");
};
exports.formatResponseTime = formatResponseTime;
var hasLogCfg = function hasLogCfg(obj) {
  return obj && obj.LOG_LEVEL || obj.LOG_SCOPE || obj.LOG_FILTER;
};
exports.hasLogCfg = hasLogCfg;
var formatLogCfg = function formatLogCfg(obj) {
  return "LogConfig[".concat(JSON.stringify(obj), "]");
};
exports.formatLogCfg = formatLogCfg;