(function( global, factory ) {

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "localdb requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

  // Support: Firefox 18+
  // Can't be in strict mode, several libs including ASP.NET trace
  // the stack via arguments.caller.callee and Firefox dies if
  // you try to trace through "use strict" call chains. (#13335)
  //
var Support = (function(){

  
  var Support, mod;
  mod = "lST$*@?";
  Support = {};
  Support.localstorage = function() {
    var e;
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch (_error) {
      e = _error;
      return false;
    }
  };
  Support.sessionstorage = function() {
    var e;
    try {
      sessionStorage.setItem(mod, mod);
      sessionStorage.removeItem(mod);
      return true;
    } catch (_error) {
      e = _error;
      return false;
    }
  };
  Support.postmessage = function() {
    return typeof postMessage !== "undefined" && postMessage !== null;
  };
  Support.websqldatabase = function() {
    return typeof openDatabase !== "undefined" && openDatabase !== null;
  };
  Support.indexedDB = function() {
    return (typeof indexedDB !== "undefined" && indexedDB !== null) || (typeof webkitIndexedDB !== "undefined" && webkitIndexedDB !== null) || (typeof mozIndexedDB !== "undefined" && mozIndexedDB !== null) || (typeof OIndexedDB !== "undefined" && OIndexedDB !== null) || (typeof msIndexedDB !== "undefined" && msIndexedDB !== null);
  };
  Support.applicationcache = function() {
    return typeof applicationCache !== "undefined" && applicationCache !== null;
  };
  Support.userdata = function() {
    return document.documentElement.addBehavior != null;
  };
  return Support;
})();

var BinaryParser = (function(){

  /**
   * Binary Parser.
   * Jonas Raoni Soares Silva
   * http://jsfromhell.com/classes/binary-parser [v1.0]
   */

  var maxBits = [];
  for (var i = 0; i < 64; i++) {
    maxBits[i] = Math.pow(2, i);
  }

  var BinaryParser = {}

  BinaryParser.decodeInt = function decodeInt(data, bits, signed, forceBigEndian) {
    var b = new this.Buffer(this.bigEndian || forceBigEndian, data),
      x = b.readBits(0, bits),
      max = maxBits[bits]; //max = Math.pow( 2, bits );

    return signed && x >= max / 2 ? x - max : x;
  };

  BinaryParser.encodeInt = function encodeInt(data, bits, signed, forceBigEndian) {
    var max = maxBits[bits];

    if (data >= max || data < -(max / 2)) {
      data = 0;
    }

    if (data < 0) {
      data += max;
    }

    for (var r = []; data; r[r.length] = String.fromCharCode(data % 256), data = Math.floor(data / 256));

    for (bits = -(-bits >> 3) - r.length; bits--; r[r.length] = "\0");

    return ((this.bigEndian || forceBigEndian) ? r.reverse() : r).join("");
  };

  BinaryParser.fromByte = function(data) {
    return this.encodeInt(data, 8, false);
  };
  BinaryParser.fromShort = function(data) {
    return this.encodeInt(data, 16, true);
  };

  /**
   * BinaryParser buffer constructor.
   */
  function BinaryParserBuffer(bigEndian, buffer) {
    this.bigEndian = bigEndian || 0;
    this.buffer = [];
    this.setBuffer(buffer);
  };

  BinaryParserBuffer.prototype.setBuffer = function setBuffer(data) {
    var l, i, b;

    if (data) {
      i = l = data.length;
      b = this.buffer = new Array(l);
      for (; i; b[l - i] = data.charCodeAt(--i));
      this.bigEndian && b.reverse();
    }
  };

  BinaryParserBuffer.prototype.hasNeededBits = function hasNeededBits(neededBits) {
    return this.buffer.length >= -(-neededBits >> 3);
  };

  BinaryParserBuffer.prototype.checkBuffer = function checkBuffer(neededBits) {
    if (!this.hasNeededBits(neededBits)) {
      throw new Error("checkBuffer::missing bytes");
    }
  };

  BinaryParserBuffer.prototype.readBits = function readBits(start, length) {
    //shl fix: Henri Torgemane ~1996 (compressed by Jonas Raoni)

    function shl(a, b) {
      for (; b--; a = ((a %= 0x7fffffff + 1) & 0x40000000) == 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1);
      return a;
    }

    if (start < 0 || length <= 0) {
      return 0;
    }

    this.checkBuffer(start + length);

    var offsetLeft, offsetRight = start % 8,
      curByte = this.buffer.length - (start >> 3) - 1,
      lastByte = this.buffer.length + (-(start + length) >> 3),
      diff = curByte - lastByte,
      sum = ((this.buffer[curByte] >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1)) + (diff && (offsetLeft = (start + length) % 8) ? (this.buffer[lastByte++] & ((1 << offsetLeft) - 1)) << (diff-- << 3) - offsetRight : 0);

    for (; diff; sum += shl(this.buffer[lastByte++], (diff-- << 3) - offsetRight));

    return sum;
  };

  BinaryParser.Buffer = BinaryParserBuffer;

  return BinaryParser;
})();

var ObjectID = (function(){

  
  var ObjectID, hexTable, i;
  hexTable = (function() {
    var _i, _results;
    _results = [];
    for (i = _i = 0; _i < 256; i = ++_i) {
      _results.push((i <= 15 ? "0" : "") + i.toString(16));
    }
    return _results;
  })();
  ObjectID = (function() {
    function ObjectID(id, _hex) {
      this._bsontype = "ObjectID";
      this.MACHINE_ID = parseInt(Math.random() * 0xFFFFFF, 10);
      if ((id != null) && id.length !== 12 && id.length !== 24) {
        throw new Error("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
      }
      if (id == null) {
        this.id = this.generate();
      } else if ((id != null) && id.length === 12) {
        this.id = id;
      } else if (/^[0-9a-fA-F]{24}$/.test(id)) {
        return this.createFromHexString(id);
      } else {
        throw new Error("Value passed in is not a valid 24 character hex string");
      }
    }

    ObjectID.prototype.generate = function() {
      var index3Bytes, machine3Bytes, pid2Bytes, time4Bytes, unixTime;
      unixTime = parseInt(Date.now() / 1000, 10);
      time4Bytes = BinaryParser.encodeInt(unixTime, 32, true, true);
      machine3Bytes = BinaryParser.encodeInt(this.MACHINE_ID, 24, false);
      pid2Bytes = BinaryParser.fromShort(typeof process === "undefined" ? Math.floor(Math.random() * 100000) : process.pid);
      index3Bytes = BinaryParser.encodeInt(this.get_inc(), 24, false, true);
      return time4Bytes + machine3Bytes + pid2Bytes + index3Bytes;
    };

    ObjectID.prototype.toHexString = function() {
      var hexString, _i, _ref;
      hexString = "";
      for (i = _i = 0, _ref = this.id.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        hexString += hexTable[this.id.charCodeAt(i)];
      }
      return hexString;
    };

    ObjectID.prototype.toString = function() {
      return this.toHexString();
    };

    ObjectID.prototype.inspect = function() {
      return this.toHexString();
    };

    ObjectID.prototype.getTime = function() {
      return Math.floor(BinaryParser.decodeInt(this.id.substring(0, 4), 32, true, true)) * 1000;
    };

    ObjectID.prototype.getTimestamp = function() {
      var timestamp;
      timestamp = new Date();
      timestamp.setTime(this.getTime());
      return timestamp;
    };

    ObjectID.prototype.get_inc = function() {
      return ObjectID.index = (ObjectID.index + 1) % 0xFFFFFF;
    };

    ObjectID.prototype.createFromHexString = function(hexString) {
      var result, _i;
      result = '';
      for (i = _i = 0; _i < 24; i = ++_i) {
        if (i % 2 === 0) {
          result += BinaryParser.fromByte(parseInt(hexString.substr(i, 2), 16));
        }
      }
      return new ObjectID(result, hexString);
    };

    return ObjectID;

  })();
  ObjectID.index = parseInt(Math.random() * 0xFFFFFF, 10);
  return ObjectID;
})();

var Utils = (function(){

  
  var Utils, eq, toString, _isType;
  Utils = {};
  toString = Object.prototype.toString;

  /*
   *  isEqual function is implemented by underscore and I just rewrite in coffee.
   *  https://github.com/jashkenas/underscore/blob/master/underscore.js
   */
  eq = function(a, b, aStack, bStack) {
    var aCtor, areArrays, bCtor, className, key, keys, length, result, size;
    if (a === b) {
      return a !== 0 || 1 / a === 1 / b;
    }
    if (a === null && b === void 0) {
      return false;
    }
    if (a === void 0 && b === null) {
      return false;
    }
    className = toString.call(a);
    if (className !== toString.call(b)) {
      return false;
    }
    switch (className) {
      case "[object RegExp]":
        return "" + a === "" + b;
      case "[object String]":
        return "" + a === "" + b;
      case "[object Number]":
        if (+a !== +a) {
          return +b !== +b;
        }
        if (+a === 0) {
          return 1 / +a === 1 / b;
        } else {
          return +a === +b;
        }
      case "[object Date]":
        return +a === +b;
      case "[object Boolean]":
        return +a === +b;
    }
    areArrays = className === "[object Array]";
    if (!areArrays) {
      if (typeof a !== "object" || typeof b !== "object") {
        return false;
      }
      aCtor = a.constructor;
      bCtor = b.constructor;
      if ((aCtor !== bCtor) && !(Utils.isFunction(aCtor) && aCtor instanceof aCtor && Utils.isFunction(bCtor) && bCtor instanceof bCtor) && ("constructor" in a && "constructor" in b)) {
        return false;
      }
    }
    length = aStack.length;
    while (length--) {
      if (aStack[length] === a) {
        return bStack[length] === b;
      }
    }
    aStack.push(a);
    bStack.push(b);
    if (areArrays) {
      size = a.length;
      result = size === b.length;
      if (result) {
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) {
            break;
          }
        }
      }
    } else {
      keys = Utils.keys(a);
      size = keys.length;
      result = Utils.keys(b).length === size;
      if (result) {
        while (size--) {
          key = keys[size];
          if (!(result = Utils.has(b, key) && eq(a[key], b[key], aStack, bStack))) {
            break;
          }
        }
      }
    }
    aStack.pop();
    bStack.pop();
    return result;
  };
  _isType = function(type) {
    return function(obj) {
      return toString.call(obj).toLowerCase() === ("[object " + type + "]").toLowerCase();
    };
  };
  Utils.isType = function(ele, type) {
    return _isType(type)(ele);
  };
  Utils.isObject = _isType("object");
  Utils.isString = _isType("string");
  Utils.isNumber = _isType("number");
  Utils.isArray = _isType("array");
  Utils.isFunction = _isType("function");
  Utils.isRegex = _isType("regexp");
  Utils.keys = function(obj) {
    if (!Utils.isObject(obj)) {
      return [];
    }
    if (Object.keys) {
      return Object.keys(obj);
    }
  };
  Utils.has = function(obj, key) {
    return (obj != null) && Object.prototype.hasOwnProperty.call(obj, key);
  };
  Utils.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };
  Utils.createObjectId = function() {
    return (new ObjectID()).inspect();
  };
  Utils.stringify = function(arr) {
    if ((arr == null) || !Utils.isArray(arr)) {
      return "[]";
    }
    return JSON.stringify(arr, function(key, value) {
      if (Utils.isRegex(value) || Utils.isFunction(value)) {
        return value.toString();
      }
      return value;
    });
  };
  Utils.parse = function(str) {
    if ((str == null) || !Utils.isString(str)) {
      return [];
    }
    return JSON.parse(str, function(key, value) {
      var v;
      try {
        v = eval(value);
      } catch (_error) {}
      if ((v != null) && Utils.isRegex(v)) {
        return v;
      }
      try {
        v = eval("(" + value + ")");
      } catch (_error) {}
      if ((v != null) && Utils.isFunction(v)) {
        return v;
      }
      return value;
    });
  };
  Utils.parseParas = function(paras) {
    var callback, options;
    options = {};
    callback = null;
    if (paras.length === 1) {
      if (Utils.isObject(paras[0])) {
        options = paras[0];
      } else if (Utils.isFunction(paras[0])) {
        callback = paras[0];
      }
    } else if (paras.length === 2) {
      if (Utils.isObject(paras[0])) {
        options = paras[0];
      }
      if (Utils.isFunction(paras[1])) {
        callback = paras[1];
      }
    }
    return [options, callback];
  };
  Utils.getTimestamp = function(objectId) {
    return (new ObjectID(objectId)).getTimestamp();
  };
  Utils.getTime = function(objectId) {
    return (new ObjectID(objectId)).getTime();
  };
  Utils.toUnicode = function(string) {
    var char, index, result, uniChar;
    result = [""];
    index = 1;
    while (index <= string.length) {
      char = string.charCodeAt(index - 1);
      uniChar = "00" + char.toString(16);
      uniChar = uniChar.slice(-4);
      result.push(uniChar);
      index += 1;
    }
    return result.join("\\u");
  };
  Utils.fromUnicode = function(string) {
    return unescape(string.replace(/\\/g, "%"));
  };
  Utils.getSubValue = function(value, key) {
    var k, keyArr, _i, _len;
    if (value == null) {
      return value;
    }
    keyArr = key.split(".");
    for (_i = 0, _len = keyArr.length; _i < _len; _i++) {
      k = keyArr[_i];
      value = value[k];
      if (value == null) {
        return value;
      }
    }
    return value;
  };

  /*
    * 快速排序
    * @param array 待排序数组
    * @param key 排序字段
    * @param order 排序方式（1:升序，-1降序）
   */
  Utils.quickSort = function(array, key, order) {
    var compareValue, leftArr, pointCompareValue, pointValue, rightArr, value, _i, _len;
    if (!Utils.isString(key)) {
      throw new Error("type Error: key");
    }
    if (array.length <= 1) {
      return array;
    }
    pointValue = array.splice(0, 1)[0];
    pointCompareValue = Utils.getSubValue(pointValue, key);
    leftArr = [];
    rightArr = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      value = array[_i];
      compareValue = Utils.getSubValue(value, key);
      ((compareValue == null) || compareValue < pointCompareValue ? leftArr : rightArr).push(value);
    }
    return Utils.quickSort((order === 1 ? leftArr : rightArr), key, order).concat([pointValue], Utils.quickSort((order === 1 ? rightArr : leftArr), key, order));
  };

  /*
    * 数据排序
   */
  Utils.sortObj = function(data, sortObj) {
    var key, order, result, sort, sortArr, _i, _len;
    if (sortObj == null) {
      return data;
    }
    result = data;
    sortArr = [];
    for (key in sortObj) {
      order = sortObj[key];
      sortArr.unshift({
        key: key,
        order: order
      });
    }
    for (_i = 0, _len = sortArr.length; _i < _len; _i++) {
      sort = sortArr[_i];
      result = Utils.quickSort(result, sort.key, sort.order);
    }
    return result;
  };

  /*
   *  根据src获取iframe
   */
  Utils.getIframe = function(src) {
    var allFrames, frame, _i, _len;
    allFrames = document.getElementsByTagName("iframe");
    for (_i = 0, _len = allFrames.length; _i < _len; _i++) {
      frame = allFrames[_i];
      if (frame.src.indexOf(src) === 0) {
        return frame;
      }
    }
    return null;
  };

  /*
   *  创建Iframe
   */
  Utils.createIframe = function(src) {
    var iframe;
    iframe = Utils.getIframe(src);
    if (iframe != null) {
      return iframe;
    }
    iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    return iframe;
  };
  Utils.getDomain = function(url) {
    return url.match(/(https?:\/\/)?([^\/]+)/)[2].split(":")[0];
  };
  Utils.getOrigin = function(url) {
    return url.match(/(https?:\/\/)?([^\/]+)/)[0];
  };
  return Utils;
})();

