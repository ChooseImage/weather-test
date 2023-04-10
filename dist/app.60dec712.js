// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"js/apis/climacell.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFallback = exports.getWeatherData = exports.API_TYPE = void 0;
var BASE_URL = 'https://api.tomorrow.io/v4/';
var getTimelineURL = 'https://api.tomorrow.io/v4/';
var apikey = 'QX5jHmzWfoGvZBPZk7oFzJsbPuZWa8RK';
var API_TYPE = {
  SINGLE: 'single',
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  VUP: 'vup',
  DAY: 'day'
};
exports.API_TYPE = API_TYPE;
var STATUS = {
  DAY: 'day',
  DUSK: 'dusk',
  NIGHT: 'night'
};
var fields = ["temperature", "temperatureApparent", "weatherCode"];
var units = "metric";
var timesteps = ["current", "1h", "1d"]; // configure the time frame up to 6 hours back and 15 days out
// const now = moment.utc();
// const startTime = moment.utc(now).add(0, "minutes").toISOString();
// const endTime = moment.utc(now).add(1, "days").toISOString();
// specify the timezone, using standard IANA timezone format

var timezone = "America/New_York";

var composeUrl = function composeUrl() {
  return BASE_URL + getTimelineParameters;
};

var fetchData = function fetchData(handleErr) {
  var composeUrl = "https://api.tomorrow.io/v4/timelines?location=40.75872069597532,-73.98529171943665&fields=windDirection&fields=weatherCode&fields=windSpeed&fields=uvIndex&fields=humidity&fields=temperature&fields=precipitationIntensity&fields=temperatureApparent&timesteps=1h&units=imperial&apikey=QX5jHmzWfoGvZBPZk7oFzJsbPuZWa8RK";
  return fetch(composeUrl).then(function (res) {
    return res.json();
  }).catch(function (err) {
    console.log('fetchData error => ', err);
    if (handleErr) handleErr();
  });
};

var setFallback = function setFallback() {// document.querySelector('#fallback').style.display = 'block';
};

exports.setFallback = setFallback;

var getWeatherData = function getWeatherData(lat, lon) {
  return fetchData(setFallback).then(function (data) {
    return data.data;
  });
}; // --------------------------------------------------------------------------
// import { fetchData } from '../app';
// // const BASE_URL = 'https://api.climacell.co/v3/weather/';
// const BASE_URL = 'https://api.tomorrow.io/v4/';
// // const API_KEY = 'fytHP6dyBi7TfXM8mOji5jZteZU0DUko';
// const API_KEY = 'QX5jHmzWfoGvZBPZk7oFzJsbPuZWa8RK';
// export const API_TYPE = {
//   SINGLE: 'single',
//   LEFT: 'left',
//   CENTER: 'center',
//   RIGHT: 'right',
//   VUP: 'vup',
//   DAY: 'day',
// };
// const STATUS = {
//   DAY: 'day',
//   DUSK: 'dusk',
//   NIGHT: 'night',
// };
// // get dayparting based on sunrise and sunset
// export const getDaypart = (time, sunrise, sunset) => {
//   // let time = new Date();
//   const offset = 15 * 60 * 1000; // 15 mins
//   // console.log('sunset => ', sunset);
//   let period = '';
//   if (
//     (time > sunrise - offset && time < sunrise + offset) ||
//     (time > sunset - offset && time < sunset + offset)
//   ) {
//     period = STATUS.DUSK;
//   } else if (time > sunrise + offset && time < sunset - offset) {
//     period = STATUS.DAY;
//   } else {
//     period = STATUS.NIGHT;
//   }
//   return period;
// };
// const composeUrl = (lat, lon, type) => {
//   switch (type) {
//     case API_TYPE.SINGLE:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=temperature&fields=temperatureApparent&fields=weatherCode&timesteps=current,1h&startTime=${new Date().toISOString()}&endTime=${new Date().addHours(
//           6
//         )}&apikey=${API_KEY}`
//       );
//     case API_TYPE.LEFT:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=temperature&fields=temperatureApparent&fields=weatherCode&timesteps=current&apikey=${API_KEY}`
//       );
//     case API_TYPE.CENTER:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=temperature&fields=temperatureApparent&fields=weatherCode&timesteps=1h&startTime=${new Date().toISOString()}&endTime=${new Date().addHours(
//           6
//         )}&apikey=${API_KEY}`
//       );
//     case API_TYPE.RIGHT:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=temperature&fields=temperatureApparent&fields=humidity&fields=windSpeed&fields=windDirection&fields=weatherCode&fields=uvIndex&fields=epaIndex&fields=epaHealthConcern&timesteps=current,1h&startTime=${new Date().toISOString()}&endTime=${new Date().addHours(
//           6
//         )}&apikey=${API_KEY}`
//       );
//     case API_TYPE.VUP:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=temperature&fields=temperatureApparent&fields=weatherCode&timesteps=current&apikey=${API_KEY}`
//       );
//     case API_TYPE.DAY:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=sunriseTime&fields=sunsetTime&timesteps=1d&startTime=${new Date().toISOString()}&endTime=${new Date().addHours(
//           25
//         )}&apikey=${API_KEY}`
//       );
//     default:
//       return '';
//   }
// };
// export const setFallback = () => {
//   document.querySelector('#fallback').style.display = 'block';
// };
// // forecast time info display
// export const getForecastTime = timeStr => {
//   return new Date(timeStr)
//     .toLocaleTimeString([], { hour: 'numeric' })
//     .toLocaleLowerCase();
// };
// // parse weather code for setting icons
// export const parseWeatherCode = (weatherCode, period) => {
//   const isDay = period !== STATUS.NIGHT;
//   switch (weatherCode) {
//     case 1000:
//     case 1100:
//     case 1101:
//       return isDay ? `${weatherCode}_day` : `${weatherCode}_night`;
//     default:
//       return weatherCode;
//   }
// };
// // parse sunrise/sunset info
// export const getSunTime = (sunriseStr, sunsetStr) => {
//   const offset = 15 * 60 * 1000; // 15 mins
//   const sunrise = new Date(sunriseStr);
//   const sunset = new Date(sunsetStr);
//   const timeStr = new Date() - sunrise < offset ? sunrise : sunset;
//   const title = new Date() - sunrise < offset ? 'Sunrise' : 'Sunset';
//   return {
//     title,
//     time: timeStr
//       .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
//       .toLowerCase(),
//   };
// };
// export const parseMoonPhase = str => {
//   return str.split('_').join(' ');
// };
// // round hours - 7:10 => 7; 7:40 => 8
// export const getForecastIndex = startTime => {
//   return new Date() - new Date(startTime) >= 1000 * 60 * 30 ? 3 : 2;
// };
// export const getWeatherData = (lat, lon, type) => {
//   return fetchData(composeUrl(lat, lon, type), setFallback).then(
//     data => data.data
//   );
// };


exports.getWeatherData = getWeatherData;
},{}],"js/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transitKey = exports.localTags = exports.WEEKBOARD = exports.WEATHER_CONDITIONS = exports.WASHINGTON_DC = exports.UV_PROPERTIES = exports.TAG_TYPE = exports.REALTIME_INTERVAL = exports.MONTHBOARD = exports.FORECAST_INTERVAL = exports.DEFAULT = exports.DAY_INTERVAL = exports.BOSTON = exports.AIR_QUALITY = void 0;
var WEATHER_CONDITIONS = {
  0: 'Unknown',
  1000: 'Clear, Sunny',
  1100: 'Mostly Clear',
  1101: 'Partly Cloudy',
  1102: 'Mostly Cloudy',
  1001: 'Cloudy',
  2000: 'Fog',
  2100: 'Light Fog',
  4000: 'Drizzle',
  4001: 'Rain',
  4200: 'Light Rain',
  4201: 'Heavy Rain',
  5000: 'Snow',
  5001: 'Flurries',
  5100: 'Light Snow',
  5101: 'Heavy Snow',
  6000: 'Freezing Drizzle',
  6001: 'Freezing Rain',
  6200: 'Light Freezing Rain',
  6201: 'Heavy Freezing Rain',
  7000: 'Ice Pellets',
  7101: 'Heavy Ice Pellets',
  7102: 'Light Ice Pellets',
  8000: 'Thunderstorm'
};
exports.WEATHER_CONDITIONS = WEATHER_CONDITIONS;
var UV_PROPERTIES = {
  0: ["#89e665", "Low"],
  1: ["#89e665", "Low"],
  2: ["#89e665", "Low"],
  3: ["#f7d84a", "Moderate"],
  4: ["#f7d84a", "Moderate"],
  5: ["#f7d84a", "Moderate"],
  6: ["#ed912f", "High"],
  7: ["#ed912f", "High"],
  8: ["#ed462f", "Very High"],
  9: ["#ed462f", "Very High"],
  10: ["#ed462f", "Very High"],
  11: ["#d239ed", "Extreme"]
};
exports.UV_PROPERTIES = UV_PROPERTIES;
var AIR_QUALITY = {
  0: 'Good',
  1: 'Moderate',
  2: 'Unhealthy for Sensitive Groups',
  3: 'Unhealthy',
  4: 'Very Unhealthy',
  5: 'Hazardous'
};
exports.AIR_QUALITY = AIR_QUALITY;
var FORECAST_INTERVAL = 45 * 60 * 1000; // 45 minutes

exports.FORECAST_INTERVAL = FORECAST_INTERVAL;
var REALTIME_INTERVAL = 20 * 60 * 1000; // 20 minutes

exports.REALTIME_INTERVAL = REALTIME_INTERVAL;
var DAY_INTERVAL = 24 * 60 * 60 * 1000; // 24 hour

exports.DAY_INTERVAL = DAY_INTERVAL;
var BOSTON = {
  LAT: 42.3601,
  LON: -71.0589
};
exports.BOSTON = BOSTON;
var WASHINGTON_DC = {
  LAT: 38.9072,
  LON: -77.0369
}; // tag type on the boards

exports.WASHINGTON_DC = WASHINGTON_DC;
var TAG_TYPE = {
  TA: 'Transit_authority',
  NYCT: 'mta_subway_stop',
  LIRR: 'mta_subway_stop',
  MNR: 'mta_subway_stop',
  MBTA: 'Station',
  OTHER: 'Station'
}; // sample tag data

exports.TAG_TYPE = TAG_TYPE;
var localTags = {
  tags: [{
    name: 'Transit_authority',
    value: ['NYCT'] // NYCT, MBTA, other...

  }, {
    name: 'mta_subway_stop',
    value: ['R28'] // G06

  }, {
    name: 'Station',
    value: ['Airport']
  }]
};
exports.localTags = localTags;
var transitKey = {
  NYCT: {
    name: 'Stop Name',
    lat: 'GTFS Latitude',
    lon: 'GTFS Longitude',
    id: 'GTFS Stop ID'
  },
  MBTA: {
    name: 'description',
    lat: 'latitude',
    lon: 'longitude',
    id: 'station'
  },
  LIRR: {
    name: 'stop_name',
    lat: 'stop_lat',
    lon: 'stop_lon',
    id: 'stop_id'
  },
  MNR: {
    name: 'stop_name',
    lat: 'stop_lat',
    lon: 'stop_lon',
    id: 'stop_id'
  },
  OTHER: {
    name: 'description',
    lat: 'latitude',
    lon: 'longitude',
    id: 'station'
  }
};
exports.transitKey = transitKey;
var DEFAULT = {
  STATION: {
    MBTA: {
      name: 'Boston',
      lat: 42.3601,
      lon: -71.0589,
      id: 'Boston'
    },
    NYCT: {
      name: 'New York',
      lat: 40.7128,
      lon: -74.006,
      id: 'New York'
    },
    LIRR: {
      name: 'New York',
      lat: 40.7128,
      lon: -74.006,
      id: 'New York'
    },
    MNR: {
      name: 'New York',
      lat: 40.7128,
      lon: -74.006,
      id: 'New York'
    },
    MARTA: {
      name: 'Atlanta',
      lat: 33.749,
      lon: -84.388,
      id: 'Atlanta'
    },
    Caltrain: {
      name: '4th & King Station',
      lat: 37.77605,
      lon: -122.3944,
      id: '4thKing'
    },
    BART: {
      name: 'San Francisco',
      lat: 37.7749,
      lon: -122.4194,
      id: 'San Francisco'
    },
    'BART-VTA': {
      name: 'San Francisco',
      lat: 37.7749,
      lon: -122.4194,
      id: 'San Francisco'
    },
    WMATA: {
      name: 'Washington, D.C.',
      lat: 38.9072,
      lon: -77.0369,
      id: 'Washington, D.C.'
    },
    Citylites: {
      name: 'Minneapolis',
      lat: 44.9778,
      lon: -93.265,
      id: 'Minneapolis'
    },
    Brightline: {
      name: 'Miami',
      lat: 25.78009,
      lon: -80.195312,
      id: 'Miami'
    }
  }
};
exports.DEFAULT = DEFAULT;
var MONTHBOARD = {
  0: "Janurary",
  1: "Feburary",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December"
};
exports.MONTHBOARD = MONTHBOARD;
var WEEKBOARD = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednsday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
};
exports.WEEKBOARD = WEEKBOARD;
},{}],"js/app.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setElementContent = exports.isDay = exports.getUVIndex = exports.getDayTimeStr = exports.getDayData = exports.getCurrentTime = exports.fetchData = exports.degToDir = exports.createTempText = void 0;

var _climacell = require("./apis/climacell");

var _constants = require("./constants");

/**
 * Global js file
 */

/*********************
 * Common Functions
 *********************/
var fetchData = function fetchData(url, handleErr) {
  return fetch(url).then(function (res) {
    return res.json();
  }).catch(function (err) {
    console.log('fetchData error => ', err);
    if (handleErr) handleErr();
  });
}; // get day/night state for assets


exports.fetchData = fetchData;

var isDay = function isDay(hur) {
  return hur < 19;
}; // for calculating forecast hour


exports.isDay = isDay;

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this.toISOString();
}; // get the start/end time of the day


var getDayTimeStr = function getDayTimeStr(hur) {
  return new Date(new Date().setHours(hur)).toISOString();
};

exports.getDayTimeStr = getDayTimeStr;

var createTempText = function createTempText(temp) {
  return temp + '°';
};

exports.createTempText = createTempText;

var setElementContent = function setElementContent(id, content) {
  document.getElementById(id).innerHTML = content;
};

exports.setElementContent = setElementContent;

var degToDir = function degToDir(num) {
  var val = Math.floor(num / 22.5 + 0.5);
  var arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return arr[val % 16];
};

exports.degToDir = degToDir;

var getCurrentTime = function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  }).toLowerCase();
};

exports.getCurrentTime = getCurrentTime;

var hideFallback = function hideFallback() {
  document.getElementById('fallback').style.display = 'none';
};

var getDayData = function getDayData(stationInfo) {
  var lastUpdatedDay = localStorage.getItem('lastUpdatedDay');
  var dayData = JSON.parse(localStorage.getItem('dayData'));
  var stationID = localStorage.getItem('stationID');

  var parseDayData = function parseDayData(dataArr) {
    hideFallback();
    return Date.now() > new Date(dataArr[0].values.sunsetTime) ? dataArr[1].values : dataArr[0].values;
  };

  if (!dayData || stationID !== stationInfo.id || Date.now() - lastUpdatedDay * 1 > _constants.DAY_INTERVAL) {
    return (0, _climacell.getWeatherData)(stationInfo.lat, stationInfo.lon, _climacell.API_TYPE.DAY).then(function (data) {
      var timelines = data.timelines;
      var newDayData;

      if (timelines) {
        newDayData = timelines[0].intervals;
        localStorage.setItem('lastUpdatedDay', Date.now());
        localStorage.setItem('dayData', JSON.stringify(newDayData));
        localStorage.setItem('stationID', stationInfo.id); // TODO: hide fallback
      }

      return parseDayData(newDayData);
    });
  } else {
    return parseDayData(dayData);
  }
};

exports.getDayData = getDayData;

var getUVIndex = function getUVIndex(index) {
  if (index <= 2) {
    return 'Low';
  } else if (index <= 5) {
    return 'Moderate';
  } else if (index <= 7) {
    return 'High';
  } else if (index <= 10) {
    return 'Very High';
  } else if (index >= 11) {
    return 'Extreme';
  } else {
    return '--';
  }
};

exports.getUVIndex = getUVIndex;
},{"./apis/climacell":"js/apis/climacell.js","./constants":"js/constants.js"}],"pages/assets/icons/1000_day.svg":[function(require,module,exports) {
module.exports = "/1000_day.01a92fb3.svg";
},{}],"pages/assets/icons/1000_night.svg":[function(require,module,exports) {
module.exports = "/1000_night.248c811e.svg";
},{}],"pages/assets/icons/1001.svg":[function(require,module,exports) {
module.exports = "/1001.dbfeda0d.svg";
},{}],"pages/assets/icons/1100_day.svg":[function(require,module,exports) {
module.exports = "/1100_day.438cdaa8.svg";
},{}],"pages/assets/icons/1100_night.svg":[function(require,module,exports) {
module.exports = "/1100_night.39f59837.svg";
},{}],"pages/assets/icons/1101_day.svg":[function(require,module,exports) {
module.exports = "/1101_day.841c7097.svg";
},{}],"pages/assets/icons/1101_night.svg":[function(require,module,exports) {
module.exports = "/1101_night.5e93c2d3.svg";
},{}],"pages/assets/icons/1102.svg":[function(require,module,exports) {
module.exports = "/1102.17af8a06.svg";
},{}],"pages/assets/icons/2000.svg":[function(require,module,exports) {
module.exports = "/2000.cc586866.svg";
},{}],"pages/assets/icons/2100.svg":[function(require,module,exports) {
module.exports = "/2100.df655d73.svg";
},{}],"pages/assets/icons/4000.svg":[function(require,module,exports) {
module.exports = "/4000.9a7c4530.svg";
},{}],"pages/assets/icons/4001.svg":[function(require,module,exports) {
module.exports = "/4001.707f625b.svg";
},{}],"pages/assets/icons/4200.svg":[function(require,module,exports) {
module.exports = "/4200.ef1f1b20.svg";
},{}],"pages/assets/icons/4201.svg":[function(require,module,exports) {
module.exports = "/4201.0445076b.svg";
},{}],"pages/assets/icons/5000.svg":[function(require,module,exports) {
module.exports = "/5000.929797b3.svg";
},{}],"pages/assets/icons/5001.svg":[function(require,module,exports) {
module.exports = "/5001.8148ae68.svg";
},{}],"pages/assets/icons/5100.svg":[function(require,module,exports) {
module.exports = "/5100.48f232e4.svg";
},{}],"pages/assets/icons/5101.svg":[function(require,module,exports) {
module.exports = "/5101.11b90383.svg";
},{}],"pages/assets/icons/6000.svg":[function(require,module,exports) {
module.exports = "/6000.c846438f.svg";
},{}],"pages/assets/icons/6001.svg":[function(require,module,exports) {
module.exports = "/6001.62b4e195.svg";
},{}],"pages/assets/icons/6201.svg":[function(require,module,exports) {
module.exports = "/6201.7d4cc5d2.svg";
},{}],"pages/assets/icons/6200.svg":[function(require,module,exports) {
module.exports = "/6200.87316dba.svg";
},{}],"pages/assets/icons/7000.svg":[function(require,module,exports) {
module.exports = "/7000.45e2edb2.svg";
},{}],"pages/assets/icons/7101.svg":[function(require,module,exports) {
module.exports = "/7101.7010a4b3.svg";
},{}],"pages/assets/icons/7102.svg":[function(require,module,exports) {
module.exports = "/7102.61ff471c.svg";
},{}],"pages/assets/icons/8000.svg":[function(require,module,exports) {
module.exports = "/8000.2733412f.svg";
},{}],"pages/assets/icons/*.svg":[function(require,module,exports) {
module.exports = {
  "1001": require("./1001.svg"),
  "1102": require("./1102.svg"),
  "2000": require("./2000.svg"),
  "2100": require("./2100.svg"),
  "4000": require("./4000.svg"),
  "4001": require("./4001.svg"),
  "4200": require("./4200.svg"),
  "4201": require("./4201.svg"),
  "5000": require("./5000.svg"),
  "5001": require("./5001.svg"),
  "5100": require("./5100.svg"),
  "5101": require("./5101.svg"),
  "6000": require("./6000.svg"),
  "6001": require("./6001.svg"),
  "6200": require("./6200.svg"),
  "6201": require("./6201.svg"),
  "7000": require("./7000.svg"),
  "7101": require("./7101.svg"),
  "7102": require("./7102.svg"),
  "8000": require("./8000.svg"),
  "1000_day": require("./1000_day.svg"),
  "1000_night": require("./1000_night.svg"),
  "1100_day": require("./1100_day.svg"),
  "1100_night": require("./1100_night.svg"),
  "1101_day": require("./1101_day.svg"),
  "1101_night": require("./1101_night.svg")
};
},{"./1000_day.svg":"pages/assets/icons/1000_day.svg","./1000_night.svg":"pages/assets/icons/1000_night.svg","./1001.svg":"pages/assets/icons/1001.svg","./1100_day.svg":"pages/assets/icons/1100_day.svg","./1100_night.svg":"pages/assets/icons/1100_night.svg","./1101_day.svg":"pages/assets/icons/1101_day.svg","./1101_night.svg":"pages/assets/icons/1101_night.svg","./1102.svg":"pages/assets/icons/1102.svg","./2000.svg":"pages/assets/icons/2000.svg","./2100.svg":"pages/assets/icons/2100.svg","./4000.svg":"pages/assets/icons/4000.svg","./4001.svg":"pages/assets/icons/4001.svg","./4200.svg":"pages/assets/icons/4200.svg","./4201.svg":"pages/assets/icons/4201.svg","./5000.svg":"pages/assets/icons/5000.svg","./5001.svg":"pages/assets/icons/5001.svg","./5100.svg":"pages/assets/icons/5100.svg","./5101.svg":"pages/assets/icons/5101.svg","./6000.svg":"pages/assets/icons/6000.svg","./6001.svg":"pages/assets/icons/6001.svg","./6201.svg":"pages/assets/icons/6201.svg","./6200.svg":"pages/assets/icons/6200.svg","./7000.svg":"pages/assets/icons/7000.svg","./7101.svg":"pages/assets/icons/7101.svg","./7102.svg":"pages/assets/icons/7102.svg","./8000.svg":"pages/assets/icons/8000.svg"}],"js/weatherApi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getDaypart", {
  enumerable: true,
  get: function () {
    return _climacell.getDaypart;
  }
});
Object.defineProperty(exports, "getForecastIndex", {
  enumerable: true,
  get: function () {
    return _climacell.getForecastIndex;
  }
});
Object.defineProperty(exports, "getForecastTime", {
  enumerable: true,
  get: function () {
    return _climacell.getForecastTime;
  }
});
Object.defineProperty(exports, "getSunTime", {
  enumerable: true,
  get: function () {
    return _climacell.getSunTime;
  }
});
Object.defineProperty(exports, "getWeatherData", {
  enumerable: true,
  get: function () {
    return _climacell.getWeatherData;
  }
});
Object.defineProperty(exports, "icons", {
  enumerable: true,
  get: function () {
    return _.default;
  }
});
Object.defineProperty(exports, "parseMoonPhase", {
  enumerable: true,
  get: function () {
    return _climacell.parseMoonPhase;
  }
});
Object.defineProperty(exports, "parseWeatherCode", {
  enumerable: true,
  get: function () {
    return _climacell.parseWeatherCode;
  }
});

var _climacell = require("./apis/climacell");

