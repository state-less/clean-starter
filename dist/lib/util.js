"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLocalStorage = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _jotai = require("jotai");
var atoms = {};
var getInitialValue = function getInitialValue(key, initialValue, _ref) {
  var cookie = _ref.cookie;
  try {
    var item = window.localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    }
    if (cookie) {
      document.cookie = "".concat(cookie, "=").concat(initialValue);
    }
    return JSON.parse(item);
  } catch (error) {
    console.log(error);
    return initialValue;
  }
};
var useLocalStorage = function useLocalStorage(key, initialValue) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref2$cookie = _ref2.cookie,
    cookie = _ref2$cookie === void 0 ? null : _ref2$cookie;
  var keyAtom = atoms[key] || (atoms[key] = (0, _jotai.atom)(getInitialValue(key, initialValue, {
    cookie: cookie
  })));
  var _useAtom = (0, _jotai.useAtom)(keyAtom),
    _useAtom2 = (0, _slicedToArray2["default"])(_useAtom, 2),
    storedValue = _useAtom2[0],
    setStoredValue = _useAtom2[1];
  var setValue = function setValue(value) {
    try {
      var valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      if (cookie) {
        document.cookie = "".concat(cookie, "=").concat(valueToStore);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};
exports.useLocalStorage = useLocalStorage;