"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isResponseTime = exports.isNumber = exports.hasLogCfg = exports.formatNumber = exports.formatLogCfg = void 0;
var isResponseTime = function isResponseTime(obj) {
  return obj && obj.req && obj.res && obj.time;
};
exports.isResponseTime = isResponseTime;
var hasLogCfg = function hasLogCfg(obj) {
  return obj && obj.LOG_LEVEL || obj.LOG_SCOPE || obj.LOG_FILTER;
};
exports.hasLogCfg = hasLogCfg;
var formatLogCfg = function formatLogCfg(obj) {
  return "LogConfig[".concat(JSON.stringify(obj), "]");
};
exports.formatLogCfg = formatLogCfg;
var isNumber = function isNumber(obj) {
  return typeof obj === 'number';
};
exports.isNumber = isNumber;
var formatNumber = function formatNumber(obj) {
  return "".concat(obj);
};
exports.formatNumber = formatNumber;