var _ = _interopRequireDefault(require("../pages/assets/icons/*.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./apis/climacell":"js/apis/climacell.js","../pages/assets/icons/*.svg":"pages/assets/icons/*.svg"}],"data/transit/mta-geo.json":[function(require,module,exports) {
module.exports = [{
  "Station ID": 1,
  "Complex ID": 1,
  "GTFS Stop ID": "R01",
  "Division": "BMT",
  "Line": "Astoria",
  "Stop Name": "Astoria-Ditmars Blvd",
  "Borough": "Q",
  "Daytime Routes": "N W",
  "Structure": "Elevated",
  "GTFS Latitude": 40.775036,
  "GTFS Longitude": -73.912034,
  "North Direction Label": "",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 2,
  "Complex ID": 2,
  "GTFS Stop ID": "R03",
  "Division": "BMT",
  "Line": "Astoria",
  "Stop Name": "Astoria Blvd",
  "Borough": "Q",
  "Daytime Routes": "N W",
  "Structure": "Elevated",
  "GTFS Latitude": 40.770258,
  "GTFS Longitude": -73.917843,
  "North Direction Label": "Ditmars Blvd",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 3,
  "Complex ID": 3,
  "GTFS Stop ID": "R04",
  "Division": "BMT",
  "Line": "Astoria",
  "Stop Name": "30 Av",
  "Borough": "Q",
  "Daytime Routes": "N W",
  "Structure": "Elevated",
  "GTFS Latitude": 40.766779,
  "GTFS Longitude": -73.921479,
  "North Direction Label": "Astoria - Ditmars Blvd",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 4,
  "Complex ID": 4,
  "GTFS Stop ID": "R05",
  "Division": "BMT",
  "Line": "Astoria",
  "Stop Name": "Broadway",
  "Borough": "Q",
  "Daytime Routes": "N W",
  "Structure": "Elevated",
  "GTFS Latitude": 40.76182,
  "GTFS Longitude": -73.925508,
  "North Direction Label": "Astoria - Ditmars Blvd",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 5,
  "Complex ID": 5,
  "GTFS Stop ID": "R06",
  "Division": "BMT",
  "Line": "Astoria",
  "Stop Name": "36 Av",
  "Borough": "Q",
  "Daytime Routes": "N W",
  "Structure": "Elevated",
  "GTFS Latitude": 40.756804,
  "GTFS Longitude": -73.929575,
  "North Direction Label": "Astoria - Ditmars Blvd",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 6,
  "Complex ID": 6,
  "GTFS Stop ID": "R08",
  "Division": "BMT",
  "Line": "Astoria",
  "Stop Name": "39 Av-Dutch Kills",
  "Borough": "Q",
  "Daytime Routes": "N W",
  "Structure": "Elevated",
  "GTFS Latitude": 40.752882,
  "GTFS Longitude": -73.932755,
  "North Direction Label": "Astoria - Ditmars Blvd",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 7,
  "Complex ID": 613,
  "GTFS Stop ID": "R11",
  "Division": "BMT",
  "Line": "Astoria",
  "Stop Name": "Lexington Av/59 St",
  "Borough": "M",
  "Daytime Routes": "N W R",
  "Structure": "Subway",
  "GTFS Latitude": 40.76266,
  "GTFS Longitude": -73.967258,
  "North Direction Label": "Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 8,
  "Complex ID": 8,
  "GTFS Stop ID": "R13",
  "Division": "BMT",
  "Line": "Astoria",
  "Stop Name": "5 Av/59 St",
  "Borough": "M",
  "Daytime Routes": "N W R",
  "Structure": "Subway",
  "GTFS Latitude": 40.764811,
  "GTFS Longitude": -73.973347,
  "North Direction Label": "Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 9,
  "Complex ID": 9,
  "GTFS Stop ID": "R14",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "57 St-7 Av",
  "Borough": "M",
  "Daytime Routes": "N Q R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.764664,
  "GTFS Longitude": -73.980658,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 10,
  "Complex ID": 10,
  "GTFS Stop ID": "R15",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "49 St",
  "Borough": "M",
  "Daytime Routes": "N R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.759901,
  "GTFS Longitude": -73.984139,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 2,
  "ADA Notes": "Uptown only"
}, {
  "Station ID": 11,
  "Complex ID": 611,
  "GTFS Stop ID": "R16",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Times Sq-42 St",
  "Borough": "M",
  "Daytime Routes": "N Q R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.754672,
  "GTFS Longitude": -73.986754,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 12,
  "Complex ID": 607,
  "GTFS Stop ID": "R17",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "34 St-Herald Sq",
  "Borough": "M",
  "Daytime Routes": "N Q R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.749567,
  "GTFS Longitude": -73.98795,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 13,
  "Complex ID": 13,
  "GTFS Stop ID": "R18",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "28 St",
  "Borough": "M",
  "Daytime Routes": "R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.745494,
  "GTFS Longitude": -73.988691,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 14,
  "Complex ID": 14,
  "GTFS Stop ID": "R19",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "23 St",
  "Borough": "M",
  "Daytime Routes": "R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.741303,
  "GTFS Longitude": -73.989344,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 15,
  "Complex ID": 602,
  "GTFS Stop ID": "R20",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "14 St-Union Sq",
  "Borough": "M",
  "Daytime Routes": "N Q R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.735736,
  "GTFS Longitude": -73.990568,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 16,
  "Complex ID": 16,
  "GTFS Stop ID": "R21",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "8 St-NYU",
  "Borough": "M",
  "Daytime Routes": "R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.730328,
  "GTFS Longitude": -73.992629,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 17,
  "Complex ID": 17,
  "GTFS Stop ID": "R22",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Prince St",
  "Borough": "M",
  "Daytime Routes": "R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.724329,
  "GTFS Longitude": -73.997702,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 18,
  "Complex ID": 623,
  "GTFS Stop ID": "R23",
  "Division": "BMT",
  "Line": "Broadway",
  "Stop Name": "Canal St",
  "Borough": "M",
  "Daytime Routes": "R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.719527,
  "GTFS Longitude": -74.001775,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 19,
  "Complex ID": 623,
  "GTFS Stop ID": "Q01",
  "Division": "BMT",
  "Line": "Manhattan Bridge",
  "Stop Name": "Canal St",
  "Borough": "M",
  "Daytime Routes": "N Q",
  "Structure": "Subway",
  "GTFS Latitude": 40.718383,
  "GTFS Longitude": -74.00046,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 20,
  "Complex ID": 20,
  "GTFS Stop ID": "R24",
  "Division": "BMT",
  "Line": "Broadway",
  "Stop Name": "City Hall",
  "Borough": "M",
  "Daytime Routes": "R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.713282,
  "GTFS Longitude": -74.006978,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 21,
  "Complex ID": 624,
  "GTFS Stop ID": "R25",
  "Division": "BMT",
  "Line": "Broadway",
  "Stop Name": "Cortlandt St",
  "Borough": "M",
  "Daytime Routes": "R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.710668,
  "GTFS Longitude": -74.011029,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 22,
  "Complex ID": 22,
  "GTFS Stop ID": "R26",
  "Division": "BMT",
  "Line": "Broadway",
  "Stop Name": "Rector St",
  "Borough": "M",
  "Daytime Routes": "R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.70722,
  "GTFS Longitude": -74.013342,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 23,
  "Complex ID": 635,
  "GTFS Stop ID": "R27",
  "Division": "BMT",
  "Line": "Broadway",
  "Stop Name": "Whitehall St-South Ferry",
  "Borough": "M",
  "Daytime Routes": "R W",
  "Structure": "Subway",
  "GTFS Latitude": 40.703087,
  "GTFS Longitude": -74.012994,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 24,
  "Complex ID": 620,
  "GTFS Stop ID": "R28",
  "Division": "BMT",
  "Line": "Broadway",
  "Stop Name": "Court St",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.6941,
  "GTFS Longitude": -73.991777,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Bay Ridge - 95 St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 25,
  "Complex ID": 636,
  "GTFS Stop ID": "R29",
  "Division": "BMT",
  "Line": "Broadway",
  "Stop Name": "Jay St-MetroTech",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.69218,
  "GTFS Longitude": -73.985942,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Bay Ridge - 95 St",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 26,
  "Complex ID": 26,
  "GTFS Stop ID": "R30",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "DeKalb Av",
  "Borough": "Bk",
  "Daytime Routes": "B Q R",
  "Structure": "Subway",
  "GTFS Latitude": 40.690635,
  "GTFS Longitude": -73.981824,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island - Bay Ridge",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 27,
  "Complex ID": 617,
  "GTFS Stop ID": "R31",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "Atlantic Av-Barclays Ctr",
  "Borough": "Bk",
  "Daytime Routes": "D N R",
  "Structure": "Subway",
  "GTFS Latitude": 40.683666,
  "GTFS Longitude": -73.97881,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island - Bay Ridge",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 28,
  "Complex ID": 28,
  "GTFS Stop ID": "R32",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "Union St",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.677316,
  "GTFS Longitude": -73.98311,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Bay Ridge - 95 St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 29,
  "Complex ID": 608,
  "GTFS Stop ID": "R33",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "4 Av-9 St",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.670847,
  "GTFS Longitude": -73.988302,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Bay Ridge - 95 St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 30,
  "Complex ID": 30,
  "GTFS Stop ID": "R34",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "Prospect Av",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.665414,
  "GTFS Longitude": -73.992872,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Bay Ridge - 95 St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 31,
  "Complex ID": 31,
  "GTFS Stop ID": "R35",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "25 St",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.660397,
  "GTFS Longitude": -73.998091,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Bay Ridge - 95 St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 32,
  "Complex ID": 32,
  "GTFS Stop ID": "R36",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "36 St",
  "Borough": "Bk",
  "Daytime Routes": "D N R",
  "Structure": "Subway",
  "GTFS Latitude": 40.655144,
  "GTFS Longitude": -74.003549,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island - Bay Ridge",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 33,
  "Complex ID": 33,
  "GTFS Stop ID": "R39",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "45 St",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.648939,
  "GTFS Longitude": -74.010006,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Bay Ridge - 95 St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 34,
  "Complex ID": 34,
  "GTFS Stop ID": "R40",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "53 St",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.645069,
  "GTFS Longitude": -74.014034,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Bay Ridge - 95 St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 35,
  "Complex ID": 35,
  "GTFS Stop ID": "R41",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "59 St",
  "Borough": "Bk",
  "Daytime Routes": "N R",
  "Structure": "Subway",
  "GTFS Latitude": 40.641362,
  "GTFS Longitude": -74.017881,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island - Bay Ridge",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 36,
  "Complex ID": 36,
  "GTFS Stop ID": "R42",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "Bay Ridge Av",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.634967,
  "GTFS Longitude": -74.023377,
  "North Direction Label": "Manhattan",
  "South Direction Label": "95 St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 37,
  "Complex ID": 37,
  "GTFS Stop ID": "R43",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "77 St",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.629742,
  "GTFS Longitude": -74.02551,
  "North Direction Label": "Manhattan",
  "South Direction Label": "95 St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 38,
  "Complex ID": 38,
  "GTFS Stop ID": "R44",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "86 St",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.622687,
  "GTFS Longitude": -74.028398,
  "North Direction Label": "Manhattan",
  "South Direction Label": "95 St",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 39,
  "Complex ID": 39,
  "GTFS Stop ID": "R45",
  "Division": "BMT",
  "Line": "4th Av",
  "Stop Name": "Bay Ridge-95 St",
  "Borough": "Bk",
  "Daytime Routes": "R",
  "Structure": "Subway",
  "GTFS Latitude": 40.616622,
  "GTFS Longitude": -74.030876,
  "North Direction Label": "Manhattan",
  "South Direction Label": "",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 40,
  "Complex ID": 617,
  "GTFS Stop ID": "D24",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Atlantic Av-Barclays Ctr",
  "Borough": "Bk",
  "Daytime Routes": "B Q",
  "Structure": "Subway",
  "GTFS Latitude": 40.68446,
  "GTFS Longitude": -73.97689,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 41,
  "Complex ID": 41,
  "GTFS Stop ID": "D25",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "7 Av",
  "Borough": "Bk",
  "Daytime Routes": "B Q",
  "Structure": "Subway",
  "GTFS Latitude": 40.67705,
  "GTFS Longitude": -73.972367,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 42,
  "Complex ID": 42,
  "GTFS Stop ID": "D26",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Prospect Park",
  "Borough": "Bk",
  "Daytime Routes": "B Q S",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.661614,
  "GTFS Longitude": -73.962246,
  "North Direction Label": "Manhattan & Franklin Av",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 43,
  "Complex ID": 43,
  "GTFS Stop ID": "D27",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Parkside Av",
  "Borough": "Bk",
  "Daytime Routes": "B Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.655292,
  "GTFS Longitude": -73.961495,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 44,
  "Complex ID": 44,
  "GTFS Stop ID": "D28",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Church Av",
  "Borough": "Bk",
  "Daytime Routes": "B Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.650527,
  "GTFS Longitude": -73.962982,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 45,
  "Complex ID": 45,
  "GTFS Stop ID": "D29",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Beverley Rd",
  "Borough": "Bk",
  "Daytime Routes": "Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.644031,
  "GTFS Longitude": -73.964492,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 46,
  "Complex ID": 46,
  "GTFS Stop ID": "D30",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Cortelyou Rd",
  "Borough": "Bk",
  "Daytime Routes": "Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.640927,
  "GTFS Longitude": -73.963891,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 47,
  "Complex ID": 47,
  "GTFS Stop ID": "D31",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Newkirk Plaza",
  "Borough": "Bk",
  "Daytime Routes": "B Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.635082,
  "GTFS Longitude": -73.962793,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 48,
  "Complex ID": 48,
  "GTFS Stop ID": "D32",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Avenue H",
  "Borough": "Bk",
  "Daytime Routes": "Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.62927,
  "GTFS Longitude": -73.961639,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 49,
  "Complex ID": 49,
  "GTFS Stop ID": "D33",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Avenue J",
  "Borough": "Bk",
  "Daytime Routes": "Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.625039,
  "GTFS Longitude": -73.960803,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 50,
  "Complex ID": 50,
  "GTFS Stop ID": "D34",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Avenue M",
  "Borough": "Bk",
  "Daytime Routes": "Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.617618,
  "GTFS Longitude": -73.959399,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 51,
  "Complex ID": 51,
  "GTFS Stop ID": "D35",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Kings Hwy",
  "Borough": "Bk",
  "Daytime Routes": "B Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.60867,
  "GTFS Longitude": -73.957734,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 52,
  "Complex ID": 52,
  "GTFS Stop ID": "D37",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Avenue U",
  "Borough": "Bk",
  "Daytime Routes": "Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.5993,
  "GTFS Longitude": -73.955929,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 53,
  "Complex ID": 53,
  "GTFS Stop ID": "D38",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Neck Rd",
  "Borough": "Bk",
  "Daytime Routes": "Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.595246,
  "GTFS Longitude": -73.955161,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 54,
  "Complex ID": 54,
  "GTFS Stop ID": "D39",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Sheepshead Bay",
  "Borough": "Bk",
  "Daytime Routes": "B Q",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.586896,
  "GTFS Longitude": -73.954155,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Brighton Beach & Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 55,
  "Complex ID": 55,
  "GTFS Stop ID": "D40",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Brighton Beach",
  "Borough": "Bk",
  "Daytime Routes": "B Q",
  "Structure": "Elevated",
  "GTFS Latitude": 40.577621,
  "GTFS Longitude": -73.961376,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 56,
  "Complex ID": 56,
  "GTFS Stop ID": "D41",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "Ocean Pkwy",
  "Borough": "Bk",
  "Daytime Routes": "Q",
  "Structure": "Elevated",
  "GTFS Latitude": 40.576312,
  "GTFS Longitude": -73.968501,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Stillwell Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 57,
  "Complex ID": 57,
  "GTFS Stop ID": "D42",
  "Division": "BMT",
  "Line": "Broadway - Brighton",
  "Stop Name": "W 8 St-NY Aquarium",
  "Borough": "Bk",
  "Daytime Routes": "F Q",
  "Structure": "Elevated",
  "GTFS Latitude": 40.576127,
  "GTFS Longitude": -73.975939,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Stillwell Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 58,
  "Complex ID": 58,
  "GTFS Stop ID": "D43",
  "Division": "BMT",
  "Line": "Sea Beach / West End / Culver / Brighton",
  "Stop Name": "Coney Island-Stillwell Av",
  "Borough": "Bk",
  "Daytime Routes": "D F N Q",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.577422,
  "GTFS Longitude": -73.981233,
  "North Direction Label": "Manhattan",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 59,
  "Complex ID": 59,
  "GTFS Stop ID": "B12",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "9 Av",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.646292,
  "GTFS Longitude": -73.994324,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 60,
  "Complex ID": 60,
  "GTFS Stop ID": "B13",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "Fort Hamilton Pkwy",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.640914,
  "GTFS Longitude": -73.994304,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 61,
  "Complex ID": 61,
  "GTFS Stop ID": "B14",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "50 St",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.63626,
  "GTFS Longitude": -73.994791,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 62,
  "Complex ID": 62,
  "GTFS Stop ID": "B15",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "55 St",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.631435,
  "GTFS Longitude": -73.995476,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 63,
  "Complex ID": 615,
  "GTFS Stop ID": "B16",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "62 St",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.626472,
  "GTFS Longitude": -73.996895,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 64,
  "Complex ID": 64,
  "GTFS Stop ID": "B17",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "71 St",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.619589,
  "GTFS Longitude": -73.998864,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 65,
  "Complex ID": 65,
  "GTFS Stop ID": "B18",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "79 St",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.613501,
  "GTFS Longitude": -74.00061,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 66,
  "Complex ID": 66,
  "GTFS Stop ID": "B19",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "18 Av",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.607954,
  "GTFS Longitude": -74.001736,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 67,
  "Complex ID": 67,
  "GTFS Stop ID": "B20",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "20 Av",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.604556,
  "GTFS Longitude": -73.998168,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 68,
  "Complex ID": 68,
  "GTFS Stop ID": "B21",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "Bay Pkwy",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.601875,
  "GTFS Longitude": -73.993728,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 69,
  "Complex ID": 69,
  "GTFS Stop ID": "B22",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "25 Av",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.597704,
  "GTFS Longitude": -73.986829,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 70,
  "Complex ID": 70,
  "GTFS Stop ID": "B23",
  "Division": "BMT",
  "Line": "West End",
  "Stop Name": "Bay 50 St",
  "Borough": "Bk",
  "Daytime Routes": "D",
  "Structure": "Elevated",
  "GTFS Latitude": 40.588841,
  "GTFS Longitude": -73.983765,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 71,
  "Complex ID": 71,
  "GTFS Stop ID": "N02",
  "Division": "BMT",
  "Line": "Sea Beach",
  "Stop Name": "8 Av",
  "Borough": "Bk",
  "Daytime Routes": "N",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.635064,
  "GTFS Longitude": -74.011719,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 2,
  "ADA Notes": "Manhattan-bound only"
}, {
  "Station ID": 72,
  "Complex ID": 72,
  "GTFS Stop ID": "N03",
  "Division": "BMT",
  "Line": "Sea Beach",
  "Stop Name": "Fort Hamilton Pkwy",
  "Borough": "Bk",
  "Daytime Routes": "N",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.631386,
  "GTFS Longitude": -74.005351,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 73,
  "Complex ID": 615,
  "GTFS Stop ID": "N04",
  "Division": "BMT",
  "Line": "Sea Beach",
  "Stop Name": "New Utrecht Av",
  "Borough": "Bk",
  "Daytime Routes": "N",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.624842,
  "GTFS Longitude": -73.996353,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 74,
  "Complex ID": 74,
  "GTFS Stop ID": "N05",
  "Division": "BMT",
  "Line": "Sea Beach",
  "Stop Name": "18 Av",
  "Borough": "Bk",
  "Daytime Routes": "N",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.620671,
  "GTFS Longitude": -73.990414,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 75,
  "Complex ID": 75,
  "GTFS Stop ID": "N06",
  "Division": "BMT",
  "Line": "Sea Beach",
  "Stop Name": "20 Av",
  "Borough": "Bk",
  "Daytime Routes": "N",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.61741,
  "GTFS Longitude": -73.985026,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 76,
  "Complex ID": 76,
  "GTFS Stop ID": "N07",
  "Division": "BMT",
  "Line": "Sea Beach",
  "Stop Name": "Bay Pkwy",
  "Borough": "Bk",
  "Daytime Routes": "N",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.611815,
  "GTFS Longitude": -73.981848,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 77,
  "Complex ID": 77,
  "GTFS Stop ID": "N08",
  "Division": "BMT",
  "Line": "Sea Beach",
  "Stop Name": "Kings Hwy",
  "Borough": "Bk",
  "Daytime Routes": "N",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.603923,
  "GTFS Longitude": -73.980353,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 78,
  "Complex ID": 78,
  "GTFS Stop ID": "N09",
  "Division": "BMT",
  "Line": "Sea Beach",
  "Stop Name": "Avenue U",
  "Borough": "Bk",
  "Daytime Routes": "N",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.597473,
  "GTFS Longitude": -73.979137,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 79,
  "Complex ID": 79,
  "GTFS Stop ID": "N10",
  "Division": "BMT",
  "Line": "Sea Beach",
  "Stop Name": "86 St",
  "Borough": "Bk",
  "Daytime Routes": "N",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.592721,
  "GTFS Longitude": -73.97823,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 80,
  "Complex ID": 80,
  "GTFS Stop ID": "J12",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "121 St",
  "Borough": "Q",
  "Daytime Routes": "J Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.700492,
  "GTFS Longitude": -73.828294,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 81,
  "Complex ID": 81,
  "GTFS Stop ID": "J13",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "111 St",
  "Borough": "Q",
  "Daytime Routes": "J",
  "Structure": "Elevated",
  "GTFS Latitude": 40.697418,
  "GTFS Longitude": -73.836345,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 82,
  "Complex ID": 82,
  "GTFS Stop ID": "J14",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "104 St",
  "Borough": "Q",
  "Daytime Routes": "J Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.695178,
  "GTFS Longitude": -73.84433,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 83,
  "Complex ID": 83,
  "GTFS Stop ID": "J15",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Woodhaven Blvd",
  "Borough": "Q",
  "Daytime Routes": "J Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.693879,
  "GTFS Longitude": -73.851576,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 84,
  "Complex ID": 84,
  "GTFS Stop ID": "J16",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "85 St-Forest Pkwy",
  "Borough": "Q",
  "Daytime Routes": "J",
  "Structure": "Elevated",
  "GTFS Latitude": 40.692435,
  "GTFS Longitude": -73.86001,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 85,
  "Complex ID": 85,
  "GTFS Stop ID": "J17",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "75 St-Elderts Ln",
  "Borough": "Q",
  "Daytime Routes": "J Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.691324,
  "GTFS Longitude": -73.867139,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 86,
  "Complex ID": 86,
  "GTFS Stop ID": "J19",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Cypress Hills",
  "Borough": "Bk",
  "Daytime Routes": "J",
  "Structure": "Elevated",
  "GTFS Latitude": 40.689941,
  "GTFS Longitude": -73.87255,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 87,
  "Complex ID": 87,
  "GTFS Stop ID": "J20",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Crescent St",
  "Borough": "Bk",
  "Daytime Routes": "J Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.683194,
  "GTFS Longitude": -73.873785,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 88,
  "Complex ID": 88,
  "GTFS Stop ID": "J21",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Norwood Av",
  "Borough": "Bk",
  "Daytime Routes": "J Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.68141,
  "GTFS Longitude": -73.880039,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 89,
  "Complex ID": 89,
  "GTFS Stop ID": "J22",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Cleveland St",
  "Borough": "Bk",
  "Daytime Routes": "J",
  "Structure": "Elevated",
  "GTFS Latitude": 40.679947,
  "GTFS Longitude": -73.884639,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 90,
  "Complex ID": 90,
  "GTFS Stop ID": "J23",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Van Siclen Av",
  "Borough": "Bk",
  "Daytime Routes": "J Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.678024,
  "GTFS Longitude": -73.891688,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 91,
  "Complex ID": 91,
  "GTFS Stop ID": "J24",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Alabama Av",
  "Borough": "Bk",
  "Daytime Routes": "J",
  "Structure": "Elevated",
  "GTFS Latitude": 40.676992,
  "GTFS Longitude": -73.898654,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 92,
  "Complex ID": 621,
  "GTFS Stop ID": "J27",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Broadway Junction",
  "Borough": "Bk",
  "Daytime Routes": "J Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.679498,
  "GTFS Longitude": -73.904512,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 93,
  "Complex ID": 93,
  "GTFS Stop ID": "J28",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Chauncey St",
  "Borough": "Bk",
  "Daytime Routes": "J Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.682893,
  "GTFS Longitude": -73.910456,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 94,
  "Complex ID": 94,
  "GTFS Stop ID": "J29",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Halsey St",
  "Borough": "Bk",
  "Daytime Routes": "J",
  "Structure": "Elevated",
  "GTFS Latitude": 40.68637,
  "GTFS Longitude": -73.916559,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 95,
  "Complex ID": 95,
  "GTFS Stop ID": "J30",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Gates Av",
  "Borough": "Bk",
  "Daytime Routes": "J Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.68963,
  "GTFS Longitude": -73.92227,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 96,
  "Complex ID": 96,
  "GTFS Stop ID": "J31",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Kosciuszko St",
  "Borough": "Bk",
  "Daytime Routes": "J",
  "Structure": "Elevated",
  "GTFS Latitude": 40.693342,
  "GTFS Longitude": -73.928814,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 97,
  "Complex ID": 97,
  "GTFS Stop ID": "M11",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Myrtle Av",
  "Borough": "Bk",
  "Daytime Routes": "J M Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.697207,
  "GTFS Longitude": -73.935657,
  "North Direction Label": "Jamaica - Middle Village",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 98,
  "Complex ID": 98,
  "GTFS Stop ID": "M12",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Flushing Av",
  "Borough": "Bk",
  "Daytime Routes": "J M",
  "Structure": "Elevated",
  "GTFS Latitude": 40.70026,
  "GTFS Longitude": -73.941126,
  "North Direction Label": "Jamaica - Middle Village",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 99,
  "Complex ID": 99,
  "GTFS Stop ID": "M13",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Lorimer St",
  "Borough": "Bk",
  "Daytime Routes": "J M",
  "Structure": "Elevated",
  "GTFS Latitude": 40.703869,
  "GTFS Longitude": -73.947408,
  "North Direction Label": "Jamaica - Middle Village",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 100,
  "Complex ID": 100,
  "GTFS Stop ID": "M14",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Hewes St",
  "Borough": "Bk",
  "Daytime Routes": "J M",
  "Structure": "Elevated",
  "GTFS Latitude": 40.70687,
  "GTFS Longitude": -73.953431,
  "North Direction Label": "Jamaica - Middle Village",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 101,
  "Complex ID": 101,
  "GTFS Stop ID": "M16",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Marcy Av",
  "Borough": "Bk",
  "Daytime Routes": "J M Z",
  "Structure": "Elevated",
  "GTFS Latitude": 40.708359,
  "GTFS Longitude": -73.957757,
  "North Direction Label": "Jamaica - Middle Village",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 102,
  "Complex ID": 625,
  "GTFS Stop ID": "M18",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Delancey St-Essex St",
  "Borough": "M",
  "Daytime Routes": "J M Z",
  "Structure": "Subway",
  "GTFS Latitude": 40.718315,
  "GTFS Longitude": -73.987437,
  "North Direction Label": "Brooklyn",
  "South Direction Label": "Broad St (JZ) - Uptown (M)",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 103,
  "Complex ID": 103,
  "GTFS Stop ID": "M19",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Bowery",
  "Borough": "M",
  "Daytime Routes": "J Z",
  "Structure": "Subway",
  "GTFS Latitude": 40.72028,
  "GTFS Longitude": -73.993915,
  "North Direction Label": "Brooklyn",
  "South Direction Label": "Broad St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 104,
  "Complex ID": 623,
  "GTFS Stop ID": "M20",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Canal St",
  "Borough": "M",
  "Daytime Routes": "J Z",
  "Structure": "Subway",
  "GTFS Latitude": 40.718092,
  "GTFS Longitude": -73.999892,
  "North Direction Label": "Brooklyn",
  "South Direction Label": "Broad St",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 105,
  "Complex ID": 622,
  "GTFS Stop ID": "M21",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Chambers St",
  "Borough": "M",
  "Daytime Routes": "J Z",
  "Structure": "Subway",
  "GTFS Latitude": 40.713243,
  "GTFS Longitude": -74.003401,
  "North Direction Label": "Brooklyn",
  "South Direction Label": "Broad St",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 106,
  "Complex ID": 628,
  "GTFS Stop ID": "M22",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Fulton St",
  "Borough": "M",
  "Daytime Routes": "J Z",
  "Structure": "Subway",
  "GTFS Latitude": 40.710374,
  "GTFS Longitude": -74.007582,
  "North Direction Label": "Brooklyn",
  "South Direction Label": "Broad St",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 107,
  "Complex ID": 107,
  "GTFS Stop ID": "M23",
  "Division": "BMT",
  "Line": "Jamaica",
  "Stop Name": "Broad St",
  "Borough": "M",
  "Daytime Routes": "J Z",
  "Structure": "Subway",
  "GTFS Latitude": 40.706476,
  "GTFS Longitude": -74.011056,
  "North Direction Label": "Brooklyn",
  "South Direction Label": "",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 108,
  "Complex ID": 108,
  "GTFS Stop ID": "M01",
  "Division": "BMT",
  "Line": "Myrtle Av",
  "Stop Name": "Middle Village-Metropolitan Av",
  "Borough": "Q",
  "Daytime Routes": "M",
  "Structure": "Elevated",
  "GTFS Latitude": 40.711396,
  "GTFS Longitude": -73.889601,
  "North Direction Label": "Manhattan",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 109,
  "Complex ID": 109,
  "GTFS Stop ID": "M04",
  "Division": "BMT",
  "Line": "Myrtle Av",
  "Stop Name": "Fresh Pond Rd",
  "Borough": "Q",
  "Daytime Routes": "M",
  "Structure": "Elevated",
  "GTFS Latitude": 40.706186,
  "GTFS Longitude": -73.895877,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Metropolitan Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 110,
  "Complex ID": 110,
  "GTFS Stop ID": "M05",
  "Division": "BMT",
  "Line": "Myrtle Av",
  "Stop Name": "Forest Av",
  "Borough": "Q",
  "Daytime Routes": "M",
  "Structure": "Elevated",
  "GTFS Latitude": 40.704423,
  "GTFS Longitude": -73.903077,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Metropolitan Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 111,
  "Complex ID": 111,
  "GTFS Stop ID": "M06",
  "Division": "BMT",
  "Line": "Myrtle Av",
  "Stop Name": "Seneca Av",
  "Borough": "Q",
  "Daytime Routes": "M",
  "Structure": "Elevated",
  "GTFS Latitude": 40.702762,
  "GTFS Longitude": -73.90774,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Metropolitan Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 112,
  "Complex ID": 630,
  "GTFS Stop ID": "M08",
  "Division": "BMT",
  "Line": "Myrtle Av",
  "Stop Name": "Myrtle-Wyckoff Avs",
  "Borough": "Bk",
  "Daytime Routes": "M",
  "Structure": "Elevated",
  "GTFS Latitude": 40.69943,
  "GTFS Longitude": -73.912385,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Metropolitan Av",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 113,
  "Complex ID": 113,
  "GTFS Stop ID": "M09",
  "Division": "BMT",
  "Line": "Myrtle Av",
  "Stop Name": "Knickerbocker Av",
  "Borough": "Bk",
  "Daytime Routes": "M",
  "Structure": "Elevated",
  "GTFS Latitude": 40.698664,
  "GTFS Longitude": -73.919711,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Metropolitan Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 114,
  "Complex ID": 114,
  "GTFS Stop ID": "M10",
  "Division": "BMT",
  "Line": "Myrtle Av",
  "Stop Name": "Central Av",
  "Borough": "Bk",
  "Daytime Routes": "M",
  "Structure": "Elevated",
  "GTFS Latitude": 40.697857,
  "GTFS Longitude": -73.927397,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Metropolitan Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 115,
  "Complex ID": 618,
  "GTFS Stop ID": "L01",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "8 Av",
  "Borough": "M",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.739777,
  "GTFS Longitude": -74.002578,
  "North Direction Label": "",
  "South Direction Label": "Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 116,
  "Complex ID": 601,
  "GTFS Stop ID": "L02",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "6 Av",
  "Borough": "M",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.737335,
  "GTFS Longitude": -73.996786,
  "North Direction Label": "8 Av",
  "South Direction Label": "Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 117,
  "Complex ID": 602,
  "GTFS Stop ID": "L03",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "14 St-Union Sq.",
  "Borough": "M",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.734789,
  "GTFS Longitude": -73.99073,
  "North Direction Label": "8 Av",
  "South Direction Label": "Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 118,
  "Complex ID": 118,
  "GTFS Stop ID": "L05",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "3 Av",
  "Borough": "M",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.732849,
  "GTFS Longitude": -73.986122,
  "North Direction Label": "8 Av",
  "South Direction Label": "Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 119,
  "Complex ID": 119,
  "GTFS Stop ID": "L06",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "1 Av",
  "Borough": "M",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.730953,
  "GTFS Longitude": -73.981628,
  "North Direction Label": "8 Av",
  "South Direction Label": "Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 120,
  "Complex ID": 120,
  "GTFS Stop ID": "L08",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Bedford Av",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.717304,
  "GTFS Longitude": -73.956872,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 121,
  "Complex ID": 629,
  "GTFS Stop ID": "L10",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Lorimer St",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.714063,
  "GTFS Longitude": -73.950275,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 122,
  "Complex ID": 122,
  "GTFS Stop ID": "L11",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Graham Av",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.714565,
  "GTFS Longitude": -73.944053,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 123,
  "Complex ID": 123,
  "GTFS Stop ID": "L12",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Grand St",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.711926,
  "GTFS Longitude": -73.94067,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 124,
  "Complex ID": 124,
  "GTFS Stop ID": "L13",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Montrose Av",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.707739,
  "GTFS Longitude": -73.93985,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 125,
  "Complex ID": 125,
  "GTFS Stop ID": "L14",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Morgan Av",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.706152,
  "GTFS Longitude": -73.933147,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 126,
  "Complex ID": 126,
  "GTFS Stop ID": "L15",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Jefferson St",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.706607,
  "GTFS Longitude": -73.922913,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 127,
  "Complex ID": 127,
  "GTFS Stop ID": "L16",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "DeKalb Av",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.703811,
  "GTFS Longitude": -73.918425,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 128,
  "Complex ID": 630,
  "GTFS Stop ID": "L17",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Myrtle-Wyckoff Avs",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.699814,
  "GTFS Longitude": -73.911586,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 129,
  "Complex ID": 129,
  "GTFS Stop ID": "L19",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Halsey St",
  "Borough": "Q",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.695602,
  "GTFS Longitude": -73.904084,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 130,
  "Complex ID": 130,
  "GTFS Stop ID": "L20",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Wilson Av",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.688764,
  "GTFS Longitude": -73.904046,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 2,
  "ADA Notes": "Manhattan-bound only"
}, {
  "Station ID": 131,
  "Complex ID": 131,
  "GTFS Stop ID": "L21",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Bushwick Av-Aberdeen St",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Subway",
  "GTFS Latitude": 40.682829,
  "GTFS Longitude": -73.905249,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 132,
  "Complex ID": 621,
  "GTFS Stop ID": "L22",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Broadway Junction",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Elevated",
  "GTFS Latitude": 40.678856,
  "GTFS Longitude": -73.90324,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 133,
  "Complex ID": 133,
  "GTFS Stop ID": "L24",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Atlantic Av",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Elevated",
  "GTFS Latitude": 40.675345,
  "GTFS Longitude": -73.903097,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 134,
  "Complex ID": 134,
  "GTFS Stop ID": "L25",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Sutter Av",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Elevated",
  "GTFS Latitude": 40.669367,
  "GTFS Longitude": -73.901975,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 135,
  "Complex ID": 135,
  "GTFS Stop ID": "L26",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Livonia Av",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Elevated",
  "GTFS Latitude": 40.664038,
  "GTFS Longitude": -73.900571,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 136,
  "Complex ID": 136,
  "GTFS Stop ID": "L27",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "New Lots Av",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "Elevated",
  "GTFS Latitude": 40.658733,
  "GTFS Longitude": -73.899232,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 137,
  "Complex ID": 137,
  "GTFS Stop ID": "L28",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "East 105 St",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "At Grade",
  "GTFS Latitude": 40.650573,
  "GTFS Longitude": -73.899485,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Canarsie - Rockaway Parkway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 138,
  "Complex ID": 138,
  "GTFS Stop ID": "L29",
  "Division": "BMT",
  "Line": "Canarsie",
  "Stop Name": "Canarsie-Rockaway Pkwy",
  "Borough": "Bk",
  "Daytime Routes": "L",
  "Structure": "At Grade",
  "GTFS Latitude": 40.646654,
  "GTFS Longitude": -73.90185,
  "North Direction Label": "Manhattan",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 139,
  "Complex ID": 627,
  "GTFS Stop ID": "S01",
  "Division": "BMT",
  "Line": "Franklin Shuttle",
  "Stop Name": "Franklin Av",
  "Borough": "Bk",
  "Daytime Routes": "S",
  "Structure": "Elevated",
  "GTFS Latitude": 40.680596,
  "GTFS Longitude": -73.955827,
  "North Direction Label": "",
  "South Direction Label": "Prospect Park",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 141,
  "Complex ID": 141,
  "GTFS Stop ID": "S03",
  "Division": "BMT",
  "Line": "Franklin Shuttle",
  "Stop Name": "Park Pl",
  "Borough": "Bk",
  "Daytime Routes": "S",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.674772,
  "GTFS Longitude": -73.957624,
  "North Direction Label": "Franklin Av",
  "South Direction Label": "Prospect Park",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 142,
  "Complex ID": 626,
  "GTFS Stop ID": "S04",
  "Division": "BMT",
  "Line": "Franklin Shuttle",
  "Stop Name": "Botanic Garden",
  "Borough": "Bk",
  "Daytime Routes": "S",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.670343,
  "GTFS Longitude": -73.959245,
  "North Direction Label": "Franklin Av",
  "South Direction Label": "Prospect Park",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 143,
  "Complex ID": 143,
  "GTFS Stop ID": "A02",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Inwood-207 St",
  "Borough": "M",
  "Daytime Routes": "A",
  "Structure": "Subway",
  "GTFS Latitude": 40.868072,
  "GTFS Longitude": -73.919899,
  "North Direction Label": "",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 144,
  "Complex ID": 144,
  "GTFS Stop ID": "A03",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Dyckman St",
  "Borough": "M",
  "Daytime Routes": "A",
  "Structure": "Subway",
  "GTFS Latitude": 40.865491,
  "GTFS Longitude": -73.927271,
  "North Direction Label": "207 St",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 145,
  "Complex ID": 145,
  "GTFS Stop ID": "A05",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "190 St",
  "Borough": "M",
  "Daytime Routes": "A",
  "Structure": "Subway",
  "GTFS Latitude": 40.859022,
  "GTFS Longitude": -73.93418,
  "North Direction Label": "207 St",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 146,
  "Complex ID": 146,
  "GTFS Stop ID": "A06",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "181 St",
  "Borough": "M",
  "Daytime Routes": "A",
  "Structure": "Subway",
  "GTFS Latitude": 40.851695,
  "GTFS Longitude": -73.937969,
  "North Direction Label": "207 St",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 147,
  "Complex ID": 147,
  "GTFS Stop ID": "A07",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "175 St",
  "Borough": "M",
  "Daytime Routes": "A",
  "Structure": "Subway",
  "GTFS Latitude": 40.847391,
  "GTFS Longitude": -73.939704,
  "North Direction Label": "207 St",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 148,
  "Complex ID": 605,
  "GTFS Stop ID": "A09",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "168 St",
  "Borough": "M",
  "Daytime Routes": "A C",
  "Structure": "Subway",
  "GTFS Latitude": 40.840719,
  "GTFS Longitude": -73.939561,
  "North Direction Label": "207 St",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 149,
  "Complex ID": 149,
  "GTFS Stop ID": "A10",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "163 St-Amsterdam Av",
  "Borough": "M",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.836013,
  "GTFS Longitude": -73.939892,
  "North Direction Label": "Uptown",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 150,
  "Complex ID": 150,
  "GTFS Stop ID": "A11",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "155 St",
  "Borough": "M",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.830518,
  "GTFS Longitude": -73.941514,
  "North Direction Label": "Uptown",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 151,
  "Complex ID": 151,
  "GTFS Stop ID": "A12",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "145 St",
  "Borough": "M",
  "Daytime Routes": "A C",
  "Structure": "Subway",
  "GTFS Latitude": 40.824783,
  "GTFS Longitude": -73.944216,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 151,
  "Complex ID": 151,
  "GTFS Stop ID": "D13",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "145 St",
  "Borough": "M",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.824783,
  "GTFS Longitude": -73.944216,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 152,
  "Complex ID": 152,
  "GTFS Stop ID": "A14",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "135 St",
  "Borough": "M",
  "Daytime Routes": "B C",
  "Structure": "Subway",
  "GTFS Latitude": 40.817894,
  "GTFS Longitude": -73.947649,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 153,
  "Complex ID": 153,
  "GTFS Stop ID": "A15",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "125 St",
  "Borough": "M",
  "Daytime Routes": "A B C D",
  "Structure": "Subway",
  "GTFS Latitude": 40.811109,
  "GTFS Longitude": -73.952343,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 154,
  "Complex ID": 154,
  "GTFS Stop ID": "A16",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "116 St",
  "Borough": "M",
  "Daytime Routes": "B C",
  "Structure": "Subway",
  "GTFS Latitude": 40.805085,
  "GTFS Longitude": -73.954882,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 155,
  "Complex ID": 155,
  "GTFS Stop ID": "A17",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Cathedral Pkwy (110 St)",
  "Borough": "M",
  "Daytime Routes": "B C",
  "Structure": "Subway",
  "GTFS Latitude": 40.800603,
  "GTFS Longitude": -73.958161,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 156,
  "Complex ID": 156,
  "GTFS Stop ID": "A18",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "103 St",
  "Borough": "M",
  "Daytime Routes": "B C",
  "Structure": "Subway",
  "GTFS Latitude": 40.796092,
  "GTFS Longitude": -73.961454,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 157,
  "Complex ID": 157,
  "GTFS Stop ID": "A19",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "96 St",
  "Borough": "M",
  "Daytime Routes": "B C",
  "Structure": "Subway",
  "GTFS Latitude": 40.791642,
  "GTFS Longitude": -73.964696,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 158,
  "Complex ID": 158,
  "GTFS Stop ID": "A20",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "86 St",
  "Borough": "M",
  "Daytime Routes": "B C",
  "Structure": "Subway",
  "GTFS Latitude": 40.785868,
  "GTFS Longitude": -73.968916,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 159,
  "Complex ID": 159,
  "GTFS Stop ID": "A21",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "81 St-Museum of Natural History",
  "Borough": "M",
  "Daytime Routes": "B C",
  "Structure": "Subway",
  "GTFS Latitude": 40.781433,
  "GTFS Longitude": -73.972143,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 160,
  "Complex ID": 160,
  "GTFS Stop ID": "A22",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "72 St",
  "Borough": "M",
  "Daytime Routes": "B C",
  "Structure": "Subway",
  "GTFS Latitude": 40.775594,
  "GTFS Longitude": -73.97641,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 161,
  "Complex ID": 614,
  "GTFS Stop ID": "A24",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "59 St-Columbus Circle",
  "Borough": "M",
  "Daytime Routes": "A B C D",
  "Structure": "Subway",
  "GTFS Latitude": 40.768296,
  "GTFS Longitude": -73.981736,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 162,
  "Complex ID": 162,
  "GTFS Stop ID": "A25",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "50 St",
  "Borough": "M",
  "Daytime Routes": "C E",
  "Structure": "Subway",
  "GTFS Latitude": 40.762456,
  "GTFS Longitude": -73.985984,
  "North Direction Label": "Uptown - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 2,
  "ADA Notes": "Downtown only"
}, {
  "Station ID": 163,
  "Complex ID": 611,
  "GTFS Stop ID": "A27",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "42 St-Port Authority Bus Terminal",
  "Borough": "M",
  "Daytime Routes": "A C E",
  "Structure": "Subway",
  "GTFS Latitude": 40.757308,
  "GTFS Longitude": -73.989735,
  "North Direction Label": "Uptown - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 164,
  "Complex ID": 164,
  "GTFS Stop ID": "A28",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "34 St-Penn Station",
  "Borough": "M",
  "Daytime Routes": "A C E",
  "Structure": "Subway",
  "GTFS Latitude": 40.752287,
  "GTFS Longitude": -73.993391,
  "North Direction Label": "Uptown - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 165,
  "Complex ID": 165,
  "GTFS Stop ID": "A30",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "23 St",
  "Borough": "M",
  "Daytime Routes": "C E",
  "Structure": "Subway",
  "GTFS Latitude": 40.745906,
  "GTFS Longitude": -73.998041,
  "North Direction Label": "Uptown - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 166,
  "Complex ID": 618,
  "GTFS Stop ID": "A31",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "14 St",
  "Borough": "M",
  "Daytime Routes": "A C E",
  "Structure": "Subway",
  "GTFS Latitude": 40.740893,
  "GTFS Longitude": -74.00169,
  "North Direction Label": "Uptown - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 167,
  "Complex ID": 167,
  "GTFS Stop ID": "A32",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "W 4 St-Wash Sq",
  "Borough": "M",
  "Daytime Routes": "A C E",
  "Structure": "Subway",
  "GTFS Latitude": 40.732338,
  "GTFS Longitude": -74.000495,
  "North Direction Label": "Uptown - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 167,
  "Complex ID": 167,
  "GTFS Stop ID": "D20",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "W 4 St-Wash Sq",
  "Borough": "M",
  "Daytime Routes": "B D F M",
  "Structure": "Subway",
  "GTFS Latitude": 40.732338,
  "GTFS Longitude": -74.000495,
  "North Direction Label": "Uptown - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 168,
  "Complex ID": 168,
  "GTFS Stop ID": "A33",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Spring St",
  "Borough": "M",
  "Daytime Routes": "C E",
  "Structure": "Subway",
  "GTFS Latitude": 40.726227,
  "GTFS Longitude": -74.003739,
  "North Direction Label": "Uptown - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 169,
  "Complex ID": 169,
  "GTFS Stop ID": "A34",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Canal St",
  "Borough": "M",
  "Daytime Routes": "A C E",
  "Structure": "Subway",
  "GTFS Latitude": 40.720824,
  "GTFS Longitude": -74.005229,
  "North Direction Label": "Uptown - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 170,
  "Complex ID": 624,
  "GTFS Stop ID": "A36",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Chambers St",
  "Borough": "M",
  "Daytime Routes": "A C",
  "Structure": "Subway",
  "GTFS Latitude": 40.714111,
  "GTFS Longitude": -74.008585,
  "North Direction Label": "Uptown",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 171,
  "Complex ID": 624,
  "GTFS Stop ID": "E01",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "World Trade Center",
  "Borough": "M",
  "Daytime Routes": "E",
  "Structure": "Subway",
  "GTFS Latitude": 40.712582,
  "GTFS Longitude": -74.009781,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 172,
  "Complex ID": 628,
  "GTFS Stop ID": "A38",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Fulton St",
  "Borough": "M",
  "Daytime Routes": "A C",
  "Structure": "Subway",
  "GTFS Latitude": 40.710197,
  "GTFS Longitude": -74.007691,
  "North Direction Label": "Uptown",
  "South Direction Label": "Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 173,
  "Complex ID": 173,
  "GTFS Stop ID": "A40",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "High St",
  "Borough": "Bk",
  "Daytime Routes": "A C",
  "Structure": "Subway",
  "GTFS Latitude": 40.699337,
  "GTFS Longitude": -73.990531,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid - Lefferts - Rockaways",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 174,
  "Complex ID": 636,
  "GTFS Stop ID": "A41",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Jay St-MetroTech",
  "Borough": "Bk",
  "Daytime Routes": "A C F",
  "Structure": "Subway",
  "GTFS Latitude": 40.692338,
  "GTFS Longitude": -73.987342,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid - Lefferts - Rockaways - Coney Island",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 175,
  "Complex ID": 175,
  "GTFS Stop ID": "A42",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Hoyt-Schermerhorn Sts",
  "Borough": "Bk",
  "Daytime Routes": "A C G",
  "Structure": "Subway",
  "GTFS Latitude": 40.688484,
  "GTFS Longitude": -73.985001,
  "North Direction Label": "Manhattan - Church Av",
  "South Direction Label": "Euclid Av & Queens - Court Sq",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 176,
  "Complex ID": 176,
  "GTFS Stop ID": "A43",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Lafayette Av",
  "Borough": "Bk",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.686113,
  "GTFS Longitude": -73.973946,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 177,
  "Complex ID": 177,
  "GTFS Stop ID": "A44",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Clinton-Washington Avs",
  "Borough": "Bk",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.683263,
  "GTFS Longitude": -73.965838,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 178,
  "Complex ID": 627,
  "GTFS Stop ID": "A45",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Franklin Av",
  "Borough": "Bk",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.68138,
  "GTFS Longitude": -73.956848,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid Av",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 179,
  "Complex ID": 179,
  "GTFS Stop ID": "A46",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Nostrand Av",
  "Borough": "Bk",
  "Daytime Routes": "A C",
  "Structure": "Subway",
  "GTFS Latitude": 40.680438,
  "GTFS Longitude": -73.950426,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid - Lefferts - Rockaways",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 180,
  "Complex ID": 180,
  "GTFS Stop ID": "A47",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Kingston-Throop Avs",
  "Borough": "Bk",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.679921,
  "GTFS Longitude": -73.940858,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 181,
  "Complex ID": 181,
  "GTFS Stop ID": "A48",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Utica Av",
  "Borough": "Bk",
  "Daytime Routes": "A C",
  "Structure": "Subway",
  "GTFS Latitude": 40.679364,
  "GTFS Longitude": -73.930729,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid - Lefferts - Rockaways",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 182,
  "Complex ID": 182,
  "GTFS Stop ID": "A49",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Ralph Av",
  "Borough": "Bk",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.678822,
  "GTFS Longitude": -73.920786,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 183,
  "Complex ID": 183,
  "GTFS Stop ID": "A50",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Rockaway Av",
  "Borough": "Bk",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.67834,
  "GTFS Longitude": -73.911946,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 184,
  "Complex ID": 621,
  "GTFS Stop ID": "A51",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Broadway Junction",
  "Borough": "Bk",
  "Daytime Routes": "A C",
  "Structure": "Subway",
  "GTFS Latitude": 40.678334,
  "GTFS Longitude": -73.905316,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid - Lefferts - Rockaways",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 185,
  "Complex ID": 185,
  "GTFS Stop ID": "A52",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Liberty Av",
  "Borough": "Bk",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.674542,
  "GTFS Longitude": -73.896548,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 186,
  "Complex ID": 186,
  "GTFS Stop ID": "A53",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Van Siclen Av",
  "Borough": "Bk",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.67271,
  "GTFS Longitude": -73.890358,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 187,
  "Complex ID": 187,
  "GTFS Stop ID": "A54",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Shepherd Av",
  "Borough": "Bk",
  "Daytime Routes": "C",
  "Structure": "Subway",
  "GTFS Latitude": 40.67413,
  "GTFS Longitude": -73.88075,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Euclid Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 188,
  "Complex ID": 188,
  "GTFS Stop ID": "A55",
  "Division": "IND",
  "Line": "8th Av - Fulton St",
  "Stop Name": "Euclid Av",
  "Borough": "Bk",
  "Daytime Routes": "A C",
  "Structure": "Subway",
  "GTFS Latitude": 40.675377,
  "GTFS Longitude": -73.872106,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Lefferts - Rockaways",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 189,
  "Complex ID": 189,
  "GTFS Stop ID": "A57",
  "Division": "IND",
  "Line": "Liberty Av",
  "Stop Name": "Grant Av",
  "Borough": "Bk",
  "Daytime Routes": "A",
  "Structure": "Subway",
  "GTFS Latitude": 40.677044,
  "GTFS Longitude": -73.86505,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Lefferts - Rockaways",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 190,
  "Complex ID": 190,
  "GTFS Stop ID": "A59",
  "Division": "IND",
  "Line": "Liberty Av",
  "Stop Name": "80 St",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Elevated",
  "GTFS Latitude": 40.679371,
  "GTFS Longitude": -73.858992,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Lefferts - Rockaways",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 191,
  "Complex ID": 191,
  "GTFS Stop ID": "A60",
  "Division": "IND",
  "Line": "Liberty Av",
  "Stop Name": "88 St",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Elevated",
  "GTFS Latitude": 40.679843,
  "GTFS Longitude": -73.85147,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Lefferts - Rockaways",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 192,
  "Complex ID": 192,
  "GTFS Stop ID": "A61",
  "Division": "IND",
  "Line": "Liberty Av",
  "Stop Name": "Rockaway Blvd",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Elevated",
  "GTFS Latitude": 40.680429,
  "GTFS Longitude": -73.843853,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Lefferts - Rockaways",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 193,
  "Complex ID": 193,
  "GTFS Stop ID": "A63",
  "Division": "IND",
  "Line": "Liberty Av",
  "Stop Name": "104 St",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Elevated",
  "GTFS Latitude": 40.681711,
  "GTFS Longitude": -73.837683,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Lefferts Blvd",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 194,
  "Complex ID": 194,
  "GTFS Stop ID": "A64",
  "Division": "IND",
  "Line": "Liberty Av",
  "Stop Name": "111 St",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Elevated",
  "GTFS Latitude": 40.684331,
  "GTFS Longitude": -73.832163,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Lefferts Blvd",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 195,
  "Complex ID": 195,
  "GTFS Stop ID": "A65",
  "Division": "IND",
  "Line": "Liberty Av",
  "Stop Name": "Ozone Park-Lefferts Blvd",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Elevated",
  "GTFS Latitude": 40.685951,
  "GTFS Longitude": -73.825798,
  "North Direction Label": "Manhattan",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 196,
  "Complex ID": 196,
  "GTFS Stop ID": "H01",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Aqueduct Racetrack",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "At Grade",
  "GTFS Latitude": 40.672097,
  "GTFS Longitude": -73.835919,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Rockaways",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 197,
  "Complex ID": 197,
  "GTFS Stop ID": "H02",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Aqueduct-N Conduit Av",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "At Grade",
  "GTFS Latitude": 40.668234,
  "GTFS Longitude": -73.834058,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Rockaways",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 198,
  "Complex ID": 198,
  "GTFS Stop ID": "H03",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Howard Beach-JFK Airport",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "At Grade",
  "GTFS Latitude": 40.660476,
  "GTFS Longitude": -73.830301,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Rockaways",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 199,
  "Complex ID": 199,
  "GTFS Stop ID": "H04",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Broad Channel",
  "Borough": "Q",
  "Daytime Routes": "A S",
  "Structure": "At Grade",
  "GTFS Latitude": 40.608382,
  "GTFS Longitude": -73.815925,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Rockaways",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 200,
  "Complex ID": 200,
  "GTFS Stop ID": "H12",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Beach 90 St",
  "Borough": "Q",
  "Daytime Routes": "A S",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.588034,
  "GTFS Longitude": -73.813641,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Rockaway Park",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 201,
  "Complex ID": 201,
  "GTFS Stop ID": "H13",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Beach 98 St",
  "Borough": "Q",
  "Daytime Routes": "A S",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.585307,
  "GTFS Longitude": -73.820558,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Rockaway Park",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 202,
  "Complex ID": 202,
  "GTFS Stop ID": "H14",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Beach 105 St",
  "Borough": "Q",
  "Daytime Routes": "A S",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.583209,
  "GTFS Longitude": -73.827559,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Rockaway Park",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 203,
  "Complex ID": 203,
  "GTFS Stop ID": "H15",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Rockaway Park-Beach 116 St",
  "Borough": "Q",
  "Daytime Routes": "A S",
  "Structure": "At Grade",
  "GTFS Latitude": 40.580903,
  "GTFS Longitude": -73.835592,
  "North Direction Label": "Manhattan",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 204,
  "Complex ID": 204,
  "GTFS Stop ID": "H06",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Beach 67 St",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.590927,
  "GTFS Longitude": -73.796924,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Far Rockaway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 205,
  "Complex ID": 205,
  "GTFS Stop ID": "H07",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Beach 60 St",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.592374,
  "GTFS Longitude": -73.788522,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Far Rockaway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 206,
  "Complex ID": 206,
  "GTFS Stop ID": "H08",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Beach 44 St",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.592943,
  "GTFS Longitude": -73.776013,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Far Rockaway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 207,
  "Complex ID": 207,
  "GTFS Stop ID": "H09",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Beach 36 St",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.595398,
  "GTFS Longitude": -73.768175,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Far Rockaway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 208,
  "Complex ID": 208,
  "GTFS Stop ID": "H10",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Beach 25 St",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.600066,
  "GTFS Longitude": -73.761353,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Far Rockaway",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 209,
  "Complex ID": 209,
  "GTFS Stop ID": "H11",
  "Division": "IND",
  "Line": "Rockaway",
  "Stop Name": "Far Rockaway-Mott Av",
  "Borough": "Q",
  "Daytime Routes": "A",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.603995,
  "GTFS Longitude": -73.755405,
  "North Direction Label": "Manhattan",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 210,
  "Complex ID": 210,
  "GTFS Stop ID": "D01",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "Norwood-205 St",
  "Borough": "Bx",
  "Daytime Routes": "D",
  "Structure": "Subway",
  "GTFS Latitude": 40.874811,
  "GTFS Longitude": -73.878855,
  "North Direction Label": "",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 211,
  "Complex ID": 211,
  "GTFS Stop ID": "D03",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "Bedford Park Blvd",
  "Borough": "Bx",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.873244,
  "GTFS Longitude": -73.887138,
  "North Direction Label": "Norwood - 205 St",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 212,
  "Complex ID": 212,
  "GTFS Stop ID": "D04",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "Kingsbridge Rd",
  "Borough": "Bx",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.866978,
  "GTFS Longitude": -73.893509,
  "North Direction Label": "Bedford Pk Blvd & 205 St",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 213,
  "Complex ID": 213,
  "GTFS Stop ID": "D05",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "Fordham Rd",
  "Borough": "Bx",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.861296,
  "GTFS Longitude": -73.897749,
  "North Direction Label": "Bedford Pk Blvd & 205 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 214,
  "Complex ID": 214,
  "GTFS Stop ID": "D06",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "182-183 Sts",
  "Borough": "Bx",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.856093,
  "GTFS Longitude": -73.900741,
  "North Direction Label": "Bedford Pk Blvd & 205 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 215,
  "Complex ID": 215,
  "GTFS Stop ID": "D07",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "Tremont Av",
  "Borough": "Bx",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.85041,
  "GTFS Longitude": -73.905227,
  "North Direction Label": "Bedford Pk Blvd & 205 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 216,
  "Complex ID": 216,
  "GTFS Stop ID": "D08",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "174-175 Sts",
  "Borough": "Bx",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.8459,
  "GTFS Longitude": -73.910136,
  "North Direction Label": "Bedford Pk Blvd & 205 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 217,
  "Complex ID": 217,
  "GTFS Stop ID": "D09",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "170 St",
  "Borough": "Bx",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.839306,
  "GTFS Longitude": -73.9134,
  "North Direction Label": "Bedford Pk Blvd & 205 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 218,
  "Complex ID": 218,
  "GTFS Stop ID": "D10",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "167 St",
  "Borough": "Bx",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.833771,
  "GTFS Longitude": -73.91844,
  "North Direction Label": "Bedford Pk Blvd & 205 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 219,
  "Complex ID": 604,
  "GTFS Stop ID": "D11",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "161 St-Yankee Stadium",
  "Borough": "Bx",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.827905,
  "GTFS Longitude": -73.925651,
  "North Direction Label": "Bedford Pk Blvd & 205 St",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 220,
  "Complex ID": 220,
  "GTFS Stop ID": "D12",
  "Division": "IND",
  "Line": "Concourse",
  "Stop Name": "155 St",
  "Borough": "M",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.830135,
  "GTFS Longitude": -73.938209,
  "North Direction Label": "The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 221,
  "Complex ID": 221,
  "GTFS Stop ID": "B04",
  "Division": "IND",
  "Line": "63rd St",
  "Stop Name": "21 St-Queensbridge",
  "Borough": "Q",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.754203,
  "GTFS Longitude": -73.942836,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 222,
  "Complex ID": 222,
  "GTFS Stop ID": "B06",
  "Division": "IND",
  "Line": "63rd St",
  "Stop Name": "Roosevelt Island",
  "Borough": "M",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.759145,
  "GTFS Longitude": -73.95326,
  "North Direction Label": "Queens",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 223,
  "Complex ID": 223,
  "GTFS Stop ID": "B08",
  "Division": "IND",
  "Line": "63rd St",
  "Stop Name": "Lexington Av/63 St",
  "Borough": "M",
  "Daytime Routes": "F Q",
  "Structure": "Subway",
  "GTFS Latitude": 40.764629,
  "GTFS Longitude": -73.966113,
  "North Direction Label": "Uptown - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 224,
  "Complex ID": 224,
  "GTFS Stop ID": "B10",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "57 St",
  "Borough": "M",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.763972,
  "GTFS Longitude": -73.97745,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 225,
  "Complex ID": 225,
  "GTFS Stop ID": "D15",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "47-50 Sts-Rockefeller Ctr",
  "Borough": "M",
  "Daytime Routes": "B D F M",
  "Structure": "Subway",
  "GTFS Latitude": 40.758663,
  "GTFS Longitude": -73.981329,
  "North Direction Label": "Uptown & The Bronx - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 226,
  "Complex ID": 609,
  "GTFS Stop ID": "D16",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "42 St-Bryant Pk",
  "Borough": "M",
  "Daytime Routes": "B D F M",
  "Structure": "Subway",
  "GTFS Latitude": 40.754222,
  "GTFS Longitude": -73.984569,
  "North Direction Label": "Uptown & The Bronx - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 227,
  "Complex ID": 607,
  "GTFS Stop ID": "D17",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "34 St-Herald Sq",
  "Borough": "M",
  "Daytime Routes": "B D F M",
  "Structure": "Subway",
  "GTFS Latitude": 40.749719,
  "GTFS Longitude": -73.987823,
  "North Direction Label": "Uptown & The Bronx - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 228,
  "Complex ID": 228,
  "GTFS Stop ID": "D18",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "23 St",
  "Borough": "M",
  "Daytime Routes": "F M",
  "Structure": "Subway",
  "GTFS Latitude": 40.742878,
  "GTFS Longitude": -73.992821,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 229,
  "Complex ID": 601,
  "GTFS Stop ID": "D19",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "14 St",
  "Borough": "M",
  "Daytime Routes": "F M",
  "Structure": "Subway",
  "GTFS Latitude": 40.738228,
  "GTFS Longitude": -73.996209,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 230,
  "Complex ID": 619,
  "GTFS Stop ID": "D21",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Broadway-Lafayette St",
  "Borough": "M",
  "Daytime Routes": "B D F M",
  "Structure": "Subway",
  "GTFS Latitude": 40.725297,
  "GTFS Longitude": -73.996204,
  "North Direction Label": "Uptown & The Bronx - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 231,
  "Complex ID": 231,
  "GTFS Stop ID": "D22",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Grand St",
  "Borough": "M",
  "Daytime Routes": "B D",
  "Structure": "Subway",
  "GTFS Latitude": 40.718267,
  "GTFS Longitude": -73.993753,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 232,
  "Complex ID": 232,
  "GTFS Stop ID": "F14",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "2 Av",
  "Borough": "M",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.723402,
  "GTFS Longitude": -73.989938,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 233,
  "Complex ID": 625,
  "GTFS Stop ID": "F15",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Delancey St-Essex St",
  "Borough": "M",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.718611,
  "GTFS Longitude": -73.988114,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 234,
  "Complex ID": 234,
  "GTFS Stop ID": "F16",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "East Broadway",
  "Borough": "M",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.713715,
  "GTFS Longitude": -73.990173,
  "North Direction Label": "Uptown & Queens",
  "South Direction Label": "Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 235,
  "Complex ID": 235,
  "GTFS Stop ID": "F18",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "York St",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.701397,
  "GTFS Longitude": -73.986751,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 236,
  "Complex ID": 236,
  "GTFS Stop ID": "F20",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Bergen St",
  "Borough": "Bk",
  "Daytime Routes": "F G",
  "Structure": "Subway",
  "GTFS Latitude": 40.686145,
  "GTFS Longitude": -73.990862,
  "North Direction Label": "Manhattan - Queens",
  "South Direction Label": "Church Av - Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 237,
  "Complex ID": 237,
  "GTFS Stop ID": "F21",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Carroll St",
  "Borough": "Bk",
  "Daytime Routes": "F G",
  "Structure": "Subway",
  "GTFS Latitude": 40.680303,
  "GTFS Longitude": -73.995048,
  "North Direction Label": "Manhattan - Queens",
  "South Direction Label": "Church Av - Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 238,
  "Complex ID": 238,
  "GTFS Stop ID": "F22",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Smith-9 Sts",
  "Borough": "Bk",
  "Daytime Routes": "F G",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.67358,
  "GTFS Longitude": -73.995959,
  "North Direction Label": "Manhattan - Queens",
  "South Direction Label": "Church Av - Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 239,
  "Complex ID": 608,
  "GTFS Stop ID": "F23",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "4 Av-9 St",
  "Borough": "Bk",
  "Daytime Routes": "F G",
  "Structure": "Viaduct",
  "GTFS Latitude": 40.670272,
  "GTFS Longitude": -73.989779,
  "North Direction Label": "Manhattan - Queens",
  "South Direction Label": "Church Av - Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 240,
  "Complex ID": 240,
  "GTFS Stop ID": "F24",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "7 Av",
  "Borough": "Bk",
  "Daytime Routes": "F G",
  "Structure": "Subway",
  "GTFS Latitude": 40.666271,
  "GTFS Longitude": -73.980305,
  "North Direction Label": "Manhattan - Queens",
  "South Direction Label": "Church Av - Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 241,
  "Complex ID": 241,
  "GTFS Stop ID": "F25",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "15 St-Prospect Park",
  "Borough": "Bk",
  "Daytime Routes": "F G",
  "Structure": "Subway",
  "GTFS Latitude": 40.660365,
  "GTFS Longitude": -73.979493,
  "North Direction Label": "Manhattan - Queens",
  "South Direction Label": "Church Av - Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 242,
  "Complex ID": 242,
  "GTFS Stop ID": "F26",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Fort Hamilton Pkwy",
  "Borough": "Bk",
  "Daytime Routes": "F G",
  "Structure": "Subway",
  "GTFS Latitude": 40.650782,
  "GTFS Longitude": -73.975776,
  "North Direction Label": "Manhattan - Queens",
  "South Direction Label": "Church Av - Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 243,
  "Complex ID": 243,
  "GTFS Stop ID": "F27",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Church Av",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.644041,
  "GTFS Longitude": -73.979678,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 244,
  "Complex ID": 244,
  "GTFS Stop ID": "F29",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Ditmas Av",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Elevated",
  "GTFS Latitude": 40.636119,
  "GTFS Longitude": -73.978172,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 245,
  "Complex ID": 245,
  "GTFS Stop ID": "F30",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "18 Av",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Elevated",
  "GTFS Latitude": 40.629755,
  "GTFS Longitude": -73.976971,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 246,
  "Complex ID": 246,
  "GTFS Stop ID": "F31",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Avenue I",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Elevated",
  "GTFS Latitude": 40.625322,
  "GTFS Longitude": -73.976127,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 247,
  "Complex ID": 247,
  "GTFS Stop ID": "F32",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Bay Pkwy",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Elevated",
  "GTFS Latitude": 40.620769,
  "GTFS Longitude": -73.975264,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 248,
  "Complex ID": 248,
  "GTFS Stop ID": "F33",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Avenue N",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Elevated",
  "GTFS Latitude": 40.61514,
  "GTFS Longitude": -73.974197,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 249,
  "Complex ID": 249,
  "GTFS Stop ID": "F34",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Avenue P",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Elevated",
  "GTFS Latitude": 40.608944,
  "GTFS Longitude": -73.973022,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 250,
  "Complex ID": 250,
  "GTFS Stop ID": "F35",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Kings Hwy",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Elevated",
  "GTFS Latitude": 40.603217,
  "GTFS Longitude": -73.972361,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 251,
  "Complex ID": 251,
  "GTFS Stop ID": "F36",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Avenue U",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Elevated",
  "GTFS Latitude": 40.596063,
  "GTFS Longitude": -73.973357,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 252,
  "Complex ID": 252,
  "GTFS Stop ID": "F38",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Avenue X",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Elevated",
  "GTFS Latitude": 40.58962,
  "GTFS Longitude": -73.97425,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Coney Island",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 253,
  "Complex ID": 253,
  "GTFS Stop ID": "F39",
  "Division": "IND",
  "Line": "6th Av - Culver",
  "Stop Name": "Neptune Av",
  "Borough": "Bk",
  "Daytime Routes": "F",
  "Structure": "Elevated",
  "GTFS Latitude": 40.581011,
  "GTFS Longitude": -73.974574,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Stillwell Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 254,
  "Complex ID": 254,
  "GTFS Stop ID": "F01",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Jamaica-179 St",
  "Borough": "Q",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.712646,
  "GTFS Longitude": -73.783817,
  "North Direction Label": "",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 255,
  "Complex ID": 255,
  "GTFS Stop ID": "F02",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "169 St",
  "Borough": "Q",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.71047,
  "GTFS Longitude": -73.793604,
  "North Direction Label": "179 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 256,
  "Complex ID": 256,
  "GTFS Stop ID": "F03",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Parsons Blvd",
  "Borough": "Q",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.707564,
  "GTFS Longitude": -73.803326,
  "North Direction Label": "179 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 257,
  "Complex ID": 257,
  "GTFS Stop ID": "F04",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Sutphin Blvd",
  "Borough": "Q",
  "Daytime Routes": "F",
  "Structure": "Subway",
  "GTFS Latitude": 40.70546,
  "GTFS Longitude": -73.810708,
  "North Direction Label": "179 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 258,
  "Complex ID": 258,
  "GTFS Stop ID": "F05",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Briarwood",
  "Borough": "Q",
  "Daytime Routes": "E F",
  "Structure": "Subway",
  "GTFS Latitude": 40.709179,
  "GTFS Longitude": -73.820574,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 259,
  "Complex ID": 259,
  "GTFS Stop ID": "F06",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Kew Gardens-Union Tpke",
  "Borough": "Q",
  "Daytime Routes": "E F",
  "Structure": "Subway",
  "GTFS Latitude": 40.714441,
  "GTFS Longitude": -73.831008,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 260,
  "Complex ID": 260,
  "GTFS Stop ID": "F07",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "75 Av",
  "Borough": "Q",
  "Daytime Routes": "E F",
  "Structure": "Subway",
  "GTFS Latitude": 40.718331,
  "GTFS Longitude": -73.837324,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 261,
  "Complex ID": 261,
  "GTFS Stop ID": "G08",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Forest Hills-71 Av",
  "Borough": "Q",
  "Daytime Routes": "E F M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.721691,
  "GTFS Longitude": -73.844521,
  "North Direction Label": "Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 262,
  "Complex ID": 262,
  "GTFS Stop ID": "G09",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "67 Av",
  "Borough": "Q",
  "Daytime Routes": "M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.726523,
  "GTFS Longitude": -73.852719,
  "North Direction Label": "Forest Hills",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 263,
  "Complex ID": 263,
  "GTFS Stop ID": "G10",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "63 Dr-Rego Park",
  "Borough": "Q",
  "Daytime Routes": "M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.729846,
  "GTFS Longitude": -73.861604,
  "North Direction Label": "Forest Hills",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 264,
  "Complex ID": 264,
  "GTFS Stop ID": "G11",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Woodhaven Blvd",
  "Borough": "Q",
  "Daytime Routes": "M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.733106,
  "GTFS Longitude": -73.869229,
  "North Direction Label": "Forest Hills",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 265,
  "Complex ID": 265,
  "GTFS Stop ID": "G12",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Grand Av-Newtown",
  "Borough": "Q",
  "Daytime Routes": "M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.737015,
  "GTFS Longitude": -73.877223,
  "North Direction Label": "Forest Hills",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 266,
  "Complex ID": 266,
  "GTFS Stop ID": "G13",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Elmhurst Av",
  "Borough": "Q",
  "Daytime Routes": "M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.742454,
  "GTFS Longitude": -73.882017,
  "North Direction Label": "Forest Hills",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 267,
  "Complex ID": 616,
  "GTFS Stop ID": "G14",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Jackson Hts-Roosevelt Av",
  "Borough": "Q",
  "Daytime Routes": "E F M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.746644,
  "GTFS Longitude": -73.891338,
  "North Direction Label": "Forest Hills - Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 268,
  "Complex ID": 268,
  "GTFS Stop ID": "G15",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "65 St",
  "Borough": "Q",
  "Daytime Routes": "M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.749669,
  "GTFS Longitude": -73.898453,
  "North Direction Label": "Forest Hills",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 269,
  "Complex ID": 269,
  "GTFS Stop ID": "G16",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Northern Blvd",
  "Borough": "Q",
  "Daytime Routes": "M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.752885,
  "GTFS Longitude": -73.906006,
  "North Direction Label": "Forest Hills",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 270,
  "Complex ID": 270,
  "GTFS Stop ID": "G18",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "46 St",
  "Borough": "Q",
  "Daytime Routes": "M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.756312,
  "GTFS Longitude": -73.913333,
  "North Direction Label": "Forest Hills",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 271,
  "Complex ID": 271,
  "GTFS Stop ID": "G19",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Steinway St",
  "Borough": "Q",
  "Daytime Routes": "M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.756879,
  "GTFS Longitude": -73.92074,
  "North Direction Label": "Forest Hills",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 272,
  "Complex ID": 272,
  "GTFS Stop ID": "G20",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "36 St",
  "Borough": "Q",
  "Daytime Routes": "M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.752039,
  "GTFS Longitude": -73.928781,
  "North Direction Label": "Forest Hills",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 273,
  "Complex ID": 273,
  "GTFS Stop ID": "G21",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Queens Plaza",
  "Borough": "Q",
  "Daytime Routes": "E M R",
  "Structure": "Subway",
  "GTFS Latitude": 40.748973,
  "GTFS Longitude": -73.937243,
  "North Direction Label": "Forest Hills - Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 274,
  "Complex ID": 606,
  "GTFS Stop ID": "F09",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Court Sq-23 St",
  "Borough": "Q",
  "Daytime Routes": "E M",
  "Structure": "Subway",
  "GTFS Latitude": 40.747846,
  "GTFS Longitude": -73.946,
  "North Direction Label": "Forest Hills - Jamaica",
  "South Direction Label": "Manhattan",
  "ADA": 2,
  "ADA Notes": "Manhattan-bound only"
}, {
  "Station ID": 275,
  "Complex ID": 612,
  "GTFS Stop ID": "F11",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "Lexington Av/53 St",
  "Borough": "M",
  "Daytime Routes": "E M",
  "Structure": "Subway",
  "GTFS Latitude": 40.757552,
  "GTFS Longitude": -73.969055,
  "North Direction Label": "Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 276,
  "Complex ID": 276,
  "GTFS Stop ID": "F12",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "5 Av/53 St",
  "Borough": "M",
  "Daytime Routes": "E M",
  "Structure": "Subway",
  "GTFS Latitude": 40.760167,
  "GTFS Longitude": -73.975224,
  "North Direction Label": "Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 277,
  "Complex ID": 277,
  "GTFS Stop ID": "D14",
  "Division": "IND",
  "Line": "Queens Blvd",
  "Stop Name": "7 Av",
  "Borough": "M",
  "Daytime Routes": "B D E",
  "Structure": "Subway",
  "GTFS Latitude": 40.762862,
  "GTFS Longitude": -73.981637,
  "North Direction Label": "Uptown & The Bronx - Queens",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 278,
  "Complex ID": 278,
  "GTFS Stop ID": "G05",
  "Division": "IND",
  "Line": "Queens - Archer",
  "Stop Name": "Jamaica Center-Parsons/Archer",
  "Borough": "Q",
  "Daytime Routes": "E J Z",
  "Structure": "Subway",
  "GTFS Latitude": 40.702147,
  "GTFS Longitude": -73.801109,
  "North Direction Label": "",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 279,
  "Complex ID": 279,
  "GTFS Stop ID": "G06",
  "Division": "IND",
  "Line": "Queens - Archer",
  "Stop Name": "Sutphin Blvd-Archer Av-JFK Airport",
  "Borough": "Q",
  "Daytime Routes": "E J Z",
  "Structure": "Subway",
  "GTFS Latitude": 40.700486,
  "GTFS Longitude": -73.807969,
  "North Direction Label": "Jamaica Center",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 280,
  "Complex ID": 280,
  "GTFS Stop ID": "G07",
  "Division": "IND",
  "Line": "Queens - Archer",
  "Stop Name": "Jamaica-Van Wyck",
  "Borough": "Q",
  "Daytime Routes": "E",
  "Structure": "Subway",
  "GTFS Latitude": 40.702566,
  "GTFS Longitude": -73.816859,
  "North Direction Label": "Jamaica Center",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 281,
  "Complex ID": 606,
  "GTFS Stop ID": "G22",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Court Sq",
  "Borough": "Q",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.746554,
  "GTFS Longitude": -73.943832,
  "North Direction Label": "",
  "South Direction Label": "Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 282,
  "Complex ID": 282,
  "GTFS Stop ID": "G24",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "21 St",
  "Borough": "Q",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.744065,
  "GTFS Longitude": -73.949724,
  "North Direction Label": "Court Sq",
  "South Direction Label": "Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 283,
  "Complex ID": 283,
  "GTFS Stop ID": "G26",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Greenpoint Av",
  "Borough": "Bk",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.731352,
  "GTFS Longitude": -73.954449,
  "North Direction Label": "Queens",
  "South Direction Label": "Church Av",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 284,
  "Complex ID": 284,
  "GTFS Stop ID": "G28",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Nassau Av",
  "Borough": "Bk",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.724635,
  "GTFS Longitude": -73.951277,
  "North Direction Label": "Queens",
  "South Direction Label": "Church Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 285,
  "Complex ID": 629,
  "GTFS Stop ID": "G29",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Metropolitan Av",
  "Borough": "Bk",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.712792,
  "GTFS Longitude": -73.951418,
  "North Direction Label": "Queens",
  "South Direction Label": "Church Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 286,
  "Complex ID": 286,
  "GTFS Stop ID": "G30",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Broadway",
  "Borough": "Bk",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.706092,
  "GTFS Longitude": -73.950308,
  "North Direction Label": "Queens",
  "South Direction Label": "Church Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 287,
  "Complex ID": 287,
  "GTFS Stop ID": "G31",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Flushing Av",
  "Borough": "Bk",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.700377,
  "GTFS Longitude": -73.950234,
  "North Direction Label": "Queens",
  "South Direction Label": "Church Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 288,
  "Complex ID": 288,
  "GTFS Stop ID": "G32",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Myrtle-Willoughby Avs",
  "Borough": "Bk",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.694568,
  "GTFS Longitude": -73.949046,
  "North Direction Label": "Queens",
  "South Direction Label": "Church Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 289,
  "Complex ID": 289,
  "GTFS Stop ID": "G33",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Bedford-Nostrand Avs",
  "Borough": "Bk",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.689627,
  "GTFS Longitude": -73.953522,
  "North Direction Label": "Queens",
  "South Direction Label": "Church Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 290,
  "Complex ID": 290,
  "GTFS Stop ID": "G34",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Classon Av",
  "Borough": "Bk",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.688873,
  "GTFS Longitude": -73.96007,
  "North Direction Label": "Queens",
  "South Direction Label": "Church Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 291,
  "Complex ID": 291,
  "GTFS Stop ID": "G35",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Clinton-Washington Avs",
  "Borough": "Bk",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.688089,
  "GTFS Longitude": -73.966839,
  "North Direction Label": "Queens",
  "South Direction Label": "Church Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 292,
  "Complex ID": 292,
  "GTFS Stop ID": "G36",
  "Division": "IND",
  "Line": "Crosstown",
  "Stop Name": "Fulton St",
  "Borough": "Bk",
  "Daytime Routes": "G",
  "Structure": "Subway",
  "GTFS Latitude": 40.687119,
  "GTFS Longitude": -73.975375,
  "North Direction Label": "Queens",
  "South Direction Label": "Church Av",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 293,
  "Complex ID": 293,
  "GTFS Stop ID": 101,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Van Cortlandt Park-242 St",
  "Borough": "Bx",
  "Daytime Routes": 1,
  "Structure": "Elevated",
  "GTFS Latitude": 40.889248,
  "GTFS Longitude": -73.898583,
  "North Direction Label": "",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 294,
  "Complex ID": 294,
  "GTFS Stop ID": 103,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "238 St",
  "Borough": "Bx",
  "Daytime Routes": 1,
  "Structure": "Elevated",
  "GTFS Latitude": 40.884667,
  "GTFS Longitude": -73.90087,
  "North Direction Label": "242 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 295,
  "Complex ID": 295,
  "GTFS Stop ID": 104,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "231 St",
  "Borough": "Bx",
  "Daytime Routes": 1,
  "Structure": "Elevated",
  "GTFS Latitude": 40.878856,
  "GTFS Longitude": -73.904834,
  "North Direction Label": "242 St",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 296,
  "Complex ID": 296,
  "GTFS Stop ID": 106,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Marble Hill-225 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Elevated",
  "GTFS Latitude": 40.874561,
  "GTFS Longitude": -73.909831,
  "North Direction Label": "242 St",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 297,
  "Complex ID": 297,
  "GTFS Stop ID": 107,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "215 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Elevated",
  "GTFS Latitude": 40.869444,
  "GTFS Longitude": -73.915279,
  "North Direction Label": "The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 298,
  "Complex ID": 298,
  "GTFS Stop ID": 108,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "207 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Elevated",
  "GTFS Latitude": 40.864621,
  "GTFS Longitude": -73.918822,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 299,
  "Complex ID": 299,
  "GTFS Stop ID": 109,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Dyckman St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Elevated",
  "GTFS Latitude": 40.860531,
  "GTFS Longitude": -73.925536,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 2,
  "ADA Notes": "Downtown only"
}, {
  "Station ID": 300,
  "Complex ID": 300,
  "GTFS Stop ID": 110,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "191 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.855225,
  "GTFS Longitude": -73.929412,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 301,
  "Complex ID": 301,
  "GTFS Stop ID": 111,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "181 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.849505,
  "GTFS Longitude": -73.933596,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 302,
  "Complex ID": 605,
  "GTFS Stop ID": 112,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "168 St-Washington Hts",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.840556,
  "GTFS Longitude": -73.940133,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 303,
  "Complex ID": 303,
  "GTFS Stop ID": 113,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "157 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.834041,
  "GTFS Longitude": -73.94489,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 304,
  "Complex ID": 304,
  "GTFS Stop ID": 114,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "145 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.826551,
  "GTFS Longitude": -73.95036,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 305,
  "Complex ID": 305,
  "GTFS Stop ID": 115,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "137 St-City College",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.822008,
  "GTFS Longitude": -73.953676,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 306,
  "Complex ID": 306,
  "GTFS Stop ID": 116,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "125 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Elevated",
  "GTFS Latitude": 40.815581,
  "GTFS Longitude": -73.958372,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 307,
  "Complex ID": 307,
  "GTFS Stop ID": 117,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "116 St-Columbia University",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.807722,
  "GTFS Longitude": -73.96411,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 308,
  "Complex ID": 308,
  "GTFS Stop ID": 118,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Cathedral Pkwy (110 St)",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.803967,
  "GTFS Longitude": -73.966847,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 309,
  "Complex ID": 309,
  "GTFS Stop ID": 119,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "103 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.799446,
  "GTFS Longitude": -73.968379,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 310,
  "Complex ID": 310,
  "GTFS Stop ID": 120,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "96 St",
  "Borough": "M",
  "Daytime Routes": "1 2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.793919,
  "GTFS Longitude": -73.972323,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 311,
  "Complex ID": 311,
  "GTFS Stop ID": 121,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "86 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.788644,
  "GTFS Longitude": -73.976218,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 312,
  "Complex ID": 312,
  "GTFS Stop ID": 122,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "79 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.783934,
  "GTFS Longitude": -73.979917,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 313,
  "Complex ID": 313,
  "GTFS Stop ID": 123,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "72 St",
  "Borough": "M",
  "Daytime Routes": "1 2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.778453,
  "GTFS Longitude": -73.98197,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 314,
  "Complex ID": 314,
  "GTFS Stop ID": 124,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "66 St-Lincoln Center",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.77344,
  "GTFS Longitude": -73.982209,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 315,
  "Complex ID": 614,
  "GTFS Stop ID": 125,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "59 St-Columbus Circle",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.768247,
  "GTFS Longitude": -73.981929,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 316,
  "Complex ID": 316,
  "GTFS Stop ID": 126,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "50 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.761728,
  "GTFS Longitude": -73.983849,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 317,
  "Complex ID": 611,
  "GTFS Stop ID": 127,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Times Sq-42 St",
  "Borough": "M",
  "Daytime Routes": "1 2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.75529,
  "GTFS Longitude": -73.987495,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 318,
  "Complex ID": 318,
  "GTFS Stop ID": 128,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "34 St-Penn Station",
  "Borough": "M",
  "Daytime Routes": "1 2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.750373,
  "GTFS Longitude": -73.991057,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 319,
  "Complex ID": 319,
  "GTFS Stop ID": 129,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "28 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.747215,
  "GTFS Longitude": -73.993365,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 320,
  "Complex ID": 320,
  "GTFS Stop ID": 130,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "23 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.744081,
  "GTFS Longitude": -73.995657,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 321,
  "Complex ID": 321,
  "GTFS Stop ID": 131,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "18 St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.74104,
  "GTFS Longitude": -73.997871,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 322,
  "Complex ID": 601,
  "GTFS Stop ID": 132,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "14 St",
  "Borough": "M",
  "Daytime Routes": "1 2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.737826,
  "GTFS Longitude": -74.000201,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 323,
  "Complex ID": 323,
  "GTFS Stop ID": 133,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Christopher St-Sheridan Sq",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.733422,
  "GTFS Longitude": -74.002906,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 324,
  "Complex ID": 324,
  "GTFS Stop ID": 134,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Houston St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.728251,
  "GTFS Longitude": -74.005367,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 325,
  "Complex ID": 325,
  "GTFS Stop ID": 135,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Canal St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.722854,
  "GTFS Longitude": -74.006277,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 326,
  "Complex ID": 326,
  "GTFS Stop ID": 136,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Franklin St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.719318,
  "GTFS Longitude": -74.006886,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 327,
  "Complex ID": 327,
  "GTFS Stop ID": 137,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Chambers St",
  "Borough": "M",
  "Daytime Routes": "1 2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.715478,
  "GTFS Longitude": -74.009266,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 328,
  "Complex ID": 328,
  "GTFS Stop ID": 138,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "WTC Cortlandt",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.711835,
  "GTFS Longitude": -74.012188,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 329,
  "Complex ID": 329,
  "GTFS Stop ID": 139,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "Rector St",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.707513,
  "GTFS Longitude": -74.013783,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 330,
  "Complex ID": 635,
  "GTFS Stop ID": 142,
  "Division": "IRT",
  "Line": "Broadway - 7Av",
  "Stop Name": "South Ferry",
  "Borough": "M",
  "Daytime Routes": 1,
  "Structure": "Subway",
  "GTFS Latitude": 40.702068,
  "GTFS Longitude": -74.013664,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 331,
  "Complex ID": 624,
  "GTFS Stop ID": 228,
  "Division": "IRT",
  "Line": "Clark St",
  "Stop Name": "Park Place",
  "Borough": "M",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.713051,
  "GTFS Longitude": -74.008811,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 332,
  "Complex ID": 628,
  "GTFS Stop ID": 229,
  "Division": "IRT",
  "Line": "Clark St",
  "Stop Name": "Fulton St",
  "Borough": "M",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.709416,
  "GTFS Longitude": -74.006571,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 333,
  "Complex ID": 333,
  "GTFS Stop ID": 230,
  "Division": "IRT",
  "Line": "Clark St",
  "Stop Name": "Wall St",
  "Borough": "M",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.706821,
  "GTFS Longitude": -74.0091,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 334,
  "Complex ID": 334,
  "GTFS Stop ID": 231,
  "Division": "IRT",
  "Line": "Clark St",
  "Stop Name": "Clark St",
  "Borough": "Bk",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.697466,
  "GTFS Longitude": -73.993086,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush - New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 335,
  "Complex ID": 620,
  "GTFS Stop ID": 232,
  "Division": "IRT",
  "Line": "Clark St",
  "Stop Name": "Borough Hall",
  "Borough": "Bk",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.693219,
  "GTFS Longitude": -73.989998,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush - New Lots",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 336,
  "Complex ID": 336,
  "GTFS Stop ID": 233,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Hoyt St",
  "Borough": "Bk",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.690545,
  "GTFS Longitude": -73.985065,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush - New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 337,
  "Complex ID": 337,
  "GTFS Stop ID": 234,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Nevins St",
  "Borough": "Bk",
  "Daytime Routes": "2 3 4 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.688246,
  "GTFS Longitude": -73.980492,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush - Utica - New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 338,
  "Complex ID": 617,
  "GTFS Stop ID": 235,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Atlantic Av-Barclays Ctr",
  "Borough": "Bk",
  "Daytime Routes": "2 3 4 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.684359,
  "GTFS Longitude": -73.977666,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush - New Lots",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 339,
  "Complex ID": 339,
  "GTFS Stop ID": 236,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Bergen St",
  "Borough": "Bk",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.680829,
  "GTFS Longitude": -73.975098,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush - New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 340,
  "Complex ID": 340,
  "GTFS Stop ID": 237,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Grand Army Plaza",
  "Borough": "Bk",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.675235,
  "GTFS Longitude": -73.971046,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush - New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 341,
  "Complex ID": 341,
  "GTFS Stop ID": 238,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Eastern Pkwy-Brooklyn Museum",
  "Borough": "Bk",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.671987,
  "GTFS Longitude": -73.964375,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush - New Lots",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 342,
  "Complex ID": 626,
  "GTFS Stop ID": 239,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Franklin Avenue-Medgar Evers College",
  "Borough": "Bk",
  "Daytime Routes": "2 3 4 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.670682,
  "GTFS Longitude": -73.958131,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush - Utica - New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 343,
  "Complex ID": 343,
  "GTFS Stop ID": 248,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Nostrand Av",
  "Borough": "Bk",
  "Daytime Routes": 3,
  "Structure": "Subway",
  "GTFS Latitude": 40.669847,
  "GTFS Longitude": -73.950466,
  "North Direction Label": "Manhattan",
  "South Direction Label": "New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 344,
  "Complex ID": 344,
  "GTFS Stop ID": 249,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Kingston Av",
  "Borough": "Bk",
  "Daytime Routes": 3,
  "Structure": "Subway",
  "GTFS Latitude": 40.669399,
  "GTFS Longitude": -73.942161,
  "North Direction Label": "Manhattan",
  "South Direction Label": "New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 345,
  "Complex ID": 345,
  "GTFS Stop ID": 250,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Crown Hts-Utica Av",
  "Borough": "Bk",
  "Daytime Routes": "3 4",
  "Structure": "Subway",
  "GTFS Latitude": 40.668897,
  "GTFS Longitude": -73.932942,
  "North Direction Label": "Manhattan",
  "South Direction Label": "New Lots",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 346,
  "Complex ID": 346,
  "GTFS Stop ID": 251,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Sutter Av-Rutland Rd",
  "Borough": "Bk",
  "Daytime Routes": 3,
  "Structure": "Elevated",
  "GTFS Latitude": 40.664717,
  "GTFS Longitude": -73.92261,
  "North Direction Label": "Manhattan",
  "South Direction Label": "New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 347,
  "Complex ID": 347,
  "GTFS Stop ID": 252,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Saratoga Av",
  "Borough": "Bk",
  "Daytime Routes": 3,
  "Structure": "Elevated",
  "GTFS Latitude": 40.661453,
  "GTFS Longitude": -73.916327,
  "North Direction Label": "Manhattan",
  "South Direction Label": "New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 348,
  "Complex ID": 348,
  "GTFS Stop ID": 253,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Rockaway Av",
  "Borough": "Bk",
  "Daytime Routes": 3,
  "Structure": "Elevated",
  "GTFS Latitude": 40.662549,
  "GTFS Longitude": -73.908946,
  "North Direction Label": "Manhattan",
  "South Direction Label": "New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 349,
  "Complex ID": 349,
  "GTFS Stop ID": 254,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Junius St",
  "Borough": "Bk",
  "Daytime Routes": 3,
  "Structure": "Elevated",
  "GTFS Latitude": 40.663515,
  "GTFS Longitude": -73.902447,
  "North Direction Label": "Manhattan",
  "South Direction Label": "New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 350,
  "Complex ID": 350,
  "GTFS Stop ID": 255,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Pennsylvania Av",
  "Borough": "Bk",
  "Daytime Routes": 3,
  "Structure": "Elevated",
  "GTFS Latitude": 40.664635,
  "GTFS Longitude": -73.894895,
  "North Direction Label": "Manhattan",
  "South Direction Label": "New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 351,
  "Complex ID": 351,
  "GTFS Stop ID": 256,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Van Siclen Av",
  "Borough": "Bk",
  "Daytime Routes": 3,
  "Structure": "Elevated",
  "GTFS Latitude": 40.665449,
  "GTFS Longitude": -73.889395,
  "North Direction Label": "Manhattan",
  "South Direction Label": "New Lots",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 352,
  "Complex ID": 352,
  "GTFS Stop ID": 257,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "New Lots Av",
  "Borough": "Bk",
  "Daytime Routes": 3,
  "Structure": "Elevated",
  "GTFS Latitude": 40.666235,
  "GTFS Longitude": -73.884079,
  "North Direction Label": "Manhattan",
  "South Direction Label": "",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 353,
  "Complex ID": 353,
  "GTFS Stop ID": 241,
  "Division": "IRT",
  "Line": "Nostrand",
  "Stop Name": "President Street-Medgar Evers College",
  "Borough": "Bk",
  "Daytime Routes": "2 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.667883,
  "GTFS Longitude": -73.950683,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 354,
  "Complex ID": 354,
  "GTFS Stop ID": 242,
  "Division": "IRT",
  "Line": "Nostrand",
  "Stop Name": "Sterling St",
  "Borough": "Bk",
  "Daytime Routes": "2 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.662742,
  "GTFS Longitude": -73.95085,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 355,
  "Complex ID": 355,
  "GTFS Stop ID": 243,
  "Division": "IRT",
  "Line": "Nostrand",
  "Stop Name": "Winthrop St",
  "Borough": "Bk",
  "Daytime Routes": "2 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.656652,
  "GTFS Longitude": -73.9502,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 356,
  "Complex ID": 356,
  "GTFS Stop ID": 244,
  "Division": "IRT",
  "Line": "Nostrand",
  "Stop Name": "Church Av",
  "Borough": "Bk",
  "Daytime Routes": "2 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.650843,
  "GTFS Longitude": -73.949575,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 357,
  "Complex ID": 357,
  "GTFS Stop ID": 245,
  "Division": "IRT",
  "Line": "Nostrand",
  "Stop Name": "Beverly Rd",
  "Borough": "Bk",
  "Daytime Routes": "2 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.645098,
  "GTFS Longitude": -73.948959,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 358,
  "Complex ID": 358,
  "GTFS Stop ID": 246,
  "Division": "IRT",
  "Line": "Nostrand",
  "Stop Name": "Newkirk Av - Little Haiti",
  "Borough": "Bk",
  "Daytime Routes": "2 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.639967,
  "GTFS Longitude": -73.948411,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 359,
  "Complex ID": 359,
  "GTFS Stop ID": 247,
  "Division": "IRT",
  "Line": "Nostrand",
  "Stop Name": "Flatbush Av-Brooklyn College",
  "Borough": "Bk",
  "Daytime Routes": "2 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.632836,
  "GTFS Longitude": -73.947642,
  "North Direction Label": "Manhattan",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 360,
  "Complex ID": 360,
  "GTFS Stop ID": 601,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Pelham Bay Park",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.852462,
  "GTFS Longitude": -73.828121,
  "North Direction Label": "",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 361,
  "Complex ID": 361,
  "GTFS Stop ID": 602,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Buhre Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.84681,
  "GTFS Longitude": -73.832569,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 362,
  "Complex ID": 362,
  "GTFS Stop ID": 603,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Middletown Rd",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.843863,
  "GTFS Longitude": -73.836322,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 363,
  "Complex ID": 363,
  "GTFS Stop ID": 604,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Westchester Sq-E Tremont Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.839892,
  "GTFS Longitude": -73.842952,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 364,
  "Complex ID": 364,
  "GTFS Stop ID": 606,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Zerega Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.836488,
  "GTFS Longitude": -73.847036,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 365,
  "Complex ID": 365,
  "GTFS Stop ID": 607,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Castle Hill Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.834255,
  "GTFS Longitude": -73.851222,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 366,
  "Complex ID": 366,
  "GTFS Stop ID": 608,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Parkchester",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.833226,
  "GTFS Longitude": -73.860816,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 367,
  "Complex ID": 367,
  "GTFS Stop ID": 609,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "St Lawrence Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.831509,
  "GTFS Longitude": -73.867618,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 368,
  "Complex ID": 368,
  "GTFS Stop ID": 610,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Morrison Av-Soundview",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.829521,
  "GTFS Longitude": -73.874516,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 369,
  "Complex ID": 369,
  "GTFS Stop ID": 611,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Elder Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.828584,
  "GTFS Longitude": -73.879159,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 370,
  "Complex ID": 370,
  "GTFS Stop ID": 612,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Whitlock Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Elevated",
  "GTFS Latitude": 40.826525,
  "GTFS Longitude": -73.886283,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 371,
  "Complex ID": 371,
  "GTFS Stop ID": 613,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Hunts Point Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.820948,
  "GTFS Longitude": -73.890549,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 372,
  "Complex ID": 372,
  "GTFS Stop ID": 614,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Longwood Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.816104,
  "GTFS Longitude": -73.896435,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 373,
  "Complex ID": 373,
  "GTFS Stop ID": 615,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "E 149 St",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.812118,
  "GTFS Longitude": -73.904098,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 374,
  "Complex ID": 374,
  "GTFS Stop ID": 616,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "E 143 St-St Mary's St",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.808719,
  "GTFS Longitude": -73.907657,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 375,
  "Complex ID": 375,
  "GTFS Stop ID": 617,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Cypress Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.805368,
  "GTFS Longitude": -73.914042,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 376,
  "Complex ID": 376,
  "GTFS Stop ID": 618,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "Brook Av",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.807566,
  "GTFS Longitude": -73.91924,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 377,
  "Complex ID": 377,
  "GTFS Stop ID": 619,
  "Division": "IRT",
  "Line": "Pelham",
  "Stop Name": "3 Av-138 St",
  "Borough": "Bx",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.810476,
  "GTFS Longitude": -73.926138,
  "North Direction Label": "Pelham Bay Park",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 378,
  "Complex ID": 378,
  "GTFS Stop ID": 401,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "Woodlawn",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.886037,
  "GTFS Longitude": -73.878751,
  "North Direction Label": "",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 379,
  "Complex ID": 379,
  "GTFS Stop ID": 402,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "Mosholu Pkwy",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.87975,
  "GTFS Longitude": -73.884655,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 380,
  "Complex ID": 380,
  "GTFS Stop ID": 405,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "Bedford Park Blvd-Lehman College",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.873412,
  "GTFS Longitude": -73.890064,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 381,
  "Complex ID": 381,
  "GTFS Stop ID": 406,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "Kingsbridge Rd",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.86776,
  "GTFS Longitude": -73.897174,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 382,
  "Complex ID": 382,
  "GTFS Stop ID": 407,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "Fordham Rd",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.862803,
  "GTFS Longitude": -73.901034,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 383,
  "Complex ID": 383,
  "GTFS Stop ID": 408,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "183 St",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.858407,
  "GTFS Longitude": -73.903879,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 384,
  "Complex ID": 384,
  "GTFS Stop ID": 409,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "Burnside Av",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.853453,
  "GTFS Longitude": -73.907684,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 385,
  "Complex ID": 385,
  "GTFS Stop ID": 410,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "176 St",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.84848,
  "GTFS Longitude": -73.911794,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 386,
  "Complex ID": 386,
  "GTFS Stop ID": 411,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "Mt Eden Av",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.844434,
  "GTFS Longitude": -73.914685,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 387,
  "Complex ID": 387,
  "GTFS Stop ID": 412,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "170 St",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.840075,
  "GTFS Longitude": -73.917791,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 388,
  "Complex ID": 388,
  "GTFS Stop ID": 413,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "167 St",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.835537,
  "GTFS Longitude": -73.9214,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 389,
  "Complex ID": 604,
  "GTFS Stop ID": 414,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "161 St-Yankee Stadium",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Elevated",
  "GTFS Latitude": 40.827994,
  "GTFS Longitude": -73.925831,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 390,
  "Complex ID": 603,
  "GTFS Stop ID": 415,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "149 St-Grand Concourse",
  "Borough": "Bx",
  "Daytime Routes": 4,
  "Structure": "Subway",
  "GTFS Latitude": 40.818375,
  "GTFS Longitude": -73.927351,
  "North Direction Label": "Woodlawn",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 391,
  "Complex ID": 391,
  "GTFS Stop ID": 416,
  "Division": "IRT",
  "Line": "Jerome Av",
  "Stop Name": "138 St-Grand Concourse",
  "Borough": "Bx",
  "Daytime Routes": "4 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.813224,
  "GTFS Longitude": -73.929849,
  "North Direction Label": "Woodlawn - Eastchester Dyre Av",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 392,
  "Complex ID": 392,
  "GTFS Stop ID": 621,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "125 St",
  "Borough": "M",
  "Daytime Routes": "4 5 6",
  "Structure": "Subway",
  "GTFS Latitude": 40.804138,
  "GTFS Longitude": -73.937594,
  "North Direction Label": "The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 393,
  "Complex ID": 393,
  "GTFS Stop ID": 622,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "116 St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.798629,
  "GTFS Longitude": -73.941617,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 394,
  "Complex ID": 394,
  "GTFS Stop ID": 623,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "110 St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.79502,
  "GTFS Longitude": -73.94425,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 395,
  "Complex ID": 395,
  "GTFS Stop ID": 624,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "103 St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.7906,
  "GTFS Longitude": -73.947478,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 396,
  "Complex ID": 396,
  "GTFS Stop ID": 625,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "96 St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.785672,
  "GTFS Longitude": -73.95107,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 397,
  "Complex ID": 397,
  "GTFS Stop ID": 626,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "86 St",
  "Borough": "M",
  "Daytime Routes": "4 5 6",
  "Structure": "Subway",
  "GTFS Latitude": 40.779492,
  "GTFS Longitude": -73.955589,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 2,
  "ADA Notes": "Uptown 6 only"
}, {
  "Station ID": 398,
  "Complex ID": 398,
  "GTFS Stop ID": 627,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "77 St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.77362,
  "GTFS Longitude": -73.959874,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 399,
  "Complex ID": 399,
  "GTFS Stop ID": 628,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "68 St-Hunter College",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.768141,
  "GTFS Longitude": -73.96387,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 400,
  "Complex ID": 613,
  "GTFS Stop ID": 629,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "59 St",
  "Borough": "M",
  "Daytime Routes": "4 5 6",
  "Structure": "Subway",
  "GTFS Latitude": 40.762526,
  "GTFS Longitude": -73.967967,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 401,
  "Complex ID": 612,
  "GTFS Stop ID": 630,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "51 St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.757107,
  "GTFS Longitude": -73.97192,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 402,
  "Complex ID": 610,
  "GTFS Stop ID": 631,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "Grand Central-42 St",
  "Borough": "M",
  "Daytime Routes": "4 5 6",
  "Structure": "Subway",
  "GTFS Latitude": 40.751776,
  "GTFS Longitude": -73.976848,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 403,
  "Complex ID": 403,
  "GTFS Stop ID": 632,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "33 St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.746081,
  "GTFS Longitude": -73.982076,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 404,
  "Complex ID": 404,
  "GTFS Stop ID": 633,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "28 St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.74307,
  "GTFS Longitude": -73.984264,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 2,
  "ADA Notes": "Downtown only"
}, {
  "Station ID": 405,
  "Complex ID": 405,
  "GTFS Stop ID": 634,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "23 St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.739864,
  "GTFS Longitude": -73.986599,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 406,
  "Complex ID": 602,
  "GTFS Stop ID": 635,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "14 St-Union Sq",
  "Borough": "M",
  "Daytime Routes": "4 5 6",
  "Structure": "Subway",
  "GTFS Latitude": 40.734673,
  "GTFS Longitude": -73.989951,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 407,
  "Complex ID": 407,
  "GTFS Stop ID": 636,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "Astor Pl",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.730054,
  "GTFS Longitude": -73.99107,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 408,
  "Complex ID": 619,
  "GTFS Stop ID": 637,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "Bleecker St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.725915,
  "GTFS Longitude": -73.994659,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 409,
  "Complex ID": 409,
  "GTFS Stop ID": 638,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "Spring St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.722301,
  "GTFS Longitude": -73.997141,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 410,
  "Complex ID": 623,
  "GTFS Stop ID": 639,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "Canal St",
  "Borough": "M",
  "Daytime Routes": 6,
  "Structure": "Subway",
  "GTFS Latitude": 40.718803,
  "GTFS Longitude": -74.000193,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 411,
  "Complex ID": 622,
  "GTFS Stop ID": 640,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "Brooklyn Bridge-City Hall",
  "Borough": "M",
  "Daytime Routes": "4 5 6",
  "Structure": "Subway",
  "GTFS Latitude": 40.713065,
  "GTFS Longitude": -74.004131,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 412,
  "Complex ID": 628,
  "GTFS Stop ID": 418,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "Fulton St",
  "Borough": "M",
  "Daytime Routes": "4 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.710368,
  "GTFS Longitude": -74.009509,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 413,
  "Complex ID": 413,
  "GTFS Stop ID": 419,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "Wall St",
  "Borough": "M",
  "Daytime Routes": "4 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.707557,
  "GTFS Longitude": -74.011862,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 414,
  "Complex ID": 414,
  "GTFS Stop ID": 420,
  "Division": "IRT",
  "Line": "Lexington Av",
  "Stop Name": "Bowling Green",
  "Borough": "M",
  "Daytime Routes": "4 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.704817,
  "GTFS Longitude": -74.014065,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 415,
  "Complex ID": 620,
  "GTFS Stop ID": 423,
  "Division": "IRT",
  "Line": "Eastern Pky",
  "Stop Name": "Borough Hall",
  "Borough": "Bk",
  "Daytime Routes": "4 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.692404,
  "GTFS Longitude": -73.990151,
  "North Direction Label": "Manhattan",
  "South Direction Label": "Flatbush - Utica",
  "ADA": 2,
  "ADA Notes": "Manhattan-bound only"
}, {
  "Station ID": 416,
  "Complex ID": 416,
  "GTFS Stop ID": 201,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Wakefield-241 St",
  "Borough": "Bx",
  "Daytime Routes": 2,
  "Structure": "Elevated",
  "GTFS Latitude": 40.903125,
  "GTFS Longitude": -73.85062,
  "North Direction Label": "",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 417,
  "Complex ID": 417,
  "GTFS Stop ID": 204,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Nereid Av",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.898379,
  "GTFS Longitude": -73.854376,
  "North Direction Label": "Wakefield - 241 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 418,
  "Complex ID": 418,
  "GTFS Stop ID": 205,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "233 St",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.893193,
  "GTFS Longitude": -73.857473,
  "North Direction Label": "Wakefield - 241 St",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 419,
  "Complex ID": 419,
  "GTFS Stop ID": 206,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "225 St",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.888022,
  "GTFS Longitude": -73.860341,
  "North Direction Label": "Wakefield - 241 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 420,
  "Complex ID": 420,
  "GTFS Stop ID": 207,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "219 St",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.883895,
  "GTFS Longitude": -73.862633,
  "North Direction Label": "Wakefield - 241 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 421,
  "Complex ID": 421,
  "GTFS Stop ID": 208,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Gun Hill Rd",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.87785,
  "GTFS Longitude": -73.866256,
  "North Direction Label": "Wakefield - 241 St",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 422,
  "Complex ID": 422,
  "GTFS Stop ID": 209,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Burke Av",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.871356,
  "GTFS Longitude": -73.867164,
  "North Direction Label": "Wakefield - 241 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 423,
  "Complex ID": 423,
  "GTFS Stop ID": 210,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Allerton Av",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.865462,
  "GTFS Longitude": -73.867352,
  "North Direction Label": "Wakefield - 241 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 424,
  "Complex ID": 424,
  "GTFS Stop ID": 211,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Pelham Pkwy",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.857192,
  "GTFS Longitude": -73.867615,
  "North Direction Label": "Wakefield - 241 St",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 425,
  "Complex ID": 425,
  "GTFS Stop ID": 212,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Bronx Park East",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.848828,
  "GTFS Longitude": -73.868457,
  "North Direction Label": "Wakefield - 241 St",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 426,
  "Complex ID": 426,
  "GTFS Stop ID": 213,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "E 180 St",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.841894,
  "GTFS Longitude": -73.873488,
  "North Direction Label": "Wakefield - Eastchester",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 427,
  "Complex ID": 427,
  "GTFS Stop ID": 214,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "West Farms Sq-E Tremont Av",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.840295,
  "GTFS Longitude": -73.880049,
  "North Direction Label": "Wakefield - Eastchester",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 428,
  "Complex ID": 428,
  "GTFS Stop ID": 215,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "174 St",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.837288,
  "GTFS Longitude": -73.887734,
  "North Direction Label": "Wakefield - Eastchester",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 429,
  "Complex ID": 429,
  "GTFS Stop ID": 216,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Freeman St",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.829993,
  "GTFS Longitude": -73.891865,
  "North Direction Label": "Wakefield - Eastchester",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 430,
  "Complex ID": 430,
  "GTFS Stop ID": 217,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Simpson St",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.824073,
  "GTFS Longitude": -73.893064,
  "North Direction Label": "Wakefield - Eastchester",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 431,
  "Complex ID": 431,
  "GTFS Stop ID": 218,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Intervale Av",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.822181,
  "GTFS Longitude": -73.896736,
  "North Direction Label": "Wakefield - Eastchester",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 432,
  "Complex ID": 432,
  "GTFS Stop ID": 219,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Prospect Av",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.819585,
  "GTFS Longitude": -73.90177,
  "North Direction Label": "Wakefield - Eastchester",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 433,
  "Complex ID": 433,
  "GTFS Stop ID": 220,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Jackson Av",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Elevated",
  "GTFS Latitude": 40.81649,
  "GTFS Longitude": -73.907807,
  "North Direction Label": "Wakefield - Eastchester",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 434,
  "Complex ID": 434,
  "GTFS Stop ID": 221,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "3 Av-149 St",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.816109,
  "GTFS Longitude": -73.917757,
  "North Direction Label": "Wakefield - Eastchester",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 435,
  "Complex ID": 603,
  "GTFS Stop ID": 222,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "149 St-Grand Concourse",
  "Borough": "Bx",
  "Daytime Routes": "2 5",
  "Structure": "Subway",
  "GTFS Latitude": 40.81841,
  "GTFS Longitude": -73.926718,
  "North Direction Label": "Wakefield - Eastchester",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 436,
  "Complex ID": 436,
  "GTFS Stop ID": 301,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Harlem-148 St",
  "Borough": "M",
  "Daytime Routes": 3,
  "Structure": "Subway",
  "GTFS Latitude": 40.82388,
  "GTFS Longitude": -73.93647,
  "North Direction Label": "",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 437,
  "Complex ID": 437,
  "GTFS Stop ID": 302,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "145 St",
  "Borough": "M",
  "Daytime Routes": 3,
  "Structure": "Subway",
  "GTFS Latitude": 40.820421,
  "GTFS Longitude": -73.936245,
  "North Direction Label": "148 St",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 438,
  "Complex ID": 438,
  "GTFS Stop ID": 224,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "135 St",
  "Borough": "M",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.814229,
  "GTFS Longitude": -73.94077,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 439,
  "Complex ID": 439,
  "GTFS Stop ID": 225,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "125 St",
  "Borough": "M",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.807754,
  "GTFS Longitude": -73.945495,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 440,
  "Complex ID": 440,
  "GTFS Stop ID": 226,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "116 St",
  "Borough": "M",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.802098,
  "GTFS Longitude": -73.949625,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 441,
  "Complex ID": 441,
  "GTFS Stop ID": 227,
  "Division": "IRT",
  "Line": "Lenox - White Plains Rd",
  "Stop Name": "Central Park North (110 St)",
  "Borough": "M",
  "Daytime Routes": "2 3",
  "Structure": "Subway",
  "GTFS Latitude": 40.799075,
  "GTFS Longitude": -73.951822,
  "North Direction Label": "Uptown & The Bronx",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 442,
  "Complex ID": 442,
  "GTFS Stop ID": 501,
  "Division": "IRT",
  "Line": "Dyre Av",
  "Stop Name": "Eastchester-Dyre Av",
  "Borough": "Bx",
  "Daytime Routes": 5,
  "Structure": "At Grade",
  "GTFS Latitude": 40.8883,
  "GTFS Longitude": -73.830834,
  "North Direction Label": "",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 443,
  "Complex ID": 443,
  "GTFS Stop ID": 502,
  "Division": "IRT",
  "Line": "Dyre Av",
  "Stop Name": "Baychester Av",
  "Borough": "Bx",
  "Daytime Routes": 5,
  "Structure": "Open Cut",
  "GTFS Latitude": 40.878663,
  "GTFS Longitude": -73.838591,
  "North Direction Label": "Eastchester - Dyre Av",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 444,
  "Complex ID": 444,
  "GTFS Stop ID": 503,
  "Division": "IRT",
  "Line": "Dyre Av",
  "Stop Name": "Gun Hill Rd",
  "Borough": "Bx",
  "Daytime Routes": 5,
  "Structure": "Open Cut",
  "GTFS Latitude": 40.869526,
  "GTFS Longitude": -73.846384,
  "North Direction Label": "Eastchester - Dyre Av",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 445,
  "Complex ID": 445,
  "GTFS Stop ID": 504,
  "Division": "IRT",
  "Line": "Dyre Av",
  "Stop Name": "Pelham Pkwy",
  "Borough": "Bx",
  "Daytime Routes": 5,
  "Structure": "Open Cut",
  "GTFS Latitude": 40.858985,
  "GTFS Longitude": -73.855359,
  "North Direction Label": "Eastchester - Dyre Av",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 446,
  "Complex ID": 446,
  "GTFS Stop ID": 505,
  "Division": "IRT",
  "Line": "Dyre Av",
  "Stop Name": "Morris Park",
  "Borough": "Bx",
  "Daytime Routes": 5,
  "Structure": "Open Cut",
  "GTFS Latitude": 40.854364,
  "GTFS Longitude": -73.860495,
  "North Direction Label": "Eastchester - Dyre Av",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 447,
  "Complex ID": 447,
  "GTFS Stop ID": 701,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "Flushing-Main St",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Subway",
  "GTFS Latitude": 40.7596,
  "GTFS Longitude": -73.83003,
  "North Direction Label": "",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 448,
  "Complex ID": 448,
  "GTFS Stop ID": 702,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "Mets-Willets Point",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.754622,
  "GTFS Longitude": -73.845625,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 449,
  "Complex ID": 449,
  "GTFS Stop ID": 705,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "111 St",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.75173,
  "GTFS Longitude": -73.855334,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 450,
  "Complex ID": 450,
  "GTFS Stop ID": 706,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "103 St-Corona Plaza",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.749865,
  "GTFS Longitude": -73.8627,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 451,
  "Complex ID": 451,
  "GTFS Stop ID": 707,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "Junction Blvd",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.749145,
  "GTFS Longitude": -73.869527,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 452,
  "Complex ID": 452,
  "GTFS Stop ID": 708,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "90 St-Elmhurst Av",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.748408,
  "GTFS Longitude": -73.876613,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 453,
  "Complex ID": 453,
  "GTFS Stop ID": 709,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "82 St-Jackson Hts",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.747659,
  "GTFS Longitude": -73.883697,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 454,
  "Complex ID": 616,
  "GTFS Stop ID": 710,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "74 St-Broadway",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.746848,
  "GTFS Longitude": -73.891394,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 455,
  "Complex ID": 455,
  "GTFS Stop ID": 711,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "69 St",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.746325,
  "GTFS Longitude": -73.896403,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 456,
  "Complex ID": 456,
  "GTFS Stop ID": 712,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "Woodside-61 St",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.74563,
  "GTFS Longitude": -73.902984,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 457,
  "Complex ID": 457,
  "GTFS Stop ID": 713,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "52 St",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.744149,
  "GTFS Longitude": -73.912549,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 458,
  "Complex ID": 458,
  "GTFS Stop ID": 714,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "46 St-Bliss St",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.743132,
  "GTFS Longitude": -73.918435,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 459,
  "Complex ID": 459,
  "GTFS Stop ID": 715,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "40 St-Lowery St",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.743781,
  "GTFS Longitude": -73.924016,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 460,
  "Complex ID": 460,
  "GTFS Stop ID": 716,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "33 St-Rawson St",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.744587,
  "GTFS Longitude": -73.930997,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 461,
  "Complex ID": 461,
  "GTFS Stop ID": 718,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "Queensboro Plaza",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.750582,
  "GTFS Longitude": -73.940202,
  "North Direction Label": "Astoria - Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 461,
  "Complex ID": 461,
  "GTFS Stop ID": "R09",
  "Division": "BMT",
  "Line": "Astoria",
  "Stop Name": "Queensboro Plaza",
  "Borough": "Q",
  "Daytime Routes": "N W",
  "Structure": "Elevated",
  "GTFS Latitude": 40.750582,
  "GTFS Longitude": -73.940202,
  "North Direction Label": "Astoria - Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 462,
  "Complex ID": 606,
  "GTFS Stop ID": 719,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "Court Sq",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Elevated",
  "GTFS Latitude": 40.747023,
  "GTFS Longitude": -73.945264,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 463,
  "Complex ID": 463,
  "GTFS Stop ID": 720,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "Hunters Point Av",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Subway",
  "GTFS Latitude": 40.742216,
  "GTFS Longitude": -73.948916,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 464,
  "Complex ID": 464,
  "GTFS Stop ID": 721,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "Vernon Blvd-Jackson Av",
  "Borough": "Q",
  "Daytime Routes": 7,
  "Structure": "Subway",
  "GTFS Latitude": 40.742626,
  "GTFS Longitude": -73.953581,
  "North Direction Label": "Flushing",
  "South Direction Label": "Manhattan",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 465,
  "Complex ID": 610,
  "GTFS Stop ID": 723,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "Grand Central-42 St",
  "Borough": "M",
  "Daytime Routes": 7,
  "Structure": "Subway",
  "GTFS Latitude": 40.751431,
  "GTFS Longitude": -73.976041,
  "North Direction Label": "Queens",
  "South Direction Label": "34 St - Hudson Yards",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 466,
  "Complex ID": 609,
  "GTFS Stop ID": 724,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "5 Av",
  "Borough": "M",
  "Daytime Routes": 7,
  "Structure": "Subway",
  "GTFS Latitude": 40.753821,
  "GTFS Longitude": -73.981963,
  "North Direction Label": "Queens",
  "South Direction Label": "34 St - Hudson Yards",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 467,
  "Complex ID": 611,
  "GTFS Stop ID": 725,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "Times Sq-42 St",
  "Borough": "M",
  "Daytime Routes": 7,
  "Structure": "Subway",
  "GTFS Latitude": 40.755477,
  "GTFS Longitude": -73.987691,
  "North Direction Label": "Queens",
  "South Direction Label": "34 St - Hudson Yards",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 468,
  "Complex ID": 611,
  "GTFS Stop ID": 902,
  "Division": "IRT",
  "Line": "Lexington - Shuttle",
  "Stop Name": "Times Sq-42 St",
  "Borough": "M",
  "Daytime Routes": "S",
  "Structure": "Subway",
  "GTFS Latitude": 40.755983,
  "GTFS Longitude": -73.986229,
  "North Direction Label": "",
  "South Direction Label": "Grand Central",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 469,
  "Complex ID": 610,
  "GTFS Stop ID": 901,
  "Division": "IRT",
  "Line": "Lexington - Shuttle",
  "Stop Name": "Grand Central-42 St",
  "Borough": "M",
  "Daytime Routes": "S",
  "Structure": "Subway",
  "GTFS Latitude": 40.752769,
  "GTFS Longitude": -73.979189,
  "North Direction Label": "Times Sq",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 471,
  "Complex ID": 471,
  "GTFS Stop ID": 726,
  "Division": "IRT",
  "Line": "Flushing",
  "Stop Name": "34 St-Hudson Yards",
  "Borough": "M",
  "Daytime Routes": 7,
  "Structure": "Subway",
  "GTFS Latitude": 40.755882,
  "GTFS Longitude": -74.00191,
  "North Direction Label": "Queens",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 475,
  "Complex ID": 475,
  "GTFS Stop ID": "Q05",
  "Division": "IND",
  "Line": "Second Av",
  "Stop Name": "96 St",
  "Borough": "M",
  "Daytime Routes": "Q",
  "Structure": "Subway",
  "GTFS Latitude": 40.784318,
  "GTFS Longitude": -73.947152,
  "North Direction Label": "",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 476,
  "Complex ID": 476,
  "GTFS Stop ID": "Q04",
  "Division": "IND",
  "Line": "Second Av",
  "Stop Name": "86 St",
  "Borough": "M",
  "Daytime Routes": "Q",
  "Structure": "Subway",
  "GTFS Latitude": 40.777891,
  "GTFS Longitude": -73.951787,
  "North Direction Label": "Uptown",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 477,
  "Complex ID": 477,
  "GTFS Stop ID": "Q03",
  "Division": "IND",
  "Line": "Second Av",
  "Stop Name": "72 St",
  "Borough": "M",
  "Daytime Routes": "Q",
  "Structure": "Subway",
  "GTFS Latitude": 40.768799,
  "GTFS Longitude": -73.958424,
  "North Direction Label": "Uptown",
  "South Direction Label": "Downtown & Brooklyn",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 501,
  "Complex ID": 501,
  "GTFS Stop ID": "S31",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "St George",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.643748,
  "GTFS Longitude": -74.073643,
  "North Direction Label": "",
  "South Direction Label": "Tottenville",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 502,
  "Complex ID": 502,
  "GTFS Stop ID": "S30",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Tompkinsville",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "At Grade",
  "GTFS Latitude": 40.636949,
  "GTFS Longitude": -74.074835,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 503,
  "Complex ID": 503,
  "GTFS Stop ID": "S29",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Stapleton",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Elevated",
  "GTFS Latitude": 40.627915,
  "GTFS Longitude": -74.075162,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 504,
  "Complex ID": 504,
  "GTFS Stop ID": "S28",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Clifton",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Elevated",
  "GTFS Latitude": 40.621319,
  "GTFS Longitude": -74.071402,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 505,
  "Complex ID": 505,
  "GTFS Stop ID": "S27",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Grasmere",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.603117,
  "GTFS Longitude": -74.084087,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 506,
  "Complex ID": 506,
  "GTFS Stop ID": "S26",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Old Town",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Embankment",
  "GTFS Latitude": 40.596612,
  "GTFS Longitude": -74.087368,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 507,
  "Complex ID": 507,
  "GTFS Stop ID": "S25",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Dongan Hills",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Embankment",
  "GTFS Latitude": 40.588849,
  "GTFS Longitude": -74.09609,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 508,
  "Complex ID": 508,
  "GTFS Stop ID": "S24",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Jefferson Av",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Embankment",
  "GTFS Latitude": 40.583591,
  "GTFS Longitude": -74.103338,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 509,
  "Complex ID": 509,
  "GTFS Stop ID": "S23",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Grant City",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.578965,
  "GTFS Longitude": -74.109704,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 510,
  "Complex ID": 510,
  "GTFS Stop ID": "S22",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "New Dorp",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.57348,
  "GTFS Longitude": -74.11721,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 511,
  "Complex ID": 511,
  "GTFS Stop ID": "S21",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Oakwood Heights",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.56511,
  "GTFS Longitude": -74.12632,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 512,
  "Complex ID": 512,
  "GTFS Stop ID": "S20",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Bay Terrace",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Embankment",
  "GTFS Latitude": 40.5564,
  "GTFS Longitude": -74.136907,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 513,
  "Complex ID": 513,
  "GTFS Stop ID": "S19",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Great Kills",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.551231,
  "GTFS Longitude": -74.151399,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 514,
  "Complex ID": 514,
  "GTFS Stop ID": "S18",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Eltingville",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Embankment",
  "GTFS Latitude": 40.544601,
  "GTFS Longitude": -74.16457,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 515,
  "Complex ID": 515,
  "GTFS Stop ID": "S17",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Annadale",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.54046,
  "GTFS Longitude": -74.178217,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 516,
  "Complex ID": 516,
  "GTFS Stop ID": "S16",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Huguenot",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.533674,
  "GTFS Longitude": -74.191794,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 517,
  "Complex ID": 517,
  "GTFS Stop ID": "S15",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Prince's Bay",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.525507,
  "GTFS Longitude": -74.200064,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 518,
  "Complex ID": 518,
  "GTFS Stop ID": "S14",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Pleasant Plains",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Embankment",
  "GTFS Latitude": 40.52241,
  "GTFS Longitude": -74.217847,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 519,
  "Complex ID": 519,
  "GTFS Stop ID": "S13",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Richmond Valley",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "Open Cut",
  "GTFS Latitude": 40.519631,
  "GTFS Longitude": -74.229141,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 0,
  "ADA Notes": ""
}, {
  "Station ID": 522,
  "Complex ID": 522,
  "GTFS Stop ID": "S09",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Tottenville",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "At Grade",
  "GTFS Latitude": 40.512764,
  "GTFS Longitude": -74.251961,
  "North Direction Label": "St George",
  "South Direction Label": "",
  "ADA": 1,
  "ADA Notes": ""
}, {
  "Station ID": 523,
  "Complex ID": 523,
  "GTFS Stop ID": "S11",
  "Division": "SIR",
  "Line": "Staten Island",
  "Stop Name": "Arthur Kill",
  "Borough": "SI",
  "Daytime Routes": "SIR",
  "Structure": "At Grade",
  "GTFS Latitude": 40.516578,
  "GTFS Longitude": -74.242096,
  "North Direction Label": "St George",
  "South Direction Label": "Tottenville",
  "ADA": 1,
  "ADA Notes": ""
}];
},{}],"data/transit/mbta-geo.json":[function(require,module,exports) {
module.exports = [{
  "address": "Transportation Way and Service Rd, Boston, MA 02128",
  "at_street": null,
  "description": "Logan Intl Airport",
  "latitude": 42.374262,
  "location_type": 1,
  "longitude": -71.030395,
  "municipality": "Boston",
  "name": "Airport",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-aport",
  "station": "Airport"
}, {
  "address": "Alewife Brook Pkwy and Cambridge Park Dr, Cambridge, MA 02140",
  "at_street": null,
  "description": "Alewife Station (Cambridge)",
  "latitude": 42.395428,
  "location_type": 1,
  "longitude": -71.142483,
  "municipality": "Cambridge",
  "name": "Alewife",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-alfcl",
  "station": "Alewife"
}, {
  "address": "Atlantic Ave and State St, Boston, MA 02120",
  "at_street": null,
  "description": "New England Aquarium",
  "latitude": 42.359784,
  "location_type": 1,
  "longitude": -71.051652,
  "municipality": "Boston",
  "name": "Aquarium",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-aqucl",
  "station": "Aquarium"
}, {
  "address": "Arlington St and Boylston St, Boston, MA 02116",
  "at_street": null,
  "description": "Arlington Station",
  "latitude": 42.351902,
  "location_type": 1,
  "longitude": -71.070893,
  "municipality": "Boston",
  "name": "Arlington",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-armnl",
  "station": "Arlington"
}, {
  "address": "145 Dartmouth St Boston, MA 02116",
  "at_street": null,
  "description": "Back Bay Station",
  "latitude": 42.34735,
  "location_type": 1,
  "longitude": -71.075727,
  "municipality": "Boston",
  "name": "Back Bay",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-bbsta",
  "station": "Back Bay"
}, {
  "address": "Boylston St and Tremont St, Boston, MA",
  "at_street": null,
  "description": "Boylston Station",
  "latitude": 42.35302,
  "location_type": 1,
  "longitude": -71.06459,
  "municipality": "Boston",
  "name": "Boylston",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 2,
  "id": "place-boyls",
  "station": "Boylston"
}, {
  "address": "Dorchester Ave and Broadway, Boston, MA",
  "at_street": null,
  "description": "Broadway Station",
  "latitude": 42.342622,
  "location_type": 1,
  "longitude": -71.056967,
  "municipality": "Boston",
  "name": "Broadway",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-brdwy",
  "station": "Broadway"
}, {
  "address": "Massachusetts Avenue and Prospect Street, Cambridge, MA 02139",
  "at_street": null,
  "description": "Central Station",
  "latitude": 42.365486,
  "location_type": 1,
  "longitude": -71.103802,
  "municipality": "Cambridge",
  "name": "Central",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-cntsq",
  "station": "Central"
}, {
  "address": "Cambridge St and Charles St, Boston, MA",
  "at_street": null,
  "description": "Charles Station",
  "latitude": 42.361166,
  "location_type": 1,
  "longitude": -71.070628,
  "municipality": "Boston",
  "name": "Charles/MGH",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-chmnl",
  "station": "Charles"
}, {
  "address": "Boylston St and Dartmouth St, Boston, MA",
  "at_street": null,
  "description": "Copley Station",
  "latitude": 42.349974,
  "location_type": 1,
  "longitude": -71.077447,
  "municipality": "Boston",
  "name": "Copley",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-coecl",
  "station": "Copley"
}, {
  "address": "College Ave and Elm St, Somerville, MA",
  "at_street": null,
  "description": "Davis Station",
  "latitude": 42.39674,
  "location_type": 1,
  "longitude": -71.121815,
  "municipality": "Somerville",
  "name": "Davis",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-davis",
  "station": "Davis"
}, {
  "address": "Washington St and Summer St, Boston, MA",
  "at_street": null,
  "description": "Downtown Crossing Station",
  "latitude": 42.355518,
  "location_type": 1,
  "longitude": -71.060225,
  "municipality": "Boston",
  "name": "Downtown Crossing",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-dwnxg",
  "station": "Downtown Crossing"
}, {
  "address": "Washington St and Hyde Park Ave, Jamaica Plain, MA 02130",
  "at_street": null,
  "description": "Forest Hills Station",
  "latitude": 42.300523,
  "location_type": 1,
  "longitude": -71.113686,
  "municipality": "Boston",
  "name": "Forest Hills",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-forhl",
  "station": "Forest Hills"
}, {
  "address": "Cambridge St and Court St, Boston, MA",
  "at_street": null,
  "description": "Government Center Station",
  "latitude": 42.359705,
  "location_type": 1,
  "longitude": -71.059215,
  "municipality": "Boston",
  "name": "Government Center",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-gover",
  "station": "Government Center"
}, {
  "address": "1400 Massachusetts Ave, Cambridge, MA",
  "at_street": null,
  "description": "Harvard Station",
  "latitude": 42.373362,
  "location_type": 1,
  "longitude": -71.118956,
  "municipality": "Cambridge",
  "name": "Harvard",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-harsq",
  "station": "Harvard"
}, {
  "address": "136 Blackstone St, Boston, MA 02109",
  "at_street": null,
  "description": "Haymarket Station",
  "latitude": 42.363021,
  "location_type": 1,
  "longitude": -71.05829,
  "municipality": "Boston",
  "name": "Haymarket",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-haecl",
  "station": "Haymarket"
}, {
  "address": "599 Old Colony Ave Boston, MA 02127-3805",
  "at_street": null,
  "description": "JFK/UMASS Station",
  "latitude": 42.320685,
  "location_type": 1,
  "longitude": -71.052391,
  "municipality": "Boston",
  "name": "JFK/UMass",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-jfk",
  "station": "JFK"
}, {
  "address": "300 Main St, Cambridge, MA 02142",
  "at_street": null,
  "description": "Kendall Station",
  "latitude": 42.362491,
  "location_type": 1,
  "longitude": -71.086176,
  "municipality": "Cambridge",
  "name": "Kendall/MIT",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-knncl",
  "station": "Kendall"
}, {
  "address": "Commonwealth Ave and Kenmore St, Boston, MA 02215",
  "at_street": null,
  "description": "Kenmore Station",
  "latitude": 42.348949,
  "location_type": 1,
  "longitude": -71.095169,
  "municipality": "Boston",
  "name": "Kenmore",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-kencl",
  "station": "Kenmore"
}, {
  "address": "Commercial St and Pleasant St, Malden, MA 02148",
  "at_street": null,
  "description": "Malden Station",
  "latitude": 42.426632,
  "location_type": 1,
  "longitude": -71.07411,
  "municipality": "Malden",
  "name": "Malden Center",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-mlmnl",
  "station": "Malden"
}, {
  "address": "Sumner St and Maverick Sq, East Boston, MA",
  "at_street": null,
  "description": "Maverick Station",
  "latitude": 42.369119,
  "location_type": 1,
  "longitude": -71.03953,
  "municipality": "Boston",
  "name": "Maverick",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-mvbcl",
  "station": "Maverick"
}, {
  "address": "135 Causeway St, Boston MA 02114",
  "at_street": null,
  "description": "North Station",
  "latitude": 42.365577,
  "location_type": 1,
  "longitude": -71.06129,
  "municipality": "Boston",
  "name": "North Station",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-north",
  "station": "North"
}, {
  "address": "Tremont St and Winter St, Boston, MA 02108",
  "at_street": null,
  "description": "Park Street Station",
  "latitude": 42.356395,
  "location_type": 1,
  "longitude": -71.062424,
  "municipality": "Boston",
  "name": "Park Street",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-pktrm",
  "station": "Park"
}, {
  "address": "1899 Massachusetts Ave, Cambridge, MA 02140",
  "at_street": null,
  "description": "Porter Square Station",
  "latitude": 42.3884,
  "location_type": 1,
  "longitude": -71.119149,
  "municipality": "Cambridge",
  "name": "Porter",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-portr",
  "station": "Porter Square"
}, {
  "address": "Huntington Ave and Belvidere St, Boston, MA 02199",
  "at_street": null,
  "description": "Prudential Station",
  "latitude": 42.34557,
  "location_type": 1,
  "longitude": -71.081696,
  "municipality": "Boston",
  "name": "Prudential",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-prmnl",
  "station": "Prudential"
}, {
  "address": "175 Thomas E Burgin Pkwy, Quincy, MA 02169",
  "at_street": null,
  "description": "Quincy Center Station",
  "latitude": 42.251809,
  "location_type": 1,
  "longitude": -71.005409,
  "municipality": "Quincy",
  "name": "Quincy Center",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-qnctr",
  "station": "Quincy Center"
}, {
  "address": "1150 Tremont St, Roxbury, MA 02120",
  "at_street": null,
  "description": "Ruggles Station",
  "latitude": 42.336377,
  "location_type": 1,
  "longitude": -71.088961,
  "municipality": "Boston",
  "name": "Ruggles",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-rugg",
  "station": "Ruggles"
}, {
  "address": "700 Atlantic Ave, Boston, MA 02110",
  "at_street": null,
  "description": "South Station",
  "latitude": 42.352271,
  "location_type": 1,
  "longitude": -71.055242,
  "municipality": "Boston",
  "name": "South Station",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-sstat",
  "station": "South"
}, {
  "address": "200 Washington St, Boston, MA",
  "at_street": null,
  "description": "State Street Station",
  "latitude": 42.358978,
  "location_type": 1,
  "longitude": -71.057598,
  "municipality": "Boston",
  "name": "State",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-state",
  "station": "State Street"
}, {
  "address": "Maffa Way and Cambridge St, Charlestown, MA 02129",
  "at_street": null,
  "description": "Sullivan Square Station",
  "latitude": 42.383975,
  "location_type": 1,
  "longitude": -71.076994,
  "municipality": "Boston",
  "name": "Sullivan Square",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-sull",
  "station": "Sullivan Square"
}, {
  "address": "750 Washington St, Boston, MA",
  "at_street": null,
  "description": "Tufts Medical Center",
  "latitude": 42.349662,
  "location_type": 1,
  "longitude": -71.063917,
  "municipality": "Boston",
  "name": "Tufts Medical Center",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-tumnl",
  "station": "Tufts Medical Center"
}, {
  "address": "Revere Beach Pkwy and Rivers Edge Dr, Medford, MA 02155",
  "at_street": null,
  "description": "Wellington Station",
  "latitude": 42.40237,
  "location_type": 1,
  "longitude": -71.077082,
  "municipality": "Medford",
  "name": "Wellington",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-welln",
  "station": "Wellington"
}, {
  "address": "Congress St and World Trade Center Ave, Boston, MA",
  "at_street": null,
  "description": "World Trade Center Station",
  "latitude": 42.34863,
  "location_type": 1,
  "longitude": -71.04246,
  "municipality": "Boston",
  "name": "World Trade Center",
  "on_street": null,
  "platform_code": null,
  "platform_name": null,
  "vehicle_type": null,
  "wheelchair_boarding": 1,
  "id": "place-wtcst",
  "station": "WTC"
}];
},{}],"data/transit/lirr-geo.json":[function(require,module,exports) {
module.exports = [{
  "stop_id": 1,
  "stop_code": "ABT",
  "stop_name": "Albertson",
  "stop_desc": "I.U. Willets Road and Albertson Avenue, between Willis Avenue and Roslyn Road.",
  "stop_lat": 40.77206317,
  "stop_lon": -73.64169095,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=44",
  "wheelchair_boarding": 1
}, {
  "stop_id": 2,
  "stop_code": "ADL",
  "stop_name": "Auburndale",
  "stop_desc": "Off Station Road, between 192nd Street and 39th Avenue, just north of Northern Boulevard.",
  "stop_lat": 40.76144288,
  "stop_lon": -73.78995927,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=21",
  "wheelchair_boarding": 1
}, {
  "stop_id": 4,
  "stop_code": "AGT",
  "stop_name": "Amagansett",
  "stop_desc": "Main Street and Abrams Landing Road.",
  "stop_lat": 40.98003964,
  "stop_lon": -72.13233416,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=137",
  "wheelchair_boarding": 1
}, {
  "stop_id": 8,
  "stop_code": "AVL",
  "stop_name": "Amityville",
  "stop_desc": "John Street, between Sunrise Highway (Route 27) and Route 27A, just west of Route 110.",
  "stop_lat": 40.68024859,
  "stop_lon": -73.42031192,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=115",
  "wheelchair_boarding": 2
}, {
  "stop_id": 11,
  "stop_code": "BDY",
  "stop_name": "Broadway",
  "stop_desc": "Intersection of 162nd Street and Northern Boulevard.",
  "stop_lat": 40.76165318,
  "stop_lon": -73.80176612,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=20",
  "wheelchair_boarding": 1
}, {
  "stop_id": 13,
  "stop_code": "BHN",
  "stop_name": "Bridgehampton",
  "stop_desc": "Maple Lane and Butter Lane, 1/4 mile north of Montauk Highway (Route 27A).",
  "stop_lat": 40.93898378,
  "stop_lon": -72.31004593,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=135",
  "wheelchair_boarding": 1
}, {
  "stop_id": 14,
  "stop_code": "BK",
  "stop_name": "Stony Brook",
  "stop_desc": "North Country Road (Route 25A) and Chapman Street, just West of Nicolls Road.",
  "stop_lat": 40.92032252,
  "stop_lon": -73.12854943,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=66",
  "wheelchair_boarding": 1
}, {
  "stop_id": 16,
  "stop_code": "BMR",
  "stop_name": "Bellmore",
  "stop_desc": "Sunrise Highway (Route 27) and Bedford Avenue, North side of Sunrise Highway, between Newbridge Road and Bellmore Avenue.",
  "stop_lat": 40.66880043,
  "stop_lon": -73.52886016,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=110",
  "wheelchair_boarding": 1
}, {
  "stop_id": 20,
  "stop_code": "BPG",
  "stop_name": "Bethpage",
  "stop_desc": "Stewart Avenue and Jackson Avenue, 1 mile North of Hempstead Turnpike (Route 24), off Railroad Avenue.",
  "stop_lat": 40.74303924,
  "stop_lon": -73.48343821,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=68",
  "wheelchair_boarding": 1
}, {
  "stop_id": 21,
  "stop_code": "BPT",
  "stop_name": "Bellport",
  "stop_desc": "Station Road and Montauk Highway, South side of Main Street (Route 27A).",
  "stop_lat": 40.7737389,
  "stop_lon": -72.94396574,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=126",
  "wheelchair_boarding": 1
}, {
  "stop_id": 23,
  "stop_code": "BRS",
  "stop_name": "Bellerose",
  "stop_desc": "Commonwealth Boulevard and Superior Road,  1/4 mile South of Jericho Turnpike.",
  "stop_lat": 40.72220443,
  "stop_lon": -73.71665289,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=33",
  "wheelchair_boarding": 2
}, {
  "stop_id": 24,
  "stop_code": "BRT",
  "stop_name": "Belmont Park",
  "stop_desc": "At Belmont Park.",
  "stop_lat": 40.71368754,
  "stop_lon": -73.72829722,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=32",
  "wheelchair_boarding": 1
}, {
  "stop_id": 25,
  "stop_code": "BSD",
  "stop_name": "Bayside",
  "stop_desc": "213th Street and  41st Avenue, off Bell Boulevard and just north of Northern Boulevard.",
  "stop_lat": 40.76315241,
  "stop_lon": -73.77124986,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=22",
  "wheelchair_boarding": 1
}, {
  "stop_id": 26,
  "stop_code": "BSR",
  "stop_name": "Bay Shore",
  "stop_desc": "Park Avenue and Oak Street to Railroad Plaza, just North of Union Boulevard.",
  "stop_lat": 40.72443344,
  "stop_lon": -73.25408295,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=119",
  "wheelchair_boarding": 1
}, {
  "stop_id": 27,
  "stop_code": "BTA",
  "stop_name": "Babylon",
  "stop_desc": "Railroad Avenue just West of Deer Park Avenue, 1 mile South of Sunrise Highway (Route 27).",
  "stop_lat": 40.70068942,
  "stop_lon": -73.32405561,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=118",
  "wheelchair_boarding": 1
}, {
  "stop_id": 29,
  "stop_code": "BWD",
  "stop_name": "Brentwood",
  "stop_desc": "Brentwood Road and Suffolk Avenue, 1/2 mile East of Brentwood Road, just South of Suffolk Avenue.",
  "stop_lat": 40.78083474,
  "stop_lon": -73.24361074,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=73",
  "wheelchair_boarding": 1
}, {
  "stop_id": 31,
  "stop_code": "CAV",
  "stop_name": "Centre Avenue",
  "stop_desc": "Forest Avenue between Rocklyn and Centre Avenue, 1 block East of Atlantic Avenue.",
  "stop_lat": 40.64831835,
  "stop_lon": -73.6639675,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=101",
  "wheelchair_boarding": 1
}, {
  "stop_id": 32,
  "stop_code": "CHT",
  "stop_name": "Cedarhurst",
  "stop_desc": "Cedarhurst Avenue and Chestnut Street, 2 blocks West of Broadway.",
  "stop_lat": 40.62217451,
  "stop_lon": -73.72618275,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=96",
  "wheelchair_boarding": 1
}, {
  "stop_id": 33,
  "stop_code": "CI",
  "stop_name": "Central Islip",
  "stop_desc": "Lowell and Suffolk Avenues, 1/2 mile East of Wheelers Road, 1 mile West of Veteran's Highway.",
  "stop_lat": 40.79185312,
  "stop_lon": -73.19486082,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=74",
  "wheelchair_boarding": 1
}, {
  "stop_id": 36,
  "stop_code": "CLP",
  "stop_name": "Country Life Press",
  "stop_desc": "Intersection of Damson and Saint James Street.",
  "stop_lat": 40.72145656,
  "stop_lon": -73.62967386,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=38",
  "wheelchair_boarding": 1
}, {
  "stop_id": 38,
  "stop_code": "CPG",
  "stop_name": "Copiague",
  "stop_desc": "Marconi Boulevard and Great Neck Road, just North of Oak Street.",
  "stop_lat": 40.68101528,
  "stop_lon": -73.39834027,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=116",
  "wheelchair_boarding": 2
}, {
  "stop_id": 39,
  "stop_code": "CPL",
  "stop_name": "Carle Place",
  "stop_desc": "Cherry Lane and Atlantic Avenue, 1/4 mile North of Old Country Road.",
  "stop_lat": 40.74920704,
  "stop_lon": -73.60365242,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=54",
  "wheelchair_boarding": 1
}, {
  "stop_id": 40,
  "stop_code": "CSH",
  "stop_name": "Cold Spring Harbor",
  "stop_desc": "West Pulaski Road and East Gate Drive, just South of Woodbury Road.",
  "stop_lat": 40.83563832,
  "stop_lon": -73.45108591,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=59",
  "wheelchair_boarding": 1
}, {
  "stop_id": 42,
  "stop_code": "DGL",
  "stop_name": "Douglaston",
  "stop_desc": "235th Street and 41st Avenue, off Douglaston Parkway and Wainscott Avenue.  Just north of Northern Boulevard.",
  "stop_lat": 40.76806862,
  "stop_lon": -73.74941265,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=23",
  "wheelchair_boarding": 1
}, {
  "stop_id": 44,
  "stop_code": "DPK",
  "stop_name": "Deer Park",
  "stop_desc": "Intersection of Pineaire Drive, Grant (Executive) Avenue, and Long Island Avenue, between Commack Road and Sagtikos Parkway.",
  "stop_lat": 40.76948364,
  "stop_lon": -73.29356494,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=72",
  "wheelchair_boarding": 1
}, {
  "stop_id": 48,
  "stop_code": "EHN",
  "stop_name": "East Hampton",
  "stop_desc": "Newtown Lane and Race Lane, 1/4 mile north of Main Street.",
  "stop_lat": 40.96508629,
  "stop_lon": -72.19324238,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=136",
  "wheelchair_boarding": 1
}, {
  "stop_id": 50,
  "stop_code": "ENY",
  "stop_name": "East New York",
  "stop_desc": "Atlantic Avenue and Williams",
  "stop_lat": 40.67581191,
  "stop_lon": -73.90280882,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=14",
  "wheelchair_boarding": 2
}, {
  "stop_id": 51,
  "stop_code": "ERY",
  "stop_name": "East Rockaway",
  "stop_desc": "Ocean Avenue and Davison Place, 2 blocks North of Atlantic Avenue next to Shopping Plaza.",
  "stop_lat": 40.64221085,
  "stop_lon": -73.65821626,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=102",
  "wheelchair_boarding": 1
}, {
  "stop_id": 52,
  "stop_code": "EWN",
  "stop_name": "East Williston",
  "stop_desc": "Hillside Avenue and Pennsylvania Avenue, between Willis Avenue and Roslyn Road.",
  "stop_lat": 40.7560191,
  "stop_lon": -73.63940764,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=43",
  "wheelchair_boarding": 1
}, {
  "stop_id": 55,
  "stop_code": "FHL",
  "stop_name": "Forest Hills",
  "stop_desc": "Continental Avenue  (71st Ave) & Austin Street, 2 blocks South of Queens Boulevard.",
  "stop_lat": 40.71957556,
  "stop_lon": -73.84481402,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=10",
  "wheelchair_boarding": 1
}, {
  "stop_id": 56,
  "stop_code": "FLS",
  "stop_name": "Flushing Main Street",
  "stop_desc": "Main Street and 41st Avenue, off Kissena Boulevard.",
  "stop_lat": 40.75789494,
  "stop_lon": -73.83134684,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=18",
  "wheelchair_boarding": 1
}, {
  "stop_id": 59,
  "stop_code": "FMD",
  "stop_name": "Farmingdale",
  "stop_desc": "Off Secatague Avenue, on Front Street and Atlantic Avenue, just North of Conklin Street.",
  "stop_lat": 40.73591503,
  "stop_lon": -73.44123878,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=69",
  "wheelchair_boarding": 1
}, {
  "stop_id": 63,
  "stop_code": "FPK",
  "stop_name": "Floral Park",
  "stop_desc": "Tulip and Atlantic Avenue, 1/4 mile South of Jericho Turnpike.",
  "stop_lat": 40.72463725,
  "stop_lon": -73.70639714,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=34",
  "wheelchair_boarding": 1
}, {
  "stop_id": 64,
  "stop_code": "FPT",
  "stop_name": "Freeport",
  "stop_desc": "Between Henry Street and Benson Place, north of Sunrise Highway (Route 27).",
  "stop_lat": 40.65745799,
  "stop_lon": -73.58232401,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=108",
  "wheelchair_boarding": 1
}, {
  "stop_id": 65,
  "stop_code": "FRY",
  "stop_name": "Far Rockaway",
  "stop_desc": "Nameoke Street and Redfern Avenue, off Central Avenue.",
  "stop_lat": 40.60914311,
  "stop_lon": -73.75054135,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=99",
  "wheelchair_boarding": 1
}, {
  "stop_id": 66,
  "stop_code": "GBN",
  "stop_name": "Gibson",
  "stop_desc": "The intersection of Gibson and Munro Boulevards, South of Sunrise Highway.",
  "stop_lat": 40.64925173,
  "stop_lon": -73.70183483,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=93",
  "wheelchair_boarding": 1
}, {
  "stop_id": 67,
  "stop_code": "GCV",
  "stop_name": "Glen Cove",
  "stop_desc": "Duck Pond Road and Pearsall Avenue, off Norfolk Lane.",
  "stop_lat": 40.86583421,
  "stop_lon": -73.61616614,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=50",
  "wheelchair_boarding": 1
}, {
  "stop_id": 68,
  "stop_code": "GCY",
  "stop_name": "Garden City",
  "stop_desc": "7th Street between Hilton and Cathedral Avenues.",
  "stop_lat": 40.72310156,
  "stop_lon": -73.64036107,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=37",
  "wheelchair_boarding": 1
}, {
  "stop_id": 71,
  "stop_code": "GHD",
  "stop_name": "Glen Head",
  "stop_desc": "Glen Head Road and School Street",
  "stop_lat": 40.83222531,
  "stop_lon": -73.62611822,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=47",
  "wheelchair_boarding": 1
}, {
  "stop_id": 72,
  "stop_code": "GNK",
  "stop_name": "Great Neck",
  "stop_desc": "Middle Neck Road and Station Plaza at Great Neck Road, 1/4 mile North of Route 25A.",
  "stop_lat": 40.78721647,
  "stop_lon": -73.72610046,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=25",
  "wheelchair_boarding": 1
}, {
  "stop_id": 73,
  "stop_code": "GPT",
  "stop_name": "Greenport",
  "stop_desc": "Wiggins and 4th Streets at Ferry Dock.",
  "stop_lat": 41.09970991,
  "stop_lon": -72.36310396,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=82",
  "wheelchair_boarding": 1
}, {
  "stop_id": 74,
  "stop_code": "GRV",
  "stop_name": "Great River",
  "stop_desc": "Connetquot Avenue and Hawthorne Avenue, between Sunrise Highway (Route 27) and Montauk Highway (Route 27A).",
  "stop_lat": 40.74044444,
  "stop_lon": -73.17019585,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=121",
  "wheelchair_boarding": 1
}, {
  "stop_id": 76,
  "stop_code": "GST",
  "stop_name": "Glen Street",
  "stop_desc": "Cedar Swamp Road (Glen Street) and Elm Avenue, just east of Glen Cove Highway (Route 107).",
  "stop_lat": 40.85798112,
  "stop_lon": -73.62121715,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=49",
  "wheelchair_boarding": 1
}, {
  "stop_id": 77,
  "stop_code": "GVL",
  "stop_name": "Greenvale",
  "stop_desc": "Off Helen Street, between Glen Cove Avenue and Glen Cove Road.   Three blocks North of 25A (Northern Boulevard).",
  "stop_lat": 40.81571566,
  "stop_lon": -73.62687152,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=46",
  "wheelchair_boarding": 1
}, {
  "stop_id": 78,
  "stop_code": "GWN",
  "stop_name": "Greenlawn",
  "stop_desc": "Broadway (Centerport Road) and Boulevard Avenue, 1/4 mile North of Pulaski Road.",
  "stop_lat": 40.86866524,
  "stop_lon": -73.36284977,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=61",
  "wheelchair_boarding": 1
}, {
  "stop_id": 83,
  "stop_code": "HBY",
  "stop_name": "Hampton Bays",
  "stop_desc": "Springville Road and Goodground Road, just west of Ponquogue Avenue.",
  "stop_lat": 40.87660916,
  "stop_lon": -72.52394936,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=132",
  "wheelchair_boarding": 1
}, {
  "stop_id": 84,
  "stop_code": "HEM",
  "stop_name": "Hempstead",
  "stop_desc": "Off West Columbia Street and Main Street",
  "stop_lat": 40.71329663,
  "stop_lon": -73.62503239,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=39",
  "wheelchair_boarding": 1
}, {
  "stop_id": 85,
  "stop_code": "HGN",
  "stop_name": "Hempstead Gardens",
  "stop_desc": "Hempstead Gardens Drive and Chestnut Street, just East of Woodfield Road.",
  "stop_lat": 40.69491356,
  "stop_lon": -73.64620888,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=91",
  "wheelchair_boarding": 1
}, {
  "stop_id": 89,
  "stop_code": "HOL",
  "stop_name": "Hollis",
  "stop_desc": "193rd Street and Woodhull Avenue, just South of Jamaica Avenue.",
  "stop_lat": 40.71018151,
  "stop_lon": -73.76675252,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=30",
  "wheelchair_boarding": 2
}, {
  "stop_id": 90,
  "stop_code": "HPA",
  "stop_name": "Hunterspoint Avenue",
  "stop_desc": "Hunterspoint Avenue and Skillman Avenue off Van Dam Street.",
  "stop_lat": 40.74239046,
  "stop_lon": -73.94678997,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=2",
  "wheelchair_boarding": 2
}, {
  "stop_id": 91,
  "stop_code": "HUN",
  "stop_name": "Huntington",
  "stop_desc": "New York Avenue (Route 110) and Broadway, 2 miles North of Jericho Turnpike.",
  "stop_lat": 40.85300971,
  "stop_lon": -73.40952576,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=60",
  "wheelchair_boarding": 1
}, {
  "stop_id": 92,
  "stop_code": "HVL",
  "stop_name": "Hicksville",
  "stop_desc": "Newbridge Road (Route 106) and West Barclay Street.  One mile South of Exit 41 South off Long Island Expressway, or Exit 35 South off the Northern State Parkway.",
  "stop_lat": 40.76717491,
  "stop_lon": -73.52853322,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=56",
  "wheelchair_boarding": 1
}, {
  "stop_id": 94,
  "stop_code": "HWT",
  "stop_name": "Hewlett",
  "stop_desc": "Franklin Avenue between Broadway and West Broadway.",
  "stop_lat": 40.63676432,
  "stop_lon": -73.70513866,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=94",
  "wheelchair_boarding": 1
}, {
  "stop_id": 99,
  "stop_code": "IPK",
  "stop_name": "Island Park",
  "stop_desc": "Long Beach Road and Austin Boulevard.",
  "stop_lat": 40.60129906,
  "stop_lon": -73.65474248,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=104",
  "wheelchair_boarding": 1
}, {
  "stop_id": 100,
  "stop_code": "ISP",
  "stop_name": "Islip",
  "stop_desc": "Islip Avenue (Route 111), between Sunrise Highway (Route 27) and Montauk Highway (Route 27A).  North of Union Boulevard, south of Moffitt Boulevard.",
  "stop_lat": 40.73583449,
  "stop_lon": -73.20932145,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=120",
  "wheelchair_boarding": 1
}, {
  "stop_id": 101,
  "stop_code": "IWD",
  "stop_name": "Inwood",
  "stop_desc": "Off Doughty Boulevard, 2 blocks West of Central Avenue.",
  "stop_lat": 40.61228773,
  "stop_lon": -73.74418354,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=98",
  "wheelchair_boarding": 1
}, {
  "stop_id": 102,
  "stop_code": "JAM",
  "stop_name": "Jamaica",
  "stop_desc": "93-02 Sutphin Blvd., Jamaica, NY 11435.  Corner of Sutphin Boulevard and Archer Avenue, 2 blocks south of Jamaica Avenue..The easiest way to Kennedy Airport is by Air Train.   AirTrain JFK leaves from the terminal adjacent to the Long Island Rail Road's Jamaica Station every 2 to 12 minutes, depending upon the time of day.",
  "stop_lat": 40.69960817,
  "stop_lon": -73.80852987,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=15",
  "wheelchair_boarding": 1
}, {
  "stop_id": 107,
  "stop_code": "KGN",
  "stop_name": "Kew Gardens",
  "stop_desc": "Austin Street and Lefferts Boulevard, between Queens Boulevard and Metropolitan Avenue.",
  "stop_lat": 40.70964917,
  "stop_lon": -73.83088807,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=11",
  "wheelchair_boarding": 1
}, {
  "stop_id": 111,
  "stop_code": "KPK",
  "stop_name": "Kings Park",
  "stop_desc": "Indian Head Road and Main Street, just South of Route 25A.",
  "stop_lat": 40.88366659,
  "stop_lon": -73.25624757,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=63",
  "wheelchair_boarding": 1
}, {
  "stop_id": 113,
  "stop_code": "LBH",
  "stop_name": "Long Beach",
  "stop_desc": "Park Place and Park Avenue, 1/4 mile West of Long Beach Road.",
  "stop_lat": 40.5901817,
  "stop_lon": -73.66481822,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=105",
  "wheelchair_boarding": 1
}, {
  "stop_id": 114,
  "stop_code": "LCE",
  "stop_name": "Lawrence",
  "stop_desc": "Lawrence Avenue and Bayview Avenue, 2 blocks West of Central Avenue.",
  "stop_lat": 40.6157347,
  "stop_lon": -73.73589955,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=97",
  "wheelchair_boarding": 1
}, {
  "stop_id": 117,
  "stop_code": "LHT",
  "stop_name": "Lindenhurst",
  "stop_desc": "Wellwood Avenue and East Hoffman Avenue between Sunrise Highway (Route 27) and Montauk Highway (Route 27A).",
  "stop_lat": 40.68826504,
  "stop_lon": -73.36921149,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=117",
  "wheelchair_boarding": 2
}, {
  "stop_id": 118,
  "stop_code": "LIC",
  "stop_name": "Long Island City",
  "stop_desc": "Borden Avenue and 2nd Street",
  "stop_lat": 40.74134343,
  "stop_lon": -73.95763922,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=1",
  "wheelchair_boarding": 1
}, {
  "stop_id": 119,
  "stop_code": "LMR",
  "stop_name": "Locust Manor",
  "stop_desc": "Farmers Boulevard and Bedell Street.",
  "stop_lat": 40.67513907,
  "stop_lon": -73.76504303,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=84",
  "wheelchair_boarding": 2
}, {
  "stop_id": 120,
  "stop_code": "LNK",
  "stop_name": "Little Neck",
  "stop_desc": "Little Neck Parkway and 39th Road, just north of Northern Boulevard.",
  "stop_lat": 40.77504393,
  "stop_lon": -73.74064662,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=24",
  "wheelchair_boarding": 1
}, {
  "stop_id": 122,
  "stop_code": "LTN",
  "stop_name": "Laurelton",
  "stop_desc": "224th Street and 141st Roadjust East of Springfield Boulevard.",
  "stop_lat": 40.66848304,
  "stop_lon": -73.75174687,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=85",
  "wheelchair_boarding": 2
}, {
  "stop_id": 123,
  "stop_code": "LVL",
  "stop_name": "Locust Valley",
  "stop_desc": "Birch Hill Road / Piping Rock Road, just South of Forest Avenue.",
  "stop_lat": 40.87446697,
  "stop_lon": -73.59830284,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=51",
  "wheelchair_boarding": 1
}, {
  "stop_id": 124,
  "stop_code": "LVW",
  "stop_name": "Lakeview",
  "stop_desc": "Woodfield Road and Eagle Avenue.",
  "stop_lat": 40.68585582,
  "stop_lon": -73.65213777,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=90",
  "wheelchair_boarding": 1
}, {
  "stop_id": 125,
  "stop_code": "LYN",
  "stop_name": "Lynbrook",
  "stop_desc": "Sunrise Highway and between Peninsula Boulevard and Broadway.",
  "stop_lat": 40.65605814,
  "stop_lon": -73.67607083,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=100",
  "wheelchair_boarding": 1
}, {
  "stop_id": 126,
  "stop_code": "MAK",
  "stop_name": "Mattituck",
  "stop_desc": "Love Lane and Pike Street, just North of Route 25.",
  "stop_lat": 40.99179354,
  "stop_lon": -72.53606243,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=80",
  "wheelchair_boarding": 1
}, {
  "stop_id": 127,
  "stop_code": "MAV",
  "stop_name": "Merillon Avenue",
  "stop_desc": "Nassau Boulevard and Merillon Avenue, just South of Jericho Turnpike (Route 25).",
  "stop_lat": 40.73516903,
  "stop_lon": -73.66252148,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=41",
  "wheelchair_boarding": 1
}, {
  "stop_id": 129,
  "stop_code": "MFD",
  "stop_name": "Medford",
  "stop_desc": "Medford Avenue (Route 112) and Long Island Avenue, 1/4 mile South of Exit 64 off the Long Island Expressway.",
  "stop_lat": 40.81739665,
  "stop_lon": -72.99890946,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=77",
  "wheelchair_boarding": 1
}, {
  "stop_id": 130,
  "stop_code": "MHL",
  "stop_name": "Murray Hill",
  "stop_desc": "150th Street and 41st Avenue, just south of Roosevelt Avenue.",
  "stop_lat": 40.76270926,
  "stop_lon": -73.81453928,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=19",
  "wheelchair_boarding": 1
}, {
  "stop_id": 131,
  "stop_code": "MHT",
  "stop_name": "Manhasset",
  "stop_desc": "Plandome Road and Maple Place, off Park Avenue.  Five blocks North of Route 25A.",
  "stop_lat": 40.7967241,
  "stop_lon": -73.69989909,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=26",
  "wheelchair_boarding": 1
}, {
  "stop_id": 132,
  "stop_code": "MIN",
  "stop_name": "Mineola",
  "stop_desc": "Front Street and Mineola Boulevard, one block north of Old Country Road.",
  "stop_lat": 40.74034743,
  "stop_lon": -73.64086293,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=42",
  "wheelchair_boarding": 1
}, {
  "stop_id": 135,
  "stop_code": "MPK",
  "stop_name": "Massapequa Park",
  "stop_desc": "Sunrise Highway (Route 27) and Park Boulevard.",
  "stop_lat": 40.6778591,
  "stop_lon": -73.45473724,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=114",
  "wheelchair_boarding": 2
}, {
  "stop_id": 136,
  "stop_code": "MQA",
  "stop_name": "Massapequa",
  "stop_desc": "Sunrise Highway (Route 27), just East of Broadway and Route 107.",
  "stop_lat": 40.67693014,
  "stop_lon": -73.46905552,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=113",
  "wheelchair_boarding": 1
}, {
  "stop_id": 140,
  "stop_code": "MSY",
  "stop_name": "Mastic Shirley",
  "stop_desc": "William Floyd Parkway and Northern Boulevard, just South of 27A.",
  "stop_lat": 40.79898815,
  "stop_lon": -72.86442272,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=127",
  "wheelchair_boarding": 1
}, {
  "stop_id": 141,
  "stop_code": "MTK",
  "stop_name": "Montauk",
  "stop_desc": "Edgemere Street and Fort Pond Road.  One mile north Old Montauk Highway.",
  "stop_lat": 41.04710896,
  "stop_lon": -71.95388103,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=138",
  "wheelchair_boarding": 1
}, {
  "stop_id": 142,
  "stop_code": "MVN",
  "stop_name": "Malverne",
  "stop_desc": "Hempstead Avenue and Utterby Road",
  "stop_lat": 40.67547844,
  "stop_lon": -73.66886364,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=89",
  "wheelchair_boarding": 1
}, {
  "stop_id": 148,
  "stop_code": "NAV",
  "stop_name": "Nostrand Avenue",
  "stop_desc": "Nostrand Avenue and Atlantic Avenue.",
  "stop_lat": 40.67838785,
  "stop_lon": -73.94822108,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=13",
  "wheelchair_boarding": 1
}, {
  "stop_id": 149,
  "stop_code": "NBD",
  "stop_name": "Nassau Boulevard",
  "stop_desc": "Nassau Boulevard and South Avenue, 4 blocks South of Stewart Avenue.",
  "stop_lat": 40.72296245,
  "stop_lon": -73.66269823,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=36",
  "wheelchair_boarding": 1
}, {
  "stop_id": 152,
  "stop_code": "NHP",
  "stop_name": "New Hyde Park",
  "stop_desc": "New Hyde Park Road and 2nd Avenue, just South of Jericho Turnpike (Route 25).",
  "stop_lat": 40.73075708,
  "stop_lon": -73.68095886,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=40",
  "wheelchair_boarding": 1
}, {
  "stop_id": 153,
  "stop_code": "NPT",
  "stop_name": "Northport",
  "stop_desc": "Larkfield Road and Bellerose Avenue, North of Pulaski Road.",
  "stop_lat": 40.88064972,
  "stop_lon": -73.32848513,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=62",
  "wheelchair_boarding": 1
}, {
  "stop_id": 154,
  "stop_code": "OBY",
  "stop_name": "Oyster Bay",
  "stop_desc": "Off Maxwell Avenue, between Shore and Larabee Avenues.",
  "stop_lat": 40.87533774,
  "stop_lon": -73.53403366,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=53",
  "wheelchair_boarding": 1
}, {
  "stop_id": 155,
  "stop_code": "ODE",
  "stop_name": "Oceanside",
  "stop_desc": "Weidner Avenue and LawsonBoulevard.",
  "stop_lat": 40.63472102,
  "stop_lon": -73.65466582,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=103",
  "wheelchair_boarding": 1
}, {
  "stop_id": 157,
  "stop_code": "ODL",
  "stop_name": "Oakdale",
  "stop_desc": "Montauk Highway (Route 27A) and Oakdale-Bohemia Road.",
  "stop_lat": 40.74343275,
  "stop_lon": -73.13243549,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=122",
  "wheelchair_boarding": 1
}, {
  "stop_id": 162,
  "stop_code": "PDM",
  "stop_name": "Plandome",
  "stop_desc": "Off Stonytown Road and Rockwood Road, near W. Circle Drive and Colonial Drive.",
  "stop_lat": 40.81069853,
  "stop_lon": -73.69521438,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=27",
  "wheelchair_boarding": 1
}, {
  "stop_id": 163,
  "stop_code": "PGE",
  "stop_name": "Patchogue",
  "stop_desc": "Division Street and Ocean Avenue, Just South of Main Street.",
  "stop_lat": 40.76187901,
  "stop_lon": -73.01574451,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=124",
  "wheelchair_boarding": 1
}, {
  "stop_id": 164,
  "stop_code": "PJN",
  "stop_name": "Port Jefferson",
  "stop_desc": "Route 112 (Main Street) and Oakland Avenue",
  "stop_lat": 40.9345531,
  "stop_lon": -73.05250164,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=67",
  "wheelchair_boarding": 1
}, {
  "stop_id": 165,
  "stop_code": "PLN",
  "stop_name": "Pinelawn",
  "stop_desc": "Wellwood Avenue and Long Island Avenue (on Cemetery grounds).The LIRR platform is ADA accessible, but the building at the station site, maintained by the cemetery, is not.",
  "stop_lat": 40.74535851,
  "stop_lon": -73.39960092,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=70",
  "wheelchair_boarding": 1
}, {
  "stop_id": 171,
  "stop_code": "PWS",
  "stop_name": "Port Washington",
  "stop_desc": "Main Street, between Haven Avenue and South Bayles Avenue",
  "stop_lat": 40.82903533,
  "stop_lon": -73.687401,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=28",
  "wheelchair_boarding": 1
}, {
  "stop_id": 175,
  "stop_code": "QVG",
  "stop_name": "Queens Village",
  "stop_desc": "Springfield Boulevard, between 219th Street and 97th Avenue, just South of Jamaica Avenue.",
  "stop_lat": 40.71745785,
  "stop_lon": -73.73645989,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=31",
  "wheelchair_boarding": 1
}, {
  "stop_id": 176,
  "stop_code": "RHD",
  "stop_name": "Riverhead",
  "stop_desc": "Osborne Avenue and Railroad Street, just North of West Main Street (Route 25).",
  "stop_lat": 40.91983928,
  "stop_lon": -72.66691054,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=79",
  "wheelchair_boarding": 1
}, {
  "stop_id": 179,
  "stop_code": "RON",
  "stop_name": "Ronkonkoma",
  "stop_desc": "Hawkins Avenue, 2 blocks South of the Long Island Expressway Exit 60.",
  "stop_lat": 40.80808613,
  "stop_lon": -73.10594023,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=75",
  "wheelchair_boarding": 1
}, {
  "stop_id": 180,
  "stop_code": "ROS",
  "stop_name": "Rosedale",
  "stop_desc": "Francis Lewis Boulevard and Sunrise Highway",
  "stop_lat": 40.66594933,
  "stop_lon": -73.73554816,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=86",
  "wheelchair_boarding": 1
}, {
  "stop_id": 182,
  "stop_code": "RSN",
  "stop_name": "Roslyn",
  "stop_desc": "Lincoln Avenue and Railroad Avenue,  just West of Roslyn Road.",
  "stop_lat": 40.7904781,
  "stop_lon": -73.64326175,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=45",
  "wheelchair_boarding": 1
}, {
  "stop_id": 183,
  "stop_code": "RVC",
  "stop_name": "Rockville Centre",
  "stop_desc": "North Village Avenue and Front Street, just North of Sunrise Highway (Route 27).",
  "stop_lat": 40.65831811,
  "stop_lon": -73.64654935,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=106",
  "wheelchair_boarding": 1
}, {
  "stop_id": 184,
  "stop_code": "SAB",
  "stop_name": "St. Albans",
  "stop_desc": "Linden Boulevard and Montauk Street, off 180th Street.",
  "stop_lat": 40.69118348,
  "stop_lon": -73.76550937,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=83",
  "wheelchair_boarding": 2
}, {
  "stop_id": 185,
  "stop_code": "SCF",
  "stop_name": "Sea Cliff",
  "stop_desc": "Sea Cliff Avenue, East of Glen Cove Avenue and just West of Route 107.",
  "stop_lat": 40.85236805,
  "stop_lon": -73.62541695,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=48",
  "wheelchair_boarding": 1
}, {
  "stop_id": 187,
  "stop_code": "SFD",
  "stop_name": "Seaford",
  "stop_desc": "Sunrise Highway (Route 27) and Jackson Avenue.",
  "stop_lat": 40.67572393,
  "stop_lon": -73.48656847,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=112",
  "wheelchair_boarding": 1
}, {
  "stop_id": 190,
  "stop_code": "SHD",
  "stop_name": "Southold",
  "stop_desc": "Youngs Avenue and Traveler Street, just North of Main Road (Route 25).",
  "stop_lat": 41.06632089,
  "stop_lon": -72.4278803,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=81",
  "wheelchair_boarding": 1
}, {
  "stop_id": 191,
  "stop_code": "SHN",
  "stop_name": "Southampton",
  "stop_desc": "North Main Street, between Prospect and Willow.  One mile north of Montauk Highway.",
  "stop_lat": 40.89471874,
  "stop_lon": -72.39012376,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=134",
  "wheelchair_boarding": 1
}, {
  "stop_id": 193,
  "stop_code": "SJM",
  "stop_name": "St. James",
  "stop_desc": "Lake Avenue and 2nd Street, just South of Route 25A and North of Route 25.",
  "stop_lat": 40.88216931,
  "stop_lon": -73.15950725,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=65",
  "wheelchair_boarding": 1
}, {
  "stop_id": 195,
  "stop_code": "SMR",
  "stop_name": "Stewart Manor",
  "stop_desc": "New Hyde Park Road and Manor Road, South of Stewart Avenue., North of Plaza Road.",
  "stop_lat": 40.72302771,
  "stop_lon": -73.68102041,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=35",
  "wheelchair_boarding": 1
}, {
  "stop_id": 198,
  "stop_code": "SPK",
  "stop_name": "Speonk",
  "stop_desc": "Phillips Avenue and Depot Road, just North of Montauk Highway (Route 27A).",
  "stop_lat": 40.82131516,
  "stop_lon": -72.70526225,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=129",
  "wheelchair_boarding": 1
}, {
  "stop_id": 199,
  "stop_code": "SSM",
  "stop_name": "Mets-Willets Point",
  "stop_desc": "Flushing Meadow Park, south of Roosevelt Avenue.",
  "stop_lat": 40.75239835,
  "stop_lon": -73.84370059,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=17",
  "wheelchair_boarding": 2
}, {
  "stop_id": 202,
  "stop_code": "STN",
  "stop_name": "Smithtown",
  "stop_desc": "Redwood Lane and Scott Lane, off Main Street and just West of Route 111.",
  "stop_lat": 40.85654755,
  "stop_lon": -73.19803235,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=64",
  "wheelchair_boarding": 1
}, {
  "stop_id": 204,
  "stop_code": "SVL",
  "stop_name": "Sayville",
  "stop_desc": "Lakeland Avenue, 1 mile South of Sunrise Highway (Route 27).",
  "stop_lat": 40.74035373,
  "stop_lon": -73.08645531,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=123",
  "wheelchair_boarding": 1
}, {
  "stop_id": 205,
  "stop_code": "SYT",
  "stop_name": "Syosset",
  "stop_desc": "Oyster Bay Road (also known as Jackson Avenue) and Underhill Boulevard, 1 mile North of Jericho Turnpike (Route 25)",
  "stop_lat": 40.82485746,
  "stop_lon": -73.5004456,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=58",
  "wheelchair_boarding": 1
}, {
  "stop_id": 211,
  "stop_code": "VSM",
  "stop_name": "Valley Stream",
  "stop_desc": "Franklin Avenue and Sunrise Highway, just West of Rockaway Avenue.",
  "stop_lat": 40.66151762,
  "stop_lon": -73.70475875,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=87",
  "wheelchair_boarding": 1
}, {
  "stop_id": 213,
  "stop_code": "WBY",
  "stop_name": "Westbury",
  "stop_desc": "Union and Post Avenues, 1/4 mile North of Old Country Road.",
  "stop_lat": 40.75345386,
  "stop_lon": -73.5858661,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=55",
  "wheelchair_boarding": 1
}, {
  "stop_id": 214,
  "stop_code": "WDD",
  "stop_name": "Woodside",
  "stop_desc": "61st Street and Roosevelt Avenue",
  "stop_lat": 40.74585067,
  "stop_lon": -73.90297516,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=9",
  "wheelchair_boarding": 1
}, {
  "stop_id": 215,
  "stop_code": "WGH",
  "stop_name": "Wantagh",
  "stop_desc": "Wantagh Avenue and Railroad Avenue, just North of Sunrise Highway (Route 27).",
  "stop_lat": 40.67299016,
  "stop_lon": -73.50896484,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=111",
  "wheelchair_boarding": 1
}, {
  "stop_id": 216,
  "stop_code": "WHD",
  "stop_name": "West Hempstead",
  "stop_desc": "Hempstead Avenue and Hempstead Gardens Drive.",
  "stop_lat": 40.70196099,
  "stop_lon": -73.64164361,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=92",
  "wheelchair_boarding": 1
}, {
  "stop_id": 217,
  "stop_code": "WMR",
  "stop_name": "Woodmere",
  "stop_desc": "Woodmere Boulevard and Cedar Lane, between Central Avenue and West Broadway.",
  "stop_lat": 40.63133646,
  "stop_lon": -73.71371544,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=95",
  "wheelchair_boarding": 1
}, {
  "stop_id": 219,
  "stop_code": "WWD",
  "stop_name": "Westwood",
  "stop_desc": "The intersection of Foster Avenue and Motley Street, 1/2 mile North of East Merrick Road.",
  "stop_lat": 40.66837227,
  "stop_lon": -73.68120878,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=88",
  "wheelchair_boarding": 1
}, {
  "stop_id": 220,
  "stop_code": "WYD",
  "stop_name": "Wyandanch",
  "stop_desc": "Straight Path and Long Island Avenue, off Acorn Street.",
  "stop_lat": 40.75480101,
  "stop_lon": -73.35806588,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=71",
  "wheelchair_boarding": 1
}, {
  "stop_id": 223,
  "stop_code": "YPK",
  "stop_name": "Yaphank",
  "stop_desc": "Yaphank Avenue and Park Street, 1 mile North of Highway 27 (Exit 57).",
  "stop_lat": 40.82561319,
  "stop_lon": -72.91587848,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=78",
  "wheelchair_boarding": 1
}, {
  "stop_id": 225,
  "stop_code": "BWN",
  "stop_name": "Baldwin",
  "stop_desc": "Sunrise Highway and Grand Avenue, North side of Sunrise Highway (Route 27).",
  "stop_lat": 40.65673224,
  "stop_lon": -73.60716245,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=107",
  "wheelchair_boarding": 1
}, {
  "stop_id": 226,
  "stop_code": "MRK",
  "stop_name": "Merrick",
  "stop_desc": "Sunrise Highway (Route 27), between Hewlett Avenue and Merrick Avenue.",
  "stop_lat": 40.6638004,
  "stop_lon": -73.55062102,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=109",
  "wheelchair_boarding": 1
}, {
  "stop_id": 233,
  "stop_code": "WHN",
  "stop_name": "Westhampton",
  "stop_desc": "Station Road and Depot Road, 1/2 mile North of Montauk Highway (Route 27A).",
  "stop_lat": 40.83030532,
  "stop_lon": -72.65032454,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=130",
  "wheelchair_boarding": 1
}, {
  "stop_id": 237,
  "stop_code": "NYK",
  "stop_name": "Penn Station",
  "stop_desc": "34th Street between 7th & 8th Avenues.",
  "stop_lat": 40.75058844,
  "stop_lon": -73.99358408,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=8",
  "wheelchair_boarding": 1
}, {
  "stop_id": 241,
  "stop_code": "ATL",
  "stop_name": "Atlantic Terminal",
  "stop_desc": "Intersection of Atlantic and Flatbush Avenues and Hanson Place.",
  "stop_lat": 40.68359596,
  "stop_lon": -73.97567112,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=12",
  "wheelchair_boarding": 1
}, {
  "stop_id": 359,
  "stop_code": "EMT",
  "stop_name": "Elmont",
  "stop_desc": "Take free shuttle bus from UBS Arena to station. Eastbound service only.",
  "stop_lat": 40.720074,
  "stop_lon": -73.725549,
  "stop_url": "http://lirr42.mta.info/stationInfo.php?id=139",
  "wheelchair_boarding": 1
}];
},{}],"data/transit/mnr-geo.json":[function(require,module,exports) {
module.exports = [{
  "stop_id": 1,
  "stop_code": "0NY",
  "stop_name": "Grand Central",
  "stop_desc": "",
  "stop_lat": 40.752998,
  "stop_lon": -73.977056,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=1",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 4,
  "stop_code": "0HL",
  "stop_name": "Harlem-125th St.",
  "stop_desc": "",
  "stop_lat": 40.805157,
  "stop_lon": -73.939149,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=2",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 9,
  "stop_code": "0MH",
  "stop_name": "Morris Heights",
  "stop_desc": "",
  "stop_lat": 40.854252,
  "stop_lon": -73.919583,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=4",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 10,
  "stop_code": "0UH",
  "stop_name": "University Heights",
  "stop_desc": "",
  "stop_lat": 40.862248,
  "stop_lon": -73.91312,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=6",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 11,
  "stop_code": "0MB",
  "stop_name": "Marble Hill",
  "stop_desc": "",
  "stop_lat": 40.874333,
  "stop_lon": -73.910941,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=8",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 14,
  "stop_code": "0DV",
  "stop_name": "Spuyten Duyvil",
  "stop_desc": "",
  "stop_lat": 40.878245,
  "stop_lon": -73.921455,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=10",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 16,
  "stop_code": "0RV",
  "stop_name": "Riverdale",
  "stop_desc": "",
  "stop_lat": 40.903981,
  "stop_lon": -73.914126,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=12",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 17,
  "stop_code": "0LU",
  "stop_name": "Ludlow",
  "stop_desc": "",
  "stop_lat": 40.924972,
  "stop_lon": -73.904612,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=14",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 18,
  "stop_code": "0YK",
  "stop_name": "Yonkers",
  "stop_desc": "",
  "stop_lat": 40.935795,
  "stop_lon": -73.902668,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=16",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 19,
  "stop_code": "0GD",
  "stop_name": "Glenwood",
  "stop_desc": "",
  "stop_lat": 40.950496,
  "stop_lon": -73.899062,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=18",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 20,
  "stop_code": "0GY",
  "stop_name": "Greystone",
  "stop_desc": "",
  "stop_lat": 40.972705,
  "stop_lon": -73.889069,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=20",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 22,
  "stop_code": "0HS",
  "stop_name": "Hastings-on-Hudson",
  "stop_desc": "",
  "stop_lat": 40.994109,
  "stop_lon": -73.884512,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=22",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 23,
  "stop_code": "0DF",
  "stop_name": "Dobbs Ferry",
  "stop_desc": "",
  "stop_lat": 41.012459,
  "stop_lon": -73.87949,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=24",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 24,
  "stop_code": "0AR",
  "stop_name": "Ardsley-on-Hudson",
  "stop_desc": "",
  "stop_lat": 41.026198,
  "stop_lon": -73.876543,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=26",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 25,
  "stop_code": "0IV",
  "stop_name": "Irvington",
  "stop_desc": "",
  "stop_lat": 41.039993,
  "stop_lon": -73.873083,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=28",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 27,
  "stop_code": "0TT",
  "stop_name": "Tarrytown",
  "stop_desc": "",
  "stop_lat": 41.076473,
  "stop_lon": -73.864563,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=30",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 29,
  "stop_code": "0PM",
  "stop_name": "Philipse Manor",
  "stop_desc": "",
  "stop_lat": 41.09492,
  "stop_lon": -73.869755,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=32",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 30,
  "stop_code": "0SB",
  "stop_name": "Scarborough",
  "stop_desc": "",
  "stop_lat": 41.135763,
  "stop_lon": -73.866163,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=34",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 31,
  "stop_code": "0OS",
  "stop_name": "Ossining",
  "stop_desc": "",
  "stop_lat": 41.157663,
  "stop_lon": -73.869281,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=36",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 33,
  "stop_code": "0HM",
  "stop_name": "Croton-Harmon",
  "stop_desc": "",
  "stop_lat": 41.189903,
  "stop_lon": -73.882394,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=38",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 37,
  "stop_code": "0CT",
  "stop_name": "Cortlandt",
  "stop_desc": "",
  "stop_lat": 41.246259,
  "stop_lon": -73.921884,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=43",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 39,
  "stop_code": "0PE",
  "stop_name": "Peekskill",
  "stop_desc": "",
  "stop_lat": 41.285962,
  "stop_lon": -73.93042,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=46",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 40,
  "stop_code": "0MN",
  "stop_name": "Manitou",
  "stop_desc": "",
  "stop_lat": 41.332601,
  "stop_lon": -73.970426,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=48",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 42,
  "stop_code": "0GA",
  "stop_name": "Garrison",
  "stop_desc": "",
  "stop_lat": 41.38178,
  "stop_lon": -73.947202,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=50",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 43,
  "stop_code": "0CS",
  "stop_name": "Cold Spring",
  "stop_desc": "",
  "stop_lat": 41.415283,
  "stop_lon": -73.95809,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=54",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 44,
  "stop_code": "0BK",
  "stop_name": "Breakneck Ridge",
  "stop_desc": "",
  "stop_lat": 41.450181,
  "stop_lon": -73.982449,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=52",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 46,
  "stop_code": "0BC",
  "stop_name": "Beacon",
  "stop_desc": "",
  "stop_lat": 41.504007,
  "stop_lon": -73.984528,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=56",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 49,
  "stop_code": "0NM",
  "stop_name": "New Hamburg",
  "stop_desc": "",
  "stop_lat": 41.587448,
  "stop_lon": -73.947226,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=57",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 51,
  "stop_code": "0PO",
  "stop_name": "Poughkeepsie",
  "stop_desc": "",
  "stop_lat": 41.705839,
  "stop_lon": -73.937946,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=58",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 54,
  "stop_code": "1ML",
  "stop_name": "Melrose",
  "stop_desc": "",
  "stop_lat": 40.825761,
  "stop_lon": -73.915231,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=104",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 55,
  "stop_code": "1TR",
  "stop_name": "Tremont",
  "stop_desc": "",
  "stop_lat": 40.847301,
  "stop_lon": -73.89955,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=106",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 56,
  "stop_code": "1FO",
  "stop_name": "Fordham",
  "stop_desc": "",
  "stop_lat": 40.8615,
  "stop_lon": -73.89058,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=108",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 57,
  "stop_code": "1BG",
  "stop_name": "Botanical Garden",
  "stop_desc": "",
  "stop_lat": 40.866555,
  "stop_lon": -73.883109,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=110",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 58,
  "stop_code": "1WG",
  "stop_name": "Williams Bridge",
  "stop_desc": "",
  "stop_lat": 40.878569,
  "stop_lon": -73.871064,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=112",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 59,
  "stop_code": "1WN",
  "stop_name": "Woodlawn",
  "stop_desc": "",
  "stop_lat": 40.895361,
  "stop_lon": -73.862916,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=114",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 61,
  "stop_code": "1WF",
  "stop_name": "Wakefield",
  "stop_desc": "",
  "stop_lat": 40.905936,
  "stop_lon": -73.85568,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=116",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 62,
  "stop_code": "1MW",
  "stop_name": "Mt Vernon West",
  "stop_desc": "",
  "stop_lat": 40.912142,
  "stop_lon": -73.851129,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=118",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 64,
  "stop_code": "1FW",
  "stop_name": "Fleetwood",
  "stop_desc": "",
  "stop_lat": 40.92699,
  "stop_lon": -73.83948,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=120",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 65,
  "stop_code": "1BX",
  "stop_name": "Bronxville",
  "stop_desc": "",
  "stop_lat": 40.93978,
  "stop_lon": -73.835208,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=122",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 66,
  "stop_code": "1TK",
  "stop_name": "Tuckahoe",
  "stop_desc": "",
  "stop_lat": 40.949393,
  "stop_lon": -73.830166,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=124",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 68,
  "stop_code": "1CW",
  "stop_name": "Crestwood",
  "stop_desc": "",
  "stop_lat": 40.958997,
  "stop_lon": -73.820564,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=126",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 71,
  "stop_code": "1SC",
  "stop_name": "Scarsdale",
  "stop_desc": "",
  "stop_lat": 40.989168,
  "stop_lon": -73.808634,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=128",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 72,
  "stop_code": "1HA",
  "stop_name": "Hartsdale",
  "stop_desc": "",
  "stop_lat": 41.010333,
  "stop_lon": -73.796407,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=130",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 74,
  "stop_code": "1WP",
  "stop_name": "White Plains",
  "stop_desc": "",
  "stop_lat": 41.032589,
  "stop_lon": -73.775208,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=132",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 76,
  "stop_code": "1NW",
  "stop_name": "North White Plains",
  "stop_desc": "",
  "stop_lat": 41.049806,
  "stop_lon": -73.773142,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=134",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 78,
  "stop_code": "1VA",
  "stop_name": "Valhalla",
  "stop_desc": "",
  "stop_lat": 41.072819,
  "stop_lon": -73.772599,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=136",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 79,
  "stop_code": "1MP",
  "stop_name": "Mount Pleasant",
  "stop_desc": "",
  "stop_lat": 41.095877,
  "stop_lon": -73.793822,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=140",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 80,
  "stop_code": "1HN",
  "stop_name": "Hawthorne",
  "stop_desc": "",
  "stop_lat": 41.108581,
  "stop_lon": -73.79625,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=142",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 81,
  "stop_code": "1PV",
  "stop_name": "Pleasantville",
  "stop_desc": "",
  "stop_lat": 41.135222,
  "stop_lon": -73.792661,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=146",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 83,
  "stop_code": "1CQ",
  "stop_name": "Chappaqua",
  "stop_desc": "",
  "stop_lat": 41.158015,
  "stop_lon": -73.774885,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=148",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 84,
  "stop_code": "1MK",
  "stop_name": "Mount Kisco",
  "stop_desc": "",
  "stop_lat": 41.208242,
  "stop_lon": -73.729778,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=150",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 85,
  "stop_code": "1BH",
  "stop_name": "Bedford Hills",
  "stop_desc": "",
  "stop_lat": 41.237316,
  "stop_lon": -73.699936,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=152",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 86,
  "stop_code": "1KA",
  "stop_name": "Katonah",
  "stop_desc": "",
  "stop_lat": 41.259552,
  "stop_lon": -73.684155,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=154",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 88,
  "stop_code": "1GO",
  "stop_name": "Goldens Bridge",
  "stop_desc": "",
  "stop_lat": 41.294338,
  "stop_lon": -73.677655,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=156",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 89,
  "stop_code": "1PY",
  "stop_name": "Purdy's",
  "stop_desc": "",
  "stop_lat": 41.325775,
  "stop_lon": -73.659061,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=158",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 90,
  "stop_code": "1CF",
  "stop_name": "Croton Falls",
  "stop_desc": "",
  "stop_lat": 41.347722,
  "stop_lon": -73.662269,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=160",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 91,
  "stop_code": "1BW",
  "stop_name": "Brewster",
  "stop_desc": "",
  "stop_lat": 41.39447,
  "stop_lon": -73.619802,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=162",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 94,
  "stop_code": "1BR",
  "stop_name": "Southeast",
  "stop_desc": "",
  "stop_lat": 41.413203,
  "stop_lon": -73.623787,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=163",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 97,
  "stop_code": "1PA",
  "stop_name": "Patterson",
  "stop_desc": "",
  "stop_lat": 41.511827,
  "stop_lon": -73.604584,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=164",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 98,
  "stop_code": "1PW",
  "stop_name": "Pawling",
  "stop_desc": "",
  "stop_lat": 41.564205,
  "stop_lon": -73.600524,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=166",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 99,
  "stop_code": "1AT",
  "stop_name": "Appalachian Trail",
  "stop_desc": "",
  "stop_lat": 41.61081,
  "stop_lon": -73.57871,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=167",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 100,
  "stop_code": "1WI",
  "stop_name": "HM Valley-Wingdale",
  "stop_desc": "",
  "stop_lat": 41.637525,
  "stop_lon": -73.57145,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=168",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 101,
  "stop_code": "1DO",
  "stop_name": "Dover Plains",
  "stop_desc": "",
  "stop_lat": 41.740401,
  "stop_lon": -73.576502,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=170",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 105,
  "stop_code": "2ME",
  "stop_name": "Mt Vernon East",
  "stop_desc": "",
  "stop_lat": 40.912161,
  "stop_lon": -73.832185,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=202",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 106,
  "stop_code": "2PH",
  "stop_name": "Pelham",
  "stop_desc": "",
  "stop_lat": 40.910321,
  "stop_lon": -73.810242,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=204",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 108,
  "stop_code": "2NR",
  "stop_name": "New Rochelle",
  "stop_desc": "",
  "stop_lat": 40.911605,
  "stop_lon": -73.783807,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=206",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 110,
  "stop_code": "2LA",
  "stop_name": "Larchmont",
  "stop_desc": "",
  "stop_lat": 40.933394,
  "stop_lon": -73.759792,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=208",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 111,
  "stop_code": "2MA",
  "stop_name": "Mamaroneck",
  "stop_desc": "",
  "stop_lat": 40.954061,
  "stop_lon": -73.736125,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=210",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 112,
  "stop_code": "2HS",
  "stop_name": "Harrison",
  "stop_desc": "",
  "stop_lat": 40.969432,
  "stop_lon": -73.712964,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=212",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 114,
  "stop_code": "2RY",
  "stop_name": "Rye",
  "stop_desc": "",
  "stop_lat": 40.985922,
  "stop_lon": -73.682553,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=214",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 115,
  "stop_code": "2PC",
  "stop_name": "Port Chester",
  "stop_desc": "",
  "stop_lat": 41.000732,
  "stop_lon": -73.6647,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=216",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 116,
  "stop_code": "2GN",
  "stop_name": "Greenwich",
  "stop_desc": "",
  "stop_lat": 41.021277,
  "stop_lon": -73.624621,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=218",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 118,
  "stop_code": "2CC",
  "stop_name": "Cos Cob",
  "stop_desc": "",
  "stop_lat": 41.030171,
  "stop_lon": -73.598306,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=220",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 120,
  "stop_code": "2RS",
  "stop_name": "Riverside",
  "stop_desc": "",
  "stop_lat": 41.031682,
  "stop_lon": -73.588173,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=222",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 121,
  "stop_code": "2OG",
  "stop_name": "Old Greenwich",
  "stop_desc": "",
  "stop_lat": 41.033817,
  "stop_lon": -73.565859,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=224",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 124,
  "stop_code": "2SM",
  "stop_name": "Stamford",
  "stop_desc": "",
  "stop_lat": 41.046611,
  "stop_lon": -73.542846,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=226",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 127,
  "stop_code": "2NO",
  "stop_name": "Noroton Heights",
  "stop_desc": "",
  "stop_lat": 41.069041,
  "stop_lon": -73.49788,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=228",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 128,
  "stop_code": "2DA",
  "stop_name": "Darien",
  "stop_desc": "",
  "stop_lat": 41.076913,
  "stop_lon": -73.472966,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=230",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 129,
  "stop_code": "2RO",
  "stop_name": "Rowayton",
  "stop_desc": "",
  "stop_lat": 41.077456,
  "stop_lon": -73.445527,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=232",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 131,
  "stop_code": "2SN",
  "stop_name": "South Norwalk",
  "stop_desc": "",
  "stop_lat": 41.09673,
  "stop_lon": -73.421132,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=234",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 133,
  "stop_code": "2EN",
  "stop_name": "East Norwalk",
  "stop_desc": "",
  "stop_lat": 41.103996,
  "stop_lon": -73.404588,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=236",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 134,
  "stop_code": "2WP",
  "stop_name": "Westport",
  "stop_desc": "",
  "stop_lat": 41.118928,
  "stop_lon": -73.371413,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=238",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 136,
  "stop_code": "2GF",
  "stop_name": "Green's Farms",
  "stop_desc": "",
  "stop_lat": 41.122265,
  "stop_lon": -73.315408,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=240",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 137,
  "stop_code": "2SP",
  "stop_name": "Southport",
  "stop_desc": "",
  "stop_lat": 41.134844,
  "stop_lon": -73.28897,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=242",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 138,
  "stop_code": "2FF",
  "stop_name": "Fairfield",
  "stop_desc": "",
  "stop_lat": 41.143077,
  "stop_lon": -73.257742,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=244",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 140,
  "stop_code": "2BP",
  "stop_name": "Bridgeport",
  "stop_desc": "",
  "stop_lat": 41.178677,
  "stop_lon": -73.187076,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=246",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 143,
  "stop_code": "2SR",
  "stop_name": "Stratford",
  "stop_desc": "",
  "stop_lat": 41.194255,
  "stop_lon": -73.131532,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=248",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 144,
  "stop_code": 261,
  "stop_name": "CP 261",
  "stop_desc": "",
  "stop_lat": 41.208638,
  "stop_lon": -73.097415,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 145,
  "stop_code": "2MI",
  "stop_name": "Milford",
  "stop_desc": "",
  "stop_lat": 41.223231,
  "stop_lon": -73.057647,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=250",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 149,
  "stop_code": "2NH",
  "stop_name": "New Haven",
  "stop_desc": "",
  "stop_lat": 41.296501,
  "stop_lon": -72.92829,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=252",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 151,
  "stop_code": "2SS",
  "stop_name": "NH-State St.",
  "stop_desc": "",
  "stop_lat": 41.304979,
  "stop_lon": -72.921747,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=253",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 153,
  "stop_code": "3GB",
  "stop_name": "Glenbrook",
  "stop_desc": "",
  "stop_lat": 41.070547,
  "stop_lon": -73.520021,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=260",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 154,
  "stop_code": "3SD",
  "stop_name": "Springdale",
  "stop_desc": "",
  "stop_lat": 41.08876,
  "stop_lon": -73.517828,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=262",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 155,
  "stop_code": "3TH",
  "stop_name": "Talmadge Hill",
  "stop_desc": "",
  "stop_lat": 41.116012,
  "stop_lon": -73.498149,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=264",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 157,
  "stop_code": "3NC",
  "stop_name": "New Canaan",
  "stop_desc": "",
  "stop_lat": 41.146305,
  "stop_lon": -73.495626,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=266",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 158,
  "stop_code": "4M7",
  "stop_name": "Merritt 7",
  "stop_desc": "",
  "stop_lat": 41.146618,
  "stop_lon": -73.427859,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=268",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 160,
  "stop_code": "4WI",
  "stop_name": "Wilton",
  "stop_desc": "",
  "stop_lat": 41.196202,
  "stop_lon": -73.432434,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=270",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 161,
  "stop_code": "4CA",
  "stop_name": "Cannondale",
  "stop_desc": "",
  "stop_lat": 41.21662,
  "stop_lon": -73.426703,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=272",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 162,
  "stop_code": "4BV",
  "stop_name": "Branchville",
  "stop_desc": "",
  "stop_lat": 41.26763,
  "stop_lon": -73.441421,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=274",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 163,
  "stop_code": "4RD",
  "stop_name": "Redding",
  "stop_desc": "",
  "stop_lat": 41.325684,
  "stop_lon": -73.4338,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=276",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 164,
  "stop_code": "4BE",
  "stop_name": "Bethel",
  "stop_desc": "",
  "stop_lat": 41.376225,
  "stop_lon": -73.418171,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=278",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 165,
  "stop_code": "4DN",
  "stop_name": "Danbury",
  "stop_desc": "",
  "stop_lat": 41.396363,
  "stop_lon": -73.450163,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=280",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 167,
  "stop_code": "5DE",
  "stop_name": "Derby",
  "stop_desc": "",
  "stop_lat": 41.319718,
  "stop_lon": -73.083548,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=290",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 168,
  "stop_code": "5AN",
  "stop_name": "Ansonia",
  "stop_desc": "",
  "stop_lat": 41.344156,
  "stop_lon": -73.079892,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=292",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 169,
  "stop_code": "5SE",
  "stop_name": "Seymour",
  "stop_desc": "",
  "stop_lat": 41.395139,
  "stop_lon": -73.072499,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=294",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 170,
  "stop_code": "5BF",
  "stop_name": "Beacon Falls",
  "stop_desc": "",
  "stop_lat": 41.441752,
  "stop_lon": -73.06359,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=295",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 171,
  "stop_code": "5NA",
  "stop_name": "Naugatuck",
  "stop_desc": "",
  "stop_lat": 41.494204,
  "stop_lon": -73.052655,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=296",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 172,
  "stop_code": "5WB",
  "stop_name": "Waterbury",
  "stop_desc": "",
  "stop_lat": 41.552728,
  "stop_lon": -73.046126,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=298",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 176,
  "stop_code": "1TM",
  "stop_name": "Tenmile River",
  "stop_desc": "",
  "stop_lat": 41.779938,
  "stop_lon": -73.558204,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=172",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 177,
  "stop_code": "1WA",
  "stop_name": "Wassaic",
  "stop_desc": "",
  "stop_lat": 41.814722,
  "stop_lon": -73.562197,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=174",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 188,
  "stop_code": "2FM",
  "stop_name": "Fairfield Metro",
  "stop_desc": "",
  "stop_lat": 41.161,
  "stop_lon": -73.234336,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=245",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 190,
  "stop_code": "2WH",
  "stop_name": "West Haven",
  "stop_desc": "",
  "stop_lat": 41.27142,
  "stop_lon": -72.963488,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=251",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 502,
  "stop_code": "12KK",
  "stop_name": "Kappock St/Knolls Crescent",
  "stop_desc": "",
  "stop_lat": 40.879135,
  "stop_lon": -73.916842,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 504,
  "stop_code": "12IA",
  "stop_name": "Henry Hudson Pkwy/Independence Ave",
  "stop_desc": "",
  "stop_lat": 40.881049,
  "stop_lon": -73.91917,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 505,
  "stop_code": 12227,
  "stop_name": "227th St/Henry Hudson Pkwy-East Side",
  "stop_desc": "",
  "stop_lat": 40.881836,
  "stop_lon": -73.917936,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 506,
  "stop_code": 12232,
  "stop_name": "232nd St/Henry Hudson Pkwy",
  "stop_desc": "",
  "stop_lat": 40.884732,
  "stop_lon": -73.914546,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 507,
  "stop_code": 12235,
  "stop_name": "235th St/Henry Hudson Pkwy-East Side",
  "stop_desc": "",
  "stop_lat": 40.886127,
  "stop_lon": -73.9124,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 508,
  "stop_code": 12236,
  "stop_name": "236th St/Henry Hudson Pkwy",
  "stop_desc": "",
  "stop_lat": 40.887011,
  "stop_lon": -73.911842,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 510,
  "stop_code": 12239,
  "stop_name": "239th St/Independence Ave.",
  "stop_desc": "",
  "stop_lat": 40.889769,
  "stop_lon": -73.912894,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 512,
  "stop_code": 12230,
  "stop_name": "230th St/Riverdale Ave",
  "stop_desc": "",
  "stop_lat": 40.880465,
  "stop_lon": -73.910544,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 514,
  "stop_code": "12236E",
  "stop_name": "236th St/Riverdale Ave-East Side",
  "stop_desc": "",
  "stop_lat": 40.885908,
  "stop_lon": -73.906993,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 516,
  "stop_code": "12239HHP",
  "stop_name": "239th St/Henry Hudson Pkwy",
  "stop_desc": "",
  "stop_lat": 40.889136,
  "stop_lon": -73.908377,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 518,
  "stop_code": 12246,
  "stop_name": "246th St/Henry Hudson Pkwy",
  "stop_desc": "",
  "stop_lat": 40.893613,
  "stop_lon": -73.907969,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 602,
  "stop_code": 13254,
  "stop_name": "254th St/Riverdale Ave",
  "stop_desc": "",
  "stop_lat": 40.901731,
  "stop_lon": -73.906134,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 604,
  "stop_code": 13256,
  "stop_name": "256th St/Riverdale Ave",
  "stop_desc": "",
  "stop_lat": 40.904156,
  "stop_lon": -73.905008,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 606,
  "stop_code": 13259,
  "stop_name": "259th St/Arlington Ave",
  "stop_desc": "",
  "stop_lat": 40.90645,
  "stop_lon": -73.906735,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 608,
  "stop_code": "13259RD",
  "stop_name": "259th St/Riverdale Ave",
  "stop_desc": "",
  "stop_lat": 40.90688,
  "stop_lon": -73.904096,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 610,
  "stop_code": "13MF",
  "stop_name": "Mosholu Ave/Fieldston Rd",
  "stop_desc": "",
  "stop_lat": 40.905485,
  "stop_lon": -73.900716,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 612,
  "stop_code": "13DSP",
  "stop_name": "David Sheridan Plaza",
  "stop_desc": "",
  "stop_lat": 40.905112,
  "stop_lon": -73.896435,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 614,
  "stop_code": 13260,
  "stop_name": "260th St/Broadway",
  "stop_desc": "",
  "stop_lat": 40.907521,
  "stop_lon": -73.896543,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 616,
  "stop_code": 13262,
  "stop_name": "262nd St/Broadway",
  "stop_desc": "",
  "stop_lat": 40.910221,
  "stop_lon": -73.896629,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 618,
  "stop_code": 13261,
  "stop_name": "261st St/Riverdale Ave",
  "stop_desc": "",
  "stop_lat": 40.910148,
  "stop_lon": -73.903216,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 620,
  "stop_code": 13263,
  "stop_name": "263rd St/Riverdale Ave",
  "stop_desc": "",
  "stop_lat": 40.912483,
  "stop_lon": -73.902583,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 622,
  "stop_code": "0YS",
  "stop_name": "Yankees-E153 St.",
  "stop_desc": "",
  "stop_lat": 40.8253,
  "stop_lon": -73.9299,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=3",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 1
}, {
  "stop_id": 40001,
  "stop_code": "11HS",
  "stop_name": "Haverstraw",
  "stop_desc": "",
  "stop_lat": 41.192009,
  "stop_lon": -73.959017,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 40002,
  "stop_code": "14NB",
  "stop_name": "Newburg",
  "stop_desc": "",
  "stop_lat": 41.500896,
  "stop_lon": -74.005419,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 40702,
  "stop_code": "10BF",
  "stop_name": "Branford (SLE)",
  "stop_desc": "",
  "stop_lat": 41.274589,
  "stop_lon": -72.817265,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 40704,
  "stop_code": "10GF",
  "stop_name": "Guilford (SLE)",
  "stop_desc": "",
  "stop_lat": 41.275839,
  "stop_lon": -72.673638,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 40706,
  "stop_code": "10MN",
  "stop_name": "Madison (SLE)",
  "stop_desc": "",
  "stop_lat": 41.283676,
  "stop_lon": -72.599545,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 40708,
  "stop_code": "10CT",
  "stop_name": "Clinton (SLE)",
  "stop_desc": "",
  "stop_lat": 41.2795,
  "stop_lon": -72.528305,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 40710,
  "stop_code": "10WB",
  "stop_name": "Westbrook (SLE)",
  "stop_desc": "",
  "stop_lat": 41.288787,
  "stop_lon": -72.44845,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 40712,
  "stop_code": "10OS",
  "stop_name": "Old Saybrook (SLE)",
  "stop_desc": "",
  "stop_lat": 41.300395,
  "stop_lon": -72.376792,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}, {
  "stop_id": 40714,
  "stop_code": "10NL",
  "stop_name": "New London (SLE)",
  "stop_desc": "",
  "stop_lat": 41.354222,
  "stop_lon": -72.093229,
  "zone_id": "",
  "stop_url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=",
  "location_type": 0,
  "parent_station": "",
  "wheelchair_boarding": 0
}];
},{}],"data/transit/others.json":[function(require,module,exports) {
module.exports = [{
  "transit authority": "MARTA",
  "description": "Buckhead Station",
  "station": "Buckhead",
  "latitude": 33.56875,
  "longitude": -83.36231
}, {
  "transit authority": "MARTA",
  "description": "Lindbergh Station",
  "station": "Lindbergh",
  "latitude": 33.82129,
  "longitude": -84.36896
}, {
  "transit authority": "MARTA",
  "description": "Mercedes Benz Station",
  "station": "Mercedes Benz",
  "latitude": 33.75659,
  "longitude": -84.39681
}, {
  "transit authority": "Caltrain",
  "description": "4th & King Station",
  "station": "4thKing",
  "latitude": 37.77605,
  "longitude": -122.3944
}, {
  "transit authority": "BART",
  "description": "12th St. Station",
  "station": "12thSt",
  "latitude": 37.80351,
  "longitude": -122.27179
}, {
  "transit authority": "BART, BART-VTA",
  "description": "Berryessa Station",
  "station": "Berryessa",
  "latitude": 37.3706,
  "longitude": -121.87482
}, {
  "transit authority": "BART, BART-VTA",
  "description": "Milpitas Station",
  "station": "Milpitas",
  "latitude": 37.42261,
  "longitude": -121.89332
}, {
  "transit authority": "WMATA",
  "description": "Union Station",
  "station": "Union Station",
  "latitude": 38.89682,
  "longitude": -77.00493
}, {
  "transit authority": "WMATA",
  "description": "Eastern Market Station",
  "station": "Eastern Market",
  "latitude": 38.88241,
  "longitude": -76.99094
}, {
  "transit authority": "WMATA",
  "description": "Federal Center Station",
  "station": "Federal Center",
  "latitude": 38.88507,
  "longitude": -77.01519
}, {
  "transit authority": "WMATA",
  "description": "Georgia Avenue Station",
  "station": "Georgia Avenue",
  "latitude": 38.93661,
  "longitude": -77.02434
}, {
  "transit authority": "WMATA",
  "description": "Glenmont Station",
  "station": "Glenmont",
  "latitude": 39.06118,
  "longitude": -77.05223
}, {
  "transit authority": "WMATA",
  "description": "Capitol South Station",
  "station": "Capitol_South",
  "latitude": 38.884,
  "longitude": -77.00588
}, {
  "transit authority": "WMATA",
  "description": "Farragut North Station",
  "station": "Farragut North",
  "latitude": 38.90386,
  "longitude": -77.03999
}, {
  "transit authority": "WMATA",
  "description": "Woodley Park Station",
  "station": "Woodley Park",
  "latitude": 38.92827,
  "longitude": -77.05427
}, {
  "transit authority": "Citylites",
  "description": "Downtown Saint Paul",
  "station": "Downtown Saint Paul",
  "latitude": 44.94566,
  "longitude": -93.09443
}, {
  "transit authority": "Citylites",
  "description": "Downtown Rochester",
  "station": "Downtown Rochester",
  "latitude": 44.021972,
  "longitude": -92.46488
}, {
  "transit authority": "Citylites",
  "description": "Central Minneapolis",
  "station": "Central Minneapolis",
  "latitude": 44.97639,
  "longitude": -93.271084
}, {
  "transit authority": "Brightline",
  "description": "Ft. Lauderdale Station",
  "station": "Fort Lauderdale",
  "latitude": 26.12416,
  "longitude": -80.143593
}, {
  "transit authority": "Brightline",
  "description": "W Palm Beach Station",
  "station": "West Palm Beach",
  "latitude": 26.71444,
  "longitude": -80.05495
}, {
  "transit authority": "Brightline",
  "description": "Miami Station",
  "station": "Miami",
  "latitude": 25.78009,
  "longitude": -80.195312
}];
},{}],"js/board.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStationInfo = void 0;

