(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(); else if (typeof define === "function" && define.amd) define("kidaptive-sdk-js", [], factory); else if (typeof exports === "object") exports["kidaptive-sdk-js"] = factory(); else root["KidaptiveSdk"] = factory();
})(window, function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
            }
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = true;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports, name, getter) {
            if (!__webpack_require__.o(exports, name)) {
                Object.defineProperty(exports, name, {
                    configurable: false,
                    enumerable: true,
                    get: getter
                });
            }
        };
        __webpack_require__.r = function(exports) {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function getDefault() {
                return module["default"];
            } : function getModuleExports() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 28);
    }([ function(module, exports) {
        var g;
        g = function() {
            return this;
        }();
        try {
            g = g || Function("return this")() || (1, eval)("this");
        } catch (e) {
            if (typeof window === "object") g = window;
        }
        module.exports = g;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        var _constants = __webpack_require__(5);
        var _constants2 = _interopRequireDefault(_constants);
        var _error = __webpack_require__(4);
        var _error2 = _interopRequireDefault(_error);
        var _state = __webpack_require__(3);
        var _state2 = _interopRequireDefault(_state);
        var _lodash = __webpack_require__(25);
        var _lodash2 = _interopRequireDefault(_lodash);
        var _jsonStableStringify = __webpack_require__(24);
        var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var KidaptiveSdkUtils = function() {
            function KidaptiveSdkUtils() {
                _classCallCheck(this, KidaptiveSdkUtils);
            }
            _createClass(KidaptiveSdkUtils, [ {
                key: "checkInitialized",
                value: function checkInitialized(method) {
                    if (!_state2.default.get("initialized")) {
                        throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "SDK not initialized");
                    }
                }
            }, {
                key: "checkTier",
                value: function checkTier(targetTier) {
                    this.checkInitialized();
                    var options = _state2.default.get("options") || {};
                    if (options.tier < targetTier) {
                        throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "SDK not configured to tier " + targetTier);
                    }
                }
            }, {
                key: "checkLoggingLevel",
                value: function checkLoggingLevel(targetLoggingLevel) {
                    var loggingLevelValues = {
                        all: 3,
                        warn: 2,
                        none: 1
                    };
                    var options = _state2.default.get("options") || {};
                    var loggingLevel = options.loggingLevel || _constants2.default.DEFAULT.LOGGING_LEVEL;
                    return loggingLevelValues[loggingLevel] >= loggingLevelValues[targetLoggingLevel];
                }
            }, {
                key: "copyObject",
                value: function copyObject(value) {
                    return (0, _lodash2.default)(value);
                }
            }, {
                key: "findItemIndex",
                value: function findItemIndex(array, evaluate) {
                    for (var index = 0; index < array.length; index++) {
                        if (evaluate(array[index])) {
                            return index;
                        }
                    }
                    return -1;
                }
            }, {
                key: "isArray",
                value: function isArray(object) {
                    return Object.prototype.toString.call(object) === "[object Array]";
                }
            }, {
                key: "isBoolean",
                value: function isBoolean(object) {
                    return typeof object === "boolean";
                }
            }, {
                key: "isFunction",
                value: function isFunction(object) {
                    return Object.prototype.toString.call(object) === "[object Function]";
                }
            }, {
                key: "isJson",
                value: function isJson(object) {
                    if (!this.isString(object)) {
                        return false;
                    }
                    try {
                        JSON.parse(object);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            }, {
                key: "isNumber",
                value: function isNumber(object) {
                    return Object.prototype.toString.call(object) === "[object Number]";
                }
            }, {
                key: "isObject",
                value: function isObject(object) {
                    return object === Object(object) && Object.prototype.toString.call(object) !== "[object Array]" && Object.prototype.toString.call(object) !== "[object Function]";
                }
            }, {
                key: "isString",
                value: function isString(object) {
                    return Object.prototype.toString.call(object) === "[object String]";
                }
            }, {
                key: "localStorageGetItem",
                value: function localStorageGetItem(key) {
                    var cached = localStorage.getItem(key);
                    if (cached === null) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "No item found for key " + key + " in localStorage");
                    }
                    return cached === "undefined" ? undefined : JSON.parse(cached);
                }
            }, {
                key: "localStorageSetItem",
                value: function localStorageSetItem(property, value) {
                    try {
                        localStorage.setItem(property, JSON.stringify(value));
                    } catch (e) {
                        if (KidaptiveSdkUtils.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: ALP SDK unable to write to localStorage. Cached data may be inconsistent or out-of-date");
                        }
                    }
                }
            }, {
                key: "toJson",
                value: function toJson(object) {
                    return (0, _jsonStableStringify2.default)(object);
                }
            } ]);
            return KidaptiveSdkUtils;
        }();
        exports.default = new KidaptiveSdkUtils();
    }, function(module, exports, __webpack_require__) {
        (function(process, setImmediate) {
            (function(definition) {
                "use strict";
                if (typeof bootstrap === "function") {
                    bootstrap("promise", definition);
                } else if (true) {
                    module.exports = definition();
                } else {
                    var previousQ, global;
                }
            })(function() {
                "use strict";
                var hasStacks = false;
                try {
                    throw new Error();
                } catch (e) {
                    hasStacks = !!e.stack;
                }
                var qStartingLine = captureLine();
                var qFileName;
                var noop = function() {};
                var nextTick = function() {
                    var head = {
                        task: void 0,
                        next: null
                    };
                    var tail = head;
                    var flushing = false;
                    var requestTick = void 0;
                    var isNodeJS = false;
                    var laterQueue = [];
                    function flush() {
                        var task, domain;
                        while (head.next) {
                            head = head.next;
                            task = head.task;
                            head.task = void 0;
                            domain = head.domain;
                            if (domain) {
                                head.domain = void 0;
                                domain.enter();
                            }
                            runSingle(task, domain);
                        }
                        while (laterQueue.length) {
                            task = laterQueue.pop();
                            runSingle(task);
                        }
                        flushing = false;
                    }
                    function runSingle(task, domain) {
                        try {
                            task();
                        } catch (e) {
                            if (isNodeJS) {
                                if (domain) {
                                    domain.exit();
                                }
                                setTimeout(flush, 0);
                                if (domain) {
                                    domain.enter();
                                }
                                throw e;
                            } else {
                                setTimeout(function() {
                                    throw e;
                                }, 0);
                            }
                        }
                        if (domain) {
                            domain.exit();
                        }
                    }
                    nextTick = function(task) {
                        tail = tail.next = {
                            task: task,
                            domain: isNodeJS && process.domain,
                            next: null
                        };
                        if (!flushing) {
                            flushing = true;
                            requestTick();
                        }
                    };
                    if (typeof process === "object" && process.toString() === "[object process]" && process.nextTick) {
                        isNodeJS = true;
                        requestTick = function() {
                            process.nextTick(flush);
                        };
                    } else if (typeof setImmediate === "function") {
                        if (typeof window !== "undefined") {
                            requestTick = setImmediate.bind(window, flush);
                        } else {
                            requestTick = function() {
                                setImmediate(flush);
                            };
                        }
                    } else if (typeof MessageChannel !== "undefined") {
                        var channel = new MessageChannel();
                        channel.port1.onmessage = function() {
                            requestTick = requestPortTick;
                            channel.port1.onmessage = flush;
                            flush();
                        };
                        var requestPortTick = function() {
                            channel.port2.postMessage(0);
                        };
                        requestTick = function() {
                            setTimeout(flush, 0);
                            requestPortTick();
                        };
                    } else {
                        requestTick = function() {
                            setTimeout(flush, 0);
                        };
                    }
                    nextTick.runAfter = function(task) {
                        laterQueue.push(task);
                        if (!flushing) {
                            flushing = true;
                            requestTick();
                        }
                    };
                    return nextTick;
                }();
                var call = Function.call;
                function uncurryThis(f) {
                    return function() {
                        return call.apply(f, arguments);
                    };
                }
                var array_slice = uncurryThis(Array.prototype.slice);
                var array_reduce = uncurryThis(Array.prototype.reduce || function(callback, basis) {
                    var index = 0, length = this.length;
                    if (arguments.length === 1) {
                        do {
                            if (index in this) {
                                basis = this[index++];
                                break;
                            }
                            if (++index >= length) {
                                throw new TypeError();
                            }
                        } while (1);
                    }
                    for (;index < length; index++) {
                        if (index in this) {
                            basis = callback(basis, this[index], index);
                        }
                    }
                    return basis;
                });
                var array_indexOf = uncurryThis(Array.prototype.indexOf || function(value) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] === value) {
                            return i;
                        }
                    }
                    return -1;
                });
                var array_map = uncurryThis(Array.prototype.map || function(callback, thisp) {
                    var self = this;
                    var collect = [];
                    array_reduce(self, function(undefined, value, index) {
                        collect.push(callback.call(thisp, value, index, self));
                    }, void 0);
                    return collect;
                });
                var object_create = Object.create || function(prototype) {
                    function Type() {}
                    Type.prototype = prototype;
                    return new Type();
                };
                var object_defineProperty = Object.defineProperty || function(obj, prop, descriptor) {
                    obj[prop] = descriptor.value;
                    return obj;
                };
                var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
                var object_keys = Object.keys || function(object) {
                    var keys = [];
                    for (var key in object) {
                        if (object_hasOwnProperty(object, key)) {
                            keys.push(key);
                        }
                    }
                    return keys;
                };
                var object_toString = uncurryThis(Object.prototype.toString);
                function isObject(value) {
                    return value === Object(value);
                }
                function isStopIteration(exception) {
                    return object_toString(exception) === "[object StopIteration]" || exception instanceof QReturnValue;
                }
                var QReturnValue;
                if (typeof ReturnValue !== "undefined") {
                    QReturnValue = ReturnValue;
                } else {
                    QReturnValue = function(value) {
                        this.value = value;
                    };
                }
                var STACK_JUMP_SEPARATOR = "From previous event:";
                function makeStackTraceLong(error, promise) {
                    if (hasStacks && promise.stack && typeof error === "object" && error !== null && error.stack) {
                        var stacks = [];
                        for (var p = promise; !!p; p = p.source) {
                            if (p.stack && (!error.__minimumStackCounter__ || error.__minimumStackCounter__ > p.stackCounter)) {
                                object_defineProperty(error, "__minimumStackCounter__", {
                                    value: p.stackCounter,
                                    configurable: true
                                });
                                stacks.unshift(p.stack);
                            }
                        }
                        stacks.unshift(error.stack);
                        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
                        var stack = filterStackString(concatedStacks);
                        object_defineProperty(error, "stack", {
                            value: stack,
                            configurable: true
                        });
                    }
                }
                function filterStackString(stackString) {
                    var lines = stackString.split("\n");
                    var desiredLines = [];
                    for (var i = 0; i < lines.length; ++i) {
                        var line = lines[i];
                        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
                            desiredLines.push(line);
                        }
                    }
                    return desiredLines.join("\n");
                }
                function isNodeFrame(stackLine) {
                    return stackLine.indexOf("(module.js:") !== -1 || stackLine.indexOf("(node.js:") !== -1;
                }
                function getFileNameAndLineNumber(stackLine) {
                    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
                    if (attempt1) {
                        return [ attempt1[1], Number(attempt1[2]) ];
                    }
                    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
                    if (attempt2) {
                        return [ attempt2[1], Number(attempt2[2]) ];
                    }
                    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
                    if (attempt3) {
                        return [ attempt3[1], Number(attempt3[2]) ];
                    }
                }
                function isInternalFrame(stackLine) {
                    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
                    if (!fileNameAndLineNumber) {
                        return false;
                    }
                    var fileName = fileNameAndLineNumber[0];
                    var lineNumber = fileNameAndLineNumber[1];
                    return fileName === qFileName && lineNumber >= qStartingLine && lineNumber <= qEndingLine;
                }
                function captureLine() {
                    if (!hasStacks) {
                        return;
                    }
                    try {
                        throw new Error();
                    } catch (e) {
                        var lines = e.stack.split("\n");
                        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
                        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
                        if (!fileNameAndLineNumber) {
                            return;
                        }
                        qFileName = fileNameAndLineNumber[0];
                        return fileNameAndLineNumber[1];
                    }
                }
                function deprecate(callback, name, alternative) {
                    return function() {
                        if (typeof console !== "undefined" && typeof console.warn === "function") {
                            console.warn(name + " is deprecated, use " + alternative + " instead.", new Error("").stack);
                        }
                        return callback.apply(callback, arguments);
                    };
                }
                function Q(value) {
                    if (value instanceof Promise) {
                        return value;
                    }
                    if (isPromiseAlike(value)) {
                        return coerce(value);
                    } else {
                        return fulfill(value);
                    }
                }
                Q.resolve = Q;
                Q.nextTick = nextTick;
                Q.longStackSupport = false;
                var longStackCounter = 1;
                if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
                    Q.longStackSupport = true;
                }
                Q.defer = defer;
                function defer() {
                    var messages = [], progressListeners = [], resolvedPromise;
                    var deferred = object_create(defer.prototype);
                    var promise = object_create(Promise.prototype);
                    promise.promiseDispatch = function(resolve, op, operands) {
                        var args = array_slice(arguments);
                        if (messages) {
                            messages.push(args);
                            if (op === "when" && operands[1]) {
                                progressListeners.push(operands[1]);
                            }
                        } else {
                            Q.nextTick(function() {
                                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
                            });
                        }
                    };
                    promise.valueOf = function() {
                        if (messages) {
                            return promise;
                        }
                        var nearerValue = nearer(resolvedPromise);
                        if (isPromise(nearerValue)) {
                            resolvedPromise = nearerValue;
                        }
                        return nearerValue;
                    };
                    promise.inspect = function() {
                        if (!resolvedPromise) {
                            return {
                                state: "pending"
                            };
                        }
                        return resolvedPromise.inspect();
                    };
                    if (Q.longStackSupport && hasStacks) {
                        try {
                            throw new Error();
                        } catch (e) {
                            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
                            promise.stackCounter = longStackCounter++;
                        }
                    }
                    function become(newPromise) {
                        resolvedPromise = newPromise;
                        if (Q.longStackSupport && hasStacks) {
                            promise.source = newPromise;
                        }
                        array_reduce(messages, function(undefined, message) {
                            Q.nextTick(function() {
                                newPromise.promiseDispatch.apply(newPromise, message);
                            });
                        }, void 0);
                        messages = void 0;
                        progressListeners = void 0;
                    }
                    deferred.promise = promise;
                    deferred.resolve = function(value) {
                        if (resolvedPromise) {
                            return;
                        }
                        become(Q(value));
                    };
                    deferred.fulfill = function(value) {
                        if (resolvedPromise) {
                            return;
                        }
                        become(fulfill(value));
                    };
                    deferred.reject = function(reason) {
                        if (resolvedPromise) {
                            return;
                        }
                        become(reject(reason));
                    };
                    deferred.notify = function(progress) {
                        if (resolvedPromise) {
                            return;
                        }
                        array_reduce(progressListeners, function(undefined, progressListener) {
                            Q.nextTick(function() {
                                progressListener(progress);
                            });
                        }, void 0);
                    };
                    return deferred;
                }
                defer.prototype.makeNodeResolver = function() {
                    var self = this;
                    return function(error, value) {
                        if (error) {
                            self.reject(error);
                        } else if (arguments.length > 2) {
                            self.resolve(array_slice(arguments, 1));
                        } else {
                            self.resolve(value);
                        }
                    };
                };
                Q.Promise = promise;
                Q.promise = promise;
                function promise(resolver) {
                    if (typeof resolver !== "function") {
                        throw new TypeError("resolver must be a function.");
                    }
                    var deferred = defer();
                    try {
                        resolver(deferred.resolve, deferred.reject, deferred.notify);
                    } catch (reason) {
                        deferred.reject(reason);
                    }
                    return deferred.promise;
                }
                promise.race = race;
                promise.all = all;
                promise.reject = reject;
                promise.resolve = Q;
                Q.passByCopy = function(object) {
                    return object;
                };
                Promise.prototype.passByCopy = function() {
                    return this;
                };
                Q.join = function(x, y) {
                    return Q(x).join(y);
                };
                Promise.prototype.join = function(that) {
                    return Q([ this, that ]).spread(function(x, y) {
                        if (x === y) {
                            return x;
                        } else {
                            throw new Error("Q can't join: not the same: " + x + " " + y);
                        }
                    });
                };
                Q.race = race;
                function race(answerPs) {
                    return promise(function(resolve, reject) {
                        for (var i = 0, len = answerPs.length; i < len; i++) {
                            Q(answerPs[i]).then(resolve, reject);
                        }
                    });
                }
                Promise.prototype.race = function() {
                    return this.then(Q.race);
                };
                Q.makePromise = Promise;
                function Promise(descriptor, fallback, inspect) {
                    if (fallback === void 0) {
                        fallback = function(op) {
                            return reject(new Error("Promise does not support operation: " + op));
                        };
                    }
                    if (inspect === void 0) {
                        inspect = function() {
                            return {
                                state: "unknown"
                            };
                        };
                    }
                    var promise = object_create(Promise.prototype);
                    promise.promiseDispatch = function(resolve, op, args) {
                        var result;
                        try {
                            if (descriptor[op]) {
                                result = descriptor[op].apply(promise, args);
                            } else {
                                result = fallback.call(promise, op, args);
                            }
                        } catch (exception) {
                            result = reject(exception);
                        }
                        if (resolve) {
                            resolve(result);
                        }
                    };
                    promise.inspect = inspect;
                    if (inspect) {
                        var inspected = inspect();
                        if (inspected.state === "rejected") {
                            promise.exception = inspected.reason;
                        }
                        promise.valueOf = function() {
                            var inspected = inspect();
                            if (inspected.state === "pending" || inspected.state === "rejected") {
                                return promise;
                            }
                            return inspected.value;
                        };
                    }
                    return promise;
                }
                Promise.prototype.toString = function() {
                    return "[object Promise]";
                };
                Promise.prototype.then = function(fulfilled, rejected, progressed) {
                    var self = this;
                    var deferred = defer();
                    var done = false;
                    function _fulfilled(value) {
                        try {
                            return typeof fulfilled === "function" ? fulfilled(value) : value;
                        } catch (exception) {
                            return reject(exception);
                        }
                    }
                    function _rejected(exception) {
                        if (typeof rejected === "function") {
                            makeStackTraceLong(exception, self);
                            try {
                                return rejected(exception);
                            } catch (newException) {
                                return reject(newException);
                            }
                        }
                        return reject(exception);
                    }
                    function _progressed(value) {
                        return typeof progressed === "function" ? progressed(value) : value;
                    }
                    Q.nextTick(function() {
                        self.promiseDispatch(function(value) {
                            if (done) {
                                return;
                            }
                            done = true;
                            deferred.resolve(_fulfilled(value));
                        }, "when", [ function(exception) {
                            if (done) {
                                return;
                            }
                            done = true;
                            deferred.resolve(_rejected(exception));
                        } ]);
                    });
                    self.promiseDispatch(void 0, "when", [ void 0, function(value) {
                        var newValue;
                        var threw = false;
                        try {
                            newValue = _progressed(value);
                        } catch (e) {
                            threw = true;
                            if (Q.onerror) {
                                Q.onerror(e);
                            } else {
                                throw e;
                            }
                        }
                        if (!threw) {
                            deferred.notify(newValue);
                        }
                    } ]);
                    return deferred.promise;
                };
                Q.tap = function(promise, callback) {
                    return Q(promise).tap(callback);
                };
                Promise.prototype.tap = function(callback) {
                    callback = Q(callback);
                    return this.then(function(value) {
                        return callback.fcall(value).thenResolve(value);
                    });
                };
                Q.when = when;
                function when(value, fulfilled, rejected, progressed) {
                    return Q(value).then(fulfilled, rejected, progressed);
                }
                Promise.prototype.thenResolve = function(value) {
                    return this.then(function() {
                        return value;
                    });
                };
                Q.thenResolve = function(promise, value) {
                    return Q(promise).thenResolve(value);
                };
                Promise.prototype.thenReject = function(reason) {
                    return this.then(function() {
                        throw reason;
                    });
                };
                Q.thenReject = function(promise, reason) {
                    return Q(promise).thenReject(reason);
                };
                Q.nearer = nearer;
                function nearer(value) {
                    if (isPromise(value)) {
                        var inspected = value.inspect();
                        if (inspected.state === "fulfilled") {
                            return inspected.value;
                        }
                    }
                    return value;
                }
                Q.isPromise = isPromise;
                function isPromise(object) {
                    return object instanceof Promise;
                }
                Q.isPromiseAlike = isPromiseAlike;
                function isPromiseAlike(object) {
                    return isObject(object) && typeof object.then === "function";
                }
                Q.isPending = isPending;
                function isPending(object) {
                    return isPromise(object) && object.inspect().state === "pending";
                }
                Promise.prototype.isPending = function() {
                    return this.inspect().state === "pending";
                };
                Q.isFulfilled = isFulfilled;
                function isFulfilled(object) {
                    return !isPromise(object) || object.inspect().state === "fulfilled";
                }
                Promise.prototype.isFulfilled = function() {
                    return this.inspect().state === "fulfilled";
                };
                Q.isRejected = isRejected;
                function isRejected(object) {
                    return isPromise(object) && object.inspect().state === "rejected";
                }
                Promise.prototype.isRejected = function() {
                    return this.inspect().state === "rejected";
                };
                var unhandledReasons = [];
                var unhandledRejections = [];
                var reportedUnhandledRejections = [];
                var trackUnhandledRejections = true;
                function resetUnhandledRejections() {
                    unhandledReasons.length = 0;
                    unhandledRejections.length = 0;
                    if (!trackUnhandledRejections) {
                        trackUnhandledRejections = true;
                    }
                }
                function trackRejection(promise, reason) {
                    if (!trackUnhandledRejections) {
                        return;
                    }
                    if (typeof process === "object" && typeof process.emit === "function") {
                        Q.nextTick.runAfter(function() {
                            if (array_indexOf(unhandledRejections, promise) !== -1) {
                                process.emit("unhandledRejection", reason, promise);
                                reportedUnhandledRejections.push(promise);
                            }
                        });
                    }
                    unhandledRejections.push(promise);
                    if (reason && typeof reason.stack !== "undefined") {
                        unhandledReasons.push(reason.stack);
                    } else {
                        unhandledReasons.push("(no stack) " + reason);
                    }
                }
                function untrackRejection(promise) {
                    if (!trackUnhandledRejections) {
                        return;
                    }
                    var at = array_indexOf(unhandledRejections, promise);
                    if (at !== -1) {
                        if (typeof process === "object" && typeof process.emit === "function") {
                            Q.nextTick.runAfter(function() {
                                var atReport = array_indexOf(reportedUnhandledRejections, promise);
                                if (atReport !== -1) {
                                    process.emit("rejectionHandled", unhandledReasons[at], promise);
                                    reportedUnhandledRejections.splice(atReport, 1);
                                }
                            });
                        }
                        unhandledRejections.splice(at, 1);
                        unhandledReasons.splice(at, 1);
                    }
                }
                Q.resetUnhandledRejections = resetUnhandledRejections;
                Q.getUnhandledReasons = function() {
                    return unhandledReasons.slice();
                };
                Q.stopUnhandledRejectionTracking = function() {
                    resetUnhandledRejections();
                    trackUnhandledRejections = false;
                };
                resetUnhandledRejections();
                Q.reject = reject;
                function reject(reason) {
                    var rejection = Promise({
                        when: function(rejected) {
                            if (rejected) {
                                untrackRejection(this);
                            }
                            return rejected ? rejected(reason) : this;
                        }
                    }, function fallback() {
                        return this;
                    }, function inspect() {
                        return {
                            state: "rejected",
                            reason: reason
                        };
                    });
                    trackRejection(rejection, reason);
                    return rejection;
                }
                Q.fulfill = fulfill;
                function fulfill(value) {
                    return Promise({
                        when: function() {
                            return value;
                        },
                        get: function(name) {
                            return value[name];
                        },
                        set: function(name, rhs) {
                            value[name] = rhs;
                        },
                        delete: function(name) {
                            delete value[name];
                        },
                        post: function(name, args) {
                            if (name === null || name === void 0) {
                                return value.apply(void 0, args);
                            } else {
                                return value[name].apply(value, args);
                            }
                        },
                        apply: function(thisp, args) {
                            return value.apply(thisp, args);
                        },
                        keys: function() {
                            return object_keys(value);
                        }
                    }, void 0, function inspect() {
                        return {
                            state: "fulfilled",
                            value: value
                        };
                    });
                }
                function coerce(promise) {
                    var deferred = defer();
                    Q.nextTick(function() {
                        try {
                            promise.then(deferred.resolve, deferred.reject, deferred.notify);
                        } catch (exception) {
                            deferred.reject(exception);
                        }
                    });
                    return deferred.promise;
                }
                Q.master = master;
                function master(object) {
                    return Promise({
                        isDef: function() {}
                    }, function fallback(op, args) {
                        return dispatch(object, op, args);
                    }, function() {
                        return Q(object).inspect();
                    });
                }
                Q.spread = spread;
                function spread(value, fulfilled, rejected) {
                    return Q(value).spread(fulfilled, rejected);
                }
                Promise.prototype.spread = function(fulfilled, rejected) {
                    return this.all().then(function(array) {
                        return fulfilled.apply(void 0, array);
                    }, rejected);
                };
                Q.async = async;
                function async(makeGenerator) {
                    return function() {
                        function continuer(verb, arg) {
                            var result;
                            if (typeof StopIteration === "undefined") {
                                try {
                                    result = generator[verb](arg);
                                } catch (exception) {
                                    return reject(exception);
                                }
                                if (result.done) {
                                    return Q(result.value);
                                } else {
                                    return when(result.value, callback, errback);
                                }
                            } else {
                                try {
                                    result = generator[verb](arg);
                                } catch (exception) {
                                    if (isStopIteration(exception)) {
                                        return Q(exception.value);
                                    } else {
                                        return reject(exception);
                                    }
                                }
                                return when(result, callback, errback);
                            }
                        }
                        var generator = makeGenerator.apply(this, arguments);
                        var callback = continuer.bind(continuer, "next");
                        var errback = continuer.bind(continuer, "throw");
                        return callback();
                    };
                }
                Q.spawn = spawn;
                function spawn(makeGenerator) {
                    Q.done(Q.async(makeGenerator)());
                }
                Q["return"] = _return;
                function _return(value) {
                    throw new QReturnValue(value);
                }
                Q.promised = promised;
                function promised(callback) {
                    return function() {
                        return spread([ this, all(arguments) ], function(self, args) {
                            return callback.apply(self, args);
                        });
                    };
                }
                Q.dispatch = dispatch;
                function dispatch(object, op, args) {
                    return Q(object).dispatch(op, args);
                }
                Promise.prototype.dispatch = function(op, args) {
                    var self = this;
                    var deferred = defer();
                    Q.nextTick(function() {
                        self.promiseDispatch(deferred.resolve, op, args);
                    });
                    return deferred.promise;
                };
                Q.get = function(object, key) {
                    return Q(object).dispatch("get", [ key ]);
                };
                Promise.prototype.get = function(key) {
                    return this.dispatch("get", [ key ]);
                };
                Q.set = function(object, key, value) {
                    return Q(object).dispatch("set", [ key, value ]);
                };
                Promise.prototype.set = function(key, value) {
                    return this.dispatch("set", [ key, value ]);
                };
                Q.del = Q["delete"] = function(object, key) {
                    return Q(object).dispatch("delete", [ key ]);
                };
                Promise.prototype.del = Promise.prototype["delete"] = function(key) {
                    return this.dispatch("delete", [ key ]);
                };
                Q.mapply = Q.post = function(object, name, args) {
                    return Q(object).dispatch("post", [ name, args ]);
                };
                Promise.prototype.mapply = Promise.prototype.post = function(name, args) {
                    return this.dispatch("post", [ name, args ]);
                };
                Q.send = Q.mcall = Q.invoke = function(object, name) {
                    return Q(object).dispatch("post", [ name, array_slice(arguments, 2) ]);
                };
                Promise.prototype.send = Promise.prototype.mcall = Promise.prototype.invoke = function(name) {
                    return this.dispatch("post", [ name, array_slice(arguments, 1) ]);
                };
                Q.fapply = function(object, args) {
                    return Q(object).dispatch("apply", [ void 0, args ]);
                };
                Promise.prototype.fapply = function(args) {
                    return this.dispatch("apply", [ void 0, args ]);
                };
                Q["try"] = Q.fcall = function(object) {
                    return Q(object).dispatch("apply", [ void 0, array_slice(arguments, 1) ]);
                };
                Promise.prototype.fcall = function() {
                    return this.dispatch("apply", [ void 0, array_slice(arguments) ]);
                };
                Q.fbind = function(object) {
                    var promise = Q(object);
                    var args = array_slice(arguments, 1);
                    return function fbound() {
                        return promise.dispatch("apply", [ this, args.concat(array_slice(arguments)) ]);
                    };
                };
                Promise.prototype.fbind = function() {
                    var promise = this;
                    var args = array_slice(arguments);
                    return function fbound() {
                        return promise.dispatch("apply", [ this, args.concat(array_slice(arguments)) ]);
                    };
                };
                Q.keys = function(object) {
                    return Q(object).dispatch("keys", []);
                };
                Promise.prototype.keys = function() {
                    return this.dispatch("keys", []);
                };
                Q.all = all;
                function all(promises) {
                    return when(promises, function(promises) {
                        var pendingCount = 0;
                        var deferred = defer();
                        array_reduce(promises, function(undefined, promise, index) {
                            var snapshot;
                            if (isPromise(promise) && (snapshot = promise.inspect()).state === "fulfilled") {
                                promises[index] = snapshot.value;
                            } else {
                                ++pendingCount;
                                when(promise, function(value) {
                                    promises[index] = value;
                                    if (--pendingCount === 0) {
                                        deferred.resolve(promises);
                                    }
                                }, deferred.reject, function(progress) {
                                    deferred.notify({
                                        index: index,
                                        value: progress
                                    });
                                });
                            }
                        }, void 0);
                        if (pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                        return deferred.promise;
                    });
                }
                Promise.prototype.all = function() {
                    return all(this);
                };
                Q.any = any;
                function any(promises) {
                    if (promises.length === 0) {
                        return Q.resolve();
                    }
                    var deferred = Q.defer();
                    var pendingCount = 0;
                    array_reduce(promises, function(prev, current, index) {
                        var promise = promises[index];
                        pendingCount++;
                        when(promise, onFulfilled, onRejected, onProgress);
                        function onFulfilled(result) {
                            deferred.resolve(result);
                        }
                        function onRejected(err) {
                            pendingCount--;
                            if (pendingCount === 0) {
                                var rejection = err || new Error("" + err);
                                rejection.message = "Q can't get fulfillment value from any promise, all " + "promises were rejected. Last error message: " + rejection.message;
                                deferred.reject(rejection);
                            }
                        }
                        function onProgress(progress) {
                            deferred.notify({
                                index: index,
                                value: progress
                            });
                        }
                    }, undefined);
                    return deferred.promise;
                }
                Promise.prototype.any = function() {
                    return any(this);
                };
                Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
                function allResolved(promises) {
                    return when(promises, function(promises) {
                        promises = array_map(promises, Q);
                        return when(all(array_map(promises, function(promise) {
                            return when(promise, noop, noop);
                        })), function() {
                            return promises;
                        });
                    });
                }
                Promise.prototype.allResolved = function() {
                    return allResolved(this);
                };
                Q.allSettled = allSettled;
                function allSettled(promises) {
                    return Q(promises).allSettled();
                }
                Promise.prototype.allSettled = function() {
                    return this.then(function(promises) {
                        return all(array_map(promises, function(promise) {
                            promise = Q(promise);
                            function regardless() {
                                return promise.inspect();
                            }
                            return promise.then(regardless, regardless);
                        }));
                    });
                };
                Q.fail = Q["catch"] = function(object, rejected) {
                    return Q(object).then(void 0, rejected);
                };
                Promise.prototype.fail = Promise.prototype["catch"] = function(rejected) {
                    return this.then(void 0, rejected);
                };
                Q.progress = progress;
                function progress(object, progressed) {
                    return Q(object).then(void 0, void 0, progressed);
                }
                Promise.prototype.progress = function(progressed) {
                    return this.then(void 0, void 0, progressed);
                };
                Q.fin = Q["finally"] = function(object, callback) {
                    return Q(object)["finally"](callback);
                };
                Promise.prototype.fin = Promise.prototype["finally"] = function(callback) {
                    if (!callback || typeof callback.apply !== "function") {
                        throw new Error("Q can't apply finally callback");
                    }
                    callback = Q(callback);
                    return this.then(function(value) {
                        return callback.fcall().then(function() {
                            return value;
                        });
                    }, function(reason) {
                        return callback.fcall().then(function() {
                            throw reason;
                        });
                    });
                };
                Q.done = function(object, fulfilled, rejected, progress) {
                    return Q(object).done(fulfilled, rejected, progress);
                };
                Promise.prototype.done = function(fulfilled, rejected, progress) {
                    var onUnhandledError = function(error) {
                        Q.nextTick(function() {
                            makeStackTraceLong(error, promise);
                            if (Q.onerror) {
                                Q.onerror(error);
                            } else {
                                throw error;
                            }
                        });
                    };
                    var promise = fulfilled || rejected || progress ? this.then(fulfilled, rejected, progress) : this;
                    if (typeof process === "object" && process && process.domain) {
                        onUnhandledError = process.domain.bind(onUnhandledError);
                    }
                    promise.then(void 0, onUnhandledError);
                };
                Q.timeout = function(object, ms, error) {
                    return Q(object).timeout(ms, error);
                };
                Promise.prototype.timeout = function(ms, error) {
                    var deferred = defer();
                    var timeoutId = setTimeout(function() {
                        if (!error || "string" === typeof error) {
                            error = new Error(error || "Timed out after " + ms + " ms");
                            error.code = "ETIMEDOUT";
                        }
                        deferred.reject(error);
                    }, ms);
                    this.then(function(value) {
                        clearTimeout(timeoutId);
                        deferred.resolve(value);
                    }, function(exception) {
                        clearTimeout(timeoutId);
                        deferred.reject(exception);
                    }, deferred.notify);
                    return deferred.promise;
                };
                Q.delay = function(object, timeout) {
                    if (timeout === void 0) {
                        timeout = object;
                        object = void 0;
                    }
                    return Q(object).delay(timeout);
                };
                Promise.prototype.delay = function(timeout) {
                    return this.then(function(value) {
                        var deferred = defer();
                        setTimeout(function() {
                            deferred.resolve(value);
                        }, timeout);
                        return deferred.promise;
                    });
                };
                Q.nfapply = function(callback, args) {
                    return Q(callback).nfapply(args);
                };
                Promise.prototype.nfapply = function(args) {
                    var deferred = defer();
                    var nodeArgs = array_slice(args);
                    nodeArgs.push(deferred.makeNodeResolver());
                    this.fapply(nodeArgs).fail(deferred.reject);
                    return deferred.promise;
                };
                Q.nfcall = function(callback) {
                    var args = array_slice(arguments, 1);
                    return Q(callback).nfapply(args);
                };
                Promise.prototype.nfcall = function() {
                    var nodeArgs = array_slice(arguments);
                    var deferred = defer();
                    nodeArgs.push(deferred.makeNodeResolver());
                    this.fapply(nodeArgs).fail(deferred.reject);
                    return deferred.promise;
                };
                Q.nfbind = Q.denodeify = function(callback) {
                    if (callback === undefined) {
                        throw new Error("Q can't wrap an undefined function");
                    }
                    var baseArgs = array_slice(arguments, 1);
                    return function() {
                        var nodeArgs = baseArgs.concat(array_slice(arguments));
                        var deferred = defer();
                        nodeArgs.push(deferred.makeNodeResolver());
                        Q(callback).fapply(nodeArgs).fail(deferred.reject);
                        return deferred.promise;
                    };
                };
                Promise.prototype.nfbind = Promise.prototype.denodeify = function() {
                    var args = array_slice(arguments);
                    args.unshift(this);
                    return Q.denodeify.apply(void 0, args);
                };
                Q.nbind = function(callback, thisp) {
                    var baseArgs = array_slice(arguments, 2);
                    return function() {
                        var nodeArgs = baseArgs.concat(array_slice(arguments));
                        var deferred = defer();
                        nodeArgs.push(deferred.makeNodeResolver());
                        function bound() {
                            return callback.apply(thisp, arguments);
                        }
                        Q(bound).fapply(nodeArgs).fail(deferred.reject);
                        return deferred.promise;
                    };
                };
                Promise.prototype.nbind = function() {
                    var args = array_slice(arguments, 0);
                    args.unshift(this);
                    return Q.nbind.apply(void 0, args);
                };
                Q.nmapply = Q.npost = function(object, name, args) {
                    return Q(object).npost(name, args);
                };
                Promise.prototype.nmapply = Promise.prototype.npost = function(name, args) {
                    var nodeArgs = array_slice(args || []);
                    var deferred = defer();
                    nodeArgs.push(deferred.makeNodeResolver());
                    this.dispatch("post", [ name, nodeArgs ]).fail(deferred.reject);
                    return deferred.promise;
                };
                Q.nsend = Q.nmcall = Q.ninvoke = function(object, name) {
                    var nodeArgs = array_slice(arguments, 2);
                    var deferred = defer();
                    nodeArgs.push(deferred.makeNodeResolver());
                    Q(object).dispatch("post", [ name, nodeArgs ]).fail(deferred.reject);
                    return deferred.promise;
                };
                Promise.prototype.nsend = Promise.prototype.nmcall = Promise.prototype.ninvoke = function(name) {
                    var nodeArgs = array_slice(arguments, 1);
                    var deferred = defer();
                    nodeArgs.push(deferred.makeNodeResolver());
                    this.dispatch("post", [ name, nodeArgs ]).fail(deferred.reject);
                    return deferred.promise;
                };
                Q.nodeify = nodeify;
                function nodeify(object, nodeback) {
                    return Q(object).nodeify(nodeback);
                }
                Promise.prototype.nodeify = function(nodeback) {
                    if (nodeback) {
                        this.then(function(value) {
                            Q.nextTick(function() {
                                nodeback(null, value);
                            });
                        }, function(error) {
                            Q.nextTick(function() {
                                nodeback(error);
                            });
                        });
                    } else {
                        return this;
                    }
                };
                Q.noConflict = function() {
                    throw new Error("Q.noConflict only works when Q is used as a global");
                };
                var qEndingLine = captureLine();
                return Q;
            });
        }).call(this, __webpack_require__(6), __webpack_require__(17).setImmediate);
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        var _utils = __webpack_require__(1);
        var _utils2 = _interopRequireDefault(_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var _state = void 0;
        var KidaptiveSdkState = function() {
            function KidaptiveSdkState() {
                _classCallCheck(this, KidaptiveSdkState);
                _state = {};
            }
            _createClass(KidaptiveSdkState, [ {
                key: "get",
                value: function get(property) {
                    return _utils2.default.copyObject(_state[property]);
                }
            }, {
                key: "set",
                value: function set(property, value) {
                    _state[property] = _utils2.default.copyObject(value);
                }
            }, {
                key: "clear",
                value: function clear() {
                    _state = {};
                }
            } ]);
            return KidaptiveSdkState;
        }();
        exports.default = new KidaptiveSdkState();
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var KidaptiveSdkError = function KidaptiveSdkError(type, message) {
            _classCallCheck(this, KidaptiveSdkError);
            return new Error("KidaptiveError (" + type + ") " + message);
        };
        KidaptiveSdkError.ERROR_CODES = {
            GENERIC_ERROR: "GENERIC_ERROR",
            INVALID_PARAMETER: "INVALID_PARAMETER",
            ILLEGAL_STATE: "ILLEGAL_STATE",
            API_KEY_ERROR: "API_KEY_ERROR",
            WEB_API_ERROR: "WEB_API_ERROR"
        };
        exports.default = KidaptiveSdkError;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = {
            DEFAULT: {
                AUTO_FLUSH_INTERVAL: 6e4,
                LOGGING_LEVEL: "all",
                TIER: 1
            },
            ENDPOINT: {
                INGESTION: "/ingestion"
            },
            HOST: {
                PROD: "https://service.kidaptive.com/v3",
                DEV: "https://develop.kidaptive.com/v3"
            },
            USER_ENDPOINTS: [ "INGESTION" ]
        };
    }, function(module, exports) {
        var process = module.exports = {};
        var cachedSetTimeout;
        var cachedClearTimeout;
        function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
        }
        (function() {
            try {
                if (typeof setTimeout === "function") {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === "function") {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        })();
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                return setTimeout(fun, 0);
            }
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                return clearTimeout(marker);
            }
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;
        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }
        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;
            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        };
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = "";
        process.versions = {};
        function noop() {}
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;
        process.listeners = function(name) {
            return [];
        };
        process.binding = function(name) {
            throw new Error("process.binding is not supported");
        };
        process.cwd = function() {
            return "/";
        };
        process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        };
        process.umask = function() {
            return 0;
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        var _utils = __webpack_require__(1);
        var _utils2 = _interopRequireDefault(_utils);
        var _q = __webpack_require__(2);
        var _q2 = _interopRequireDefault(_q);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var KidaptiveSdkOperationManager = function() {
            function KidaptiveSdkOperationManager() {
                _classCallCheck(this, KidaptiveSdkOperationManager);
                this.operationQueue = (0, _q2.default)(true);
            }
            _createClass(KidaptiveSdkOperationManager, [ {
                key: "addToQueue",
                value: function addToQueue(action) {
                    var actionPromise = this.operationQueue.then(action);
                    this.operationQueue = actionPromise.then(function() {}, function(error) {
                        if (_utils2.default.checkLoggingLevel("all") && console && console.error) {
                            console.error(error);
                        }
                    });
                    return actionPromise;
                }
            } ]);
            return KidaptiveSdkOperationManager;
        }();
        exports.default = new KidaptiveSdkOperationManager();
    }, function(module, exports) {
        function isObject(obj) {
            return null != obj && "object" == typeof obj;
        }
        module.exports = isObject;
    }, function(module, exports) {
        module.exports = function(module) {
            if (!module.webpackPolyfill) {
                module.deprecate = function() {};
                module.paths = [];
                if (!module.children) module.children = [];
                Object.defineProperty(module, "loaded", {
                    enumerable: true,
                    get: function() {
                        return module.l;
                    }
                });
                Object.defineProperty(module, "id", {
                    enumerable: true,
                    get: function() {
                        return module.i;
                    }
                });
                module.webpackPolyfill = 1;
            }
            return module;
        };
    }, function(module, exports) {
        function request(RequestConstructor, method, url) {
            if ("function" == typeof url) {
                return new RequestConstructor("GET", method).end(url);
            }
            if (2 == arguments.length) {
                return new RequestConstructor("GET", method);
            }
            return new RequestConstructor(method, url);
        }
        module.exports = request;
    }, function(module, exports, __webpack_require__) {
        var isObject = __webpack_require__(8);
        exports.clearTimeout = function _clearTimeout() {
            this._timeout = 0;
            clearTimeout(this._timer);
            return this;
        };
        exports.parse = function parse(fn) {
            this._parser = fn;
            return this;
        };
        exports.timeout = function timeout(ms) {
            this._timeout = ms;
            return this;
        };
        exports.then = function then(fulfill, reject) {
            return this.end(function(err, res) {
                err ? reject(err) : fulfill(res);
            });
        };
        exports.use = function use(fn) {
            fn(this);
            return this;
        };
        exports.get = function(field) {
            return this._header[field.toLowerCase()];
        };
        exports.getHeader = exports.get;
        exports.set = function(field, val) {
            if (isObject(field)) {
                for (var key in field) {
                    this.set(key, field[key]);
                }
                return this;
            }
            this._header[field.toLowerCase()] = val;
            this.header[field] = val;
            return this;
        };
        exports.unset = function(field) {
            delete this._header[field.toLowerCase()];
            delete this.header[field];
            return this;
        };
        exports.field = function(name, val) {
            this._getFormData().append(name, val);
            return this;
        };
    }, function(module, exports) {
        module.exports = function(arr, fn, initial) {
            var idx = 0;
            var len = arr.length;
            var curr = arguments.length == 3 ? initial : arr[idx++];
            while (idx < len) {
                curr = fn.call(null, curr, arr[idx], ++idx, arr);
            }
            return curr;
        };
    }, function(module, exports, __webpack_require__) {
        if (true) {
            module.exports = Emitter;
        }
        function Emitter(obj) {
            if (obj) return mixin(obj);
        }
        function mixin(obj) {
            for (var key in Emitter.prototype) {
                obj[key] = Emitter.prototype[key];
            }
            return obj;
        }
        Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
            this._callbacks = this._callbacks || {};
            (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
            return this;
        };
        Emitter.prototype.once = function(event, fn) {
            function on() {
                this.off(event, on);
                fn.apply(this, arguments);
            }
            on.fn = fn;
            this.on(event, on);
            return this;
        };
        Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
            this._callbacks = this._callbacks || {};
            if (0 == arguments.length) {
                this._callbacks = {};
                return this;
            }
            var callbacks = this._callbacks["$" + event];
            if (!callbacks) return this;
            if (1 == arguments.length) {
                delete this._callbacks["$" + event];
                return this;
            }
            var cb;
            for (var i = 0; i < callbacks.length; i++) {
                cb = callbacks[i];
                if (cb === fn || cb.fn === fn) {
                    callbacks.splice(i, 1);
                    break;
                }
            }
            return this;
        };
        Emitter.prototype.emit = function(event) {
            this._callbacks = this._callbacks || {};
            var args = [].slice.call(arguments, 1), callbacks = this._callbacks["$" + event];
            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) {
                    callbacks[i].apply(this, args);
                }
            }
            return this;
        };
        Emitter.prototype.listeners = function(event) {
            this._callbacks = this._callbacks || {};
            return this._callbacks["$" + event] || [];
        };
        Emitter.prototype.hasListeners = function(event) {
            return !!this.listeners(event).length;
        };
    }, function(module, exports, __webpack_require__) {
        var Emitter = __webpack_require__(13);
        var reduce = __webpack_require__(12);
        var requestBase = __webpack_require__(11);
        var isObject = __webpack_require__(8);
        var root;
        if (typeof window !== "undefined") {
            root = window;
        } else if (typeof self !== "undefined") {
            root = self;
        } else {
            root = this;
        }
        function noop() {}
        function isHost(obj) {
            var str = {}.toString.call(obj);
            switch (str) {
              case "[object File]":
              case "[object Blob]":
              case "[object FormData]":
                return true;

              default:
                return false;
            }
        }
        var request = module.exports = __webpack_require__(10).bind(null, Request);
        request.getXHR = function() {
            if (root.XMLHttpRequest && (!root.location || "file:" != root.location.protocol || !root.ActiveXObject)) {
                return new XMLHttpRequest();
            } else {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                } catch (e) {}
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                } catch (e) {}
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {}
            }
            return false;
        };
        var trim = "".trim ? function(s) {
            return s.trim();
        } : function(s) {
            return s.replace(/(^\s*|\s*$)/g, "");
        };
        function serialize(obj) {
            if (!isObject(obj)) return obj;
            var pairs = [];
            for (var key in obj) {
                if (null != obj[key]) {
                    pushEncodedKeyValuePair(pairs, key, obj[key]);
                }
            }
            return pairs.join("&");
        }
        function pushEncodedKeyValuePair(pairs, key, val) {
            if (Array.isArray(val)) {
                return val.forEach(function(v) {
                    pushEncodedKeyValuePair(pairs, key, v);
                });
            }
            pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
        }
        request.serializeObject = serialize;
        function parseString(str) {
            var obj = {};
            var pairs = str.split("&");
            var parts;
            var pair;
            for (var i = 0, len = pairs.length; i < len; ++i) {
                pair = pairs[i];
                parts = pair.split("=");
                obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            }
            return obj;
        }
        request.parseString = parseString;
        request.types = {
            html: "text/html",
            json: "application/json",
            xml: "application/xml",
            urlencoded: "application/x-www-form-urlencoded",
            form: "application/x-www-form-urlencoded",
            "form-data": "application/x-www-form-urlencoded"
        };
        request.serialize = {
            "application/x-www-form-urlencoded": serialize,
            "application/json": JSON.stringify
        };
        request.parse = {
            "application/x-www-form-urlencoded": parseString,
            "application/json": JSON.parse
        };
        function parseHeader(str) {
            var lines = str.split(/\r?\n/);
            var fields = {};
            var index;
            var line;
            var field;
            var val;
            lines.pop();
            for (var i = 0, len = lines.length; i < len; ++i) {
                line = lines[i];
                index = line.indexOf(":");
                field = line.slice(0, index).toLowerCase();
                val = trim(line.slice(index + 1));
                fields[field] = val;
            }
            return fields;
        }
        function isJSON(mime) {
            return /[\/+]json\b/.test(mime);
        }
        function type(str) {
            return str.split(/ *; */).shift();
        }
        function params(str) {
            return reduce(str.split(/ *; */), function(obj, str) {
                var parts = str.split(/ *= */), key = parts.shift(), val = parts.shift();
                if (key && val) obj[key] = val;
                return obj;
            }, {});
        }
        function Response(req, options) {
            options = options || {};
            this.req = req;
            this.xhr = this.req.xhr;
            this.text = this.req.method != "HEAD" && (this.xhr.responseType === "" || this.xhr.responseType === "text") || typeof this.xhr.responseType === "undefined" ? this.xhr.responseText : null;
            this.statusText = this.req.xhr.statusText;
            this.setStatusProperties(this.xhr.status);
            this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
            this.header["content-type"] = this.xhr.getResponseHeader("content-type");
            this.setHeaderProperties(this.header);
            this.body = this.req.method != "HEAD" ? this.parseBody(this.text ? this.text : this.xhr.response) : null;
        }
        Response.prototype.get = function(field) {
            return this.header[field.toLowerCase()];
        };
        Response.prototype.setHeaderProperties = function(header) {
            var ct = this.header["content-type"] || "";
            this.type = type(ct);
            var obj = params(ct);
            for (var key in obj) this[key] = obj[key];
        };
        Response.prototype.parseBody = function(str) {
            var parse = request.parse[this.type];
            if (!parse && isJSON(this.type)) {
                parse = request.parse["application/json"];
            }
            return parse && str && (str.length || str instanceof Object) ? parse(str) : null;
        };
        Response.prototype.setStatusProperties = function(status) {
            if (status === 1223) {
                status = 204;
            }
            var type = status / 100 | 0;
            this.status = this.statusCode = status;
            this.statusType = type;
            this.info = 1 == type;
            this.ok = 2 == type;
            this.clientError = 4 == type;
            this.serverError = 5 == type;
            this.error = 4 == type || 5 == type ? this.toError() : false;
            this.accepted = 202 == status;
            this.noContent = 204 == status;
            this.badRequest = 400 == status;
            this.unauthorized = 401 == status;
            this.notAcceptable = 406 == status;
            this.notFound = 404 == status;
            this.forbidden = 403 == status;
        };
        Response.prototype.toError = function() {
            var req = this.req;
            var method = req.method;
            var url = req.url;
            var msg = "cannot " + method + " " + url + " (" + this.status + ")";
            var err = new Error(msg);
            err.status = this.status;
            err.method = method;
            err.url = url;
            return err;
        };
        request.Response = Response;
        function Request(method, url) {
            var self = this;
            this._query = this._query || [];
            this.method = method;
            this.url = url;
            this.header = {};
            this._header = {};
            this.on("end", function() {
                var err = null;
                var res = null;
                try {
                    res = new Response(self);
                } catch (e) {
                    err = new Error("Parser is unable to parse the response");
                    err.parse = true;
                    err.original = e;
                    err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
                    err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
                    return self.callback(err);
                }
                self.emit("response", res);
                if (err) {
                    return self.callback(err, res);
                }
                if (res.status >= 200 && res.status < 300) {
                    return self.callback(err, res);
                }
                var new_err = new Error(res.statusText || "Unsuccessful HTTP response");
                new_err.original = err;
                new_err.response = res;
                new_err.status = res.status;
                self.callback(new_err, res);
            });
        }
        Emitter(Request.prototype);
        for (var key in requestBase) {
            Request.prototype[key] = requestBase[key];
        }
        Request.prototype.abort = function() {
            if (this.aborted) return;
            this.aborted = true;
            this.xhr.abort();
            this.clearTimeout();
            this.emit("abort");
            return this;
        };
        Request.prototype.type = function(type) {
            this.set("Content-Type", request.types[type] || type);
            return this;
        };
        Request.prototype.responseType = function(val) {
            this._responseType = val;
            return this;
        };
        Request.prototype.accept = function(type) {
            this.set("Accept", request.types[type] || type);
            return this;
        };
        Request.prototype.auth = function(user, pass, options) {
            if (!options) {
                options = {
                    type: "basic"
                };
            }
            switch (options.type) {
              case "basic":
                var str = btoa(user + ":" + pass);
                this.set("Authorization", "Basic " + str);
                break;

              case "auto":
                this.username = user;
                this.password = pass;
                break;
            }
            return this;
        };
        Request.prototype.query = function(val) {
            if ("string" != typeof val) val = serialize(val);
            if (val) this._query.push(val);
            return this;
        };
        Request.prototype.attach = function(field, file, filename) {
            this._getFormData().append(field, file, filename || file.name);
            return this;
        };
        Request.prototype._getFormData = function() {
            if (!this._formData) {
                this._formData = new root.FormData();
            }
            return this._formData;
        };
        Request.prototype.send = function(data) {
            var obj = isObject(data);
            var type = this._header["content-type"];
            if (obj && isObject(this._data)) {
                for (var key in data) {
                    this._data[key] = data[key];
                }
            } else if ("string" == typeof data) {
                if (!type) this.type("form");
                type = this._header["content-type"];
                if ("application/x-www-form-urlencoded" == type) {
                    this._data = this._data ? this._data + "&" + data : data;
                } else {
                    this._data = (this._data || "") + data;
                }
            } else {
                this._data = data;
            }
            if (!obj || isHost(data)) return this;
            if (!type) this.type("json");
            return this;
        };
        Response.prototype.parse = function serialize(fn) {
            if (root.console) {
                console.warn("Client-side parse() method has been renamed to serialize(). This method is not compatible with superagent v2.0");
            }
            this.serialize(fn);
            return this;
        };
        Response.prototype.serialize = function serialize(fn) {
            this._parser = fn;
            return this;
        };
        Request.prototype.callback = function(err, res) {
            var fn = this._callback;
            this.clearTimeout();
            fn(err, res);
        };
        Request.prototype.crossDomainError = function() {
            var err = new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");
            err.crossDomain = true;
            err.status = this.status;
            err.method = this.method;
            err.url = this.url;
            this.callback(err);
        };
        Request.prototype.timeoutError = function() {
            var timeout = this._timeout;
            var err = new Error("timeout of " + timeout + "ms exceeded");
            err.timeout = timeout;
            this.callback(err);
        };
        Request.prototype.withCredentials = function() {
            this._withCredentials = true;
            return this;
        };
        Request.prototype.end = function(fn) {
            var self = this;
            var xhr = this.xhr = request.getXHR();
            var query = this._query.join("&");
            var timeout = this._timeout;
            var data = this._formData || this._data;
            this._callback = fn || noop;
            xhr.onreadystatechange = function() {
                if (4 != xhr.readyState) return;
                var status;
                try {
                    status = xhr.status;
                } catch (e) {
                    status = 0;
                }
                if (0 == status) {
                    if (self.timedout) return self.timeoutError();
                    if (self.aborted) return;
                    return self.crossDomainError();
                }
                self.emit("end");
            };
            var handleProgress = function(e) {
                if (e.total > 0) {
                    e.percent = e.loaded / e.total * 100;
                }
                e.direction = "download";
                self.emit("progress", e);
            };
            if (this.hasListeners("progress")) {
                xhr.onprogress = handleProgress;
            }
            try {
                if (xhr.upload && this.hasListeners("progress")) {
                    xhr.upload.onprogress = handleProgress;
                }
            } catch (e) {}
            if (timeout && !this._timer) {
                this._timer = setTimeout(function() {
                    self.timedout = true;
                    self.abort();
                }, timeout);
            }
            if (query) {
                query = request.serializeObject(query);
                this.url += ~this.url.indexOf("?") ? "&" + query : "?" + query;
            }
            if (this.username && this.password) {
                xhr.open(this.method, this.url, true, this.username, this.password);
            } else {
                xhr.open(this.method, this.url, true);
            }
            if (this._withCredentials) xhr.withCredentials = true;
            if ("GET" != this.method && "HEAD" != this.method && "string" != typeof data && !isHost(data)) {
                var contentType = this._header["content-type"];
                var serialize = this._parser || request.serialize[contentType ? contentType.split(";")[0] : ""];
                if (!serialize && isJSON(contentType)) serialize = request.serialize["application/json"];
                if (serialize) data = serialize(data);
            }
            for (var field in this.header) {
                if (null == this.header[field]) continue;
                xhr.setRequestHeader(field, this.header[field]);
            }
            if (this._responseType) {
                xhr.responseType = this._responseType;
            }
            this.emit("request", this);
            xhr.send(typeof data !== "undefined" ? data : null);
            return this;
        };
        request.Request = Request;
        request.get = function(url, data, fn) {
            var req = request("GET", url);
            if ("function" == typeof data) fn = data, data = null;
            if (data) req.query(data);
            if (fn) req.end(fn);
            return req;
        };
        request.head = function(url, data, fn) {
            var req = request("HEAD", url);
            if ("function" == typeof data) fn = data, data = null;
            if (data) req.send(data);
            if (fn) req.end(fn);
            return req;
        };
        function del(url, fn) {
            var req = request("DELETE", url);
            if (fn) req.end(fn);
            return req;
        }
        request["del"] = del;
        request["delete"] = del;
        request.patch = function(url, data, fn) {
            var req = request("PATCH", url);
            if ("function" == typeof data) fn = data, data = null;
            if (data) req.send(data);
            if (fn) req.end(fn);
            return req;
        };
        request.post = function(url, data, fn) {
            var req = request("POST", url);
            if ("function" == typeof data) fn = data, data = null;
            if (data) req.send(data);
            if (fn) req.end(fn);
            return req;
        };
        request.put = function(url, data, fn) {
            var req = request("PUT", url);
            if ("function" == typeof data) fn = data, data = null;
            if (data) req.send(data);
            if (fn) req.end(fn);
            return req;
        };
    }, function(module, exports, __webpack_require__) {
        var Q = __webpack_require__(2);
        var superagent = __webpack_require__(14);
        function wrap(item) {
            return function() {
                var agent = item.apply(superagent, arguments);
                var agentEnd = agent.end;
                agent.end = function() {
                    var doEnd = Q.defer();
                    agent.on("progress", function(e) {
                        doEnd.notify(e);
                    });
                    agentEnd.call(agent, function(err, res) {
                        if (err) return doEnd.reject(err);
                        doEnd.resolve(res);
                    });
                    return doEnd.promise;
                };
                return agent;
            };
        }
        var agentQ = wrap(superagent);
        agentQ.get = wrap(superagent.get);
        agentQ.put = wrap(superagent.put);
        agentQ.post = wrap(superagent.post);
        agentQ.del = wrap(superagent.del);
        agentQ.head = wrap(superagent.head);
        module.exports = agentQ;
    }, function(module, exports, __webpack_require__) {
        (function(global, process) {
            (function(global, undefined) {
                "use strict";
                if (global.setImmediate) {
                    return;
                }
                var nextHandle = 1;
                var tasksByHandle = {};
                var currentlyRunningATask = false;
                var doc = global.document;
                var registerImmediate;
                function setImmediate(callback) {
                    if (typeof callback !== "function") {
                        callback = new Function("" + callback);
                    }
                    var args = new Array(arguments.length - 1);
                    for (var i = 0; i < args.length; i++) {
                        args[i] = arguments[i + 1];
                    }
                    var task = {
                        callback: callback,
                        args: args
                    };
                    tasksByHandle[nextHandle] = task;
                    registerImmediate(nextHandle);
                    return nextHandle++;
                }
                function clearImmediate(handle) {
                    delete tasksByHandle[handle];
                }
                function run(task) {
                    var callback = task.callback;
                    var args = task.args;
                    switch (args.length) {
                      case 0:
                        callback();
                        break;

                      case 1:
                        callback(args[0]);
                        break;

                      case 2:
                        callback(args[0], args[1]);
                        break;

                      case 3:
                        callback(args[0], args[1], args[2]);
                        break;

                      default:
                        callback.apply(undefined, args);
                        break;
                    }
                }
                function runIfPresent(handle) {
                    if (currentlyRunningATask) {
                        setTimeout(runIfPresent, 0, handle);
                    } else {
                        var task = tasksByHandle[handle];
                        if (task) {
                            currentlyRunningATask = true;
                            try {
                                run(task);
                            } finally {
                                clearImmediate(handle);
                                currentlyRunningATask = false;
                            }
                        }
                    }
                }
                function installNextTickImplementation() {
                    registerImmediate = function(handle) {
                        process.nextTick(function() {
                            runIfPresent(handle);
                        });
                    };
                }
                function canUsePostMessage() {
                    if (global.postMessage && !global.importScripts) {
                        var postMessageIsAsynchronous = true;
                        var oldOnMessage = global.onmessage;
                        global.onmessage = function() {
                            postMessageIsAsynchronous = false;
                        };
                        global.postMessage("", "*");
                        global.onmessage = oldOnMessage;
                        return postMessageIsAsynchronous;
                    }
                }
                function installPostMessageImplementation() {
                    var messagePrefix = "setImmediate$" + Math.random() + "$";
                    var onGlobalMessage = function(event) {
                        if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                            runIfPresent(+event.data.slice(messagePrefix.length));
                        }
                    };
                    if (global.addEventListener) {
                        global.addEventListener("message", onGlobalMessage, false);
                    } else {
                        global.attachEvent("onmessage", onGlobalMessage);
                    }
                    registerImmediate = function(handle) {
                        global.postMessage(messagePrefix + handle, "*");
                    };
                }
                function installMessageChannelImplementation() {
                    var channel = new MessageChannel();
                    channel.port1.onmessage = function(event) {
                        var handle = event.data;
                        runIfPresent(handle);
                    };
                    registerImmediate = function(handle) {
                        channel.port2.postMessage(handle);
                    };
                }
                function installReadyStateChangeImplementation() {
                    var html = doc.documentElement;
                    registerImmediate = function(handle) {
                        var script = doc.createElement("script");
                        script.onreadystatechange = function() {
                            runIfPresent(handle);
                            script.onreadystatechange = null;
                            html.removeChild(script);
                            script = null;
                        };
                        html.appendChild(script);
                    };
                }
                function installSetTimeoutImplementation() {
                    registerImmediate = function(handle) {
                        setTimeout(runIfPresent, 0, handle);
                    };
                }
                var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
                attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
                if ({}.toString.call(global.process) === "[object process]") {
                    installNextTickImplementation();
                } else if (canUsePostMessage()) {
                    installPostMessageImplementation();
                } else if (global.MessageChannel) {
                    installMessageChannelImplementation();
                } else if (doc && "onreadystatechange" in doc.createElement("script")) {
                    installReadyStateChangeImplementation();
                } else {
                    installSetTimeoutImplementation();
                }
                attachTo.setImmediate = setImmediate;
                attachTo.clearImmediate = clearImmediate;
            })(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self);
        }).call(this, __webpack_require__(0), __webpack_require__(6));
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            var apply = Function.prototype.apply;
            exports.setTimeout = function() {
                return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
            };
            exports.setInterval = function() {
                return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
            };
            exports.clearTimeout = exports.clearInterval = function(timeout) {
                if (timeout) {
                    timeout.close();
                }
            };
            function Timeout(id, clearFn) {
                this._id = id;
                this._clearFn = clearFn;
            }
            Timeout.prototype.unref = Timeout.prototype.ref = function() {};
            Timeout.prototype.close = function() {
                this._clearFn.call(window, this._id);
            };
            exports.enroll = function(item, msecs) {
                clearTimeout(item._idleTimeoutId);
                item._idleTimeout = msecs;
            };
            exports.unenroll = function(item) {
                clearTimeout(item._idleTimeoutId);
                item._idleTimeout = -1;
            };
            exports._unrefActive = exports.active = function(item) {
                clearTimeout(item._idleTimeoutId);
                var msecs = item._idleTimeout;
                if (msecs >= 0) {
                    item._idleTimeoutId = setTimeout(function onTimeout() {
                        if (item._onTimeout) item._onTimeout();
                    }, msecs);
                }
            };
            __webpack_require__(16);
            exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || this && this.setImmediate;
            exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || this && this.clearImmediate;
        }).call(this, __webpack_require__(0));
    }, function(module, exports) {
        (function(__webpack_amd_options__) {
            module.exports = __webpack_amd_options__;
        }).call(this, {});
    }, function(module, exports, __webpack_require__) {
        (function(process, global) {
            var __WEBPACK_AMD_DEFINE_RESULT__;
            (function() {
                "use strict";
                var ERROR = "input is invalid type";
                var WINDOW = typeof window === "object";
                var root = WINDOW ? window : {};
                if (root.JS_SHA256_NO_WINDOW) {
                    WINDOW = false;
                }
                var WEB_WORKER = !WINDOW && typeof self === "object";
                var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
                if (NODE_JS) {
                    root = global;
                } else if (WEB_WORKER) {
                    root = self;
                }
                var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === "object" && module.exports;
                var AMD = "function" === "function" && __webpack_require__(18);
                var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
                var HEX_CHARS = "0123456789abcdef".split("");
                var EXTRA = [ -2147483648, 8388608, 32768, 128 ];
                var SHIFT = [ 24, 16, 8, 0 ];
                var K = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ];
                var OUTPUT_TYPES = [ "hex", "array", "digest", "arrayBuffer" ];
                var blocks = [];
                if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
                    Array.isArray = function(obj) {
                        return Object.prototype.toString.call(obj) === "[object Array]";
                    };
                }
                if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
                    ArrayBuffer.isView = function(obj) {
                        return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
                    };
                }
                var createOutputMethod = function(outputType, is224) {
                    return function(message) {
                        return new Sha256(is224, true).update(message)[outputType]();
                    };
                };
                var createMethod = function(is224) {
                    var method = createOutputMethod("hex", is224);
                    if (NODE_JS) {
                        method = nodeWrap(method, is224);
                    }
                    method.create = function() {
                        return new Sha256(is224);
                    };
                    method.update = function(message) {
                        return method.create().update(message);
                    };
                    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
                        var type = OUTPUT_TYPES[i];
                        method[type] = createOutputMethod(type, is224);
                    }
                    return method;
                };
                var nodeWrap = function(method, is224) {
                    var crypto = eval("require('crypto')");
                    var Buffer = eval("require('buffer').Buffer");
                    var algorithm = is224 ? "sha224" : "sha256";
                    var nodeMethod = function(message) {
                        if (typeof message === "string") {
                            return crypto.createHash(algorithm).update(message, "utf8").digest("hex");
                        } else {
                            if (message === null || message === undefined) {
                                throw new Error(ERROR);
                            } else if (message.constructor === ArrayBuffer) {
                                message = new Uint8Array(message);
                            }
                        }
                        if (Array.isArray(message) || ArrayBuffer.isView(message) || message.constructor === Buffer) {
                            return crypto.createHash(algorithm).update(new Buffer(message)).digest("hex");
                        } else {
                            return method(message);
                        }
                    };
                    return nodeMethod;
                };
                var createHmacOutputMethod = function(outputType, is224) {
                    return function(key, message) {
                        return new HmacSha256(key, is224, true).update(message)[outputType]();
                    };
                };
                var createHmacMethod = function(is224) {
                    var method = createHmacOutputMethod("hex", is224);
                    method.create = function(key) {
                        return new HmacSha256(key, is224);
                    };
                    method.update = function(key, message) {
                        return method.create(key).update(message);
                    };
                    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
                        var type = OUTPUT_TYPES[i];
                        method[type] = createHmacOutputMethod(type, is224);
                    }
                    return method;
                };
                function Sha256(is224, sharedMemory) {
                    if (sharedMemory) {
                        blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                        this.blocks = blocks;
                    } else {
                        this.blocks = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
                    }
                    if (is224) {
                        this.h0 = 3238371032;
                        this.h1 = 914150663;
                        this.h2 = 812702999;
                        this.h3 = 4144912697;
                        this.h4 = 4290775857;
                        this.h5 = 1750603025;
                        this.h6 = 1694076839;
                        this.h7 = 3204075428;
                    } else {
                        this.h0 = 1779033703;
                        this.h1 = 3144134277;
                        this.h2 = 1013904242;
                        this.h3 = 2773480762;
                        this.h4 = 1359893119;
                        this.h5 = 2600822924;
                        this.h6 = 528734635;
                        this.h7 = 1541459225;
                    }
                    this.block = this.start = this.bytes = this.hBytes = 0;
                    this.finalized = this.hashed = false;
                    this.first = true;
                    this.is224 = is224;
                }
                Sha256.prototype.update = function(message) {
                    if (this.finalized) {
                        return;
                    }
                    var notString, type = typeof message;
                    if (type !== "string") {
                        if (type === "object") {
                            if (message === null) {
                                throw new Error(ERROR);
                            } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                                message = new Uint8Array(message);
                            } else if (!Array.isArray(message)) {
                                if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                                    throw new Error(ERROR);
                                }
                            }
                        } else {
                            throw new Error(ERROR);
                        }
                        notString = true;
                    }
                    var code, index = 0, i, length = message.length, blocks = this.blocks;
                    while (index < length) {
                        if (this.hashed) {
                            this.hashed = false;
                            blocks[0] = this.block;
                            blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                        }
                        if (notString) {
                            for (i = this.start; index < length && i < 64; ++index) {
                                blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                            }
                        } else {
                            for (i = this.start; index < length && i < 64; ++index) {
                                code = message.charCodeAt(index);
                                if (code < 128) {
                                    blocks[i >> 2] |= code << SHIFT[i++ & 3];
                                } else if (code < 2048) {
                                    blocks[i >> 2] |= (192 | code >> 6) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                                } else if (code < 55296 || code >= 57344) {
                                    blocks[i >> 2] |= (224 | code >> 12) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                                } else {
                                    code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                                    blocks[i >> 2] |= (240 | code >> 18) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                                }
                            }
                        }
                        this.lastByteIndex = i;
                        this.bytes += i - this.start;
                        if (i >= 64) {
                            this.block = blocks[16];
                            this.start = i - 64;
                            this.hash();
                            this.hashed = true;
                        } else {
                            this.start = i;
                        }
                    }
                    if (this.bytes > 4294967295) {
                        this.hBytes += this.bytes / 4294967296 << 0;
                        this.bytes = this.bytes % 4294967296;
                    }
                    return this;
                };
                Sha256.prototype.finalize = function() {
                    if (this.finalized) {
                        return;
                    }
                    this.finalized = true;
                    var blocks = this.blocks, i = this.lastByteIndex;
                    blocks[16] = this.block;
                    blocks[i >> 2] |= EXTRA[i & 3];
                    this.block = blocks[16];
                    if (i >= 56) {
                        if (!this.hashed) {
                            this.hash();
                        }
                        blocks[0] = this.block;
                        blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                    }
                    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
                    blocks[15] = this.bytes << 3;
                    this.hash();
                };
                Sha256.prototype.hash = function() {
                    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6, h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;
                    for (j = 16; j < 64; ++j) {
                        t1 = blocks[j - 15];
                        s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
                        t1 = blocks[j - 2];
                        s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
                        blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
                    }
                    bc = b & c;
                    for (j = 0; j < 64; j += 4) {
                        if (this.first) {
                            if (this.is224) {
                                ab = 300032;
                                t1 = blocks[0] - 1413257819;
                                h = t1 - 150054599 << 0;
                                d = t1 + 24177077 << 0;
                            } else {
                                ab = 704751109;
                                t1 = blocks[0] - 210244248;
                                h = t1 - 1521486534 << 0;
                                d = t1 + 143694565 << 0;
                            }
                            this.first = false;
                        } else {
                            s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
                            s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
                            ab = a & b;
                            maj = ab ^ a & c ^ bc;
                            ch = e & f ^ ~e & g;
                            t1 = h + s1 + ch + K[j] + blocks[j];
                            t2 = s0 + maj;
                            h = d + t1 << 0;
                            d = t1 + t2 << 0;
                        }
                        s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
                        s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
                        da = d & a;
                        maj = da ^ d & b ^ ab;
                        ch = h & e ^ ~h & f;
                        t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
                        t2 = s0 + maj;
                        g = c + t1 << 0;
                        c = t1 + t2 << 0;
                        s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
                        s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
                        cd = c & d;
                        maj = cd ^ c & a ^ da;
                        ch = g & h ^ ~g & e;
                        t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
                        t2 = s0 + maj;
                        f = b + t1 << 0;
                        b = t1 + t2 << 0;
                        s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
                        s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
                        bc = b & c;
                        maj = bc ^ b & d ^ cd;
                        ch = f & g ^ ~f & h;
                        t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
                        t2 = s0 + maj;
                        e = a + t1 << 0;
                        a = t1 + t2 << 0;
                    }
                    this.h0 = this.h0 + a << 0;
                    this.h1 = this.h1 + b << 0;
                    this.h2 = this.h2 + c << 0;
                    this.h3 = this.h3 + d << 0;
                    this.h4 = this.h4 + e << 0;
                    this.h5 = this.h5 + f << 0;
                    this.h6 = this.h6 + g << 0;
                    this.h7 = this.h7 + h << 0;
                };
                Sha256.prototype.hex = function() {
                    this.finalize();
                    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
                    var hex = HEX_CHARS[h0 >> 28 & 15] + HEX_CHARS[h0 >> 24 & 15] + HEX_CHARS[h0 >> 20 & 15] + HEX_CHARS[h0 >> 16 & 15] + HEX_CHARS[h0 >> 12 & 15] + HEX_CHARS[h0 >> 8 & 15] + HEX_CHARS[h0 >> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >> 28 & 15] + HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h1 >> 20 & 15] + HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 12 & 15] + HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] + HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] + HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] + HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >> 28 & 15] + HEX_CHARS[h3 >> 24 & 15] + HEX_CHARS[h3 >> 20 & 15] + HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 12 & 15] + HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >> 28 & 15] + HEX_CHARS[h4 >> 24 & 15] + HEX_CHARS[h4 >> 20 & 15] + HEX_CHARS[h4 >> 16 & 15] + HEX_CHARS[h4 >> 12 & 15] + HEX_CHARS[h4 >> 8 & 15] + HEX_CHARS[h4 >> 4 & 15] + HEX_CHARS[h4 & 15] + HEX_CHARS[h5 >> 28 & 15] + HEX_CHARS[h5 >> 24 & 15] + HEX_CHARS[h5 >> 20 & 15] + HEX_CHARS[h5 >> 16 & 15] + HEX_CHARS[h5 >> 12 & 15] + HEX_CHARS[h5 >> 8 & 15] + HEX_CHARS[h5 >> 4 & 15] + HEX_CHARS[h5 & 15] + HEX_CHARS[h6 >> 28 & 15] + HEX_CHARS[h6 >> 24 & 15] + HEX_CHARS[h6 >> 20 & 15] + HEX_CHARS[h6 >> 16 & 15] + HEX_CHARS[h6 >> 12 & 15] + HEX_CHARS[h6 >> 8 & 15] + HEX_CHARS[h6 >> 4 & 15] + HEX_CHARS[h6 & 15];
                    if (!this.is224) {
                        hex += HEX_CHARS[h7 >> 28 & 15] + HEX_CHARS[h7 >> 24 & 15] + HEX_CHARS[h7 >> 20 & 15] + HEX_CHARS[h7 >> 16 & 15] + HEX_CHARS[h7 >> 12 & 15] + HEX_CHARS[h7 >> 8 & 15] + HEX_CHARS[h7 >> 4 & 15] + HEX_CHARS[h7 & 15];
                    }
                    return hex;
                };
                Sha256.prototype.toString = Sha256.prototype.hex;
                Sha256.prototype.digest = function() {
                    this.finalize();
                    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
                    var arr = [ h0 >> 24 & 255, h0 >> 16 & 255, h0 >> 8 & 255, h0 & 255, h1 >> 24 & 255, h1 >> 16 & 255, h1 >> 8 & 255, h1 & 255, h2 >> 24 & 255, h2 >> 16 & 255, h2 >> 8 & 255, h2 & 255, h3 >> 24 & 255, h3 >> 16 & 255, h3 >> 8 & 255, h3 & 255, h4 >> 24 & 255, h4 >> 16 & 255, h4 >> 8 & 255, h4 & 255, h5 >> 24 & 255, h5 >> 16 & 255, h5 >> 8 & 255, h5 & 255, h6 >> 24 & 255, h6 >> 16 & 255, h6 >> 8 & 255, h6 & 255 ];
                    if (!this.is224) {
                        arr.push(h7 >> 24 & 255, h7 >> 16 & 255, h7 >> 8 & 255, h7 & 255);
                    }
                    return arr;
                };
                Sha256.prototype.array = Sha256.prototype.digest;
                Sha256.prototype.arrayBuffer = function() {
                    this.finalize();
                    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
                    var dataView = new DataView(buffer);
                    dataView.setUint32(0, this.h0);
                    dataView.setUint32(4, this.h1);
                    dataView.setUint32(8, this.h2);
                    dataView.setUint32(12, this.h3);
                    dataView.setUint32(16, this.h4);
                    dataView.setUint32(20, this.h5);
                    dataView.setUint32(24, this.h6);
                    if (!this.is224) {
                        dataView.setUint32(28, this.h7);
                    }
                    return buffer;
                };
                function HmacSha256(key, is224, sharedMemory) {
                    var i, type = typeof key;
                    if (type === "string") {
                        var bytes = [], length = key.length, index = 0, code;
                        for (i = 0; i < length; ++i) {
                            code = key.charCodeAt(i);
                            if (code < 128) {
                                bytes[index++] = code;
                            } else if (code < 2048) {
                                bytes[index++] = 192 | code >> 6;
                                bytes[index++] = 128 | code & 63;
                            } else if (code < 55296 || code >= 57344) {
                                bytes[index++] = 224 | code >> 12;
                                bytes[index++] = 128 | code >> 6 & 63;
                                bytes[index++] = 128 | code & 63;
                            } else {
                                code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
                                bytes[index++] = 240 | code >> 18;
                                bytes[index++] = 128 | code >> 12 & 63;
                                bytes[index++] = 128 | code >> 6 & 63;
                                bytes[index++] = 128 | code & 63;
                            }
                        }
                        key = bytes;
                    } else {
                        if (type === "object") {
                            if (key === null) {
                                throw new Error(ERROR);
                            } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
                                key = new Uint8Array(key);
                            } else if (!Array.isArray(key)) {
                                if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
                                    throw new Error(ERROR);
                                }
                            }
                        } else {
                            throw new Error(ERROR);
                        }
                    }
                    if (key.length > 64) {
                        key = new Sha256(is224, true).update(key).array();
                    }
                    var oKeyPad = [], iKeyPad = [];
                    for (i = 0; i < 64; ++i) {
                        var b = key[i] || 0;
                        oKeyPad[i] = 92 ^ b;
                        iKeyPad[i] = 54 ^ b;
                    }
                    Sha256.call(this, is224, sharedMemory);
                    this.update(iKeyPad);
                    this.oKeyPad = oKeyPad;
                    this.inner = true;
                    this.sharedMemory = sharedMemory;
                }
                HmacSha256.prototype = new Sha256();
                HmacSha256.prototype.finalize = function() {
                    Sha256.prototype.finalize.call(this);
                    if (this.inner) {
                        this.inner = false;
                        var innerHash = this.array();
                        Sha256.call(this, this.is224, this.sharedMemory);
                        this.update(this.oKeyPad);
                        this.update(innerHash);
                        Sha256.prototype.finalize.call(this);
                    }
                };
                var exports = createMethod();
                exports.sha256 = exports;
                exports.sha224 = createMethod(true);
                exports.sha256.hmac = createHmacMethod();
                exports.sha224.hmac = createHmacMethod(true);
                if (COMMON_JS) {
                    module.exports = exports;
                } else {
                    root.sha256 = exports.sha256;
                    root.sha224 = exports.sha224;
                    if (AMD) {
                        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
                            return exports;
                        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                    }
                }
            })();
        }).call(this, __webpack_require__(6), __webpack_require__(0));
    }, function(module, exports, __webpack_require__) {
        (function(module, global) {
            var __WEBPACK_AMD_DEFINE_RESULT__;
            (function(root) {
                var freeExports = typeof exports == "object" && exports;
                var freeModule = typeof module == "object" && module && module.exports == freeExports && module;
                var freeGlobal = typeof global == "object" && global;
                if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
                    root = freeGlobal;
                }
                var InvalidCharacterError = function(message) {
                    this.message = message;
                };
                InvalidCharacterError.prototype = new Error();
                InvalidCharacterError.prototype.name = "InvalidCharacterError";
                var error = function(message) {
                    throw new InvalidCharacterError(message);
                };
                var TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;
                var decode = function(input) {
                    input = String(input).replace(REGEX_SPACE_CHARACTERS, "");
                    var length = input.length;
                    if (length % 4 == 0) {
                        input = input.replace(/==?$/, "");
                        length = input.length;
                    }
                    if (length % 4 == 1 || /[^+a-zA-Z0-9/]/.test(input)) {
                        error("Invalid character: the string to be decoded is not correctly encoded.");
                    }
                    var bitCounter = 0;
                    var bitStorage;
                    var buffer;
                    var output = "";
                    var position = -1;
                    while (++position < length) {
                        buffer = TABLE.indexOf(input.charAt(position));
                        bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
                        if (bitCounter++ % 4) {
                            output += String.fromCharCode(255 & bitStorage >> (-2 * bitCounter & 6));
                        }
                    }
                    return output;
                };
                var encode = function(input) {
                    input = String(input);
                    if (/[^\0-\xFF]/.test(input)) {
                        error("The string to be encoded contains characters outside of the " + "Latin1 range.");
                    }
                    var padding = input.length % 3;
                    var output = "";
                    var position = -1;
                    var a;
                    var b;
                    var c;
                    var d;
                    var buffer;
                    var length = input.length - padding;
                    while (++position < length) {
                        a = input.charCodeAt(position) << 16;
                        b = input.charCodeAt(++position) << 8;
                        c = input.charCodeAt(++position);
                        buffer = a + b + c;
                        output += TABLE.charAt(buffer >> 18 & 63) + TABLE.charAt(buffer >> 12 & 63) + TABLE.charAt(buffer >> 6 & 63) + TABLE.charAt(buffer & 63);
                    }
                    if (padding == 2) {
                        a = input.charCodeAt(position) << 8;
                        b = input.charCodeAt(++position);
                        buffer = a + b;
                        output += TABLE.charAt(buffer >> 10) + TABLE.charAt(buffer >> 4 & 63) + TABLE.charAt(buffer << 2 & 63) + "=";
                    } else if (padding == 1) {
                        buffer = input.charCodeAt(position);
                        output += TABLE.charAt(buffer >> 2) + TABLE.charAt(buffer << 4 & 63) + "==";
                    }
                    return output;
                };
                var base64 = {
                    encode: encode,
                    decode: decode,
                    version: "0.1.0"
                };
                if (true) {
                    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
                        return base64;
                    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                } else {
                    var key;
                }
            })(this);
        }).call(this, __webpack_require__(9)(module), __webpack_require__(0));
    }, function(module, exports) {
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, rep;
        function quote(string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }
        function str(key, holder) {
            var i, k, v, length, mind = gap, partial, value = holder[key];
            if (value && typeof value === "object" && typeof value.toJSON === "function") {
                value = value.toJSON(key);
            }
            if (typeof rep === "function") {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
              case "string":
                return quote(value);

              case "number":
                return isFinite(value) ? String(value) : "null";

              case "boolean":
              case "null":
                return String(value);

              case "object":
                if (!value) return "null";
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === "string") {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
            }
        }
        module.exports = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }
            } else if (typeof space === "string") {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }
            return str("", {
                "": value
            });
        };
    }, function(module, exports) {
        var at, ch, escapee = {
            '"': '"',
            "\\": "\\",
            "/": "/",
            b: "\b",
            f: "\f",
            n: "\n",
            r: "\r",
            t: "\t"
        }, text, error = function(m) {
            throw {
                name: "SyntaxError",
                message: m,
                at: at,
                text: text
            };
        }, next = function(c) {
            if (c && c !== ch) {
                error("Expected '" + c + "' instead of '" + ch + "'");
            }
            ch = text.charAt(at);
            at += 1;
            return ch;
        }, number = function() {
            var number, string = "";
            if (ch === "-") {
                string = "-";
                next("-");
            }
            while (ch >= "0" && ch <= "9") {
                string += ch;
                next();
            }
            if (ch === ".") {
                string += ".";
                while (next() && ch >= "0" && ch <= "9") {
                    string += ch;
                }
            }
            if (ch === "e" || ch === "E") {
                string += ch;
                next();
                if (ch === "-" || ch === "+") {
                    string += ch;
                    next();
                }
                while (ch >= "0" && ch <= "9") {
                    string += ch;
                    next();
                }
            }
            number = +string;
            if (!isFinite(number)) {
                error("Bad number");
            } else {
                return number;
            }
        }, string = function() {
            var hex, i, string = "", uffff;
            if (ch === '"') {
                while (next()) {
                    if (ch === '"') {
                        next();
                        return string;
                    } else if (ch === "\\") {
                        next();
                        if (ch === "u") {
                            uffff = 0;
                            for (i = 0; i < 4; i += 1) {
                                hex = parseInt(next(), 16);
                                if (!isFinite(hex)) {
                                    break;
                                }
                                uffff = uffff * 16 + hex;
                            }
                            string += String.fromCharCode(uffff);
                        } else if (typeof escapee[ch] === "string") {
                            string += escapee[ch];
                        } else {
                            break;
                        }
                    } else {
                        string += ch;
                    }
                }
            }
            error("Bad string");
        }, white = function() {
            while (ch && ch <= " ") {
                next();
            }
        }, word = function() {
            switch (ch) {
              case "t":
                next("t");
                next("r");
                next("u");
                next("e");
                return true;

              case "f":
                next("f");
                next("a");
                next("l");
                next("s");
                next("e");
                return false;

              case "n":
                next("n");
                next("u");
                next("l");
                next("l");
                return null;
            }
            error("Unexpected '" + ch + "'");
        }, value, array = function() {
            var array = [];
            if (ch === "[") {
                next("[");
                white();
                if (ch === "]") {
                    next("]");
                    return array;
                }
                while (ch) {
                    array.push(value());
                    white();
                    if (ch === "]") {
                        next("]");
                        return array;
                    }
                    next(",");
                    white();
                }
            }
            error("Bad array");
        }, object = function() {
            var key, object = {};
            if (ch === "{") {
                next("{");
                white();
                if (ch === "}") {
                    next("}");
                    return object;
                }
                while (ch) {
                    key = string();
                    white();
                    next(":");
                    if (Object.hasOwnProperty.call(object, key)) {
                        error('Duplicate key "' + key + '"');
                    }
                    object[key] = value();
                    white();
                    if (ch === "}") {
                        next("}");
                        return object;
                    }
                    next(",");
                    white();
                }
            }
            error("Bad object");
        };
        value = function() {
            white();
            switch (ch) {
              case "{":
                return object();

              case "[":
                return array();

              case '"':
                return string();

              case "-":
                return number();

              default:
                return ch >= "0" && ch <= "9" ? number() : word();
            }
        };
        module.exports = function(source, reviver) {
            var result;
            text = source;
            at = 0;
            ch = " ";
            result = value();
            white();
            if (ch) {
                error("Syntax error");
            }
            return typeof reviver === "function" ? function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }({
                "": result
            }, "") : result;
        };
    }, function(module, exports, __webpack_require__) {
        exports.parse = __webpack_require__(22);
        exports.stringify = __webpack_require__(21);
    }, function(module, exports, __webpack_require__) {
        var json = typeof JSON !== "undefined" ? JSON : __webpack_require__(23);
        module.exports = function(obj, opts) {
            if (!opts) opts = {};
            if (typeof opts === "function") opts = {
                cmp: opts
            };
            var space = opts.space || "";
            if (typeof space === "number") space = Array(space + 1).join(" ");
            var cycles = typeof opts.cycles === "boolean" ? opts.cycles : false;
            var replacer = opts.replacer || function(key, value) {
                return value;
            };
            var cmp = opts.cmp && function(f) {
                return function(node) {
                    return function(a, b) {
                        var aobj = {
                            key: a,
                            value: node[a]
                        };
                        var bobj = {
                            key: b,
                            value: node[b]
                        };
                        return f(aobj, bobj);
                    };
                };
            }(opts.cmp);
            var seen = [];
            return function stringify(parent, key, node, level) {
                var indent = space ? "\n" + new Array(level + 1).join(space) : "";
                var colonSeparator = space ? ": " : ":";
                if (node && node.toJSON && typeof node.toJSON === "function") {
                    node = node.toJSON();
                }
                node = replacer.call(parent, key, node);
                if (node === undefined) {
                    return;
                }
                if (typeof node !== "object" || node === null) {
                    return json.stringify(node);
                }
                if (isArray(node)) {
                    var out = [];
                    for (var i = 0; i < node.length; i++) {
                        var item = stringify(node, i, node[i], level + 1) || json.stringify(null);
                        out.push(indent + space + item);
                    }
                    return "[" + out.join(",") + indent + "]";
                } else {
                    if (seen.indexOf(node) !== -1) {
                        if (cycles) return json.stringify("__cycle__");
                        throw new TypeError("Converting circular structure to JSON");
                    } else seen.push(node);
                    var keys = objectKeys(node).sort(cmp && cmp(node));
                    var out = [];
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var value = stringify(node, key, node[key], level + 1);
                        if (!value) continue;
                        var keyValue = json.stringify(key) + colonSeparator + value;
                        out.push(indent + space + keyValue);
                    }
                    seen.splice(seen.indexOf(node), 1);
                    return "{" + out.join(",") + indent + "}";
                }
            }({
                "": obj
            }, "", obj, 0);
        };
        var isArray = Array.isArray || function(x) {
            return {}.toString.call(x) === "[object Array]";
        };
        var objectKeys = Object.keys || function(obj) {
            var has = Object.prototype.hasOwnProperty || function() {
                return true;
            };
            var keys = [];
            for (var key in obj) {
                if (has.call(obj, key)) keys.push(key);
            }
            return keys;
        };
    }, function(module, exports, __webpack_require__) {
        (function(global, module) {
            var LARGE_ARRAY_SIZE = 200;
            var HASH_UNDEFINED = "__lodash_hash_undefined__";
            var MAX_SAFE_INTEGER = 9007199254740991;
            var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", promiseTag = "[object Promise]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
            var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
            var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
            var reFlags = /\w*$/;
            var reIsHostCtor = /^\[object .+?Constructor\]$/;
            var reIsUint = /^(?:0|[1-9]\d*)$/;
            var cloneableTags = {};
            cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
            cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
            var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
            var freeSelf = typeof self == "object" && self && self.Object === Object && self;
            var root = freeGlobal || freeSelf || Function("return this")();
            var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
            var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
            var moduleExports = freeModule && freeModule.exports === freeExports;
            function addMapEntry(map, pair) {
                map.set(pair[0], pair[1]);
                return map;
            }
            function addSetEntry(set, value) {
                set.add(value);
                return set;
            }
            function arrayEach(array, iteratee) {
                var index = -1, length = array ? array.length : 0;
                while (++index < length) {
                    if (iteratee(array[index], index, array) === false) {
                        break;
                    }
                }
                return array;
            }
            function arrayPush(array, values) {
                var index = -1, length = values.length, offset = array.length;
                while (++index < length) {
                    array[offset + index] = values[index];
                }
                return array;
            }
            function arrayReduce(array, iteratee, accumulator, initAccum) {
                var index = -1, length = array ? array.length : 0;
                if (initAccum && length) {
                    accumulator = array[++index];
                }
                while (++index < length) {
                    accumulator = iteratee(accumulator, array[index], index, array);
                }
                return accumulator;
            }
            function baseTimes(n, iteratee) {
                var index = -1, result = Array(n);
                while (++index < n) {
                    result[index] = iteratee(index);
                }
                return result;
            }
            function getValue(object, key) {
                return object == null ? undefined : object[key];
            }
            function isHostObject(value) {
                var result = false;
                if (value != null && typeof value.toString != "function") {
                    try {
                        result = !!(value + "");
                    } catch (e) {}
                }
                return result;
            }
            function mapToArray(map) {
                var index = -1, result = Array(map.size);
                map.forEach(function(value, key) {
                    result[++index] = [ key, value ];
                });
                return result;
            }
            function overArg(func, transform) {
                return function(arg) {
                    return func(transform(arg));
                };
            }
            function setToArray(set) {
                var index = -1, result = Array(set.size);
                set.forEach(function(value) {
                    result[++index] = value;
                });
                return result;
            }
            var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
            var coreJsData = root["__core-js_shared__"];
            var maskSrcKey = function() {
                var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
                return uid ? "Symbol(src)_1." + uid : "";
            }();
            var funcToString = funcProto.toString;
            var hasOwnProperty = objectProto.hasOwnProperty;
            var objectToString = objectProto.toString;
            var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            var Buffer = moduleExports ? root.Buffer : undefined, Symbol = root.Symbol, Uint8Array = root.Uint8Array, getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice;
            var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined, nativeKeys = overArg(Object.keys, Object);
            var DataView = getNative(root, "DataView"), Map = getNative(root, "Map"), Promise = getNative(root, "Promise"), Set = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create");
            var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
            var symbolProto = Symbol ? Symbol.prototype : undefined, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
            function Hash(entries) {
                var index = -1, length = entries ? entries.length : 0;
                this.clear();
                while (++index < length) {
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }
            function hashClear() {
                this.__data__ = nativeCreate ? nativeCreate(null) : {};
            }
            function hashDelete(key) {
                return this.has(key) && delete this.__data__[key];
            }
            function hashGet(key) {
                var data = this.__data__;
                if (nativeCreate) {
                    var result = data[key];
                    return result === HASH_UNDEFINED ? undefined : result;
                }
                return hasOwnProperty.call(data, key) ? data[key] : undefined;
            }
            function hashHas(key) {
                var data = this.__data__;
                return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
            }
            function hashSet(key, value) {
                var data = this.__data__;
                data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
                return this;
            }
            Hash.prototype.clear = hashClear;
            Hash.prototype["delete"] = hashDelete;
            Hash.prototype.get = hashGet;
            Hash.prototype.has = hashHas;
            Hash.prototype.set = hashSet;
            function ListCache(entries) {
                var index = -1, length = entries ? entries.length : 0;
                this.clear();
                while (++index < length) {
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }
            function listCacheClear() {
                this.__data__ = [];
            }
            function listCacheDelete(key) {
                var data = this.__data__, index = assocIndexOf(data, key);
                if (index < 0) {
                    return false;
                }
                var lastIndex = data.length - 1;
                if (index == lastIndex) {
                    data.pop();
                } else {
                    splice.call(data, index, 1);
                }
                return true;
            }
            function listCacheGet(key) {
                var data = this.__data__, index = assocIndexOf(data, key);
                return index < 0 ? undefined : data[index][1];
            }
            function listCacheHas(key) {
                return assocIndexOf(this.__data__, key) > -1;
            }
            function listCacheSet(key, value) {
                var data = this.__data__, index = assocIndexOf(data, key);
                if (index < 0) {
                    data.push([ key, value ]);
                } else {
                    data[index][1] = value;
                }
                return this;
            }
            ListCache.prototype.clear = listCacheClear;
            ListCache.prototype["delete"] = listCacheDelete;
            ListCache.prototype.get = listCacheGet;
            ListCache.prototype.has = listCacheHas;
            ListCache.prototype.set = listCacheSet;
            function MapCache(entries) {
                var index = -1, length = entries ? entries.length : 0;
                this.clear();
                while (++index < length) {
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }
            function mapCacheClear() {
                this.__data__ = {
                    hash: new Hash(),
                    map: new (Map || ListCache)(),
                    string: new Hash()
                };
            }
            function mapCacheDelete(key) {
                return getMapData(this, key)["delete"](key);
            }
            function mapCacheGet(key) {
                return getMapData(this, key).get(key);
            }
            function mapCacheHas(key) {
                return getMapData(this, key).has(key);
            }
            function mapCacheSet(key, value) {
                getMapData(this, key).set(key, value);
                return this;
            }
            MapCache.prototype.clear = mapCacheClear;
            MapCache.prototype["delete"] = mapCacheDelete;
            MapCache.prototype.get = mapCacheGet;
            MapCache.prototype.has = mapCacheHas;
            MapCache.prototype.set = mapCacheSet;
            function Stack(entries) {
                this.__data__ = new ListCache(entries);
            }
            function stackClear() {
                this.__data__ = new ListCache();
            }
            function stackDelete(key) {
                return this.__data__["delete"](key);
            }
            function stackGet(key) {
                return this.__data__.get(key);
            }
            function stackHas(key) {
                return this.__data__.has(key);
            }
            function stackSet(key, value) {
                var cache = this.__data__;
                if (cache instanceof ListCache) {
                    var pairs = cache.__data__;
                    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
                        pairs.push([ key, value ]);
                        return this;
                    }
                    cache = this.__data__ = new MapCache(pairs);
                }
                cache.set(key, value);
                return this;
            }
            Stack.prototype.clear = stackClear;
            Stack.prototype["delete"] = stackDelete;
            Stack.prototype.get = stackGet;
            Stack.prototype.has = stackHas;
            Stack.prototype.set = stackSet;
            function arrayLikeKeys(value, inherited) {
                var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
                var length = result.length, skipIndexes = !!length;
                for (var key in value) {
                    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
                        result.push(key);
                    }
                }
                return result;
            }
            function assignValue(object, key, value) {
                var objValue = object[key];
                if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
                    object[key] = value;
                }
            }
            function assocIndexOf(array, key) {
                var length = array.length;
                while (length--) {
                    if (eq(array[length][0], key)) {
                        return length;
                    }
                }
                return -1;
            }
            function baseAssign(object, source) {
                return object && copyObject(source, keys(source), object);
            }
            function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
                var result;
                if (customizer) {
                    result = object ? customizer(value, key, object, stack) : customizer(value);
                }
                if (result !== undefined) {
                    return result;
                }
                if (!isObject(value)) {
                    return value;
                }
                var isArr = isArray(value);
                if (isArr) {
                    result = initCloneArray(value);
                    if (!isDeep) {
                        return copyArray(value, result);
                    }
                } else {
                    var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
                    if (isBuffer(value)) {
                        return cloneBuffer(value, isDeep);
                    }
                    if (tag == objectTag || tag == argsTag || isFunc && !object) {
                        if (isHostObject(value)) {
                            return object ? value : {};
                        }
                        result = initCloneObject(isFunc ? {} : value);
                        if (!isDeep) {
                            return copySymbols(value, baseAssign(result, value));
                        }
                    } else {
                        if (!cloneableTags[tag]) {
                            return object ? value : {};
                        }
                        result = initCloneByTag(value, tag, baseClone, isDeep);
                    }
                }
                stack || (stack = new Stack());
                var stacked = stack.get(value);
                if (stacked) {
                    return stacked;
                }
                stack.set(value, result);
                if (!isArr) {
                    var props = isFull ? getAllKeys(value) : keys(value);
                }
                arrayEach(props || value, function(subValue, key) {
                    if (props) {
                        key = subValue;
                        subValue = value[key];
                    }
                    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
                });
                return result;
            }
            function baseCreate(proto) {
                return isObject(proto) ? objectCreate(proto) : {};
            }
            function baseGetAllKeys(object, keysFunc, symbolsFunc) {
                var result = keysFunc(object);
                return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
            }
            function baseGetTag(value) {
                return objectToString.call(value);
            }
            function baseIsNative(value) {
                if (!isObject(value) || isMasked(value)) {
                    return false;
                }
                var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
                return pattern.test(toSource(value));
            }
            function baseKeys(object) {
                if (!isPrototype(object)) {
                    return nativeKeys(object);
                }
                var result = [];
                for (var key in Object(object)) {
                    if (hasOwnProperty.call(object, key) && key != "constructor") {
                        result.push(key);
                    }
                }
                return result;
            }
            function cloneBuffer(buffer, isDeep) {
                if (isDeep) {
                    return buffer.slice();
                }
                var result = new buffer.constructor(buffer.length);
                buffer.copy(result);
                return result;
            }
            function cloneArrayBuffer(arrayBuffer) {
                var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
                new Uint8Array(result).set(new Uint8Array(arrayBuffer));
                return result;
            }
            function cloneDataView(dataView, isDeep) {
                var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
                return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
            }
            function cloneMap(map, isDeep, cloneFunc) {
                var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
                return arrayReduce(array, addMapEntry, new map.constructor());
            }
            function cloneRegExp(regexp) {
                var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
                result.lastIndex = regexp.lastIndex;
                return result;
            }
            function cloneSet(set, isDeep, cloneFunc) {
                var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
                return arrayReduce(array, addSetEntry, new set.constructor());
            }
            function cloneSymbol(symbol) {
                return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
            }
            function cloneTypedArray(typedArray, isDeep) {
                var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
                return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
            }
            function copyArray(source, array) {
                var index = -1, length = source.length;
                array || (array = Array(length));
                while (++index < length) {
                    array[index] = source[index];
                }
                return array;
            }
            function copyObject(source, props, object, customizer) {
                object || (object = {});
                var index = -1, length = props.length;
                while (++index < length) {
                    var key = props[index];
                    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
                    assignValue(object, key, newValue === undefined ? source[key] : newValue);
                }
                return object;
            }
            function copySymbols(source, object) {
                return copyObject(source, getSymbols(source), object);
            }
            function getAllKeys(object) {
                return baseGetAllKeys(object, keys, getSymbols);
            }
            function getMapData(map, key) {
                var data = map.__data__;
                return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
            }
            function getNative(object, key) {
                var value = getValue(object, key);
                return baseIsNative(value) ? value : undefined;
            }
            var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
            var getTag = baseGetTag;
            if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
                getTag = function(value) {
                    var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : undefined, ctorString = Ctor ? toSource(Ctor) : undefined;
                    if (ctorString) {
                        switch (ctorString) {
                          case dataViewCtorString:
                            return dataViewTag;

                          case mapCtorString:
                            return mapTag;

                          case promiseCtorString:
                            return promiseTag;

                          case setCtorString:
                            return setTag;

                          case weakMapCtorString:
                            return weakMapTag;
                        }
                    }
                    return result;
                };
            }
            function initCloneArray(array) {
                var length = array.length, result = array.constructor(length);
                if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
                    result.index = array.index;
                    result.input = array.input;
                }
                return result;
            }
            function initCloneObject(object) {
                return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
            }
            function initCloneByTag(object, tag, cloneFunc, isDeep) {
                var Ctor = object.constructor;
                switch (tag) {
                  case arrayBufferTag:
                    return cloneArrayBuffer(object);

                  case boolTag:
                  case dateTag:
                    return new Ctor(+object);

                  case dataViewTag:
                    return cloneDataView(object, isDeep);

                  case float32Tag:
                  case float64Tag:
                  case int8Tag:
                  case int16Tag:
                  case int32Tag:
                  case uint8Tag:
                  case uint8ClampedTag:
                  case uint16Tag:
                  case uint32Tag:
                    return cloneTypedArray(object, isDeep);

                  case mapTag:
                    return cloneMap(object, isDeep, cloneFunc);

                  case numberTag:
                  case stringTag:
                    return new Ctor(object);

                  case regexpTag:
                    return cloneRegExp(object);

                  case setTag:
                    return cloneSet(object, isDeep, cloneFunc);

                  case symbolTag:
                    return cloneSymbol(object);
                }
            }
            function isIndex(value, length) {
                length = length == null ? MAX_SAFE_INTEGER : length;
                return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
            }
            function isKeyable(value) {
                var type = typeof value;
                return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
            }
            function isMasked(func) {
                return !!maskSrcKey && maskSrcKey in func;
            }
            function isPrototype(value) {
                var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
                return value === proto;
            }
            function toSource(func) {
                if (func != null) {
                    try {
                        return funcToString.call(func);
                    } catch (e) {}
                    try {
                        return func + "";
                    } catch (e) {}
                }
                return "";
            }
            function cloneDeep(value) {
                return baseClone(value, true, true);
            }
            function eq(value, other) {
                return value === other || value !== value && other !== other;
            }
            function isArguments(value) {
                return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
            }
            var isArray = Array.isArray;
            function isArrayLike(value) {
                return value != null && isLength(value.length) && !isFunction(value);
            }
            function isArrayLikeObject(value) {
                return isObjectLike(value) && isArrayLike(value);
            }
            var isBuffer = nativeIsBuffer || stubFalse;
            function isFunction(value) {
                var tag = isObject(value) ? objectToString.call(value) : "";
                return tag == funcTag || tag == genTag;
            }
            function isLength(value) {
                return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
            }
            function isObject(value) {
                var type = typeof value;
                return !!value && (type == "object" || type == "function");
            }
            function isObjectLike(value) {
                return !!value && typeof value == "object";
            }
            function keys(object) {
                return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
            }
            function stubArray() {
                return [];
            }
            function stubFalse() {
                return false;
            }
            module.exports = cloneDeep;
        }).call(this, __webpack_require__(0), __webpack_require__(9)(module));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        var _constants = __webpack_require__(5);
        var _constants2 = _interopRequireDefault(_constants);
        var _error = __webpack_require__(4);
        var _error2 = _interopRequireDefault(_error);
        var _state = __webpack_require__(3);
        var _state2 = _interopRequireDefault(_state);
        var _utils = __webpack_require__(1);
        var _utils2 = _interopRequireDefault(_utils);
        var _base = __webpack_require__(20);
        var _base2 = _interopRequireDefault(_base);
        var _jsSha = __webpack_require__(19);
        var _jsSha2 = _interopRequireDefault(_jsSha);
        var _q = __webpack_require__(2);
        var _q2 = _interopRequireDefault(_q);
        var _superagentQ = __webpack_require__(15);
        var _superagentQ2 = _interopRequireDefault(_superagentQ);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var KidaptiveSdkHttpClient = function() {
            function KidaptiveSdkHttpClient() {
                _classCallCheck(this, KidaptiveSdkHttpClient);
            }
            _createClass(KidaptiveSdkHttpClient, [ {
                key: "request",
                value: function request(method, endpoint, data) {
                    var _this = this;
                    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                    return _q2.default.fcall(function() {
                        var settings = _this.getRequestSettings(method, endpoint, data);
                        var request = (0, _superagentQ2.default)(settings.method, settings.host + settings.endpoint);
                        request.withCredentials();
                        if (settings.method === "POST") {
                            request.send(settings.data);
                        } else {
                            request.query(settings.data);
                        }
                        if (settings.contentType) {
                            request.set("Content-Type", settings.contentType);
                        }
                        request.set("api-key", settings.apiKey);
                        return request.end().then(function(result) {
                            return result.body;
                        }, function(error) {
                            var parseError = error.parse && "Cannot parse response" || "";
                            var status = error && (error.status || error.statusCode);
                            var errorMessage = error.response && error.response.text || parseError;
                            if (status === 400) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, errorMessage);
                            } else if (status === 401) {
                                throw new _error2.default(_error2.default.ERROR_CODES.API_KEY_ERROR, errorMessage);
                            } else if (status && (status < 200 || status >= 300)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.WEB_API_ERROR, errorMessage);
                            } else {
                                throw new _error2.default(_error2.default.ERROR_CODES.GENERIC_ERROR, "HTTP Client Error" + (errorMessage ? ": " + errorMessage : ""));
                            }
                        });
                    });
                }
            }, {
                key: "getCacheKey",
                value: function getCacheKey(settings) {
                    return _base2.default.encode(String.fromCharCode.apply(undefined, _jsSha2.default.array(_utils2.default.toJson(settings)))).replace(/[+]/g, "-").replace(/[/]/g, "_").replace(/=+/, "") + (KidaptiveSdkHttpClient.isUserEndpoint(settings.endpoint) ? ".alpUserData" : ".alpAppData");
                }
            }, {
                key: "getRequestSettings",
                value: function getRequestSettings(method, endpoint, data) {
                    var settings = {
                        method: method,
                        host: KidaptiveSdkHttpClient.getHost(),
                        apiKey: _state2.default.get("apiKey"),
                        endpoint: endpoint,
                        data: data
                    };
                    if (method === "POST") {
                        settings.contentType = "application/json";
                    }
                    return settings;
                }
            } ], [ {
                key: "getHost",
                value: function getHost() {
                    var options = _state2.default.get("options") || {};
                    if (options.environment === "prod") {
                        return _constants2.default.HOST.PROD;
                    }
                    if (options.environment === "dev") {
                        return _constants2.default.HOST.DEV;
                    }
                    if (options.environment === "custom") {
                        return options.baseUrl;
                    }
                }
            }, {
                key: "isUserEndpoint",
                value: function isUserEndpoint(endpoint) {
                    return _utils2.default.findItemIndex(_constants2.default.USER_ENDPOINTS, function(item) {
                        return _constants2.default.ENDPOINT[item] === endpoint;
                    }) !== -1;
                }
            } ]);
            return KidaptiveSdkHttpClient;
        }();
        exports.default = new KidaptiveSdkHttpClient();
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        var _constants = __webpack_require__(5);
        var _constants2 = _interopRequireDefault(_constants);
        var _error = __webpack_require__(4);
        var _error2 = _interopRequireDefault(_error);
        var _httpClient = __webpack_require__(26);
        var _httpClient2 = _interopRequireDefault(_httpClient);
        var _operationManager = __webpack_require__(7);
        var _operationManager2 = _interopRequireDefault(_operationManager);
        var _state = __webpack_require__(3);
        var _state2 = _interopRequireDefault(_state);
        var _utils = __webpack_require__(1);
        var _utils2 = _interopRequireDefault(_utils);
        var _q = __webpack_require__(2);
        var _q2 = _interopRequireDefault(_q);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var _autoFlushTimeout = null;
        var _eventQueue = [];
        var KidaptiveSdkEventManager = function() {
            function KidaptiveSdkEventManager() {
                _classCallCheck(this, KidaptiveSdkEventManager);
            }
            _createClass(KidaptiveSdkEventManager, [ {
                key: "reportSimpleEvent",
                value: function reportSimpleEvent(eventName, eventFields) {
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(1);
                        if (eventName == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "EventName is required");
                        }
                        if (!_utils2.default.isString(eventName)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "EventName must be a string");
                        }
                        eventFields = eventFields == null ? {} : eventFields;
                        if (!_utils2.default.isObject(eventFields)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "EventFields must be an object");
                        }
                        eventFields = _utils2.default.copyObject(eventFields);
                        Object.keys(eventFields).forEach(function(key) {
                            var value = eventFields[key];
                            if (value !== null && !_utils2.default.isBoolean(value) && !_utils2.default.isNumber(value) && !_utils2.default.isString(value)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "EventField values must be a boolean, null, number, or string");
                            }
                            var newValue = value === null ? null : value.toString();
                            if (_utils2.default.isNumber(value) && newValue.indexOf("e") !== -1) {
                                if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                                    console.log("Warning: Numeric value with large number of significant digits was converted to scientific notation.");
                                }
                            }
                            eventFields[key] = newValue;
                        });
                        var event = {
                            name: eventName,
                            additionalFields: _utils2.default.copyObject(eventFields)
                        };
                        KidaptiveSdkEventManager.addToEventQueue(event);
                    });
                }
            }, {
                key: "reportRawEvent",
                value: function reportRawEvent(rawEvent) {
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(1);
                        rawEvent = _utils2.default.copyObject(rawEvent);
                        if (rawEvent == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "RawEvent is required");
                        }
                        if (!_utils2.default.isString(rawEvent)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "RawEvent must be a string");
                        }
                        KidaptiveSdkEventManager.addToEventQueue(rawEvent);
                    });
                }
            }, {
                key: "flushEventQueue",
                value: function flushEventQueue() {
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(1);
                        var eventQueue = KidaptiveSdkEventManager.getEventQueue();
                        if (eventQueue.length) {
                            var requests = [];
                            eventQueue.forEach(function(event) {
                                requests.push(_httpClient2.default.request("POST", _constants2.default.ENDPOINT.INGESTION, event, {
                                    noCache: true
                                }));
                            });
                            eventQueue = [];
                            KidaptiveSdkEventManager.setEventQueue(eventQueue);
                            return _q2.default.allSettled(requests);
                        } else {
                            return _q2.default.fcall(function() {
                                return [];
                            });
                        }
                    });
                }
            }, {
                key: "startAutoFlush",
                value: function startAutoFlush() {
                    var _this = this;
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(1);
                        clearTimeout(_autoFlushTimeout);
                        var options = _state2.default.get("options") || {};
                        if (options.autoFlushInterval) {
                            _autoFlushTimeout = setTimeout(function() {
                                _this.flushEventQueue().then(function(results) {
                                    var options = _state2.default.get("options") || {};
                                    if (options.autoFlushCallback) {
                                        options.autoFlushCallback.forEach(function(callback) {
                                            callback(results);
                                        });
                                    }
                                    _this.startAutoFlush();
                                });
                            }, options.autoFlushInterval);
                        } else {
                            if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                                console.log("Warning: ALP SDK autoFlushInterval is configured to 0. Auto flush is disabled.");
                            }
                        }
                    });
                }
            }, {
                key: "stopAutoFlush",
                value: function stopAutoFlush() {
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(1);
                        clearTimeout(_autoFlushTimeout);
                        _autoFlushTimeout = null;
                    });
                }
            } ], [ {
                key: "addToEventQueue",
                value: function addToEventQueue(event) {
                    var options = _state2.default.get("options") || {};
                    var appInfo = {
                        uri: options.appUri,
                        version: options.version,
                        build: options.build
                    };
                    var deviceInfo = {
                        deviceType: window && window.navigator && window.navigator.userAgent,
                        language: window && window.navigator && window.navigator.language
                    };
                    var eventQueue = KidaptiveSdkEventManager.getEventQueue();
                    var itemIndex = _utils2.default.findItemIndex(eventQueue, function(item) {
                        return item.appInfo.uri === appInfo.uri && item.appInfo.version === appInfo.version && item.appInfo.build === appInfo.build && item.deviceInfo.deviceType === deviceInfo.deviceType && item.deviceInfo.language === deviceInfo.language;
                    });
                    if (itemIndex !== -1) {
                        eventQueue[itemIndex].events.push(event);
                    } else {
                        eventQueue.push({
                            appInfo: appInfo,
                            deviceInfo: deviceInfo,
                            events: [ event ]
                        });
                    }
                    KidaptiveSdkEventManager.setEventQueue(eventQueue);
                }
            }, {
                key: "getEventQueue",
                value: function getEventQueue() {
                    var result = void 0;
                    try {
                        result = _utils2.default.localStorageGetItem(KidaptiveSdkEventManager.getEventQueueCacheKey());
                    } catch (e) {
                        result = _utils2.default.copyObject(_eventQueue);
                    }
                    if (!(result instanceof Array)) {
                        result = [];
                    }
                    return result;
                }
            }, {
                key: "setEventQueue",
                value: function setEventQueue(eventQueue) {
                    eventQueue = _utils2.default.copyObject(eventQueue);
                    _eventQueue = eventQueue;
                    _utils2.default.localStorageSetItem(KidaptiveSdkEventManager.getEventQueueCacheKey(), eventQueue);
                }
            }, {
                key: "getEventQueueCacheKey",
                value: function getEventQueueCacheKey() {
                    var settings = _httpClient2.default.getRequestSettings("POST", _constants2.default.ENDPOINT.INGESTION);
                    return _httpClient2.default.getCacheKey(settings).replace(/[.].*/, ".alpEventData");
                }
            } ]);
            return KidaptiveSdkEventManager;
        }();
        exports.default = new KidaptiveSdkEventManager();
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        var _constants = __webpack_require__(5);
        var _constants2 = _interopRequireDefault(_constants);
        var _error = __webpack_require__(4);
        var _error2 = _interopRequireDefault(_error);
        var _eventManager = __webpack_require__(27);
        var _eventManager2 = _interopRequireDefault(_eventManager);
        var _operationManager = __webpack_require__(7);
        var _operationManager2 = _interopRequireDefault(_operationManager);
        var _state = __webpack_require__(3);
        var _state2 = _interopRequireDefault(_state);
        var _utils = __webpack_require__(1);
        var _utils2 = _interopRequireDefault(_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var KidaptiveSdk = function() {
            function KidaptiveSdk() {
                _classCallCheck(this, KidaptiveSdk);
                _state2.default.clear();
                _state2.default.set("initialized", false);
                this.eventManager = _eventManager2.default;
            }
            _createClass(KidaptiveSdk, [ {
                key: "init",
                value: function init(apiKey) {
                    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    return _operationManager2.default.addToQueue(function() {
                        if (_state2.default.get("initialized")) {
                            throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "SDK already initialized");
                        }
                        apiKey = _utils2.default.copyObject(apiKey);
                        options = _utils2.default.copyObject(options);
                        if (!_utils2.default.isArray(options.autoFlushCallback) && options.autoFlushCallback != null) {
                            options.autoFlushCallback = [ options.autoFlushCallback ];
                        }
                        options.tier = options.tier == null ? _constants2.default.DEFAULT.TIER : options.tier;
                        options.autoFlushInterval = options.autoFlushInterval == null ? _constants2.default.DEFAULT.AUTO_FLUSH_INTERVAL : options.autoFlushInterval;
                        options.loggingLevel = options.loggingLevel == null ? _constants2.default.DEFAULT.LOGGING_LEVEL : options.loggingLevel;
                        if (apiKey == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Api key is required");
                        }
                        if (!_utils2.default.isString(apiKey)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Api key must be a string");
                        }
                        if (options.environment == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Environment option is required");
                        }
                        if (!_utils2.default.isString(options.environment)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Environment option must be a string");
                        }
                        if ([ "dev", "prod", "custom" ].indexOf(options.environment) === -1) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Environment option is not an accepted value");
                        }
                        if (options.environment === "custom") {
                            if (options.baseUrl == null) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "BaseUrl option is required");
                            }
                        }
                        if (options.baseUrl != null && !_utils2.default.isString(options.baseUrl)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "BaseUrl option must be a string");
                        }
                        if (!_utils2.default.isNumber(options.tier)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Tier option must be a string");
                        }
                        if ([ 1 ].indexOf(options.tier) === -1) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Tier option is not an accepted value");
                        }
                        if (options.appUri != null) {
                            if (!_utils2.default.isString(options.appUri)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "AppUri option must be a string");
                            }
                        }
                        if (options.version != null) {
                            if (!_utils2.default.isString(options.version)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Version option must be a string");
                            }
                        }
                        if (options.build != null) {
                            if (!_utils2.default.isString(options.build)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Build option must be a string");
                            }
                        }
                        if (!_utils2.default.isNumber(options.autoFlushInterval)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "AutoFlushInterval option must be a string");
                        }
                        if (options.autoFlushInterval < 0) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "AutoFlushInterval option is not an accepted value");
                        }
                        if (options.autoFlushCallback) {
                            options.autoFlushCallback.forEach(function(callback) {
                                if (!_utils2.default.isFunction(callback)) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "AutoFlushCallback option must be a function or array of functions");
                                }
                            });
                        }
                        if (!_utils2.default.isString(options.loggingLevel)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "LoggingLevel option must be a string");
                        }
                        if ([ "all", "warn", "none" ].indexOf(options.loggingLevel) === -1) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "LoggingLevel option is not an accepted value");
                        }
                        _state2.default.set("initialized", true);
                        _state2.default.set("apiKey", apiKey);
                        _state2.default.set("options", options);
                        if (_state2.default.get("options").tier >= 1) {
                            _eventManager2.default.startAutoFlush();
                        }
                    });
                }
            }, {
                key: "getSdkVersion",
                value: function getSdkVersion() {
                    return "0.2.19";
                }
            }, {
                key: "destroy",
                value: function destroy() {
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkInitialized();
                        if (_state2.default.get("options").tier >= 1) {
                            _eventManager2.default.stopAutoFlush();
                            _eventManager2.default.flushEventQueue();
                        }
                    }).then(function() {
                        return _operationManager2.default.addToQueue(function() {
                            _state2.default.clear();
                            _state2.default.set("initialized", false);
                        });
                    });
                }
            } ]);
            return KidaptiveSdk;
        }();
        exports.default = new KidaptiveSdk();
    } ])["default"];
});