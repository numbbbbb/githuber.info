
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("forbeslindesay-is-browser/client.js", Function("exports, require, module",
"module.exports = true;//@ sourceURL=forbeslindesay-is-browser/client.js"
));
require.register("component-stack/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `stack()`.\n\
 */\n\
\n\
module.exports = stack;\n\
\n\
/**\n\
 * Return the stack.\n\
 *\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
function stack() {\n\
  var orig = Error.prepareStackTrace;\n\
  Error.prepareStackTrace = function(_, stack){ return stack; };\n\
  var err = new Error;\n\
  Error.captureStackTrace(err, arguments.callee);\n\
  var stack = err.stack;\n\
  Error.prepareStackTrace = orig;\n\
  return stack;\n\
}//@ sourceURL=component-stack/index.js"
));
require.register("jkroso-type/index.js", Function("exports, require, module",
"\n\
var toString = {}.toString\n\
var DomNode = typeof window != 'undefined'\n\
  ? window.Node\n\
  : Function\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = exports = function(x){\n\
  var type = typeof x\n\
  if (type != 'object') return type\n\
  type = types[toString.call(x)]\n\
  if (type) return type\n\
  if (x instanceof DomNode) switch (x.nodeType) {\n\
    case 1:  return 'element'\n\
    case 3:  return 'text-node'\n\
    case 9:  return 'document'\n\
    case 11: return 'document-fragment'\n\
    default: return 'dom-node'\n\
  }\n\
}\n\
\n\
var types = exports.types = {\n\
  '[object Function]': 'function',\n\
  '[object Date]': 'date',\n\
  '[object RegExp]': 'regexp',\n\
  '[object Arguments]': 'arguments',\n\
  '[object Array]': 'array',\n\
  '[object String]': 'string',\n\
  '[object Null]': 'null',\n\
  '[object Undefined]': 'undefined',\n\
  '[object Number]': 'number',\n\
  '[object Boolean]': 'boolean',\n\
  '[object Object]': 'object',\n\
  '[object Text]': 'text-node',\n\
  '[object Uint8Array]': 'bit-array',\n\
  '[object Uint16Array]': 'bit-array',\n\
  '[object Uint32Array]': 'bit-array',\n\
  '[object Uint8ClampedArray]': 'bit-array',\n\
  '[object Error]': 'error',\n\
  '[object FormData]': 'form-data',\n\
  '[object File]': 'file',\n\
  '[object Blob]': 'blob'\n\
}\n\
//@ sourceURL=jkroso-type/index.js"
));
require.register("jkroso-equals/index.js", Function("exports, require, module",
"\n\
var type = require('type')\n\
\n\
// (any, any, [array]) -> boolean\n\
function equals(a, b, memos){\n\
  // All identical values are equivalent\n\
  if (a === b) return true\n\
  var fnA = types[type(a)]\n\
  var fnB = types[type(b)]\n\
  return fnA && fnA === fnB\n\
    ? fnA(a, b, memos)\n\
    : false\n\
}\n\
\n\
var types = {}\n\
\n\
// (Number) -> boolean\n\
types.number = function(a){\n\
  // NaN check\n\
  return a !== a\n\
}\n\
\n\
// (function, function, array) -> boolean\n\
types['function'] = function(a, b, memos){\n\
  return a.toString() === b.toString()\n\
    // Functions can act as objects\n\
    && types.object(a, b, memos)\n\
    && equals(a.prototype, b.prototype)\n\
}\n\
\n\
// (date, date) -> boolean\n\
types.date = function(a, b){\n\
  return +a === +b\n\
}\n\
\n\
// (regexp, regexp) -> boolean\n\
types.regexp = function(a, b){\n\
  return a.toString() === b.toString()\n\
}\n\
\n\
// (DOMElement, DOMElement) -> boolean\n\
types.element = function(a, b){\n\
  return a.outerHTML === b.outerHTML\n\
}\n\
\n\
// (textnode, textnode) -> boolean\n\
types.textnode = function(a, b){\n\
  return a.textContent === b.textContent\n\
}\n\
\n\
// decorate `fn` to prevent it re-checking objects\n\
// (function) -> function\n\
function memoGaurd(fn){\n\
  return function(a, b, memos){\n\
    if (!memos) return fn(a, b, [])\n\
    var i = memos.length, memo\n\
    while (memo = memos[--i]) {\n\
      if (memo[0] === a && memo[1] === b) return true\n\
    }\n\
    return fn(a, b, memos)\n\
  }\n\
}\n\
\n\
types['arguments'] =\n\
types.array = memoGaurd(compareArrays)\n\
\n\
// (array, array, array) -> boolean\n\
function compareArrays(a, b, memos){\n\
  var i = a.length\n\
  if (i !== b.length) return false\n\
  memos.push([a, b])\n\
  while (i--) {\n\
    if (!equals(a[i], b[i], memos)) return false\n\
  }\n\
  return true\n\
}\n\
\n\
types.object = memoGaurd(compareObjects)\n\
\n\
// (object, object, array) -> boolean\n\
function compareObjects(a, b, memos) {\n\
  var ka = getEnumerableProperties(a)\n\
  var kb = getEnumerableProperties(b)\n\
  var i = ka.length\n\
\n\
  // same number of properties\n\
  if (i !== kb.length) return false\n\
\n\
  // although not necessarily the same order\n\
  ka.sort()\n\
  kb.sort()\n\
\n\
  // cheap key test\n\
  while (i--) if (ka[i] !== kb[i]) return false\n\
\n\
  // remember\n\
  memos.push([a, b])\n\
\n\
  // iterate again this time doing a thorough check\n\
  i = ka.length\n\
  while (i--) {\n\
    var key = ka[i]\n\
    if (!equals(a[key], b[key], memos)) return false\n\
  }\n\
\n\
  return true\n\
}\n\
\n\
// (object) -> array\n\
function getEnumerableProperties (object) {\n\
  var result = []\n\
  for (var k in object) if (k !== 'constructor') {\n\
    result.push(k)\n\
  }\n\
  return result\n\
}\n\
\n\
/**\n\
 * assert all values are equal\n\
 *\n\
 * @param {Any} [...]\n\
 * @return {Boolean}\n\
 */\n\
\n\
function allEqual(){\n\
  var i = arguments.length - 1\n\
  while (i > 0) {\n\
    if (!equals(arguments[i], arguments[--i])) return false\n\
  }\n\
  return true\n\
}\n\
\n\
/**\n\
 * expose equals\n\
 */\n\
\n\
module.exports = allEqual\n\
allEqual.compare = equals\n\
//@ sourceURL=jkroso-equals/index.js"
));
require.register("yields-fmt/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Export `fmt`\n\
 */\n\
\n\
module.exports = fmt;\n\
\n\
/**\n\
 * Formatters\n\
 */\n\
\n\
fmt.o = JSON.stringify;\n\
fmt.s = String;\n\
fmt.d = parseInt;\n\
\n\
/**\n\
 * Format the given `str`.\n\
 *\n\
 * @param {String} str\n\
 * @param {...} args\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
function fmt(str){\n\
  var args = [].slice.call(arguments, 1);\n\
  var j = 0;\n\
\n\
  return str.replace(/%([a-z])/gi, function(_, f){\n\
    return fmt[f]\n\
      ? fmt[f](args[j++])\n\
      : _ + f;\n\
  });\n\
}\n\
//@ sourceURL=yields-fmt/index.js"
));
require.register("component-assert/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var equals = require('equals');\n\
var fmt = require('fmt');\n\
var stack = require('stack');\n\
\n\
/**\n\
 * Assert `expr` with optional failure `msg`.\n\
 *\n\
 * @param {Mixed} expr\n\
 * @param {String} [msg]\n\
 * @api public\n\
 */\n\
\n\
module.exports = exports = function (expr, msg) {\n\
  if (expr) return;\n\
  throw new Error(msg || message());\n\
};\n\
\n\
/**\n\
 * Assert `actual` is weak equal to `expected`.\n\
 *\n\
 * @param {Mixed} actual\n\
 * @param {Mixed} expected\n\
 * @param {String} [msg]\n\
 * @api public\n\
 */\n\
\n\
exports.equal = function (actual, expected, msg) {\n\
  if (actual == expected) return;\n\
  throw new Error(msg || fmt('Expected %o to equal %o.', actual, expected));\n\
};\n\
\n\
/**\n\
 * Assert `actual` is not weak equal to `expected`.\n\
 *\n\
 * @param {Mixed} actual\n\
 * @param {Mixed} expected\n\
 * @param {String} [msg]\n\
 * @api public\n\
 */\n\
\n\
exports.notEqual = function (actual, expected, msg) {\n\
  if (actual != expected) return;\n\
  throw new Error(msg || fmt('Expected %o not to equal %o.', actual, expected));\n\
};\n\
\n\
/**\n\
 * Assert `actual` is deep equal to `expected`.\n\
 *\n\
 * @param {Mixed} actual\n\
 * @param {Mixed} expected\n\
 * @param {String} [msg]\n\
 * @api public\n\
 */\n\
\n\
exports.deepEqual = function (actual, expected, msg) {\n\
  if (equals(actual, expected)) return;\n\
  throw new Error(msg || fmt('Expected %o to deeply equal %o.', actual, expected));\n\
};\n\
\n\
/**\n\
 * Assert `actual` is not deep equal to `expected`.\n\
 *\n\
 * @param {Mixed} actual\n\
 * @param {Mixed} expected\n\
 * @param {String} [msg]\n\
 * @api public\n\
 */\n\
\n\
exports.notDeepEqual = function (actual, expected, msg) {\n\
  if (!equals(actual, expected)) return;\n\
  throw new Error(msg || fmt('Expected %o not to deeply equal %o.', actual, expected));\n\
};\n\
\n\
/**\n\
 * Assert `actual` is strict equal to `expected`.\n\
 *\n\
 * @param {Mixed} actual\n\
 * @param {Mixed} expected\n\
 * @param {String} [msg]\n\
 * @api public\n\
 */\n\
\n\
exports.strictEqual = function (actual, expected, msg) {\n\
  if (actual === expected) return;\n\
  throw new Error(msg || fmt('Expected %o to strictly equal %o.', actual, expected));\n\
};\n\
\n\
/**\n\
 * Assert `actual` is not strict equal to `expected`.\n\
 *\n\
 * @param {Mixed} actual\n\
 * @param {Mixed} expected\n\
 * @param {String} [msg]\n\
 * @api public\n\
 */\n\
\n\
exports.notStrictEqual = function (actual, expected, msg) {\n\
  if (actual !== expected) return;\n\
  throw new Error(msg || fmt('Expected %o not to strictly equal %o.', actual, expected));\n\
};\n\
\n\
/**\n\
 * Assert `block` throws an `error`.\n\
 *\n\
 * @param {Function} block\n\
 * @param {Function} [error]\n\
 * @param {String} [msg]\n\
 * @api public\n\
 */\n\
\n\
exports.throws = function (block, error, msg) {\n\
  var err;\n\
  try {\n\
    block();\n\
  } catch (e) {\n\
    err = e;\n\
  }\n\
\n\
  if (!err) throw new Error(msg || fmt('Expected %s to throw an error.', block.toString()));\n\
  if (error && !(err instanceof error)) {\n\
    throw new Error(msg || fmt('Expected %s to throw an %o.', block.toString(), error));\n\
  }\n\
};\n\
\n\
/**\n\
 * Assert `block` doesn't throw an `error`.\n\
 *\n\
 * @param {Function} block\n\
 * @param {Function} [error]\n\
 * @param {String} [msg]\n\
 * @api public\n\
 */\n\
\n\
exports.doesNotThrow = function (block, error, msg) {\n\
  var err;\n\
  try {\n\
    block();\n\
  } catch (e) {\n\
    err = e;\n\
  }\n\
\n\
  if (err) throw new Error(msg || fmt('Expected %s not to throw an error.', block.toString()));\n\
  if (error && (err instanceof error)) {\n\
    throw new Error(msg || fmt('Expected %s not to throw an %o.', block.toString(), error));\n\
  }\n\
};\n\
\n\
/**\n\
 * Create a message from the call stack.\n\
 *\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function message() {\n\
  if (!Error.captureStackTrace) return 'assertion failed';\n\
  var callsite = stack()[2];\n\
  var fn = callsite.getFunctionName();\n\
  var file = callsite.getFileName();\n\
  var line = callsite.getLineNumber() - 1;\n\
  var col = callsite.getColumnNumber() - 1;\n\
  var src = get(file);\n\
  line = src.split('\\n\
')[line].slice(col);\n\
  var m = line.match(/assert\\((.*)\\)/);\n\
  return m && m[1].trim();\n\
}\n\
\n\
/**\n\
 * Load contents of `script`.\n\
 *\n\
 * @param {String} script\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function get(script) {\n\
  var xhr = new XMLHttpRequest;\n\
  xhr.open('GET', script, false);\n\
  xhr.send(null);\n\
  return xhr.responseText;\n\
}\n\
//@ sourceURL=component-assert/index.js"
));
require.register("generator-support/index.js", Function("exports, require, module",
"try {\n\
  eval('(function* () {})()');\n\
  module.exports = true;\n\
} catch (e) {\n\
  module.exports = false;\n\
}\n\
//@ sourceURL=generator-support/index.js"
));








require.alias("forbeslindesay-is-browser/client.js", "generator-support/deps/is-browser/client.js");
require.alias("forbeslindesay-is-browser/client.js", "generator-support/deps/is-browser/index.js");
require.alias("forbeslindesay-is-browser/client.js", "is-browser/index.js");
require.alias("forbeslindesay-is-browser/client.js", "forbeslindesay-is-browser/index.js");
require.alias("component-assert/index.js", "generator-support/deps/assert/index.js");
require.alias("component-assert/index.js", "assert/index.js");
require.alias("component-stack/index.js", "component-assert/deps/stack/index.js");

require.alias("jkroso-equals/index.js", "component-assert/deps/equals/index.js");
require.alias("jkroso-type/index.js", "jkroso-equals/deps/type/index.js");

require.alias("yields-fmt/index.js", "component-assert/deps/fmt/index.js");
require.alias("yields-fmt/index.js", "component-assert/deps/fmt/index.js");
require.alias("yields-fmt/index.js", "yields-fmt/index.js");
require.alias("generator-support/index.js", "generator-support/index.js");