var _constants = require("./constants");

var _mtaGeo = _interopRequireDefault(require("../data/transit/mta-geo.json"));

var _mbtaGeo = _interopRequireDefault(require("../data/transit/mbta-geo.json"));

var _lirrGeo = _interopRequireDefault(require("../data/transit/lirr-geo.json"));

var _mnrGeo = _interopRequireDefault(require("../data/transit/mnr-geo.json"));

var _others = _interopRequireDefault(require("../data/transit/others.json"));

var _climacell = require("./apis/climacell");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stations = {
  MBTA: _mbtaGeo.default,
  NYCT: _mtaGeo.default,
  LIRR: _lirrGeo.default,
  MNR: _mnrGeo.default,
  OTHER: _others.default
};
/*********************************************
	 mraid API Helpers
*********************************************/
// get tags from the board

var getBoardTags = function getBoardTags() {
  // check for mraid api
  var mraid = null;
  if (parent && parent.parent && parent.parent.mraid) mraid = parent.parent.mraid;

  if (!mraid) {
    console.log('ERROR: No mraid API');
    return null;
  }

  var tags = JSON.parse(mraid.getTags()).tags;
  return tags;
};

var getAllTags = function getAllTags() {
  var tags = getBoardTags();

  if (!tags) {
    // to show something when devloping locally
    tags = _constants.localTags.tags; // console.log('local sample tags => ');
    // console.log(tags);
  } else {
    console.log('all board tags => ');
    console.log(tags);
  }

  return tags;
};