var Promise = (function(){

  /**
   * https://github.com/then/promise [v6.0.1]
   */

  // Use the fastest possible means to execute a task in a future turn
  // of the event loop.

  // linked list of tasks (single, with head node)
  var head = {
    task: void 0,
    next: null
  };
  var tail = head;
  var flushing = false;
  var requestFlush = void 0;
  var isNodeJS = false;

  function flush() {
    /* jshint loopfunc: true */

    while (head.next) {
      head = head.next;
      var task = head.task;
      head.task = void 0;
      var domain = head.domain;

      if (domain) {
        head.domain = void 0;
        domain.enter();
      }

      try {
        task();

      } catch (e) {
        if (isNodeJS) {
          // In node, uncaught exceptions are considered fatal errors.
          // Re-throw them synchronously to interrupt flushing!

          // Ensure continuation if the uncaught exception is suppressed
          // listening "uncaughtException" events (as domains does).
          // Continue in next event to avoid tick recursion.
          if (domain) {
            domain.exit();
          }
          setTimeout(flush, 0);
          if (domain) {
            domain.enter();
          }

          throw e;

        } else {
          // In browsers, uncaught exceptions are not fatal.
          // Re-throw them asynchronously to avoid slow-downs.
          setTimeout(function() {
            throw e;
          }, 0);
        }
      }

      if (domain) {
        domain.exit();
      }
    }

    flushing = false;
  }

  if (typeof process !== "undefined" && process.nextTick) {
    // Node.js before 0.9. Note that some fake-Node environments, like the
    // Mocha test runner, introduce a `process` global without a `nextTick`.
    isNodeJS = true;

    requestFlush = function() {
      process.nextTick(flush);
    };

  } else if (typeof setImmediate === "function") {
    // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
    if (typeof window !== "undefined") {
      requestFlush = setImmediate.bind(window, flush);
    } else {
      requestFlush = function() {
        setImmediate(flush);
      };
    }

  } else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    requestFlush = function() {
      channel.port2.postMessage(0);
    };

  } else {
    // old browsers
    requestFlush = function() {
      setTimeout(flush, 0);
    };
  }

  function asap(task) {
    tail = tail.next = {
      task: task,
      domain: isNodeJS && process.domain,
      next: null
    };

    if (!flushing) {
      flushing = true;
      requestFlush();
    }
  };


  function Promise(fn) {
    if (typeof this !== "object") throw new TypeError("Promises must be constructed via new")
    if (typeof fn !== "function") throw new TypeError("not a function")
    var state = null
    var value = null
    var deferreds = []
    var self = this

    this.then = function(onFulfilled, onRejected) {
      return new self.constructor(function(resolve, reject) {
        handle(new Handler(onFulfilled, onRejected, resolve, reject))
      })
    }

    function handle(deferred) {
      if (state === null) {
        deferreds.push(deferred)
        return
      }
      asap(function() {
        var cb = state ? deferred.onFulfilled : deferred.onRejected
        if (cb === null) {
          (state ? deferred.resolve : deferred.reject)(value)
          return
        }
        var ret
        try {
          ret = cb(value)
        } catch (e) {
          deferred.reject(e)
          return
        }
        deferred.resolve(ret)
      })
    }

    function resolve(newValue) {
      try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === self) throw new TypeError("A promise cannot be resolved with itself.")
        if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
          var then = newValue.then
          if (typeof then === "function") {
            doResolve(then.bind(newValue), resolve, reject)
            return
          }
        }
        state = true
        value = newValue
        finale()
      } catch (e) {
        reject(e)
      }
    }

    function reject(newValue) {
      state = false
      value = newValue
      finale()
    }

    function finale() {
      for (var i = 0, len = deferreds.length; i < len; i++)
        handle(deferreds[i])
      deferreds = null
    }

    doResolve(fn, resolve, reject)
  }


  function Handler(onFulfilled, onRejected, resolve, reject) {
    this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null
    this.onRejected = typeof onRejected === "function" ? onRejected : null
    this.resolve = resolve
    this.reject = reject
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, onFulfilled, onRejected) {
    var done = false;
    try {
      fn(function(value) {
        if (done) return
        done = true
        onFulfilled(value)
      }, function(reason) {
        if (done) return
        done = true
        onRejected(reason)
      })
    } catch (ex) {
      if (done) return
      done = true
      onRejected(ex)
    }
  }

  Promise.prototype.done = function(onFulfilled, onRejected) {
    var self = arguments.length ? this.then.apply(this, arguments) : this
    self.then(null, function(err) {
      asap(function() {
        throw err
      })
    })
  }

  /* Static Functions */

  function ValuePromise(value) {
    this.then = function(onFulfilled) {
      if (typeof onFulfilled !== "function") return this
      return new Promise(function(resolve, reject) {
        asap(function() {
          try {
            resolve(onFulfilled(value))
          } catch (ex) {
            reject(ex);
          }
        })
      })
    }
  }
  ValuePromise.prototype = Promise.prototype

  var TRUE = new ValuePromise(true)
  var FALSE = new ValuePromise(false)
  var NULL = new ValuePromise(null)
  var UNDEFINED = new ValuePromise(undefined)
  var ZERO = new ValuePromise(0)
  var EMPTYSTRING = new ValuePromise("")

  Promise.resolve = function(value) {
    if (value instanceof Promise) return value

    if (value === null) return NULL
    if (value === undefined) return UNDEFINED
    if (value === true) return TRUE
    if (value === false) return FALSE
    if (value === 0) return ZERO
    if (value === "") return EMPTYSTRING

    if (typeof value === "object" || typeof value === "function") {
      try {
        var then = value.then
        if (typeof then === "function") {
          return new Promise(then.bind(value))
        }
      } catch (ex) {
        return new Promise(function(resolve, reject) {
          reject(ex)
        })
      }
    }

    return new ValuePromise(value)
  }

  Promise.all = function(arr) {
    var args = Array.prototype.slice.call(arr)

    return new Promise(function(resolve, reject) {
      if (args.length === 0) return resolve([])
      var remaining = args.length

      function res(i, val) {
        try {
          if (val && (typeof val === "object" || typeof val === "function")) {
            var then = val.then
            if (typeof then === "function") {
              then.call(val, function(val) {
                res(i, val)
              }, reject)
              return
            }
          }
          args[i] = val
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex)
        }
      }
      for (var i = 0; i < args.length; i++) {
        res(i, args[i])
      }
    })
  }

  Promise.reject = function(value) {
    return new Promise(function(resolve, reject) {
      reject(value);
    });
  }

  Promise.race = function(values) {
    return new Promise(function(resolve, reject) {
      values.forEach(function(value) {
        Promise.resolve(value).then(resolve, reject);
      })
    });
  }

  /* Prototype Methods */

  Promise.prototype["catch"] = function(onRejected) {
    return this.then(null, onRejected);
  }

  /* Static Functions */

  Promise.denodeify = function(fn, argumentCount) {
    argumentCount = argumentCount || Infinity
    return function() {
      var self = this
      var args = Array.prototype.slice.call(arguments)
      return new Promise(function(resolve, reject) {
        while (args.length && args.length > argumentCount) {
          args.pop()
        }
        args.push(function(err, res) {
          if (err) reject(err)
          else resolve(res)
        })
        fn.apply(self, args)
      })
    }
  }
  Promise.nodeify = function(fn) {
    return function() {
      var args = Array.prototype.slice.call(arguments)
      var callback = typeof args[args.length - 1] === "function" ? args.pop() : null
      var ctx = this
      try {
        return fn.apply(this, arguments).nodeify(callback, ctx)
      } catch (ex) {
        if (callback === null || typeof callback == "undefined") {
          return new Promise(function(resolve, reject) {
            reject(ex)
          })
        } else {
          asap(function() {
            callback.call(ctx, ex)
          })
        }
      }
    }
  }

  Promise.prototype.nodeify = function(callback, ctx) {
    if (typeof callback != "function") return this

    this.then(function(value) {
      asap(function() {
        callback.call(ctx, null, value)
      })
    }, function(err) {
      asap(function() {
        callback.call(ctx, err)
      })
    })
  }

  return Promise;
})();

