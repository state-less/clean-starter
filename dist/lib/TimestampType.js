"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _language = require("graphql/language");
var _graphql = require("graphql");
function serializeDate(value) {
  if (value instanceof Date) {
    return value.getTime();
  } else if (typeof value === 'number') {
    return Math.trunc(value);
  } else if (typeof value === 'string') {
    return Date.parse(value);
  }
  return null;
}
function parseDate(value) {
  if (value === null) {
    return null;
  }
  try {
    return new Date(value);
  } catch (err) {
    return null;
  }
}
function parseDateFromLiteral(ast) {
  if (ast.kind === _language.Kind.INT) {
    var num = parseInt(ast.value, 10);
    return new Date(num);
  } else if (ast.kind === _language.Kind.STRING) {
    return parseDate(ast.value);
  }
  return null;
}
var TimestampType = new _graphql.GraphQLScalarType({
  name: 'Timestamp',
  description: 'The javascript `Date` as integer. Type represents date and time ' + 'as number of milliseconds from start of UNIX epoch.',
  serialize: serializeDate,
  parseValue: parseDate,
  parseLiteral: parseDateFromLiteral
});
var _default = TimestampType;
exports["default"] = _default;