var getTagsByType = function getTagsByType(allTags, tagType) {
  var tag = allTags && allTags.find(function (tag) {
    return tag.name === tagType;
  });

  if (tag) {
    return tag.value;
  } else {
    console.log('get tag: ');
    console.log(tagType);
    console.log('ERROR: No tags with that name');
    return null;
  }
}; // get station info


var getStationByTag = function getStationByTag(transitTag, stationTag) {
  var sTag = transitTag === 'NYCT' ? stationTag.slice(0, 3) : stationTag;
  var station = stations[transitTag].find(function (item) {
    return item[_constants.transitKey[transitTag].id] + '' === sTag;
  });

  if (station) {
    return station;
  } else {
    console.log('No station with that ID');
    return null;
  }
};

var getStationInfo = function getStationInfo() {
  var allTags = getAllTags(); // get current transit_authority type

  var taTag = getTagsByType(allTags, _constants.TAG_TYPE.TA);
  var rawTag = taTag && taTag[0]; // console.log('TA tag => ');
  // console.log(rawTag);

  var transitTag;

  if (rawTag) {
    transitTag = Object.keys(stations).includes(rawTag) ? rawTag : 'OTHER';
    var stationTag = transitTag && getTagsByType(allTags, _constants.TAG_TYPE[transitTag]) && getTagsByType(allTags, _constants.TAG_TYPE[transitTag])[0]; // console.log('Station tag => ');
    // console.log(stationTag);
    // get the first 3 characters of ID (NYCT)

    var station = stationTag && getStationByTag(transitTag, stationTag + ''); // console.log('station => ');
    // console.log(station);

    if (stationTag && station) {
      return {
        name: station[_constants.transitKey[transitTag].name],
        lat: station[_constants.transitKey[transitTag].lat],
        lon: station[_constants.transitKey[transitTag].lon],
        id: station[_constants.transitKey[transitTag].id] + ''
      };
    } else {
      var defaultStation = _constants.DEFAULT.STATION[rawTag];

      if (defaultStation) {
        console.log('~~~ show default station => ');
        console.log(defaultStation);
        return _constants.DEFAULT.STATION[rawTag];
      } else {
        console.log('### no default station');
        (0, _climacell.setFallback)();
      }
    }
  } else {
    console.log('### no TA tag');
    (0, _climacell.setFallback)();
  }
};