var Where = (function(){
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };


  
  var Where, arrayCheck, dotCheck, isKeyReserved, keywordCheck, numberCheck, objectCheck, regexCheck, reservedKeys, stringCheck, valueCheck;
  reservedKeys = ["$gt", "$gte", "$lt", "$lte", "$ne", "$in", "$nin", "$and", "$nor", "$or", "$not", "$exists", "$type", "$mod", "$regex", "$all", "$elemMatch", "$size"];
  isKeyReserved = function(key) {
    return __indexOf.call(reservedKeys, key) >= 0;
  };
  Where = function(data, conditions) {

    /*
     *  如果key中包含dot的话，则执行dotCheck
     *  执行valueCheck
     *  如果返回值为true的话，执行keywordCheck
     */
    var condition, key;
    for (key in conditions) {
      condition = conditions[key];
      if (data == null) {
        if (key === "$exists" && condition === false) {
          continue;
        }
        return false;
      }
      if (key.indexOf(".") !== -1) {
        if (dotCheck(data, key, condition)) {
          continue;
        } else {
          return false;
        }
      }
      if (!valueCheck(data, key, condition)) {
        return false;
      }
      if (!keywordCheck(data, key, condition)) {
        return false;
      }
    }
    return true;
  };
  dotCheck = function(data, key, condition) {
    var firstKey;
    firstKey = key.split(".")[0];
    return Where(data[/\d/.test(firstKey) ? Number(firstKey) : firstKey], new function() {
      this[key.substr(key.indexOf(".") + 1)] = condition;
    });
  };
  valueCheck = function(data, key, condition) {

    /*
     *  如果key是关键字，则返回true
     *  如果condition是数字，则执行numberCheck
     *  如果condition是字符串，则执行stringCheck
     *  如果condition是正则表达式，则执行regexCheck
     *  如果condition是数组，则执行arrayCheck
     *  如果condition是对象，则执行objectCheck
     */
    var d;
    if (isKeyReserved(key)) {
      return true;
    }
    d = data[key];
    if (Utils.isNumber(condition) && !numberCheck(d, condition)) {
      return false;
    }
    if (Utils.isString(condition) && !stringCheck(d, condition)) {
      return false;
    }
    if (Utils.isRegex(condition) && !regexCheck(d, condition)) {
      return false;
    }
    if (Utils.isArray(condition) && !arrayCheck(d, condition)) {
      return false;
    }
    if (Utils.isObject(condition) && !objectCheck(d, condition)) {
      return false;
    }
    return true;
  };
  keywordCheck = function(data, key, condition) {
    var c, d, flag, _i, _j, _k, _l, _len, _len1, _len2, _len3;
    switch (key) {
      case "$gt":
        if (data <= condition) {
          return false;
        }
        break;
      case "$gte":
        if (data < condition) {
          return false;
        }
        break;
      case "$lt":
        if (data >= condition) {
          return false;
        }
        break;
      case "$lte":
        if (data > condition) {
          return false;
        }
        break;
      case "$ne":
        if (data === condition) {
          return false;
        }
        break;
      case "$in":
        if (Utils.isArray(data)) {
          flag = true;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            d = data[_i];
            if (flag) {
              if ((function() {
                var c, _j, _len1;
                for (_j = 0, _len1 = condition.length; _j < _len1; _j++) {
                  c = condition[_j];
                  if (Utils.isRegex(c) && c.test(d) || (Utils.isEqual(c, d))) {
                    return true;
                  }
                }
                return false;
              })()) {
                flag = false;
              }
            }
          }
          if (flag) {
            return false;
          }
        } else {
          if (!(function() {
            var c, _j, _len1;
            for (_j = 0, _len1 = condition.length; _j < _len1; _j++) {
              c = condition[_j];
              if (Utils.isRegex(c) && c.test(data) || (Utils.isEqual(c, data))) {
                return true;
              }
            }
            return false;
          })()) {
            return false;
          }
        }
        break;
      case "$nin":
        if (__indexOf.call(condition, data) >= 0) {
          return false;
        }
        break;
      case "$exists":
        if (condition !== (data != null)) {
          return false;
        }
        break;
      case "$type":
        if (!Utils.isType(data, condition)) {
          return false;
        }
        break;
      case "$mod":
        if (data % condition[0] !== condition[1]) {
          return false;
        }
        break;
      case "$regex":
        if (!(new RegExp(condition)).test(data)) {
          return false;
        }
        break;
      case "$and":
        for (_j = 0, _len1 = condition.length; _j < _len1; _j++) {
          c = condition[_j];
          if (!Where(data, c)) {
            return false;
          }
        }
        break;
      case "$nor":
        for (_k = 0, _len2 = condition.length; _k < _len2; _k++) {
          c = condition[_k];
          if (Where(data, c)) {
            return false;
          }
        }
        break;
      case "$or":
        if (!(function() {
          var _l, _len3;
          for (_l = 0, _len3 = condition.length; _l < _len3; _l++) {
            c = condition[_l];
            if (Where(data, c)) {
              return true;
            }
          }
          return false;
        })()) {
          return false;
        }
        break;
      case "$not":
        if (Where(data, condition)) {
          return false;
        }
        break;
      case "$all":
        if (!Utils.isArray(data)) {
          return false;
        }
        for (_l = 0, _len3 = condition.length; _l < _len3; _l++) {
          c = condition[_l];
          if (!(function() {
            var _len4, _m;
            for (_m = 0, _len4 = data.length; _m < _len4; _m++) {
              d = data[_m];
              if (Utils.isArray(c) ? keywordCheck(d, key, c) : d === c) {
                return true;
              }
            }
          })()) {
            return false;
          }
        }
        break;
      case "$elemMatch":
        if (!Utils.isArray(data)) {
          return false;
        }
        if (!(function() {
          var _len4, _m;
          for (_m = 0, _len4 = data.length; _m < _len4; _m++) {
            d = data[_m];
            if (Where(d, condition)) {
              return true;
            }
          }
        })()) {
          return false;
        }
        break;
      case "$size":
        if (!Utils.isArray(data)) {
          return false;
        }
        if (data.length !== condition) {
          return false;
        }
    }
    return true;
  };
  numberCheck = function(data, cmpData) {

    /* Number Check
     *  cmpData: 1
     *  data: 1 or [1,2,3]
     */
    if (Utils.isNumber(data) && cmpData === data) {
      return true;
    }
    if (Utils.isArray(data) && (__indexOf.call(data, cmpData) >= 0)) {
      return true;
    }
    return false;
  };
  stringCheck = function(data, cmpData) {

    /* String Check
     *  cmpData: "abc"
     *  data: "abc" or ["abc","aaa","bbbb"]
     */
    if (Utils.isString(data) && cmpData === data) {
      return true;
    }
    if (Utils.isArray(data) && (__indexOf.call(data, cmpData) >= 0)) {
      return true;
    }
    return false;
  };
  regexCheck = function(data, cmpData) {

    /* Regex Check
     *  cmpData: /abc/
     *  data: "abcd" or ["abcdf","aaaa","basc","abce"] or /abc/ or [/abc/,/bce/,/hello.*ld/]
     */
    var d, _i, _len;
    if (Utils.isArray(data)) {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        d = data[_i];
        if (Utils.isRegex(d)) {
          if (Utils.isEqual(d, cmpData)) {
            return true;
          }
        } else {
          if (cmpData.test(d)) {
            return true;
          }
        }
      }
    } else {
      if (Utils.isRegex(data)) {
        if (Utils.isEqual(data, cmpData)) {
          return true;
        }
      } else {
        if (cmpData.test(data)) {
          return true;
        }
      }
    }
    return false;
  };
  arrayCheck = function(data, cmpData) {
    return Utils.isEqual(data, cmpData);
  };
  objectCheck = function(data, conditions) {
    var c, flag, key;
    flag = true;
    for (key in conditions) {
      c = conditions[key];
      if (!(isKeyReserved(key))) {
        continue;
      }
      flag = false;
      if (!Where(data, new function() {
        this[key] = c;
      })) {
        return false;
      }
    }
    if (flag) {
      return Utils.isEqual(data, conditions);
    } else {
      return true;
    }
  };
  return Where;
})();

