'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _graphql = require('graphql');

var scalars = {
  ID: _graphql.GraphQLID,
  Int: _graphql.GraphQLInt,
  String: _graphql.GraphQLString,
  Float: _graphql.GraphQLFloat,
  Boolean: _graphql.GraphQLBoolean
};

var modifiers = {
  '!': _graphql.GraphQLNonNull,
  ']': _graphql.GraphQLList
};

var resolveConcreteType = function resolveConcreteType(_ref) {
  var prefix = _ref.prefix,
      suffix = _ref.suffix,
      type = _ref.type;

  var invalidChars = [prefix.replace(/[[]/g, ''), suffix.replace(/[!\]]/g, '')].join('');

  if (invalidChars.length > 0) {
    throw new Error('invalid modifier character ' + invalidChars);
  }

  var wrapInModifier = function wrapInModifier(modifierType, char) {
    var ModifierType = modifiers[char];
    return new ModifierType(modifierType);
  };

  return suffix.split('').reduce(wrapInModifier, type);
};

var typiql = function typiql(strings) {
  var isScalar = (arguments.length <= 1 ? 0 : arguments.length - 1) === 0 && strings.length === 1;
  var isConcreteType = (arguments.length <= 1 ? 0 : arguments.length - 1) === 1 && strings.length === 2;

  if (isScalar) {
    var scalarName = strings[0].replace(/[[\]!]/g, '');
    var scalar = scalars[scalarName];
    if (scalar == null) {
      throw new Error('unrecognized scalar ' + scalarName);
    }
    // Call typiql again with the concrete type of the scalar

    var _strings$0$split = strings[0].split(/[^[\]!]+/g),
        _strings$0$split2 = _slicedToArray(_strings$0$split, 2),
        prefix = _strings$0$split2[0],
        suffix = _strings$0$split2[1];

    return resolveConcreteType({
      prefix: prefix,
      suffix: suffix,
      type: scalar
    });
  } else if (isConcreteType) {
    return resolveConcreteType({
      prefix: strings[0],
      suffix: strings[1],
      type: arguments.length <= 1 ? undefined : arguments[1]
    });
  }

  throw new Error('invalid template string format');
};

exports.default = typiql;
module.exports = exports['default'];