exports.getStationInfo = getStationInfo;
},{"./constants":"js/constants.js","../data/transit/mta-geo.json":"data/transit/mta-geo.json","../data/transit/mbta-geo.json":"data/transit/mbta-geo.json","../data/transit/lirr-geo.json":"data/transit/lirr-geo.json","../data/transit/mnr-geo.json":"data/transit/mnr-geo.json","../data/transit/others.json":"data/transit/others.json","./apis/climacell":"js/apis/climacell.js"}],"pages/single/js/app.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _app = require("../../../js/app");

var _weatherApi = require("../../../js/weatherApi");

var _board = require("../../../js/board.js");

var _constants = require("../../../js/constants");

var _climacell = require("../../../js/apis/climacell");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var setRealtimeData = function setRealtimeData(realtime) {
  // console.log(realtime);
  // current weather
  document.querySelector('#now h2 .temp').innerHTML = "".concat(Math.round(realtime.temperature), "\u02DA");
  document.querySelector('#now .subh .temp').innerHTML = "".concat(Math.round(realtime.temperatureApparent), "\u02DA");
  document.querySelector('#now h3').innerHTML = _constants.WEATHER_CONDITIONS[realtime.weatherCode];
};

var setForecastData = function setForecastData(forecast) {
  var idx = (0, _weatherApi.getForecastIndex)(forecast[0].startTime); // forecast + 2 hours

  document.querySelector('#forecast-1 h2 .temp').innerHTML = "".concat(Math.round(forecast[idx].values.temperature), "\u02DA");
  document.querySelector('#forecast-1 .subh .temp').innerHTML = "".concat(Math.round(forecast[idx].values.temperatureApparent), "\u02DA");
  document.querySelector('#forecast-1 h3').innerHTML = _constants.WEATHER_CONDITIONS[forecast[idx].values.weatherCode];
  document.querySelector('#forecast-1 .time').innerHTML = (0, _weatherApi.getForecastTime)(forecast[idx].startTime); // forecast + 4 hours

  document.querySelector('#forecast-2 h2 .temp').innerHTML = "".concat(Math.round(forecast[idx + 2].values.temperature), "\u02DA");
  document.querySelector('#forecast-2 .subh .temp').innerHTML = "".concat(Math.round(forecast[idx + 2].values.temperatureApparent), "\u02DA");
  document.querySelector('#forecast-2 h3').innerHTML = _constants.WEATHER_CONDITIONS[forecast[idx + 2].values.weatherCode];
  document.querySelector('#forecast-2 .time').innerHTML = (0, _weatherApi.getForecastTime)(forecast[idx + 2].startTime);
};