var Projection = (function(){

  
  var Projection, generateItem;
  Projection = {};
  Projection.generate = function(data, projection) {
    var d, item, result, _i, _len;
    if (JSON.stringify(projection) === "{}") {
      return data;
    }
    result = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      d = data[_i];
      item = generateItem(d, projection);
      if (!Utils.isEqual(item, {})) {
        result.push(item);
      }
    }
    return result;
  };
  generateItem = function(item, projection) {
    var flag, gItem, i, idFlag, key, r, result, v_key, v_value, value, _i, _len;
    result = {};
    idFlag = true;
    for (key in projection) {
      value = projection[key];
      if (key === "_id" && value === -1) {
        idFlag = false;
        continue;
      }
      if (key.indexOf(".$") !== -1) {
        key = key.split(".")[0];
        if (!Utils.isArray(item[key]) || item[key].length === 0) {
          continue;
        }
        result[key] = [item[key][0]];
      } else if (key.indexOf("$elemMatch") === 0) {
        if (!Utils.isArray(item) || item.length === 0) {
          return [];
        }
        r = [];
        for (_i = 0, _len = item.length; _i < _len; _i++) {
          i = item[_i];
          flag = true;
          for (v_key in value) {
            v_value = value[v_key];
            if (Utils.isObject(v_value)) {

            } else {
              if (i[v_key] !== v_value) {
                flag = false;
              }
            }
          }
          if (flag) {
            r.push(i);
            break;
          }
        }
        if (Utils.isEqual(r, [])) {
          return [];
        }
        return r;
      } else if (Utils.isObject(value)) {
        gItem = generateItem(item[key], value);
        if (!Utils.isEqual(gItem, [])) {
          result[key] = gItem;
        }
      } else {
        if (value === 1) {
          result[key] = item[key];
        }
      }
    }
    if (idFlag && !Utils.isEqual(result, {})) {
      result._id = item._id;
    }
    return result;
  };
  return Projection;
})();

