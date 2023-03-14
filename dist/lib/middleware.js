"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToken = exports.getId = exports.authenticate = exports.ValidatePermission = void 0;
var _config = require("../config");
const jwt = require('jsonwebtoken');
var Strategies = /*#__PURE__*/function (Strategies) {
  Strategies["fingerprint"] = "fingerprint";
  return Strategies;
}(Strategies || {});
const ValidatePermission = (permissions, roles) => ({
  data
}) => {
  var _data$headers, _data$headers2, _data$headers2$Author;
  if (!(data !== null && data !== void 0 && (_data$headers = data.headers) !== null && _data$headers !== void 0 && _data$headers.Authorization) || !(data !== null && data !== void 0 && (_data$headers2 = data.headers) !== null && _data$headers2 !== void 0 && (_data$headers2$Author = _data$headers2.Authorization) !== null && _data$headers2$Author !== void 0 && _data$headers2$Author.includes('Bearer'))) {
    throw new Error('Not authorized');
  }
  const token = data.headers.Authorization.split(' ').pop();
  const decoded = jwt.verify(token, _config.SECRET);
  console.log('VALIDATE', JSON.stringify(decoded));
  for (const role of roles) {
    const roleObj = permissions[role];
    if (!roleObj) throw new Error(`Not authorized. Missing permission '${roles}'`);
    for (const identity of roleObj) {
      for (const strat in identity) {
        const fields = identity[Strategies[strat]];
        const allowed = Object.keys(fields).reduce((acc, field) => {
          const test = fields[field];
          if (test instanceof RegExp) return acc && decoded[strat] && test.test(decoded[strat][field]);
          return acc && decoded[strat] && decoded[strat][field] === fields[field];
        }, true);
        if (allowed) return decoded;
      }
    }
  }
  throw new Error(`Not authorized. Missing permission '${roles}'`);
};
exports.ValidatePermission = ValidatePermission;
const authenticate = ({
  data
}) => {
  var _data$headers3, _data$headers4, _data$headers4$Author;
  if (!(data !== null && data !== void 0 && (_data$headers3 = data.headers) !== null && _data$headers3 !== void 0 && _data$headers3.Authorization) || !(data !== null && data !== void 0 && (_data$headers4 = data.headers) !== null && _data$headers4 !== void 0 && (_data$headers4$Author = _data$headers4.Authorization) !== null && _data$headers4$Author !== void 0 && _data$headers4$Author.includes('Bearer'))) {
    throw new Error('Not authorized');
  }
  const token = data.headers.Authorization.split(' ').pop();
  return jwt.verify(token, _config.SECRET);
};
exports.authenticate = authenticate;
const getToken = ({
  data
}) => {
  try {
    var _data$headers5, _data$headers5$Author;
    const token = data === null || data === void 0 ? void 0 : (_data$headers5 = data.headers) === null || _data$headers5 === void 0 ? void 0 : (_data$headers5$Author = _data$headers5.Authorization) === null || _data$headers5$Author === void 0 ? void 0 : _data$headers5$Author.split(' ').pop();
    return jwt.verify(token, _config.SECRET);
  } catch (e) {
    return null;
  }
};
exports.getToken = getToken;
const getId = jwt => {
  var _jwt$google, _jwt$google2, _jwt$webauthn, _jwt$webauthn2, _jwt$fingerprint, _jwt$fingerprint2, _jwt$address;
  if (!jwt) return null;
  if (jwt.compound) return jwt.compound.id;
  if (jwt !== null && jwt !== void 0 && (_jwt$google = jwt.google) !== null && _jwt$google !== void 0 && _jwt$google.email) return jwt === null || jwt === void 0 ? void 0 : (_jwt$google2 = jwt.google) === null || _jwt$google2 === void 0 ? void 0 : _jwt$google2.email;
  if (jwt !== null && jwt !== void 0 && (_jwt$webauthn = jwt.webauthn) !== null && _jwt$webauthn !== void 0 && _jwt$webauthn.keyId) return jwt === null || jwt === void 0 ? void 0 : (_jwt$webauthn2 = jwt.webauthn) === null || _jwt$webauthn2 === void 0 ? void 0 : _jwt$webauthn2.keyId;
  if (jwt !== null && jwt !== void 0 && (_jwt$fingerprint = jwt.fingerprint) !== null && _jwt$fingerprint !== void 0 && _jwt$fingerprint.visitorId) return jwt === null || jwt === void 0 ? void 0 : (_jwt$fingerprint2 = jwt.fingerprint) === null || _jwt$fingerprint2 === void 0 ? void 0 : _jwt$fingerprint2.visitorId;
  return jwt === null || jwt === void 0 ? void 0 : (_jwt$address = jwt.address) === null || _jwt$address === void 0 ? void 0 : _jwt$address.id;
};
exports.getId = getId;