var setIconBg = function setIconBg(realtime, forecast, dayInfo) {
  // set icons and backgrounds
  var sunriseTime = new Date(dayInfo.sunriseTime).getTime();
  var sunsetTime = new Date(dayInfo.sunsetTime).getTime(); // console.log(new Date(day.sunsetTime));

  var daypartNow = (0, _weatherApi.getDaypart)(new Date(), sunriseTime, sunsetTime);
  document.querySelector('#now img').src = _weatherApi.icons[(0, _weatherApi.parseWeatherCode)(realtime.weatherCode, daypartNow)];
  document.querySelector('#now').classList = daypartNow;
  var idx = (0, _weatherApi.getForecastIndex)(forecast[0].startTime);
  var daypartF1 = (0, _weatherApi.getDaypart)(new Date(forecast[idx].startTime), sunriseTime, sunsetTime);
  document.querySelector('#forecast-1 img').src = _weatherApi.icons[(0, _weatherApi.parseWeatherCode)(forecast[idx].values.weatherCode, daypartF1)];
  document.querySelector('#forecast-1').classList = daypartF1;
  var daypartF2 = (0, _weatherApi.getDaypart)(new Date(forecast[idx + 2].startTime), sunriseTime, sunsetTime);
  document.querySelector('#forecast-2 img').src = _weatherApi.icons[(0, _weatherApi.parseWeatherCode)(forecast[idx + 2].values.weatherCode, daypartF2)];
  document.querySelector('#forecast-2').classList = daypartF2;
};