var Operation = (function(){

  
  var Operation, Update;
  Operation = {};
  Operation.insert = function(data, rowData, options) {
    var d, _i, _len;
    if (Utils.isArray(rowData)) {
      for (_i = 0, _len = rowData.length; _i < _len; _i++) {
        d = rowData[_i];
        if (!(Utils.isObject(d))) {
          continue;
        }
        if (d._id == null) {
          d._id = Utils.createObjectId();
        }
        data.push(d);
      }
    } else if (Utils.isObject(rowData)) {
      if (rowData._id == null) {
        rowData._id = Utils.createObjectId();
      }
      data.push(rowData);
    }
    return data;
  };
  Operation.update = function(data, actions, options) {
    var action, multi, upsert, value, where;
    where = options.where || {};
    multi = options.multi != null ? options.multi : true;
    upsert = options.upsert != null ? options.upsert : true;
    for (action in actions) {
      value = actions[action];
      data = Update.generate(data, action, value, where, multi, upsert);
    }
    return data;
  };
  Operation.remove = function(data, options) {
    var d, flag, multi, result, where, _i, _len;
    where = options.where || {};
    multi = options.multi != null ? options.multi : true;
    result = [];
    flag = false;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      d = data[_i];
      if (flag) {
        result.push(d);
        continue;
      }
      if (Where(d, where)) {
        if (!multi) {
          flag = true;
        }
        continue;
      }
      result.push(d);
    }
    return result;
  };
  Operation.find = function(data, options) {
    var d, limit, projection, result, where, _i, _len;
    where = options.where || {};
    projection = options.projection || {};
    limit = options.limit || -1;
    result = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      d = data[_i];
      if (!(Where(d, where))) {
        continue;
      }
      if (limit === 0) {
        break;
      }
      limit -= 1;
      result.push(d);
    }
    result = Utils.sortObj(result, options.sort);
    return Projection.generate(result, projection);
  };
  Update = {
    isKeyReserved: function(key) {
      return key === "$inc" || key === "$set" || key === "$mul" || key === "$rename" || key === "$unset" || key === "$max" || key === "$min";
    },
    generate: function(data, action, value, where, multi, upsert) {
      var d, firstKey, flag, k, v, _i, _len;
      if (!Update.isKeyReserved(action)) {
        return data;
      }
      for (k in value) {
        v = value[k];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          if (!(Where(d, where))) {
            continue;
          }
          flag = false;
          while (k.indexOf(".") > 0) {
            firstKey = k.split(".")[0];
            d = d[firstKey];
            if ((d == null) && !upsert) {
              flag = true;
              break;
            }
            if (upsert) {
              d = d || {};
            }
            k = k.substr(k.indexOf(".") + 1);
          }
          if (flag) {
            continue;
          }
          switch (action) {
            case "$inc":
              if ((d[k] != null) || upsert) {
                d[k] += v;
              }
              break;
            case "$set":
              if ((d[k] != null) || upsert) {
                d[k] = v;
              }
              break;
            case "$mul":
              if ((d[k] != null) || upsert) {
                d[k] *= v;
              }
              break;
            case "$rename":
              d[v] = d[k];
              delete d[k];
              break;
            case "$unset":
              delete d[k];
              break;
            case "$min":
              if ((d[k] != null) || upsert) {
                d[k] = Math.min(d[k], v);
              }
              break;
            case "$max":
              if ((d[k] != null) || upsert) {
                d[k] = Math.max(d[k], v);
              }
          }
          if (!multi) {
            break;
          }
        }
      }
      return data;
    }
  };
  return Operation;
})();

var Collection = (function(){
var __slice = [].slice;


  

  /**
   *  该callback只接受err参数
   *  @callback CallbackStatus
   *  @param  {Error} err - 返回错误信息，null则表示success
   */

  /**
   *  该callback接受两个参数，第一个参数为具体数据信息，第二个参数为err
   *  @callback CallbackData
   *  @param  {*} data - 返回的数据
   *  @param  {Error} err - 返回错误信息，null则表示success
   */
  var Collection;

  /**
   *  @class Collection
   *  @classdesc Collection类用来操作collection集合，Collection不直接进行初始化，而是通过db来获取，具体方式参考Example
   *  @author [wh1100717]{@link https://github.com/wh1100717}
   *  @param  {String}    collectionName - 集合名
   *  @param  {Engine}    engine - 使用的引擎
   *  @return {Collection}   Instance of Collection Class
   *
   *  @todo Update Actions 文档需要撰写
   *  @todo Where 支持的操作文档需要撰写
   *  @todo Promise 相关使用方式文档撰写
   *  @todo Projection 相关使用方式文档撰写
   *  @todo Sort 相关使用方式文档撰写
   *
   *  @example
   db = new LocalDB("foo")
   var collection = db.collection("bar")
   */
  Collection = (function() {
    function Collection(collectionName, engine) {
      this.engine = engine;
      this.name = "" + engine.name + "_" + collectionName;
    }


    /**
     *  @function Collection#deserialize
     *  @desc 从engine中获取数据并将其转化为对象
     *  @instance
     *  @private
     *  @param {CallbackData} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
     */

    Collection.prototype.deserialize = function(callback) {
      return this.engine.getItem(this.name, function(data, err) {
        return callback(Utils.parse(data), err);
      });
    };


    /**
     *  @function Collection#serialize
     *  @desc 将数据存储到engine中
     *  @instance
     *  @private
     *  @param {CallbackData} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
     */

    Collection.prototype.serialize = function(data, callback) {
      return this.engine.setItem(this.name, Utils.stringify(data), callback);
    };


    /**
     *  @function Collection#drop
     *  @desc 执行删除集合操作
     *  @instance
     *  @param {CallbackStatus} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
     */

    Collection.prototype.drop = function(callback) {
      var promiseFn, self;
      self = this;
      promiseFn = function(resolve, reject) {
        return self.engine.removeItem(self.name, function(err) {
          if (callback != null) {
            callback(err);
          }
          if (err != null) {
            return reject(err);
          } else {
            return resolve();
          }
        });
      };
      return new Promise(promiseFn);
    };


    /**
     *  @function Collection#insert
     *  @desc 集合执行插入数据操作
     *  @instance
     *  @param {Object|Array<Object>} rowData 要插入的源数据
     *  @param {Object} [options]   配置参数，预留配置参数接口，目前没有用到
     *  @param {CallbackStatus} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
     *
     *  @todo 对rowData数组类型进行判断
     *  @todo 对options参数进行判断，如果判断为false的，则调用callback(err)及rejct(err)
     */

    Collection.prototype.insert = function() {
      var callback, options, paras, promiseFn, rowData, self, _ref;
      rowData = arguments[0], paras = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = Utils.parseParas(paras), options = _ref[0], callback = _ref[1];
      self = this;
      promiseFn = function(resolve, reject) {
        return self.deserialize(function(data, err) {
          if (err != null) {
            if (callback != null) {
              callback(err);
            }
            return reject(err);
          } else {
            data = Operation.insert(data, rowData, options);
            return self.serialize(data, function(err) {
              if (callback != null) {
                callback(err);
              }
              if (err != null) {
                return reject(err);
              } else {
                return resolve();
              }
            });
          }
        });
      };
      return new Promise(promiseFn);
    };


    /**
     *  @function Collection#update
     *  @desc 集合执行更新数据操作
     *  @instance
     *  @param {Object} actions 更新操作，目前支持$inc, $set, $mul, $rename, $unset, $min, $max操作
     *  @param {Object} [options]   配置参数
     *  @param {Object} [options.where] 更新条件匹配参数
     *  @param {Boolean} [options.multi] false表示只更新匹配上的第一条数据，true表示更新全部匹配数据，默认为true
     *  @param {Boolean} [options.upsert] true表示如果更新的数据的key不存在则插入该数据，false则丢弃，默认为true
     *  @param {CallbackStatus} [callback] 需要异步执行的回调函数，支持Promise异步编程方式
     */

    Collection.prototype.update = function() {
      var actions, callback, options, paras, promiseFn, self, _ref;
      actions = arguments[0], paras = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = Utils.parseParas(paras), options = _ref[0], callback = _ref[1];
      self = this;
      promiseFn = function(resolve, reject) {
        return self.deserialize(function(data, err) {
          if (err) {
            if (callback != null) {
              callback(err);
            }
            return reject(err);
          } else {
            data = Operation.update(data, actions, options);
            return self.serialize(data, function(err) {
              if (callback != null) {
                callback(err);
              }
              if (err != null) {
                return reject(err);
              } else {
                return resolve();
              }
            });
          }
        });
      };
      return new Promise(promiseFn);
    };


    /**
     *  @function Collection#remove
     *  @desc 集合执行删除数据操作
     *  @instance
     *  @param {Object} [options]   配置参数
     *  @param {Object} [options.where] 删除条件匹配参数
     *  @param {Boolean} [options.multi] false表示只删除匹配上的第一条数据，true表示删除全部匹配数据，默认为true
     *  @param {CallbackStatus} [callback] 需要异步执行的回调函数，支持Promise异步编程方式
     */

    Collection.prototype.remove = function() {
      var callback, options, paras, promiseFn, self, _ref;
      paras = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = Utils.parseParas(paras), options = _ref[0], callback = _ref[1];
      self = this;
      promiseFn = function(resolve, reject) {
        return self.deserialize(function(data, err) {
          if (err != null) {
            if (callback != null) {
              callback(err);
            }
            return reject(err);
          } else {
            data = Operation.remove(data, options);
            return self.serialize(data, function(err) {
              if (callback != null) {
                callback(err);
              }
              if (err != null) {
                return reject(err);
              } else {
                return resolve();
              }
            });
          }
        });
      };
      return new Promise(promiseFn);
    };


    /**
     *  @function Collection#find
     *  @desc 集合执行查询数据操作
     *  @instance
     *  @param {Object} [options]   配置参数
     *  @param {Object} [options.where] 查询条件匹配参数
     *  @param {Object} [options.projection] 返回数据格式配置参数
     *  @param {Number} [options.limit] 返回数据数量配置参数
     *  @param {Object} [options.sort] 返回数据排序方式配置参数
     *  @param {CallbackData} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
     */

    Collection.prototype.find = function() {
      var callback, options, paras, promiseFn, self, _ref;
      paras = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = Utils.parseParas(paras), options = _ref[0], callback = _ref[1];
      self = this;
      promiseFn = function(resolve, reject) {
        return self.deserialize(function(data, err) {
          if (err != null) {
            if (callback != null) {
              callback([], err);
            }
            return reject(err);
          } else {
            data = Operation.find(data, options);
            if (callback != null) {
              callback(data, err);
            }
            if (err != null) {
              return reject(err);
            } else {
              return resolve(data);
            }
          }
        });
      };
      return new Promise(promiseFn);
    };


    /**
     *  @function Collection#findOne
     *  @desc 集合执行查询一条数据操作
     *  @instance
     *  @param {Object} [options]   配置参数
     *  @param {Object} [options.where] 查询条件匹配参数
     *  @param {Object} [options.projection] 返回数据格式配置参数
     *  @param {Object} [options.sort] 返回数据排序方式配置参数
     *  @param {CallbackData} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
     */

    Collection.prototype.findOne = function() {
      var callback, options, paras, promiseFn, self, _ref;
      paras = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = Utils.parseParas(paras), options = _ref[0], callback = _ref[1];
      options.limit = 1;
      self = this;
      promiseFn = function(resolve, reject) {
        return self.deserialize(function(data, err) {
          if (err != null) {
            if (callback != null) {
              callback(void 0, err);
            }
            return reject(err);
          } else {
            data = Operation.find(data, options);
            if (callback != null) {
              callback(data[0], err);
            }
            if (err != null) {
              return reject(err);
            } else {
              return resolve(data[0]);
            }
          }
        });
      };
      return new Promise(promiseFn);
    };

    return Collection;

  })();
  return Collection;
})();

