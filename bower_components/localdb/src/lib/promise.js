define(function(require, exports, module) {
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

  return module.exports = Promise;
});