document.addEventListener('DOMContentLoaded', ready);

function ready() {
  return _ready.apply(this, arguments);
}

function _ready() {
  _ready = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var stationInfo, lastUpdatedSingle, singleData, stationID, dayData, newSingleData, timelines, tCurrent, t1h, realtimeData, forecastData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            stationInfo = (0, _board.getStationInfo)();

            if (stationInfo) {
              document.querySelector('#station-title').innerHTML = stationInfo.name;
            } // get cache


            lastUpdatedSingle = localStorage.getItem('lastUpdatedSingle');
            singleData = JSON.parse(localStorage.getItem('singleData'));
            stationID = localStorage.getItem('stationID'); // set current time

            document.querySelector('#today').innerHTML = new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            });
            document.querySelector('#now .time').innerHTML = (0, _app.getCurrentTime)();
            _context.prev = 7;
            _context.next = 10;
            return (0, _app.getDayData)(stationInfo);

          case 10:
            dayData = _context.sent;

            if (!(!singleData || stationID !== stationInfo.id || Date.now() - lastUpdatedSingle * 1 > _constants.REALTIME_INTERVAL)) {
              _context.next = 19;
              break;
            }

            _context.next = 14;
            return (0, _weatherApi.getWeatherData)(stationInfo.lat, stationInfo.lon, _climacell.API_TYPE.SINGLE);

          case 14:
            newSingleData = _context.sent;
            // console.log('single => ', data);
            timelines = newSingleData.timelines;

            if (timelines) {
              tCurrent = timelines.find(function (t) {
                return t.timestep === 'current';
              });
              t1h = timelines.find(function (t) {
                return t.timestep === '1h';
              });
              realtimeData = tCurrent.intervals[0].values;
              forecastData = t1h.intervals; // const dayData = timelines[2].intervals[0].values;

              setRealtimeData(realtimeData);
              setForecastData(forecastData);
              setIconBg(realtimeData, forecastData, dayData);
              localStorage.setItem('singleData', JSON.stringify({
                realtimeData: realtimeData,
                forecastData: forecastData
              }));
              localStorage.setItem('lastUpdatedSingle', Date.now());
            }

            _context.next = 22;
            break;

          case 19:
            setRealtimeData(singleData.realtimeData);
            setForecastData(singleData.forecastData);
            setIconBg(singleData.realtimeData, singleData.forecastData, dayData);

          case 22:
            _context.next = 28;
            break;

          case 24:
            _context.prev = 24;
            _context.t0 = _context["catch"](7);
            console.log(_context.t0);
            (0, _climacell.setFallback)();

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 24]]);
  }));
  return _ready.apply(this, arguments);
}
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","../../../js/app":"js/app.js","../../../js/weatherApi":"js/weatherApi.js","../../../js/board.js":"js/board.js","../../../js/constants":"js/constants.js","../../../js/apis/climacell":"js/apis/climacell.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54518" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","pages/single/js/app.js"], null)
//# sourceMappingURL=/app.60dec712.js.map