var Sha1 = (function(){
/*   
 *   A   JavaScript   implementation   of   the   Secure   Hash   Algorithm,   SHA-1,   as   defined
 *   in   FIPS   PUB   180-1
 *   Version   2.1-BETA   Copyright   Paul   Johnston   2000   -   2002.
 *   Other   contributors:   Greg   Holt,   Andrew   Kepert,   Ydnar,   Lostinet
 *   Distributed   under   the   BSD   License
 *   See   http://pajhome.org.uk/crypt/md5   for   details.
 */
/*   
 *   Configurable   variables.   You   may   need   to   tweak   these   to   be   compatible   with
 *   the   server-side,   but   the   defaults   work   in   most   cases.
 */

  
  var hexcase = 0; /*   hex   output   format.   0   -   lowercase;   1   -   uppercase                 */
  var b64pad = ""; /*   base-64   pad   character.   "="   for   strict   RFC   compliance       */
  var chrsz = 8; /*   bits   per   input   character.   8   -   ASCII;   16   -   Unicode             */
  var Sha1 = {};
  /*   
   *   These   are   the   functions   you'll   usually   want   to   call
   *   They   take   string   arguments   and   return   either   hex   or   base-64   encoded   strings
   */
  Sha1.hex_sha1 = function(s) {
    return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
  }

  /*   
   *   Calculate   the   SHA-1   of   an   array   of   big-endian   words,   and   a   bit   length
   */
  function core_sha1(x, len) {
    /*   append   padding   */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;

    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      var olde = e;

      for (var j = 0; j < 80; j++) {
        if (j < 16) w[j] = x[i + j];
        else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
        e = d;
        d = c;
        c = rol(b, 30);
        b = a;
        a = t;
      }

      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
      e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);

  }

  /*   
   *   Perform   the   appropriate   triplet   combination   function   for   the   current
   *   iteration
   */
  function sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  }

  /*   
   *   Determine   the   appropriate   additive   constant   for   the   current   iteration
   */
  function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
  }

  /*   
   *   Add   integers,   wrapping   at   2^32.   This   uses   16-bit   operations   internally
   *   to   work   around   bugs   in   some   JS   interpreters.
   */
  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /*   
   *   Bitwise   rotate   a   32-bit   number   to   the   left.
   */
  function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /*   
   *   Convert   an   8-bit   or   16-bit   string   to   an   array   of   big-endian   words
   *   In   8-bit   function,   characters   >255   have   their   hi-byte   silently   ignored.
   */
  function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    return bin;
  }

  /*   
   *   Convert   an   array   of   big-endian   words   to   a   hex   string.
   */
  function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
  }

  return Sha1;
})();

var Encrypt = (function(){

  
  var Encrypt;
  Encrypt = {};

  /*
    * 加密
   */
  Encrypt.encode = function(value, key) {
    var comEncodeVal, encodeVal, index, len, mod, resultArr, resultStr, uniKey, uniKeyArr, uniValue, uniValueArr, unicodeKey, unicodeValue, _i, _len;
    if (value == null) {
      return null;
    }
    resultArr = [""];
    key = Sha1.hex_sha1(key);
    unicodeValue = Utils.toUnicode(value);
    unicodeKey = Utils.toUnicode(key);
    uniValueArr = unicodeValue.split('\\u').slice(1);
    uniKeyArr = unicodeKey.split('\\u').slice(1);
    len = uniKeyArr.length;
    for (index = _i = 0, _len = uniValueArr.length; _i < _len; index = ++_i) {
      uniValue = uniValueArr[index];
      mod = index % len;
      uniKey = uniKeyArr[mod];
      encodeVal = parseInt(uniValue, 16) + parseInt(uniKey, 16);
      if (encodeVal > 65536) {
        encodeVal = encodeVal - 65536;
      }
      comEncodeVal = ('00' + encodeVal.toString(16)).slice(-4);
      resultArr.push(comEncodeVal);
    }
    resultStr = resultArr.join('\\u');
    return Utils.fromUnicode(resultStr);
  };

  /*
    * 解密
   */
  Encrypt.decode = function(value, key) {
    var comEncodeVal, encodeVal, index, len, mod, resultArr, resultStr, uniKey, uniKeyArr, uniValue, uniValueArr, unicodeKey, unicodeValue, _i, _len;
    if (value === null) {
      return null;
    }
    resultArr = [""];
    key = Sha1.hex_sha1(key);
    unicodeValue = Utils.toUnicode(value);
    unicodeKey = Utils.toUnicode(key);
    uniValueArr = unicodeValue.split("\\u").slice(1);
    uniKeyArr = unicodeKey.split("\\u").slice(1);
    len = uniKeyArr.length;
    for (index = _i = 0, _len = uniValueArr.length; _i < _len; index = ++_i) {
      uniValue = uniValueArr[index];
      mod = index % len;
      uniKey = uniKeyArr[mod];
      encodeVal = parseInt(uniValue, 16) - parseInt(uniKey, 16);
      if (encodeVal < 0) {
        encodeVal = 65536 + encodeVal;
      }
      comEncodeVal = ("00" + encodeVal.toString(16)).slice(-4);
      resultArr.push(comEncodeVal);
    }
    resultStr = resultArr.join("\\u");
    return Utils.fromUnicode(resultStr);
  };
  return Encrypt;
})();

var Storage = (function(){

  
  var Storage;
  Storage = (function() {
    function Storage(options) {
      this.expire = options.expire;
      this.encrypt = options.encrypt;
      this.token = options.name;
      this.insert_guarantee = options.insert_guarantee;
      if (this.expire === "window") {
        if (!Support.sessionstorage()) {
          throw new Error("sessionStorage is not supported!");
        }
        this.storage = sessionStorage;
      } else if (this.expire === "none") {
        if (!Support.localstorage()) {
          throw new Error("localStorage is not supported!");
        }
        this.storage = localStorage;
      }
    }

    Storage.prototype.key = function(index, callback) {
      var e, key;
      try {
        key = this.storage.key(index);
      } catch (_error) {
        e = _error;
        callback(-1, e);
      }
      callback(key);
    };

    Storage.prototype.size = function(callback) {
      var e, size;
      try {
        size = this.storage.length;
      } catch (_error) {
        e = _error;
        callback(-1, e);
      }
      callback(size);
    };

    Storage.prototype.setItem = function(key, val, callback) {
      var cnt, data, e, self;
      self = this;
      cnt = 0;
      try {
        if (this.encrypt) {
          val = Encrypt.encode(val, this.token);
        }
        this.storage.setItem(key, val);
      } catch (_error) {
        e = _error;

        /* TODO
         *  增加过期时间配置项
         */
        if (!this.insert_guarantee) {
          callback(e);
          return;
        }
        if (this.encrypt) {
          val = Encrypt.decode(val, this.token);
        }
        data = Utils.parse(val);
        while (cnt > 10) {
          try {
            data.splice(0, 1);
            val = Utils.stringify(data);
            if (self.encrypt) {
              val = Encrypt.encode(val, self.token);
            }
            self.storage.setItem(key, val);
            cnt = 11;
          } catch (_error) {
            e = _error;
            cnt += 1;
          }
        }
      }
      callback((cnt > 10 ? new Error("exceed maximum times trying setItem into Storage") : void 0));
    };

    Storage.prototype.getItem = function(key, callback) {
      var e, item;
      try {
        item = this.storage.getItem(key);
        if (this.encrypt) {
          item = Encrypt.decode(item, this.token);
        }
      } catch (_error) {
        e = _error;
        callback(null, e);
      }
      callback(item);
    };

    Storage.prototype.removeItem = function(key, callback) {
      var e;
      try {
        this.storage.removeItem(key);
      } catch (_error) {
        e = _error;
        callback(e);
      }
      callback();
    };

    Storage.prototype.usage = function(callback) {

      /*
       *  check it out: http://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage
       */
      var allStrings, e, key, val, _ref;
      try {
        allStrings = "";
        _ref = this.storage;
        for (key in _ref) {
          val = _ref[key];
          allStrings += val;
        }
      } catch (_error) {
        e = _error;
        callback(-1, e);
      }
      return callback(allStrings.length / 512);
    };

    return Storage;

  })();
  return Storage;
})();

var Evemit = (function(){
var __slice = [].slice;


  
  var Evemit, _isIE;

  /*
   *  https://github.com/wh1100717/evemit
   */
  _isIE = window.addEventListener != null ? false : true;
  Evemit = (function() {
    function Evemit(obj) {
      var i, j, _ref;
      if (obj == null) {
        obj = {};
      }
      if (!Utils.isObject(obj)) {
        throw new Error("input type error: Input should be object");
      }
      this.events = {};
      _ref = Evemit.prototype;
      for (i in _ref) {
        j = _ref[i];
        obj[i] = j;
      }
      return obj;
    }

    Evemit.prototype.on = function(eve, fn) {
      this.events[eve] = this.events[eve] || [];
      return this.events[eve].push(fn);
    };

    Evemit.prototype.once = function(eve, fn) {
      var self;
      self = this;
      return this.on(eve, function() {
        self.off(eve);
        return fn.apply(this, arguments);
      });
    };

    Evemit.prototype.off = function(eve) {
      return delete this.events[eve];
    };

    Evemit.prototype.emit = function() {
      var args, e, eve, _i, _len, _ref, _results;
      eve = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (this.events[eve] != null) {
        _ref = this.events[eve];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          _results.push(e.apply(this, args));
        }
        return _results;
      }
    };

    Evemit.prototype.events = function() {
      var e, _results;
      _results = [];
      for (e in this.events) {
        _results.push(e);
      }
      return _results;
    };

    Evemit.prototype.listeners = function(eve) {
      var l, _i, _len, _ref, _results;
      _ref = this.events[eve];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        _results.push(l);
      }
      return _results;
    };

    return Evemit;

  })();
  Evemit.bind = function(el, eve, fn, priority) {
    return el[_isIE ? "attachEvent" : "addEventListener"]("" + (_isIE ? "on" : "") + eve, fn, priority || false);
  };
  Evemit.unbind = function(el, eve, fn, priority) {
    return el[_isIE ? "detachEvent" : "removeEventListener"]("" + (_isIE ? "on" : "") + eve, fn, priority || false);
  };
  return Evemit;
})();

var Proxy = (function(){

  
  var Proxy;
  Proxy = (function() {
    function Proxy(options) {
      var self;
      self = this;
      this.expire = options.expire;
      this.encrypt = options.encrypt;
      this.name = options.name;
      this.proxy = options.proxy;
      this.insert_guarantee = options.insert_guarantee;
      this.evemit = new Evemit();
      this.iframe = Utils.createIframe(this.proxy);
      Evemit.bind(window, "message", function(e) {
        var result;
        result = JSON.parse(e.data);
        if (self.proxy.indexOf(e.origin) === -1) {
          return;
        }
        if (result.data != null) {
          return self.evemit.emit(result.eve, result.data, result.err);
        } else {
          return self.evemit.emit(result.eve, result.err);
        }
      });
    }

    Proxy.prototype.sendMessage = function(type, data, callback) {
      var e, eve, ifrWin, self;
      self = this;
      eve = type + "|" + new Date().getTime();
      data.eve = eve;
      data.expire = this.expire;
      data.encrypt = this.encrypt;
      data.name = this.name;
      data.insert_guarantee = this.insert_guarantee;
      this.evemit.once(eve, callback);
      data = JSON.stringify(data);
      ifrWin = this.iframe.contentWindow;

      /*
       *  当加载非同源iframe时，不能简单的通过 iframe.contentWindow.document.readystate来判断页面是否为complete
       *  第一: readystate为complete不代表server端的localDB初始化完成
       *  第二: 一旦非同源iframe加载完成，则无法访问到readystate
       *  因此通过能否访问到iframe.contentWindow.document来判断其是否完成加载
          *   如果能访问到，则给iframe的load事件增加函数
          *   如果不能访问到，则直接iframe.contentWindow.postMessage发送请求
       */
      try {
        ifrWin.document;
        return Evemit.bind(this.iframe, "load", function() {
          return ifrWin.postMessage(data, Utils.getOrigin(self.proxy));
        });
      } catch (_error) {
        e = _error;
        return ifrWin.postMessage(data, Utils.getOrigin(this.proxy));
      }
    };

    Proxy.prototype.key = function(index, callback) {
      return this.sendMessage("key", {
        index: index
      }, callback);
    };

    Proxy.prototype.size = function(callback) {
      return this.sendMessage("size", {}, callback);
    };

    Proxy.prototype.setItem = function(key, val, callback) {
      return this.sendMessage("setItem", {
        key: key,
        val: val
      }, callback);
    };

    Proxy.prototype.getItem = function(key, callback) {
      return this.sendMessage("getItem", {
        key: key
      }, callback);
    };

    Proxy.prototype.removeItem = function(key, callback) {
      return this.sendMessage("removeItem", {
        key: key
      }, callback);
    };

    Proxy.prototype.usage = function(callback) {
      return this.sendMessage("usage", {}, callback);
    };

    return Proxy;

  })();
  return Proxy;
})();

var Engine = (function(){

  
  var Engine;
  Engine = (function() {
    function Engine(options) {

      /* TODO
       *  增加 @expire 类型判断，目前应该只有"none"和"window"，后续会增加"browser"和Date()类型
       */
      var proxy;
      proxy = options.proxy;
      this.name = options.name;
      if (proxy != null) {
        proxy = proxy.trim();
        if (proxy.indexOf("http") === -1) {
          proxy = "http://" + proxy;
        }
        this.proxy = new Proxy(options);
      } else {
        this.storage = new Storage(options);
      }
      return;
    }

    Engine.prototype.key = function(index, callback) {
      return (this.proxy != null ? this.proxy : this.storage).key(index, callback);
    };

    Engine.prototype.size = function(callback) {
      return (this.proxy != null ? this.proxy : this.storage).size(callback);
    };

    Engine.prototype.setItem = function(key, val, callback) {
      return (this.proxy != null ? this.proxy : this.storage).setItem(key, val, callback);
    };

    Engine.prototype.getItem = function(key, callback) {
      return (this.proxy != null ? this.proxy : this.storage).getItem(key, callback);
    };

    Engine.prototype.removeItem = function(key, callback) {
      return (this.proxy != null ? this.proxy : this.storage).removeItem(key, callback);
    };

    Engine.prototype.usage = function(callback) {
      return (this.proxy != null ? this.proxy : this.storage).usage(callback);
    };

    return Engine;

  })();
  return Engine;
})();

var Server = (function(){

  
  var Server;
  Server = (function() {
    function Server(config) {
      this.config = config;
      this.allow = this.config.allow || "*";
      this.deny = this.config.deny || [];
      this.storages = {};
    }

    Server.prototype.postParent = function(mes, origin) {
      return top.postMessage(JSON.stringify(mes), origin);
    };


    /*
     *  支持正则表达式
     *  支持*.xxx.com/www.*.com/www.xxx.*等格式
     */

    Server.prototype.checkOrigin = function(origin) {
      var flag, rule, _i, _j, _len, _len1, _ref, _ref1;
      origin = Utils.getDomain(origin);
      if (Utils.isString(this.allow)) {
        if (!this.checkRule(origin, this.allow)) {
          return false;
        }
      } else {
        flag = true;
        _ref = this.allow;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rule = _ref[_i];
          if (!(this.checkRule(origin, rule))) {
            continue;
          }
          flag = false;
          break;
        }
        if (flag) {
          return false;
        }
      }
      if (Utils.isString(this.deny)) {
        if (this.checkRule(origin, this.deny)) {
          return false;
        }
      } else {
        _ref1 = this.deny;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          rule = _ref1[_j];
          if (this.checkRule(origin, rule)) {
            return false;
          }
        }
      }
      return true;
    };

    Server.prototype.checkRule = function(url, rule) {
      var seg, segList, _i, _len;
      if (Utils.isRegex(rule)) {
        return rule.test(url);
      }
      if (rule.indexOf("*") !== -1) {
        segList = rule.split("*");
        for (_i = 0, _len = segList.length; _i < _len; _i++) {
          seg = segList[_i];
          if (url.indexOf(seg) === -1) {
            return false;
          }
        }
      } else {
        return url === rule;
      }
      return true;
    };

    Server.prototype.init = function() {
      var self;
      self = this;
      return Evemit.bind(window, "message", function(e) {
        var origin, result, storage;
        origin = e.origin;
        if (!self.checkOrigin(origin)) {
          return false;
        }
        result = JSON.parse(e.data);
        if (self.storages[result.name] == null) {
          self.storages[result.name] = new Storage(result);
        }
        storage = self.storages[result.name];
        switch (result.eve.split("|")[0]) {
          case "key":
            return storage.key(result.index, function(data, err) {
              result.data = data;
              result.err = err;
              return self.postParent(result, origin);
            });
          case "size":
            return storage.size(function(data, err) {
              result.data = data;
              result.err = err;
              return self.postParent(result, origin);
            });
          case "setItem":
            return storage.setItem(result.key, result.val, function(err) {
              result.err = err;
              return self.postParent(result, origin);
            });
          case "getItem":
            return storage.getItem(result.key, function(data, err) {
              result.data = data;
              result.err = err;
              return self.postParent(result, origin);
            });
          case "removeItem":
            return storage.removeItem(result.key, function(err) {
              result.err = err;
              return self.postParent(result, origin);
            });
          case "usage":
            return storage.usage(function(data, err) {
              result.data = data;
              result.err = err;
              return self.postParent(result, origin);
            });
        }
      });
    };

    return Server;

  })();
  return Server;
})();

var LocalDB = (function(){

  
  var LocalDB, dbPrefix, version;
  dbPrefix = "ldb_";
  version = "0.1.0"

  /**
   *  @class LocalDB
   *  @classdesc LocalDB用来生成数据库对象
   *  @author [wh1100717]{@link https://github.com/wh1100717}
   *  @param  {String}    dbName - 数据库名
   *  @param  {Object}    [options] 配置参数
   *  @param  {String}    [options.expire="window"] - "window"：数据随着当前页面标签关闭而消失, "none"：数据会一直存在对应的域内，不随着页面或者浏览器关闭而消失。
   *  @param  {Boolean}   [options.encrypt=true] - true：对存储的数据进行加密操作
   *  @param  {String}    [options.proxy=null] - 指定proxy url来进行跨域数据存取，具体请参考@todo Proxy文档
   *  @return {LocalDB}
   *  @example
  ```javascript
  var db = new LocalDB("foo")
  var db = new LocaoDB("foo", {
     expire: "window",
     encrypt: true,
     proxy: "http://www.foo.com/getProxy.html"
  })
  ```
   *  @todo 增加 options.expire 对"browser"的支持，数据可以在可以在同一个域的多个页面之间共享，但随着浏览器关闭而消失。
   *  @todo 增加 options.expire 对"Date()"的支持，数据可以在指定日期内一直存在。
   */
  LocalDB = (function() {
    function LocalDB(dbName, options) {
      if (options == null) {
        options = {};
      }
      if (dbName == null) {
        throw new Error("dbName should be specified.");
      }
      this.name = dbPrefix + dbName;
      this.expire = options.expire != null ? options.expire : "window";
      this.encrypt = options.encrypt != null ? options.encrypt : true;
      this.proxy = options.proxy != null ? options.proxy : null;
      this.insert_guarantee = options.guarantee ? options.guarantee : false;
      this.engine = new Engine({
        expire: this.expire,
        encrypt: this.encrypt,
        name: this.name,
        proxy: this.proxy,
        insert_guarantee: this.insert_guarantee
      });
    }


    /**
     *  @function LocalDB#options
     *  @desc get options
     *  @instance
     *  @return {Object}
     *  @example
     var db = new LocalDB("foo")
     var options = db.options()
     console.log(options)
     */

    LocalDB.prototype.options = function() {
      return {
        name: this.name.substr(dbPrefix.length),
        expire: this.expire,
        encrypt: this.encrypt,
        proxy: this.proxy
      };
    };


    /**
     *  @function LocalDB#collection
     *  @desc get collection
     *  @instance
     *  @param {String} collectionName - collection Name
     *  @return {Collection}    Instance of Collection Class
     *  @example
     var db = new LocalDB("foo")
     var collection = db.collection("bar")
     console.log(typeof collection)
     */

    LocalDB.prototype.collection = function(collectionName) {
      if (collectionName == null) {
        throw new Error("collectionName should be specified.");
      }
      return new Collection(collectionName, this.engine);
    };


    /*
     *  Delete Collection: db.drop(collectionName)
     *  Delete DB: db.drop()
     */

    return LocalDB;

  })();

  /**
   *  @function LocalDB.getSupport
   *  @desc Check Browser Feature Compatibility
   *  @return {Support}
   *  @example
   if(LocalDB.getSupport().localstorage()){
      alert("Your Browser support LocalStorage!")
   }
   */
  LocalDB.getSupport = function() {
    return Support;
  };

  /**
   *  @function LocalDB.getVersion
   *  @desc Get LocalDB version
   *  @return {String}
   *  @example
   console.log("The version of LocalDB is:", LocalDB.getVersion())
   */
  LocalDB.getVersion = function() {
    return version;
  };

  /**
   *  @function LocalDB.getTimestamp
   *  @desc Convert ObjectId to timestamp
   *  @param {String} objectId
   *  @return {Number}
   */
  LocalDB.getTimestamp = function(objectId) {
    return Utils.getTimestamp(objectId);
  };

  /**
   *  @function LocalDB.getTime
   *  @desc Convert ObjectId to time
   *  @param {String} objectId
   *  @return {String}
   */
  LocalDB.getTime = function(objectId) {
    return Utils.getTime(objectId);
  };

  /**
   *  @function LocalDB.init
   *  @desc Proxy Server Init
   *  @param {Object} config
   */
  LocalDB.init = function(config) {
    return (new Server(config)).init();
  };
  return LocalDB;
})();


  if ( typeof define === "function" && define.amd ) {
    define( "localdb", [], function() {
      return LocalDB;
    });
  }

  if (!noGlobal) {
    window.LocalDB = LocalDB
  }

  return LocalDB
}));