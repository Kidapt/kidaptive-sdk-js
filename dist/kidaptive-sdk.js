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
        return __webpack_require__(__webpack_require__.s = 37);
    }([ function(module, exports, __webpack_require__) {
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
        var _constants = __webpack_require__(4);
        var _constants2 = _interopRequireDefault(_constants);
        var _error = __webpack_require__(1);
        var _error2 = _interopRequireDefault(_error);
        var _httpClient = __webpack_require__(6);
        var _httpClient2 = _interopRequireDefault(_httpClient);
        var _state = __webpack_require__(2);
        var _state2 = _interopRequireDefault(_state);
        var _lodash = __webpack_require__(35);
        var _lodash2 = _interopRequireDefault(_lodash);
        var _jsonStableStringify = __webpack_require__(34);
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
                key: "checkAuthMode",
                value: function checkAuthMode(targetAuthMode) {
                    this.checkInitialized();
                    var options = _state2.default.get("options") || {};
                    if (options.authMode !== targetAuthMode) {
                        throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "SDK not configured to authMode " + targetAuthMode);
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
                key: "findItem",
                value: function findItem(array, evaluate) {
                    for (var index = 0; index < array.length; index++) {
                        if (evaluate(array[index])) {
                            return array[index];
                        }
                    }
                    return;
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
                key: "isInteger",
                value: function isInteger(object) {
                    return this.isNumber(object) && isFinite(object) && Math.floor(object) === object;
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
                key: "localStorageGetKeys",
                value: function localStorageGetKeys() {
                    try {
                        return Object.keys(localStorage);
                    } catch (e) {
                        return [];
                    }
                }
            }, {
                key: "localStorageRemoveItem",
                value: function localStorageRemoveItem(property) {
                    try {
                        localStorage.removeItem(property);
                    } catch (e) {}
                }
            }, {
                key: "localStorageSetItem",
                value: function localStorageSetItem(property, value) {
                    var stringify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                    try {
                        localStorage.setItem(property, stringify ? JSON.stringify(value) : value);
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
            }, {
                key: "clearUserCache",
                value: function clearUserCache() {
                    var _this = this;
                    this.localStorageGetKeys().forEach(function(cacheKey) {
                        if (cacheKey.match(/^[\w-.]*[.]alpUserData$/)) {
                            _this.localStorageRemoveItem(cacheKey);
                        }
                    });
                }
            }, {
                key: "clearAppCache",
                value: function clearAppCache() {
                    var _this2 = this;
                    this.localStorageGetKeys().forEach(function(cacheKey) {
                        if (cacheKey.match(/^[\w-.]*[.]alpAppData$/)) {
                            _this2.localStorageRemoveItem(cacheKey);
                        }
                    });
                }
            }, {
                key: "cacheUser",
                value: function cacheUser(user) {
                    this.localStorageSetItem("User." + _state2.default.get("apiKey") + _constants2.default.CACHE_KEY.USER, user);
                }
            }, {
                key: "cacheLearnerId",
                value: function cacheLearnerId(learnerId) {
                    this.localStorageSetItem("LearnerId." + _state2.default.get("apiKey") + _constants2.default.CACHE_KEY.USER, learnerId);
                }
            }, {
                key: "cacheSingletonLearnerFlag",
                value: function cacheSingletonLearnerFlag(singletonLearnerFlag) {
                    this.localStorageSetItem("SingletonLearnerFlag." + _state2.default.get("apiKey") + _constants2.default.CACHE_KEY.USER, singletonLearnerFlag);
                }
            }, {
                key: "cacheLatentAbilityEstimates",
                value: function cacheLatentAbilityEstimates(abilityEstimates) {
                    var learnerId = _state2.default.get("learnerId");
                    var cacheReadyAbilities = this.copyObject(abilityEstimates);
                    cacheReadyAbilities.forEach(function(ability) {
                        ability.dimensionId = ability.dimension && ability.dimension.id;
                        delete ability.dimension;
                    });
                    var cacheKey = _httpClient2.default.getCacheKey(_httpClient2.default.getRequestSettings("GET", _constants2.default.ENDPOINT.ABILITY, {
                        learnerId: learnerId
                    }));
                    this.localStorageSetItem(cacheKey, cacheReadyAbilities);
                }
            }, {
                key: "getCachedUser",
                value: function getCachedUser() {
                    try {
                        return this.localStorageGetItem("User." + _state2.default.get("apiKey") + _constants2.default.CACHE_KEY.USER);
                    } catch (e) {}
                }
            }, {
                key: "getCachedLearnerId",
                value: function getCachedLearnerId() {
                    try {
                        return this.localStorageGetItem("LearnerId." + _state2.default.get("apiKey") + _constants2.default.CACHE_KEY.USER);
                    } catch (e) {}
                }
            }, {
                key: "getCachedSingletonLearnerFlag",
                value: function getCachedSingletonLearnerFlag() {
                    try {
                        return this.localStorageGetItem("SingletonLearnerFlag." + _state2.default.get("apiKey") + _constants2.default.CACHE_KEY.USER);
                    } catch (e) {
                        return true;
                    }
                }
            } ]);
            return KidaptiveSdkUtils;
        }();
        exports.default = new KidaptiveSdkUtils();
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
            var thisError = new Error("KidaptiveError (" + type + ") " + message);
            thisError.type = type;
            return thisError;
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
        var _utils = __webpack_require__(0);
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
                    var copy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                    return copy ? _utils2.default.copyObject(_state[property]) : _state[property];
                }
            }, {
                key: "set",
                value: function set(property, value) {
                    var copy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                    _state[property] = copy ? _utils2.default.copyObject(value) : value;
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
        }).call(this, __webpack_require__(9), __webpack_require__(27).setImmediate);
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = {
            DEFAULT: {
                AUTH_MODE: "client",
                AUTO_FLUSH_INTERVAL: 6e4,
                LOGGING_LEVEL: "all",
                TIER: 1
            },
            ENDPOINT: {
                ABILITY: "/ability",
                CLIENT_SESSION: "/learner/client-session",
                DIMENSION: "/dimension",
                GAME: "/game",
                INGESTION: "/ingestion",
                INSIGHT: "/insight",
                LOCAL_ABILITY: "/local-ability",
                LOCAL_DIMENSION: "/local-dimension",
                LOGOUT: "/user/logout",
                METRIC: "/metric"
            },
            HOST: {
                DEV: "https://develop.kidaptive.com/v3",
                PROD: "https://service.kidaptive.com/v3"
            },
            USER_ENDPOINTS: [ "ABILITY", "CLIENT_SESSION", "INGESTION", "INSIGHT", "LOCAL_ABILITY", "LOGOUT", "METRIC" ],
            CACHE_KEY: {
                USER: ".alpUserData",
                APP: ".alpAppData"
            }
        };
    }, function(module, exports) {
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
        var _constants = __webpack_require__(4);
        var _constants2 = _interopRequireDefault(_constants);
        var _error = __webpack_require__(1);
        var _error2 = _interopRequireDefault(_error);
        var _state = __webpack_require__(2);
        var _state2 = _interopRequireDefault(_state);
        var _utils = __webpack_require__(0);
        var _utils2 = _interopRequireDefault(_utils);
        var _base = __webpack_require__(30);
        var _base2 = _interopRequireDefault(_base);
        var _jsSha = __webpack_require__(29);
        var _jsSha2 = _interopRequireDefault(_jsSha);
        var _q = __webpack_require__(3);
        var _q2 = _interopRequireDefault(_q);
        var _superagentQ = __webpack_require__(25);
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
                        var settings = _this.getRequestSettings(method, endpoint, data, options);
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
                        var cacheKey = _this.getCacheKey(settings);
                        try {
                            return request.end().then(function(result) {
                                if (!options.noCache) {
                                    _utils2.default.localStorageSetItem(cacheKey, result.body);
                                }
                                return result.body;
                            }, function(error) {
                                var parseError = error.parse && "Cannot parse response" || "";
                                var status = error && (error.status || error.statusCode);
                                var errorMessage = error.response && error.response.text || parseError;
                                if (status === 400) {
                                    _utils2.default.localStorageRemoveItem(cacheKey);
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, errorMessage);
                                } else if (status === 401) {
                                    _utils2.default.clearUserCache();
                                    if (!KidaptiveSdkHttpClient.isUserEndpoint(endpoint)) {
                                        _utils2.default.clearAppCache();
                                    }
                                    throw new _error2.default(_error2.default.ERROR_CODES.API_KEY_ERROR, errorMessage);
                                } else if (status && (status < 200 || status >= 300)) {
                                    _utils2.default.localStorageRemoveItem(cacheKey);
                                    throw new _error2.default(_error2.default.ERROR_CODES.WEB_API_ERROR, errorMessage);
                                } else {
                                    try {
                                        return _utils2.default.localStorageGetItem(cacheKey);
                                    } catch (e) {
                                        throw new _error2.default(_error2.default.ERROR_CODES.GENERIC_ERROR, "HTTP Client Error" + (errorMessage ? ": " + errorMessage : ""));
                                    }
                                }
                            });
                        } catch (errorMessage) {
                            try {
                                return _utils2.default.localStorageGetItem(cacheKey);
                            } catch (e) {
                                throw new _error2.default(_error2.default.ERROR_CODES.GENERIC_ERROR, "HTTP Client Error" + (errorMessage ? ": " + errorMessage : ""));
                            }
                        }
                    });
                }
            }, {
                key: "getCacheKey",
                value: function getCacheKey(settings) {
                    return _base2.default.encode(String.fromCharCode.apply(undefined, _jsSha2.default.array(_utils2.default.toJson(settings)))).replace(/[+]/g, "-").replace(/[/]/g, "_").replace(/=+/, "") + (KidaptiveSdkHttpClient.isUserEndpoint(settings.endpoint) ? _constants2.default.CACHE_KEY.USER : _constants2.default.CACHE_KEY.APP);
                }
            }, {
                key: "getRequestSettings",
                value: function getRequestSettings(method, endpoint, data) {
                    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                    var apiKey = _state2.default.get("apiKey");
                    var user = _state2.default.get("user");
                    if (KidaptiveSdkHttpClient.isUserEndpoint(endpoint) && user && user.apiKey && !options.defaultApiKey) {
                        apiKey = user.apiKey;
                    }
                    var settings = {
                        method: method,
                        host: KidaptiveSdkHttpClient.getHost(),
                        apiKey: apiKey,
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
        var _utils = __webpack_require__(0);
        var _utils2 = _interopRequireDefault(_utils);
        var _q = __webpack_require__(3);
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
                this.executing = false;
                this.operationQueue = (0, _q2.default)(true);
            }
            _createClass(KidaptiveSdkOperationManager, [ {
                key: "addToQueue",
                value: function addToQueue(action) {
                    var _this = this;
                    if (this.executing) {
                        return _q2.default.fcall(action);
                    }
                    var actionPromise = this.operationQueue.then(function() {
                        _this.executing = true;
                        return _q2.default.fcall(action);
                    });
                    this.operationQueue = actionPromise.then(function() {
                        _this.executing = false;
                    }, function(error) {
                        _this.executing = false;
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
        var _httpClient = __webpack_require__(6);
        var _httpClient2 = _interopRequireDefault(_httpClient);
        var _error = __webpack_require__(1);
        var _error2 = _interopRequireDefault(_error);
        var _operationManager = __webpack_require__(7);
        var _operationManager2 = _interopRequireDefault(_operationManager);
        var _state = __webpack_require__(2);
        var _state2 = _interopRequireDefault(_state);
        var _utils = __webpack_require__(0);
        var _utils2 = _interopRequireDefault(_utils);
        var _q = __webpack_require__(3);
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
        var KidaptiveSdkModelManager = function() {
            function KidaptiveSdkModelManager() {
                var _this = this;
                _classCallCheck(this, KidaptiveSdkModelManager);
                this.modelParents = {
                    tier2: {
                        dimension: [],
                        game: [],
                        "local-dimension": [ "dimension", "game" ]
                    },
                    tier3: {
                        dimension: [],
                        game: [],
                        "local-dimension": [ "dimension", "game" ],
                        item: [ "prompt", "local-dimension" ],
                        prompt: [ "game" ]
                    }
                };
                this.modelOrder = {};
                Object.keys(this.modelParents).forEach(function(tier) {
                    _this.modelOrder[tier] = [];
                    var determineModelOrder = function determineModelOrder(modelTypes) {
                        modelTypes.forEach(function(modelType) {
                            determineModelOrder(_this.modelParents[tier][modelType]);
                            if (_this.modelOrder[tier].indexOf(modelType) === -1) {
                                _this.modelOrder[tier].push(modelType);
                            }
                        });
                    };
                    determineModelOrder(Object.keys(_this.modelParents[tier]));
                });
            }
            _createClass(KidaptiveSdkModelManager, [ {
                key: "getGames",
                value: function getGames() {
                    _utils2.default.checkTier(2);
                    var modelListLookup = _state2.default.get("modelListLookup", false) || {};
                    var modelList = modelListLookup["game"] || [];
                    return _utils2.default.copyObject(modelList);
                }
            }, {
                key: "getGameByUri",
                value: function getGameByUri(gameUri) {
                    _utils2.default.checkTier(2);
                    if (!_utils2.default.isString(gameUri)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "gameUri must be a string");
                    }
                    var uriToModel = _state2.default.get("uriToModel", false) || {};
                    var modelMap = uriToModel["game"];
                    var model = modelMap && modelMap[gameUri];
                    return _utils2.default.copyObject(model);
                }
            }, {
                key: "getDimensions",
                value: function getDimensions() {
                    _utils2.default.checkTier(2);
                    var modelListLookup = _state2.default.get("modelListLookup", false) || {};
                    var modelList = modelListLookup["dimension"] || [];
                    return _utils2.default.copyObject(modelList);
                }
            }, {
                key: "getDimensionByUri",
                value: function getDimensionByUri(dimensionUri) {
                    _utils2.default.checkTier(2);
                    if (!_utils2.default.isString(dimensionUri)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "dimensionUri must be a string");
                    }
                    var uriToModel = _state2.default.get("uriToModel", false) || {};
                    var modelMap = uriToModel["dimension"];
                    var model = modelMap && modelMap[dimensionUri];
                    return _utils2.default.copyObject(model);
                }
            }, {
                key: "getLocalDimensions",
                value: function getLocalDimensions() {
                    _utils2.default.checkTier(2);
                    var modelListLookup = _state2.default.get("modelListLookup", false) || {};
                    var modelList = modelListLookup["local-dimension"] || [];
                    return _utils2.default.copyObject(modelList);
                }
            }, {
                key: "getLocalDimensionByUri",
                value: function getLocalDimensionByUri(localDimensionUri) {
                    _utils2.default.checkTier(2);
                    if (!_utils2.default.isString(localDimensionUri)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "localDimensionUri must be a string");
                    }
                    var uriToModel = _state2.default.get("uriToModel", false) || {};
                    var modelMap = uriToModel["local-dimension"];
                    var model = modelMap && modelMap[localDimensionUri];
                    return _utils2.default.copyObject(model);
                }
            }, {
                key: "getItems",
                value: function getItems() {
                    _utils2.default.checkTier(3);
                    var modelListLookup = _state2.default.get("modelListLookup", false) || {};
                    var modelList = modelListLookup["item"] || [];
                    return _utils2.default.copyObject(modelList);
                }
            }, {
                key: "getItemByUri",
                value: function getItemByUri(itemUri) {
                    _utils2.default.checkTier(3);
                    if (!_utils2.default.isString(itemUri)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "itemUri must be a string");
                    }
                    var uriToModel = _state2.default.get("uriToModel", false) || {};
                    var modelMap = uriToModel["item"];
                    var model = modelMap && modelMap[itemUri];
                    return _utils2.default.copyObject(model);
                }
            }, {
                key: "getItemsByPromptUri",
                value: function getItemsByPromptUri(promptUri) {
                    _utils2.default.checkTier(3);
                    if (!_utils2.default.isString(promptUri)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "promptUri must be a string");
                    }
                    var modelListLookup = _state2.default.get("modelListLookup", false) || {};
                    var modelList = modelListLookup["item"] || [];
                    var filteredModelList = modelList.filter(function(model) {
                        return model.prompt.uri === promptUri;
                    });
                    return _utils2.default.copyObject(filteredModelList);
                }
            }, {
                key: "getPrompts",
                value: function getPrompts() {
                    _utils2.default.checkTier(3);
                    var modelListLookup = _state2.default.get("modelListLookup", false) || {};
                    var modelList = modelListLookup["prompt"] || [];
                    return _utils2.default.copyObject(modelList);
                }
            }, {
                key: "getPromptByUri",
                value: function getPromptByUri(promptUri) {
                    _utils2.default.checkTier(3);
                    if (!_utils2.default.isString(promptUri)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "promptUri must be a string");
                    }
                    var uriToModel = _state2.default.get("uriToModel", false) || {};
                    var modelMap = uriToModel["prompt"];
                    var model = modelMap && modelMap[promptUri];
                    return _utils2.default.copyObject(model);
                }
            }, {
                key: "getPromptsByGameUri",
                value: function getPromptsByGameUri(gameUri) {
                    _utils2.default.checkTier(3);
                    if (!_utils2.default.isString(gameUri)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "gameUri must be a string");
                    }
                    var modelListLookup = _state2.default.get("modelListLookup", false) || {};
                    var modelList = modelListLookup["prompt"] || [];
                    var filteredModelList = modelList.filter(function(model) {
                        return model.game.uri === gameUri;
                    });
                    return _utils2.default.copyObject(filteredModelList);
                }
            }, {
                key: "updateModels",
                value: function updateModels() {
                    var _this2 = this;
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(2);
                        _state2.default.set("uriToModel", {});
                        _state2.default.set("idToModel", {});
                        _state2.default.set("modelListLookup", {});
                        var options = _state2.default.get("options") || {};
                        var tierKey = "tier" + options.tier;
                        var modelOrder = _this2.modelOrder[tierKey];
                        var modelParents = _this2.modelParents[tierKey];
                        var requests = modelOrder.map(function(model) {
                            return _httpClient2.default.request("GET", "/" + model);
                        });
                        return _q2.default.all(requests).then(function(results) {
                            var uriToModel = {};
                            var idToModel = {};
                            var modelListLookup = {};
                            var _loop = function _loop(i) {
                                var modelName = modelOrder[i];
                                var modelUriMap = {};
                                var modelIdMap = {};
                                var modelList = [];
                                var modelArray = results[i] || [];
                                modelArray.forEach(function(model) {
                                    var modelCopy = _utils2.default.copyObject(model);
                                    modelParents[modelName].forEach(function(modelParentName) {
                                        var publicModelParentName = modelParentName.replace(/-([a-z])/g, function(matched) {
                                            return matched[1].toUpperCase();
                                        });
                                        var modelParentId = modelCopy[publicModelParentName + "Id"];
                                        var idToModel = _state2.default.get("idToModel", false) || {};
                                        modelCopy[publicModelParentName] = idToModel[modelParentName] && idToModel[modelParentName][modelParentId];
                                        delete modelCopy[publicModelParentName + "Id"];
                                    });
                                    modelUriMap[modelCopy.uri] = modelCopy;
                                    modelIdMap[modelCopy.id] = modelCopy;
                                    modelList.push(modelCopy);
                                });
                                uriToModel[modelName] = modelUriMap;
                                idToModel[modelName] = modelIdMap;
                                modelListLookup[modelName] = modelList;
                                _state2.default.set("uriToModel", uriToModel, false);
                                _state2.default.set("idToModel", idToModel, false);
                                _state2.default.set("modelListLookup", modelListLookup, false);
                            };
                            for (var i = 0; i < results.length; i++) {
                                _loop(i);
                            }
                        }, function(error) {
                            throw error;
                        });
                    });
                }
            } ]);
            return KidaptiveSdkModelManager;
        }();
        exports.default = new KidaptiveSdkModelManager();
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
        var _error = __webpack_require__(1);
        var _error2 = _interopRequireDefault(_error);
        var _state = __webpack_require__(2);
        var _state2 = _interopRequireDefault(_state);
        var _utils = __webpack_require__(0);
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
        var KidaptiveSdkRecommendationManager = function() {
            function KidaptiveSdkRecommendationManager() {
                _classCallCheck(this, KidaptiveSdkRecommendationManager);
            }
            _createClass(KidaptiveSdkRecommendationManager, [ {
                key: "registerRecommender",
                value: function registerRecommender(recommender, key) {
                    _utils2.default.checkTier(2);
                    var recommenderError = KidaptiveSdkRecommendationManager.checkRecommender(recommender);
                    if (recommenderError) {
                        throw recommenderError;
                    }
                    if (key == null) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Recommender key is required");
                    }
                    if (!_utils2.default.isString(key)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Recommender key must be a string");
                    }
                    var recommenders = _state2.default.get("recommenders", false) || {};
                    if (recommenders[key] && _utils2.default.checkLoggingLevel("warn") && console && console.log) {
                        console.log("Warning: recommender key already exists, recommender will be replaced.");
                    }
                    recommenders[key] = _utils2.default.copyObject(recommender);
                    _state2.default.set("recommenders", recommenders, false);
                }
            }, {
                key: "unregisterRecommender",
                value: function unregisterRecommender(key) {
                    _utils2.default.checkTier(2);
                    if (key == null) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Recommender key is required");
                    }
                    if (!_utils2.default.isString(key)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Recommender key must be a string");
                    }
                    var recommenders = _state2.default.get("recommenders", false) || {};
                    if (!recommenders[key]) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: recommender key does not exist.");
                        }
                        return;
                    }
                    delete recommenders[key];
                    _state2.default.set("recommenders", recommenders, false);
                }
            }, {
                key: "getRecommenderKeys",
                value: function getRecommenderKeys() {
                    _utils2.default.checkTier(2);
                    var recommenders = _state2.default.get("recommenders", false) || {};
                    return Object.keys(recommenders);
                }
            }, {
                key: "getRecommendation",
                value: function getRecommendation(key) {
                    var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    _utils2.default.checkTier(2);
                    if (parameters === null) {
                        parameters = {};
                    }
                    if (key == null) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Recommender key is required");
                    }
                    if (!_utils2.default.isString(key)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Recommender key must be a string");
                    }
                    if (!_utils2.default.isObject(parameters)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Parameters must be an object");
                    }
                    var recommenders = _state2.default.get("recommenders", false) || {};
                    if (!recommenders[key]) {
                        return {
                            error: new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "Recommender for the provided key does not exist")
                        };
                    }
                    var recommendationResult = recommenders[key].getRecommendation(parameters);
                    var recommendationResultError = KidaptiveSdkRecommendationManager.checkRecommendationResult(recommendationResult);
                    if (recommendationResultError) {
                        return {
                            error: recommendationResultError
                        };
                    }
                    return recommendationResult;
                }
            } ], [ {
                key: "checkRecommender",
                value: function checkRecommender(recommender) {
                    if (recommender == null) {
                        return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Recommender is required");
                    }
                    if (!_utils2.default.isObject(recommender)) {
                        return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Recommender must be an object");
                    }
                    if (recommender.getRecommendation == null) {
                        return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Recommender.getRecommendation must be defined");
                    }
                    if (!_utils2.default.isFunction(recommender.getRecommendation)) {
                        return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Recommender.getRecommendation must be a function");
                    }
                }
            }, {
                key: "checkRecommendationResult",
                value: function checkRecommendationResult(recommendationResult) {
                    if (recommendationResult == null) {
                        return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "No recommendationResult is returned from the recommender");
                    }
                    if (!_utils2.default.isObject(recommendationResult)) {
                        return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "The recommendationResult returned from the recommender must be an object");
                    }
                    if (recommendationResult.error) {} else {
                        var errorPrefix = "The recommendationResult returned from the recommender ";
                        if (recommendationResult.type == null) {
                            return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, errorPrefix + "must have a type property");
                        }
                        if (!_utils2.default.isString(recommendationResult.type)) {
                            return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, errorPrefix + "must have a type property that is a string");
                        }
                        if (recommendationResult.recommendations == null) {
                            return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, errorPrefix + "must have a recommendations property");
                        }
                        if (!_utils2.default.isArray(recommendationResult.recommendations)) {
                            return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, errorPrefix + "must have a recommendations property that is an array");
                        }
                        if (recommendationResult.context != null) {
                            if (!_utils2.default.isObject(recommendationResult.context)) {
                                return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, errorPrefix + "must have a context property that is an object");
                            }
                            var hasContextStringError = false;
                            Object.keys(recommendationResult.context).forEach(function(contextKey) {
                                if (!_utils2.default.isString(recommendationResult.context[contextKey])) {
                                    hasContextStringError = true;
                                }
                            });
                            if (hasContextStringError) {
                                return new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, errorPrefix + "must have a context property that is an object of key:value pairs with string values");
                            }
                        }
                    }
                }
            } ]);
            return KidaptiveSdkRecommendationManager;
        }();
        exports.default = new KidaptiveSdkRecommendationManager();
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
        var _constants = __webpack_require__(4);
        var _constants2 = _interopRequireDefault(_constants);
        var _error = __webpack_require__(1);
        var _error2 = _interopRequireDefault(_error);
        var _eventManager = __webpack_require__(14);
        var _eventManager2 = _interopRequireDefault(_eventManager);
        var _httpClient = __webpack_require__(6);
        var _httpClient2 = _interopRequireDefault(_httpClient);
        var _modelManager = __webpack_require__(8);
        var _modelManager2 = _interopRequireDefault(_modelManager);
        var _operationManager = __webpack_require__(7);
        var _operationManager2 = _interopRequireDefault(_operationManager);
        var _recommendationManager = __webpack_require__(10);
        var _recommendationManager2 = _interopRequireDefault(_recommendationManager);
        var _state = __webpack_require__(2);
        var _state2 = _interopRequireDefault(_state);
        var _utils = __webpack_require__(0);
        var _utils2 = _interopRequireDefault(_utils);
        var _q = __webpack_require__(3);
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
        var KidaptiveSdkLearnerManager = function() {
            function KidaptiveSdkLearnerManager() {
                _classCallCheck(this, KidaptiveSdkLearnerManager);
            }
            _createClass(KidaptiveSdkLearnerManager, [ {
                key: "setUser",
                value: function setUser() {
                    var _this = this;
                    var userObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(1);
                        var options = _state2.default.get("options") || {};
                        if (options.authMode === "client") {
                            if (userObject.providerUserId == null) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "providerUserId is required");
                            }
                            if (!_utils2.default.isString(userObject.providerUserId)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "providerUserId must be a string");
                            }
                            if (userObject.apiKey != null) {
                                throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "setUser apiKey not supported when the SDK authMode is cient");
                            }
                            if (userObject.providerId != null) {
                                throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "setUser providerId not supported when the SDK authMode is cient");
                            }
                            if (userObject.id != null) {
                                throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "setUser id not supported when the SDK authMode is cient");
                            }
                        }
                        if (options.authMode === "server") {
                            var commonParamError = "Invalid object passed to setUser. Please ensure SDK authmode is correct and the object being passed to setUser is correct.";
                            if (userObject.apiKey == null) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, commonParamError + " ApiKey is required");
                            }
                            if (!_utils2.default.isString(userObject.apiKey)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, commonParamError + " ApiKey must be a string");
                            }
                            if (userObject.id == null) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, commonParamError + " User ID is required");
                            }
                            if (!_utils2.default.isNumber(userObject.id)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, commonParamError + " User ID must be a number");
                            }
                            if (!_utils2.default.isArray(userObject.learners)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, commonParamError + " Learners must be an array");
                            }
                            userObject.learners.forEach(function(learner) {
                                if (!_utils2.default.isObject(learner)) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, commonParamError + " Learner must be an object");
                                }
                                if (learner.id == null) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, commonParamError + " Learner ID is required");
                                }
                                if (!_utils2.default.isNumber(learner.id)) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, commonParamError + " Learner ID must be a number");
                                }
                                if (learner.providerId == null) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, commonParamError + " Learner ProviderID is required");
                                }
                                if (!_utils2.default.isString(learner.providerId)) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, commonParamError + " Learner ProviderID must be a string");
                                }
                            });
                        }
                        return _eventManager2.default.flushEventQueue().then(function() {
                            if (options.authMode === "client") {
                                return _httpClient2.default.request("POST", _constants2.default.ENDPOINT.CLIENT_SESSION, {
                                    providerUserId: userObject.providerUserId
                                }, {
                                    defaultApiKey: true
                                }).then(function(userObjectResponse) {
                                    if (KidaptiveSdkLearnerManager.userIdDifferent(userObjectResponse.id)) {
                                        return _this.logout().then(function() {
                                            var cacheKey = _httpClient2.default.getCacheKey(_httpClient2.default.getRequestSettings("POST", _constants2.default.ENDPOINT.CLIENT_SESSION, {
                                                providerUserId: userObject.providerUserId
                                            }, {
                                                defaultApiKey: true
                                            }));
                                            _utils2.default.localStorageSetItem(cacheKey, userObjectResponse);
                                            KidaptiveSdkLearnerManager.onClientSetUserSuccess(userObjectResponse);
                                        });
                                    }
                                    KidaptiveSdkLearnerManager.onClientSetUserSuccess(userObjectResponse);
                                });
                            }
                            if (options.authMode === "server") {
                                if (KidaptiveSdkLearnerManager.userIdDifferent(userObject.id)) {
                                    return _this.logout().then(function() {
                                        KidaptiveSdkLearnerManager.onServerSetUserSuccess(userObject);
                                    });
                                }
                                KidaptiveSdkLearnerManager.onServerSetUserSuccess(userObject);
                            }
                        });
                    });
                }
            }, {
                key: "selectActiveLearner",
                value: function selectActiveLearner(providerLearnerId) {
                    var _this2 = this;
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(1);
                        var options = _state2.default.get("options") || {};
                        var user = _state2.default.get("user");
                        var learnerId = _state2.default.get("learnerId");
                        var singletonLearner = _state2.default.get("singletonLearner") === false ? false : true;
                        if (providerLearnerId == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "providerLearnerId is required");
                        }
                        if (!_utils2.default.isString(providerLearnerId)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "providerLearnerId must be a string");
                        }
                        if (options.authMode === "client") {
                            var learner = _utils2.default.findItem(_this2.getLearnerList(), function(learner) {
                                return learner.providerId === providerLearnerId;
                            });
                            if (learner) {
                                _state2.default.set("learnerId", learner.id);
                                _utils2.default.cacheLearnerId(learner.id);
                                if (options.tier >= 2) {
                                    return _this2.updateAbilityEstimates().then(function() {}, function() {}).then(function() {
                                        return _this2.startTrial();
                                    });
                                }
                                return _this2.startTrial();
                            }
                            if (singletonLearner && learnerId != null) {
                                return _this2.logout().then(function() {
                                    return _this2.selectActiveLearner(providerLearnerId);
                                });
                            }
                            return _httpClient2.default.request("POST", _constants2.default.ENDPOINT.CLIENT_SESSION, {
                                providerLearnerId: providerLearnerId,
                                providerUserId: user && user.providerId
                            }, {
                                defaultApiKey: true
                            }).then(function(userObjectResponse) {
                                var newUserObject = _state2.default.get("user");
                                if (!singletonLearner) {
                                    if (userObjectResponse.learners < 1) {
                                        throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "The client session response is missing learner information");
                                    }
                                    newUserObject.learners.push(userObjectResponse.learners[0]);
                                } else {
                                    newUserObject = userObjectResponse;
                                    _state2.default.set("singletonLearner", true);
                                    _utils2.default.cacheSingletonLearnerFlag(true);
                                }
                                _state2.default.set("user", newUserObject);
                                var activeLearner = _utils2.default.findItem(_this2.getLearnerList(), function(learner) {
                                    return learner.providerId === providerLearnerId;
                                });
                                if (!activeLearner) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "A learner with that providerLearnerId does not exist");
                                }
                                _state2.default.set("learnerId", activeLearner.id);
                                _utils2.default.cacheUser(newUserObject);
                                _utils2.default.cacheLearnerId(activeLearner.id);
                                if (options.tier >= 2) {
                                    return _this2.updateAbilityEstimates().then(function() {}, function() {}).then(function() {
                                        return _this2.startTrial();
                                    });
                                }
                                return _this2.startTrial();
                            });
                        }
                        if (options.authMode === "server") {
                            if (!user) {
                                throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "KidaptiveSdk.leanerManager.setUser must be called before setting an active learner when using server authentication");
                            }
                            var activeLearner = _utils2.default.findItem(_this2.getLearnerList(), function(learner) {
                                return learner.providerId === providerLearnerId;
                            });
                            if (!activeLearner) {
                                throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "A learner with that providerLearnerId does not exist");
                            }
                            _state2.default.set("learnerId", activeLearner.id);
                            _utils2.default.cacheLearnerId(activeLearner.id);
                            if (options.tier >= 2) {
                                return _this2.updateAbilityEstimates().then(function() {
                                    return _this2.startTrial();
                                });
                            }
                            return _this2.startTrial();
                        }
                    });
                }
            }, {
                key: "clearActiveLearner",
                value: function clearActiveLearner() {
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(1);
                        var options = _state2.default.get("options") || {};
                        if (options.authMode === "client" && _state2.default.get("singletonLearner") === true) {
                            _utils2.default.clearUserCache();
                            _state2.default.set("user", undefined);
                        }
                        _state2.default.set("learnerId", undefined);
                        _utils2.default.cacheLearnerId(undefined);
                    });
                }
            }, {
                key: "logout",
                value: function logout() {
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(1);
                        return _eventManager2.default.flushEventQueue().then(function() {
                            var options = _state2.default.get("options") || {};
                            if (options.authMode === "server" && _state2.default.get("user")) {
                                return _httpClient2.default.request("POST", _constants2.default.ENDPOINT.LOGOUT, undefined, {
                                    noCache: true
                                }).then(function() {}, function() {});
                            }
                        }).then(function() {
                            _utils2.default.clearUserCache();
                            _state2.default.set("learnerId", undefined);
                            _state2.default.set("user", undefined);
                            _state2.default.set("singletonLearner", undefined);
                        });
                    });
                }
            }, {
                key: "getUser",
                value: function getUser() {
                    _utils2.default.checkTier(1);
                    return _state2.default.get("user") || undefined;
                }
            }, {
                key: "getActiveLearner",
                value: function getActiveLearner() {
                    _utils2.default.checkTier(1);
                    var learnerId = _state2.default.get("learnerId");
                    if (learnerId == null) {
                        return;
                    }
                    return _utils2.default.findItem(this.getLearnerList(), function(learner) {
                        return learner.id === learnerId;
                    });
                }
            }, {
                key: "getLearnerList",
                value: function getLearnerList() {
                    _utils2.default.checkTier(1);
                    var userObject = _state2.default.get("user") || {};
                    return _utils2.default.isArray(userObject.learners) ? userObject.learners : [];
                }
            }, {
                key: "getMetricsByUri",
                value: function getMetricsByUri(metricUri, minTimestamp, maxTimestamp) {
                    return _q2.default.fcall(function() {
                        _utils2.default.checkTier(1);
                        if (metricUri == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "metricUri is required");
                        }
                        if (!_utils2.default.isString(metricUri)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "metricUri must be a string");
                        }
                        if (minTimestamp != null) {
                            if (!_utils2.default.isInteger(minTimestamp) || minTimestamp < 0) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "minTimestamp must be an integer that is at least 0");
                            }
                        }
                        if (maxTimestamp != null) {
                            if (!_utils2.default.isInteger(maxTimestamp) || maxTimestamp < 1) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "maxTimestamp must be a positive integer greater than 0");
                            }
                        }
                        if (minTimestamp != null && maxTimestamp != null) {
                            if (minTimestamp >= maxTimestamp) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "maxTimestamp must be greater than minTimestamp");
                            }
                            if (maxTimestamp - minTimestamp > 31536e6) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "minTimestamp and maxTimestamp can only be 1 year (365 days) apart");
                            }
                        }
                        var learnerId = _state2.default.get("learnerId");
                        if (learnerId == null) {
                            if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                                console.log("Warning: getMetricsByUri called with no active learner selected.");
                            }
                            return;
                        }
                        if (minTimestamp == null && maxTimestamp == null) {
                            maxTimestamp = Date.now() + 864e5;
                            minTimestamp = maxTimestamp - 31536e6;
                        } else if (minTimestamp == null) {
                            minTimestamp = maxTimestamp - 31536e6;
                            if (minTimestamp < 0) {
                                minTimestamp = 0;
                            }
                        } else if (maxTimestamp == null) {
                            maxTimestamp = minTimestamp + 31536e6;
                        }
                        var data = {
                            learnerId: learnerId,
                            items: [ {
                                name: metricUri,
                                start: minTimestamp,
                                end: maxTimestamp
                            } ]
                        };
                        var options = {
                            noCache: true
                        };
                        return _httpClient2.default.request("POST", _constants2.default.ENDPOINT.METRIC, data, options).then(function(result) {
                            return result;
                        });
                    });
                }
            }, {
                key: "getLatestInsightByUri",
                value: function getLatestInsightByUri(insightUri, contextKeys) {
                    return _q2.default.fcall(function() {
                        _utils2.default.checkTier(1);
                        if (insightUri == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "insightUri is required");
                        }
                        if (!_utils2.default.isString(insightUri)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "insightUri must be a string");
                        }
                        if (contextKeys != null) {
                            if (!_utils2.default.isArray(contextKeys)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "contextKeys must be an array");
                            } else {
                                contextKeys.forEach(function(contextKey) {
                                    if (!_utils2.default.isString(contextKey)) {
                                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "contextKeys must be an array of strings");
                                    }
                                });
                            }
                        }
                        var learnerId = _state2.default.get("learnerId");
                        if (learnerId == null) {
                            if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                                console.log("Warning: getLatestInsightByUri called with no active learner selected.");
                            }
                            return;
                        }
                        var data = {
                            learnerId: learnerId,
                            uri: insightUri,
                            latest: true
                        };
                        if (contextKeys != null) {
                            data.contextKeys = contextKeys.join(",");
                        }
                        var options = {
                            noCache: true
                        };
                        return _httpClient2.default.request("GET", _constants2.default.ENDPOINT.INSIGHT, data, options).then(function(result) {
                            return result && result.length ? result[0] : undefined;
                        });
                    });
                }
            }, {
                key: "getInsights",
                value: function getInsights(minTimestamp, contextMap) {
                    return _q2.default.fcall(function() {
                        _utils2.default.checkTier(1);
                        if (minTimestamp == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "minTimestamp is required");
                        }
                        if (!_utils2.default.isInteger(minTimestamp) || minTimestamp < 0) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "minTimestamp must be an integer that is at least 0");
                        }
                        if (contextMap != null) {
                            if (!_utils2.default.isObject(contextMap)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "contextMap must be an object");
                            } else {
                                Object.keys(contextMap).forEach(function(contextKey) {
                                    if (!_utils2.default.isString(contextMap[contextKey])) {
                                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "contextMap must be an object of key:value pairs with string values");
                                    }
                                });
                            }
                        }
                        var learnerId = _state2.default.get("learnerId");
                        if (learnerId == null) {
                            if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                                console.log("Warning: getInsights called with no active learner selected.");
                            }
                            return [];
                        }
                        var data = {
                            learnerId: learnerId,
                            minDateCreated: minTimestamp
                        };
                        if (contextMap != null) {
                            Object.keys(contextMap).forEach(function(contextKey) {
                                data["context." + contextKey] = contextMap[contextKey];
                            });
                        }
                        var options = {
                            noCache: true
                        };
                        return _httpClient2.default.request("GET", _constants2.default.ENDPOINT.INSIGHT, data, options).then(function(result) {
                            return result;
                        });
                    });
                }
            }, {
                key: "startTrial",
                value: function startTrial() {
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(1);
                        var learnerId = _state2.default.get("learnerId");
                        if (learnerId == null) {
                            if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                                console.log("Warning: startTrial called with no active learner selected.");
                            }
                            return;
                        }
                        var trialTime = Date.now();
                        var options = _state2.default.get("options");
                        if (options.tier >= 3) {
                            var previousLatentAbilities = _state2.default.get("latentAbilities." + learnerId) || [];
                            var updatedLatentAbilities = previousLatentAbilities.map(function(latentAbility) {
                                var updatedLatentAbility = _utils2.default.copyObject(latentAbility);
                                if (updatedLatentAbility.standardDeviation < .65) {
                                    updatedLatentAbility.standardDeviation = .65;
                                    updatedLatentAbility.timestamp = trialTime;
                                }
                                return updatedLatentAbility;
                            });
                            _state2.default.set("latentAbilities." + learnerId, updatedLatentAbilities);
                        }
                        _state2.default.set("trialTime", trialTime);
                    });
                }
            }, {
                key: "getLatentAbilityEstimates",
                value: function getLatentAbilityEstimates() {
                    var _this3 = this;
                    _utils2.default.checkTier(2);
                    var learnerId = _state2.default.get("learnerId");
                    if (learnerId == null) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: getLatentAbilityEstimates called with no active learner selected.");
                        }
                        return [];
                    }
                    return _modelManager2.default.getDimensions().map(function(dimension) {
                        return _this3.getLatentAbilityEstimate(dimension && dimension.uri);
                    });
                }
            }, {
                key: "getLatentAbilityEstimate",
                value: function getLatentAbilityEstimate(dimensionUri) {
                    _utils2.default.checkTier(2);
                    var learnerId = _state2.default.get("learnerId");
                    if (learnerId == null) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: getLatentAbilityEstimate called with no active learner selected.");
                        }
                        return;
                    }
                    var dimension = _modelManager2.default.getDimensionByUri(dimensionUri);
                    if (!dimension) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: getLatentAbilityEstimate called with an invalid dimension.");
                        }
                        return;
                    }
                    var latentAbilities = _state2.default.get("latentAbilities." + learnerId) || [];
                    var latentAbility = _utils2.default.copyObject(_utils2.default.findItem(latentAbilities, function(latentAbility) {
                        return latentAbility.dimension.id === dimension.id;
                    }));
                    if (latentAbility) {
                        return latentAbility;
                    } else {
                        return {
                            dimension: dimension,
                            mean: 0,
                            standardDeviation: 1,
                            timestamp: 0
                        };
                    }
                }
            }, {
                key: "getLocalAbilityEstimates",
                value: function getLocalAbilityEstimates() {
                    var _this4 = this;
                    _utils2.default.checkTier(2);
                    var learnerId = _state2.default.get("learnerId");
                    if (learnerId == null) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: getLatentAbilityEstimates called with no active learner selected.");
                        }
                        return [];
                    }
                    return _modelManager2.default.getLocalDimensions().map(function(localDimension) {
                        return _this4.getLocalAbilityEstimate(localDimension && localDimension.uri);
                    });
                }
            }, {
                key: "getLocalAbilityEstimate",
                value: function getLocalAbilityEstimate(localDimensionUri) {
                    _utils2.default.checkTier(2);
                    var learnerId = _state2.default.get("learnerId");
                    if (learnerId == null) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: getLocalAbilityEstimate called with no active learner selected.");
                        }
                        return;
                    }
                    var localDimension = _modelManager2.default.getLocalDimensionByUri(localDimensionUri);
                    if (!localDimension) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: getLocalAbilityEstimate called with an invalid local dimension.");
                        }
                        return;
                    }
                    var dimension = localDimension.dimension || {};
                    var latentAbilities = _state2.default.get("latentAbilities." + learnerId) || [];
                    var latentAbility = _utils2.default.copyObject(_utils2.default.findItem(latentAbilities, function(latentAbility) {
                        return latentAbility.dimension.id === dimension.id;
                    }));
                    if (latentAbility) {
                        return {
                            localDimension: localDimension,
                            mean: latentAbility.mean,
                            standardDeviation: latentAbility.standardDeviation,
                            timestamp: latentAbility.timestamp
                        };
                    } else {
                        return {
                            localDimension: localDimension,
                            mean: 0,
                            standardDeviation: 1,
                            timestamp: 0
                        };
                    }
                }
            }, {
                key: "updateAbilityEstimates",
                value: function updateAbilityEstimates() {
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkTier(2);
                        var learnerId = _state2.default.get("learnerId");
                        if (learnerId == null) {
                            if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                                console.log("Warning: updateAbilityEstimates called with no active learner selected.");
                            }
                            return;
                        }
                        var idToModel = _state2.default.get("idToModel", false) || {};
                        var idToDimension = idToModel.dimension || {};
                        var cacheKey = _httpClient2.default.getCacheKey(_httpClient2.default.getRequestSettings("GET", _constants2.default.ENDPOINT.ABILITY, {
                            learnerId: learnerId
                        }));
                        var previousLatentAbilities = void 0;
                        try {
                            previousLatentAbilities = _utils2.default.localStorageGetItem(cacheKey) || [];
                            previousLatentAbilities.forEach(function(previousAbility) {
                                previousAbility.dimension = idToDimension[previousAbility.dimensionId];
                                delete previousAbility.dimensionId;
                            });
                        } catch (e) {
                            previousLatentAbilities = _state2.default.get("latentAbilities." + learnerId) || [];
                        }
                        return _httpClient2.default.request("GET", _constants2.default.ENDPOINT.ABILITY, {
                            learnerId: learnerId
                        }, {
                            noCache: true
                        }).then(function(latentAbilities) {
                            return latentAbilities;
                        }, function(error) {
                            return [];
                        }).then(function(latentAbilities) {
                            var newAbilities = [];
                            latentAbilities.forEach(function(latentAbility) {
                                var previousLatentAbility = _utils2.default.findItem(previousLatentAbilities, function(previousAbility) {
                                    return previousAbility.dimension.id === latentAbility.dimensionId;
                                });
                                if (!previousLatentAbility || previousLatentAbility.timestamp < latentAbility.timestamp) {
                                    var newAbility = _utils2.default.copyObject(latentAbility);
                                    newAbility.dimension = idToDimension[newAbility.dimensionId];
                                    delete newAbility.dimensionId;
                                    newAbilities.push(newAbility);
                                } else {
                                    newAbilities.push(previousLatentAbility);
                                }
                            });
                            previousLatentAbilities.forEach(function(previousAbility) {
                                if (!_utils2.default.findItem(newAbilities, function(newAbility) {
                                    return newAbility.dimension.id === previousAbility.dimension.id;
                                })) {
                                    newAbilities.push(previousAbility);
                                }
                            });
                            _state2.default.set("latentAbilities." + learnerId, newAbilities);
                            _utils2.default.cacheLatentAbilityEstimates(newAbilities);
                        });
                    });
                }
            }, {
                key: "getSuggestedPrompts",
                value: function getSuggestedPrompts(localDimensionUri, targetSuccessProbability, maxResults, excludedPromptUris, includedPromptUris) {
                    _utils2.default.checkTier(3);
                    var result = _recommendationManager2.default.getRecommendation("optimalDifficulty", {
                        localDimensionUri: localDimensionUri,
                        targetSuccessProbability: targetSuccessProbability,
                        maxResults: maxResults,
                        excludedPromptUris: excludedPromptUris,
                        includedPromptUris: includedPromptUris
                    });
                    if (result.error) {
                        throw result.error;
                    }
                    return result.recommendations;
                }
            }, {
                key: "getRandomPromptForGame",
                value: function getRandomPromptForGame(gameUri, maxResults, excludedPromptUris, includedPromptUris) {
                    _utils2.default.checkTier(3);
                    var result = _recommendationManager2.default.getRecommendation("random", {
                        gameUri: gameUri,
                        maxResults: maxResults,
                        excludedPromptUris: excludedPromptUris,
                        includedPromptUris: includedPromptUris
                    });
                    if (result.error) {
                        throw result.error;
                    }
                    return result.recommendations;
                }
            } ], [ {
                key: "onClientSetUserSuccess",
                value: function onClientSetUserSuccess(userObjectResponse) {
                    _utils2.default.cacheUser(userObjectResponse);
                    _utils2.default.cacheSingletonLearnerFlag(false);
                    _state2.default.set("user", userObjectResponse);
                    _state2.default.set("learnerId", undefined);
                    _state2.default.set("singletonLearner", false);
                }
            }, {
                key: "onServerSetUserSuccess",
                value: function onServerSetUserSuccess(userObject) {
                    _utils2.default.cacheUser(userObject);
                    _utils2.default.cacheSingletonLearnerFlag(false);
                    _state2.default.set("user", userObject);
                    _state2.default.set("learnerId", undefined);
                    _state2.default.set("singletonLearner", false);
                }
            }, {
                key: "userIdDifferent",
                value: function userIdDifferent(userId) {
                    var user = _state2.default.get("user") || _utils2.default.getCachedUser();
                    return user ? user.id !== userId : userId != null;
                }
            } ]);
            return KidaptiveSdkLearnerManager;
        }();
        exports.default = new KidaptiveSdkLearnerManager();
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                _typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                _typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return _typeof(obj);
        }
        function isObject(obj) {
            return obj !== null && _typeof(obj) === "object";
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
        var _attemptProcessor = __webpack_require__(36);
        var _attemptProcessor2 = _interopRequireDefault(_attemptProcessor);
        var _constants = __webpack_require__(4);
        var _constants2 = _interopRequireDefault(_constants);
        var _error = __webpack_require__(1);
        var _error2 = _interopRequireDefault(_error);
        var _httpClient = __webpack_require__(6);
        var _httpClient2 = _interopRequireDefault(_httpClient);
        var _operationManager = __webpack_require__(7);
        var _operationManager2 = _interopRequireDefault(_operationManager);
        var _state = __webpack_require__(2);
        var _state2 = _interopRequireDefault(_state);
        var _utils = __webpack_require__(0);
        var _utils2 = _interopRequireDefault(_utils);
        var _q = __webpack_require__(3);
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
                            additionalFields: _utils2.default.copyObject(eventFields),
                            name: eventName
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
                        var event = {
                            additionalFields: {
                                raw_event_payload: rawEvent
                            },
                            name: "raw_custom_event"
                        };
                        KidaptiveSdkEventManager.addToEventQueue(event);
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
                            var eventBatches = [];
                            eventQueue.forEach(function(event) {
                                eventBatches.push(event);
                                requests.push(_httpClient2.default.request("POST", _constants2.default.ENDPOINT.INGESTION, event, {
                                    noCache: true
                                }));
                            });
                            eventQueue = [];
                            KidaptiveSdkEventManager.setEventQueue(eventQueue);
                            return _q2.default.allSettled(requests).then(function(results) {
                                var requeue = [];
                                for (var i = 0; i < results.length; i++) {
                                    var rejected = results[i].state === "rejected";
                                    var error = results[i].reason || {};
                                    if (rejected && error.type !== _error2.default.ERROR_CODES.INVALID_PARAMETER) {
                                        requeue.push(eventBatches[i]);
                                    }
                                    if (requeue.length) {
                                        var newEventQueue = requeue.concat(KidaptiveSdkEventManager.getEventQueue());
                                        KidaptiveSdkEventManager.setEventQueue(newEventQueue);
                                    }
                                }
                                return results;
                            });
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
            }, {
                key: "setEventTransformer",
                value: function setEventTransformer(eventTransformer) {
                    _utils2.default.checkTier(3);
                    if (eventTransformer == null) {
                        _state2.default.set("eventTransformer");
                        return;
                    }
                    if (!_utils2.default.isFunction(eventTransformer)) {
                        throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "eventTransformer must be a function");
                    }
                    _state2.default.set("eventTransformer", eventTransformer, false);
                }
            } ], [ {
                key: "addToEventQueue",
                value: function addToEventQueue(event) {
                    var options = _state2.default.get("options") || {};
                    var user = _state2.default.get("user");
                    if (options.authMode === "server" && !user) {
                        throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "KidaptiveSdk.leanerManager.setUser must be called before sending events when using server authentication");
                    }
                    var updatedEvent = _utils2.default.copyObject(event);
                    updatedEvent.eventTime = Date.now();
                    updatedEvent.learnerId = _state2.default.get("learnerId");
                    updatedEvent.trialTime = _state2.default.get("trialTime");
                    updatedEvent.userId = user && user.id;
                    var appInfo = {
                        version: options.version,
                        build: options.build
                    };
                    var deviceInfo = {
                        deviceType: window && window.navigator && window.navigator.userAgent,
                        language: window && window.navigator && window.navigator.language
                    };
                    var eventQueue = KidaptiveSdkEventManager.getEventQueue();
                    var itemIndex = _utils2.default.findItemIndex(eventQueue, function(item) {
                        return item.appInfo.version === appInfo.version && item.appInfo.build === appInfo.build && item.deviceInfo.deviceType === deviceInfo.deviceType && item.deviceInfo.language === deviceInfo.language;
                    });
                    if (options.tier >= 3) {
                        var eventTransformer = _state2.default.get("eventTransformer", false);
                        if (eventTransformer) {
                            updatedEvent = _utils2.default.copyObject(eventTransformer(updatedEvent));
                            if (!_utils2.default.isObject(updatedEvent)) {
                                return;
                            }
                            KidaptiveSdkEventManager.validateTransformedEvent(updatedEvent);
                            if (_utils2.default.isArray(updatedEvent.attempts)) {
                                updatedEvent.attempts = updatedEvent.attempts.map(function(attempt) {
                                    var updatedAttempt = _attemptProcessor2.default.prepareAttempt(attempt);
                                    if (updatedAttempt && (!updatedEvent.tags || !updatedEvent.tags.skipIrt)) {
                                        _attemptProcessor2.default.processAttempt(updatedAttempt);
                                    }
                                    return updatedAttempt || attempt;
                                });
                            }
                        }
                    }
                    if (itemIndex !== -1) {
                        eventQueue[itemIndex].events.push(updatedEvent);
                    } else {
                        eventQueue.push({
                            appInfo: appInfo,
                            deviceInfo: deviceInfo,
                            events: [ updatedEvent ]
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
                        result = _state2.default.get("eventQueue");
                    }
                    if (!(result instanceof Array)) {
                        result = [];
                    }
                    return result;
                }
            }, {
                key: "setEventQueue",
                value: function setEventQueue(eventQueue) {
                    _state2.default.set("eventQueue", eventQueue);
                    _utils2.default.localStorageSetItem(KidaptiveSdkEventManager.getEventQueueCacheKey(), eventQueue);
                }
            }, {
                key: "getEventQueueCacheKey",
                value: function getEventQueueCacheKey() {
                    return _httpClient2.default.getCacheKey(_httpClient2.default.getRequestSettings("POST", _constants2.default.ENDPOINT.INGESTION));
                }
            }, {
                key: "validateTransformedEvent",
                value: function validateTransformedEvent(event) {
                    if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                        if (!_utils2.default.isString(event.name) || !event.name.length) {
                            console.log("Warning: eventTransformer returned an event with name not set as a string.");
                        }
                        if (!_utils2.default.isObject(event.additionalFields) || event.additionalFields === null) {
                            console.log("Warning: eventTransformer returned an event with additionalFields not set as an object.");
                        }
                        if (event.userId != null && !_utils2.default.isNumber(event.userId)) {
                            console.log("Warning: eventTransformer returned an event with userId not set as a number.");
                        }
                        if (event.learnerId != null && !_utils2.default.isNumber(event.learnerId)) {
                            console.log("Warning: eventTransformer returned an event with learnerId not set as a number.");
                        }
                        if (!_utils2.default.isNumber(event.eventTime)) {
                            console.log("Warning: eventTransformer returned an event with eventTime not set as a number.");
                        }
                        if (!_utils2.default.isNumber(event.trialTime)) {
                            console.log("Warning: eventTransformer returned an event with trialTime not set as a number.");
                        }
                        if (event.attempts != null) {
                            if (!_utils2.default.isArray(event.attempts)) {
                                console.log("Warning: eventTransformer returned an event with attempts not set as an array.");
                            } else {
                                event.attempts.forEach(function(attempt) {
                                    if (!_utils2.default.isObject(attempt)) {
                                        console.log("Warning: eventTransformer returned an event with an attempt not set as an object.");
                                    } else {
                                        if (!_utils2.default.isString(attempt.itemURI) || !attempt.itemURI.length) {
                                            console.log("Warning: eventTransformer returned an event attempt with itemURI not set as a string.");
                                        }
                                        if (!_utils2.default.isNumber(attempt.outcome)) {
                                            console.log("Warning: eventTransformer returned an event attempt with outcome not set as a numeric value.");
                                        } else if (attempt.outcome < 0 || attempt.outcome > 1) {
                                            console.log("Warning: eventTransformer returned an event attempt with outcome not set as a value between or equal to 0 and 1.");
                                        }
                                        if (attempt.guessingParameter != null && !_utils2.default.isNumber(attempt.guessingParameter)) {
                                            console.log("Warning: eventTransformer returned an event attempt with guessingParameter not set as a numeric value.");
                                        } else if (attempt.guessingParameter != null && (attempt.guessingParameter < 0 || attempt.guessingParameter > 1)) {
                                            console.log("Warning: eventTransformer returned an event attempt with a guessingParameter not set as a value between or equal to 0 and 1.");
                                        }
                                    }
                                });
                            }
                        }
                        if (event.tags != null) {
                            if (!_utils2.default.isObject(event.tags)) {
                                console.log("Warning: eventTransformer returned an event with tags not set as an object.");
                            } else {
                                if (event.tags.skipIrt != null && !_utils2.default.isBoolean(event.tags.skipIrt)) {
                                    console.log("Warning: eventTransformer returned an event tag with skipIrt not set as a boolean.");
                                }
                            }
                        }
                    }
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
        var _error = __webpack_require__(1);
        var _error2 = _interopRequireDefault(_error);
        var _utils = __webpack_require__(0);
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
        var KidaptiveSdkRecommenderRandom = function() {
            function KidaptiveSdkRecommenderRandom(sdk) {
                _classCallCheck(this, KidaptiveSdkRecommenderRandom);
                this.sdk = sdk;
            }
            _createClass(KidaptiveSdkRecommenderRandom, [ {
                key: "getRecommendation",
                value: function getRecommendation(params) {
                    var _this = this;
                    try {
                        if (this.sdk.learnerManager.getActiveLearner() === undefined) {
                            throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "OptimalDifficulty getRecommendation called with no active learner selected.");
                        }
                        if (!_utils2.default.isObject(params)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Params must be an object.");
                        }
                        var gameUri = params.gameUri, excludedPromptUris = params.excludedPromptUris, includedPromptUris = params.includedPromptUris;
                        var maxResults = params.maxResults == null ? 10 : params.maxResults;
                        if (gameUri == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "gameUri is required.");
                        }
                        if (!_utils2.default.isString(gameUri)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "gameUri must be a string.");
                        }
                        var game = this.sdk.modelManager.getGameByUri(gameUri);
                        if (!game) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "gameUri does not map to a game.");
                        }
                        if (!_utils2.default.isInteger(maxResults)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "maxResults must be an integer.");
                        }
                        if (maxResults < 1) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "maxResults must be an integer greater than 0.");
                        }
                        if (excludedPromptUris != null) {
                            if (!_utils2.default.isArray(excludedPromptUris)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "excludedPromptUris must be an array.");
                            }
                            excludedPromptUris.forEach(function(promptUri) {
                                if (!_utils2.default.isString(promptUri)) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "excludedPromptUris must be an array of strings.");
                                }
                            });
                        }
                        if (includedPromptUris != null) {
                            if (!_utils2.default.isArray(includedPromptUris)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "includedPromptUris must be an array.");
                            }
                            includedPromptUris.forEach(function(promptUri) {
                                if (!_utils2.default.isString(promptUri)) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "includedPromptUris must be an array of strings.");
                                }
                            });
                        }
                        var prompts = void 0;
                        if (includedPromptUris) {
                            prompts = includedPromptUris.map(function(promptUri) {
                                return _this.sdk.modelManager.getPromptByUri(promptUri);
                            });
                            prompts = prompts.filter(function(prompt) {
                                return prompt && prompt.game && prompt.game.uri === gameUri;
                            });
                        } else {
                            prompts = this.sdk.modelManager.getPromptsByGameUri(gameUri);
                        }
                        if (excludedPromptUris && excludedPromptUris.length) {
                            prompts = prompts.filter(function(prompt) {
                                return excludedPromptUris.indexOf(prompt.uri) === -1;
                            });
                        }
                        prompts = prompts.map(function(prompt) {
                            return {
                                sort: Math.random(),
                                prompt: prompt
                            };
                        }).sort(function(objectA, objectB) {
                            return objectA.sort - objectB.sort;
                        }).slice(0, maxResults);
                        var recommendations = prompts.map(function(object) {
                            return {
                                promptUri: object.prompt.uri
                            };
                        });
                        return {
                            recommendations: recommendations,
                            type: "prompt"
                        };
                    } catch (error) {
                        return {
                            error: error
                        };
                    }
                }
            } ]);
            return KidaptiveSdkRecommenderRandom;
        }();
        exports.default = KidaptiveSdkRecommenderRandom;
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
        var _error = __webpack_require__(1);
        var _error2 = _interopRequireDefault(_error);
        var _utils = __webpack_require__(0);
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
        var KidaptiveSdkRecommenderOptimalDifficulty = function() {
            function KidaptiveSdkRecommenderOptimalDifficulty(sdk) {
                _classCallCheck(this, KidaptiveSdkRecommenderOptimalDifficulty);
                this.sdk = sdk;
            }
            _createClass(KidaptiveSdkRecommenderOptimalDifficulty, [ {
                key: "getRecommendation",
                value: function getRecommendation() {
                    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                    try {
                        if (this.sdk.learnerManager.getActiveLearner() === undefined) {
                            throw new _error2.default(_error2.default.ERROR_CODES.ILLEGAL_STATE, "No active learner selected.");
                        }
                        if (!_utils2.default.isObject(params)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Params must be an object.");
                        }
                        var localDimensionUri = params.localDimensionUri, excludedPromptUris = params.excludedPromptUris, includedPromptUris = params.includedPromptUris;
                        var maxResults = params.maxResults == null ? 10 : params.maxResults;
                        var targetSuccessProbability = params.targetSuccessProbability == null ? .7 : params.targetSuccessProbability;
                        if (localDimensionUri == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "localDimensionUri is required.");
                        }
                        if (!_utils2.default.isString(localDimensionUri)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "localDimensionUri must be a string.");
                        }
                        var localDimension = this.sdk.modelManager.getLocalDimensionByUri(localDimensionUri);
                        if (!localDimension) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "localDimensionUri does not map to a local dimension.");
                        }
                        if (!_utils2.default.isNumber(targetSuccessProbability)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "targetSuccessProbability must be a number.");
                        }
                        if (targetSuccessProbability < 0 || targetSuccessProbability > 1) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "targetSuccessProbability must be a number between  0 and 1.");
                        }
                        if (!_utils2.default.isInteger(maxResults)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "maxResults must be an integer.");
                        }
                        if (maxResults < 1) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "maxResults must be an integer greater than 0.");
                        }
                        if (excludedPromptUris != null) {
                            if (!_utils2.default.isArray(excludedPromptUris)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "excludedPromptUris must be an array.");
                            }
                            excludedPromptUris.forEach(function(promptUri) {
                                if (!_utils2.default.isString(promptUri)) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "excludedPromptUris must be an array of strings.");
                                }
                            });
                        }
                        if (includedPromptUris != null) {
                            if (!_utils2.default.isArray(includedPromptUris)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "includedPromptUris must be an array.");
                            }
                            includedPromptUris.forEach(function(promptUri) {
                                if (!_utils2.default.isString(promptUri)) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "includedPromptUris must be an array of strings.");
                                }
                            });
                        }
                        var localAbilityEstimate = this.sdk.learnerManager.getLocalAbilityEstimate(localDimensionUri);
                        var items = this.sdk.modelManager.getItems().filter(function(item) {
                            return item.localDimension && item.localDimension.uri === localDimensionUri;
                        });
                        if (includedPromptUris) {
                            items = items.filter(function(item) {
                                return includedPromptUris.indexOf(item.prompt && item.prompt.uri) !== -1;
                            });
                        }
                        if (excludedPromptUris && excludedPromptUris.length) {
                            items = items.filter(function(item) {
                                return excludedPromptUris.indexOf(item.prompt && item.prompt.uri) === -1;
                            });
                        }
                        items = items.map(function(item) {
                            return {
                                sort: Math.random(),
                                item: item
                            };
                        }).sort(function(objectA, objectB) {
                            return objectA.sort - objectB.sort;
                        }).map(function(object) {
                            return {
                                sort: 1 / (1 + Math.exp(Math.sqrt(8 / Math.PI) * (object.item.mean - localAbilityEstimate.mean))),
                                item: object.item
                            };
                        }).sort(function(objectA, objectB) {
                            return Math.abs(objectA.sort - targetSuccessProbability) - Math.abs(objectB.sort - targetSuccessProbability);
                        }).slice(0, maxResults);
                        var recommendations = items.map(function(object) {
                            return {
                                itemUri: object.item.uri,
                                promptUri: object.item.prompt && object.item.prompt.uri,
                                successProbability: object.sort
                            };
                        });
                        return {
                            recommendations: recommendations,
                            type: "prompt"
                        };
                    } catch (error) {
                        return {
                            error: error
                        };
                    }
                }
            } ]);
            return KidaptiveSdkRecommenderOptimalDifficulty;
        }();
        exports.default = KidaptiveSdkRecommenderOptimalDifficulty;
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
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var KidaptiveSdkIrt = function() {
            function KidaptiveSdkIrt() {
                _classCallCheck(this, KidaptiveSdkIrt);
            }
            _createClass(KidaptiveSdkIrt, [ {
                key: "estimate",
                value: function estimate(y, beta, guessing, theta, sigma, post_mean, post_sd) {
                    return KidaptiveSdkIrt.estimate(y || 0, beta || 0, guessing || 0, theta || 0, sigma || 0, post_mean || 0, post_sd || 0);
                }
            } ], [ {
                key: "normal_dist",
                value: function normal_dist(x, mu, sigma) {
                    return Math.exp(-Math.pow(x - mu, 2) / 2 / Math.pow(sigma, 2)) / sigma / Math.sqrt(2 * Math.PI);
                }
            }, {
                key: "logistic_dist",
                value: function logistic_dist(x, mu, alpha) {
                    return 1 / (1 + Math.exp(-alpha * (x - mu)));
                }
            }, {
                key: "inv_logis",
                value: function inv_logis(p) {
                    return Math.log(1 / p - 1) * Math.sqrt(Math.PI / 8);
                }
            }, {
                key: "estimate",
                value: function estimate(y, beta, guessing, theta, sigma, post_mean, post_sd) {
                    var a = Math.sqrt(8 / Math.PI);
                    var max_sigma = 2 / a;
                    post_mean = theta;
                    post_sd = sigma = Math.min(Math.max(sigma, 0), max_sigma);
                    if (sigma === 0) {
                        return {
                            post_mean: post_mean,
                            post_sd: post_sd
                        };
                    }
                    y = y < .5 ? 0 : 1;
                    if (guessing >= 1) {
                        return {
                            post_mean: post_mean,
                            post_sd: post_sd
                        };
                    } else {
                        guessing = Math.max(guessing, 0);
                    }
                    var dll = void 0;
                    var ddll = void 0;
                    var x = void 0;
                    var high = Infinity;
                    var low = -Infinity;
                    var delta = 1;
                    var p = void 0;
                    var q = void 0;
                    var P = void 0;
                    do {
                        x = post_mean;
                        p = KidaptiveSdkIrt.logistic_dist(post_mean, beta, a);
                        q = 1 - p;
                        if (y === 0 || guessing === 0) {
                            dll = a * (y - p) - (post_mean - theta) * Math.pow(sigma, -2);
                            ddll = -Math.pow(a, 2) * p * q - Math.pow(sigma, -2);
                        } else {
                            P = guessing + (1 - guessing) * p;
                            dll = a * p * (y - P) / P - (post_mean - theta) * Math.pow(sigma, -2);
                            ddll = Math.pow(a, 2) * p * q * (guessing * y - Math.pow(P, 2)) * Math.pow(P, -2) - Math.pow(sigma, -2);
                        }
                        if (dll > 0) {
                            low = post_mean;
                        } else if (dll < 0) {
                            high = post_mean;
                        }
                        post_mean -= dll / ddll;
                        if (post_mean >= high || post_mean <= low) {
                            if (high < Infinity && low > -Infinity) {
                                post_mean = (high + low) / 2;
                            } else if (high < Infinity) {
                                post_mean -= delta;
                                delta *= 2;
                            } else {
                                post_mean += delta;
                                delta *= 2;
                            }
                        }
                    } while (x !== post_mean);
                    post_sd = Math.min(Math.sqrt(-1 / ddll), max_sigma);
                    return {
                        post_mean: post_mean,
                        post_sd: post_sd
                    };
                }
            } ]);
            return KidaptiveSdkIrt;
        }();
        exports.default = new KidaptiveSdkIrt();
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function _toConsumableArray(arr) {
            return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
        }
        function _nonIterableSpread() {
            throw new TypeError("Invalid attempt to spread non-iterable instance");
        }
        function _iterableToArray(iter) {
            if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
        }
        function _arrayWithoutHoles(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            }
        }
        function Agent() {
            this._defaults = [];
        }
        [ "use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects", "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert" ].forEach(function(fn) {
            Agent.prototype[fn] = function() {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }
                this._defaults.push({
                    fn: fn,
                    args: args
                });
                return this;
            };
        });
        Agent.prototype._setDefaults = function(req) {
            this._defaults.forEach(function(def) {
                req[def.fn].apply(req, _toConsumableArray(def.args));
            });
        };
        module.exports = Agent;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        exports.type = function(str) {
            return str.split(/ *; */).shift();
        };
        exports.params = function(str) {
            return str.split(/ *; */).reduce(function(obj, str) {
                var parts = str.split(/ *= */);
                var key = parts.shift();
                var val = parts.shift();
                if (key && val) obj[key] = val;
                return obj;
            }, {});
        };
        exports.parseLinks = function(str) {
            return str.split(/ *, */).reduce(function(obj, str) {
                var parts = str.split(/ *; */);
                var url = parts[0].slice(1, -1);
                var rel = parts[1].split(/ *= */)[1].slice(1, -1);
                obj[rel] = url;
                return obj;
            }, {});
        };
        exports.cleanHeader = function(header, changesOrigin) {
            delete header["content-type"];
            delete header["content-length"];
            delete header["transfer-encoding"];
            delete header.host;
            if (changesOrigin) {
                delete header.authorization;
                delete header.cookie;
            }
            return header;
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var utils = __webpack_require__(19);
        module.exports = ResponseBase;
        function ResponseBase(obj) {
            if (obj) return mixin(obj);
        }
        function mixin(obj) {
            for (var key in ResponseBase.prototype) {
                if (Object.prototype.hasOwnProperty.call(ResponseBase.prototype, key)) obj[key] = ResponseBase.prototype[key];
            }
            return obj;
        }
        ResponseBase.prototype.get = function(field) {
            return this.header[field.toLowerCase()];
        };
        ResponseBase.prototype._setHeaderProperties = function(header) {
            var ct = header["content-type"] || "";
            this.type = utils.type(ct);
            var params = utils.params(ct);
            for (var key in params) {
                if (Object.prototype.hasOwnProperty.call(params, key)) this[key] = params[key];
            }
            this.links = {};
            try {
                if (header.link) {
                    this.links = utils.parseLinks(header.link);
                }
            } catch (err) {}
        };
        ResponseBase.prototype._setStatusProperties = function(status) {
            var type = status / 100 | 0;
            this.statusCode = status;
            this.status = this.statusCode;
            this.statusType = type;
            this.info = type === 1;
            this.ok = type === 2;
            this.redirect = type === 3;
            this.clientError = type === 4;
            this.serverError = type === 5;
            this.error = type === 4 || type === 5 ? this.toError() : false;
            this.created = status === 201;
            this.accepted = status === 202;
            this.noContent = status === 204;
            this.badRequest = status === 400;
            this.unauthorized = status === 401;
            this.notAcceptable = status === 406;
            this.forbidden = status === 403;
            this.notFound = status === 404;
            this.unprocessableEntity = status === 422;
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                _typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                _typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return _typeof(obj);
        }
        var isObject = __webpack_require__(12);
        module.exports = RequestBase;
        function RequestBase(obj) {
            if (obj) return mixin(obj);
        }
        function mixin(obj) {
            for (var key in RequestBase.prototype) {
                if (Object.prototype.hasOwnProperty.call(RequestBase.prototype, key)) obj[key] = RequestBase.prototype[key];
            }
            return obj;
        }
        RequestBase.prototype.clearTimeout = function() {
            clearTimeout(this._timer);
            clearTimeout(this._responseTimeoutTimer);
            clearTimeout(this._uploadTimeoutTimer);
            delete this._timer;
            delete this._responseTimeoutTimer;
            delete this._uploadTimeoutTimer;
            return this;
        };
        RequestBase.prototype.parse = function(fn) {
            this._parser = fn;
            return this;
        };
        RequestBase.prototype.responseType = function(val) {
            this._responseType = val;
            return this;
        };
        RequestBase.prototype.serialize = function(fn) {
            this._serializer = fn;
            return this;
        };
        RequestBase.prototype.timeout = function(options) {
            if (!options || _typeof(options) !== "object") {
                this._timeout = options;
                this._responseTimeout = 0;
                this._uploadTimeout = 0;
                return this;
            }
            for (var option in options) {
                if (Object.prototype.hasOwnProperty.call(options, option)) {
                    switch (option) {
                      case "deadline":
                        this._timeout = options.deadline;
                        break;

                      case "response":
                        this._responseTimeout = options.response;
                        break;

                      case "upload":
                        this._uploadTimeout = options.upload;
                        break;

                      default:
                        console.warn("Unknown timeout option", option);
                    }
                }
            }
            return this;
        };
        RequestBase.prototype.retry = function(count, fn) {
            if (arguments.length === 0 || count === true) count = 1;
            if (count <= 0) count = 0;
            this._maxRetries = count;
            this._retries = 0;
            this._retryCallback = fn;
            return this;
        };
        var ERROR_CODES = [ "ECONNRESET", "ETIMEDOUT", "EADDRINFO", "ESOCKETTIMEDOUT" ];
        RequestBase.prototype._shouldRetry = function(err, res) {
            if (!this._maxRetries || this._retries++ >= this._maxRetries) {
                return false;
            }
            if (this._retryCallback) {
                try {
                    var override = this._retryCallback(err, res);
                    if (override === true) return true;
                    if (override === false) return false;
                } catch (err2) {
                    console.error(err2);
                }
            }
            if (res && res.status && res.status >= 500 && res.status !== 501) return true;
            if (err) {
                if (err.code && ERROR_CODES.indexOf(err.code) !== -1) return true;
                if (err.timeout && err.code === "ECONNABORTED") return true;
                if (err.crossDomain) return true;
            }
            return false;
        };
        RequestBase.prototype._retry = function() {
            this.clearTimeout();
            if (this.req) {
                this.req = null;
                this.req = this.request();
            }
            this._aborted = false;
            this.timedout = false;
            return this._end();
        };
        RequestBase.prototype.then = function(resolve, reject) {
            var _this = this;
            if (!this._fullfilledPromise) {
                var self = this;
                if (this._endCalled) {
                    console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
                }
                this._fullfilledPromise = new Promise(function(resolve, reject) {
                    self.on("abort", function() {
                        var err = new Error("Aborted");
                        err.code = "ABORTED";
                        err.status = _this.status;
                        err.method = _this.method;
                        err.url = _this.url;
                        reject(err);
                    });
                    self.end(function(err, res) {
                        if (err) reject(err); else resolve(res);
                    });
                });
            }
            return this._fullfilledPromise.then(resolve, reject);
        };
        RequestBase.prototype.catch = function(cb) {
            return this.then(undefined, cb);
        };
        RequestBase.prototype.use = function(fn) {
            fn(this);
            return this;
        };
        RequestBase.prototype.ok = function(cb) {
            if (typeof cb !== "function") throw new Error("Callback required");
            this._okCallback = cb;
            return this;
        };
        RequestBase.prototype._isResponseOK = function(res) {
            if (!res) {
                return false;
            }
            if (this._okCallback) {
                return this._okCallback(res);
            }
            return res.status >= 200 && res.status < 300;
        };
        RequestBase.prototype.get = function(field) {
            return this._header[field.toLowerCase()];
        };
        RequestBase.prototype.getHeader = RequestBase.prototype.get;
        RequestBase.prototype.set = function(field, val) {
            if (isObject(field)) {
                for (var key in field) {
                    if (Object.prototype.hasOwnProperty.call(field, key)) this.set(key, field[key]);
                }
                return this;
            }
            this._header[field.toLowerCase()] = val;
            this.header[field] = val;
            return this;
        };
        RequestBase.prototype.unset = function(field) {
            delete this._header[field.toLowerCase()];
            delete this.header[field];
            return this;
        };
        RequestBase.prototype.field = function(name, val) {
            if (name === null || undefined === name) {
                throw new Error(".field(name, val) name can not be empty");
            }
            if (this._data) {
                throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
            }
            if (isObject(name)) {
                for (var key in name) {
                    if (Object.prototype.hasOwnProperty.call(name, key)) this.field(key, name[key]);
                }
                return this;
            }
            if (Array.isArray(val)) {
                for (var i in val) {
                    if (Object.prototype.hasOwnProperty.call(val, i)) this.field(name, val[i]);
                }
                return this;
            }
            if (val === null || undefined === val) {
                throw new Error(".field(name, val) val can not be empty");
            }
            if (typeof val === "boolean") {
                val = String(val);
            }
            this._getFormData().append(name, val);
            return this;
        };
        RequestBase.prototype.abort = function() {
            if (this._aborted) {
                return this;
            }
            this._aborted = true;
            if (this.xhr) this.xhr.abort();
            if (this.req) this.req.abort();
            this.clearTimeout();
            this.emit("abort");
            return this;
        };
        RequestBase.prototype._auth = function(user, pass, options, base64Encoder) {
            switch (options.type) {
              case "basic":
                this.set("Authorization", "Basic ".concat(base64Encoder("".concat(user, ":").concat(pass))));
                break;

              case "auto":
                this.username = user;
                this.password = pass;
                break;

              case "bearer":
                this.set("Authorization", "Bearer ".concat(user));
                break;

              default:
                break;
            }
            return this;
        };
        RequestBase.prototype.withCredentials = function(on) {
            if (on === undefined) on = true;
            this._withCredentials = on;
            return this;
        };
        RequestBase.prototype.redirects = function(n) {
            this._maxRedirects = n;
            return this;
        };
        RequestBase.prototype.maxResponseSize = function(n) {
            if (typeof n !== "number") {
                throw new TypeError("Invalid argument");
            }
            this._maxResponseSize = n;
            return this;
        };
        RequestBase.prototype.toJSON = function() {
            return {
                method: this.method,
                url: this.url,
                data: this._data,
                headers: this._header
            };
        };
        RequestBase.prototype.send = function(data) {
            var isObj = isObject(data);
            var type = this._header["content-type"];
            if (this._formData) {
                throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
            }
            if (isObj && !this._data) {
                if (Array.isArray(data)) {
                    this._data = [];
                } else if (!this._isHost(data)) {
                    this._data = {};
                }
            } else if (data && this._data && this._isHost(this._data)) {
                throw new Error("Can't merge these send calls");
            }
            if (isObj && isObject(this._data)) {
                for (var key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) this._data[key] = data[key];
                }
            } else if (typeof data === "string") {
                if (!type) this.type("form");
                type = this._header["content-type"];
                if (type === "application/x-www-form-urlencoded") {
                    this._data = this._data ? "".concat(this._data, "&").concat(data) : data;
                } else {
                    this._data = (this._data || "") + data;
                }
            } else {
                this._data = data;
            }
            if (!isObj || this._isHost(data)) {
                return this;
            }
            if (!type) this.type("json");
            return this;
        };
        RequestBase.prototype.sortQuery = function(sort) {
            this._sort = typeof sort === "undefined" ? true : sort;
            return this;
        };
        RequestBase.prototype._finalizeQueryString = function() {
            var query = this._query.join("&");
            if (query) {
                this.url += (this.url.indexOf("?") >= 0 ? "&" : "?") + query;
            }
            this._query.length = 0;
            if (this._sort) {
                var index = this.url.indexOf("?");
                if (index >= 0) {
                    var queryArr = this.url.substring(index + 1).split("&");
                    if (typeof this._sort === "function") {
                        queryArr.sort(this._sort);
                    } else {
                        queryArr.sort();
                    }
                    this.url = this.url.substring(0, index) + "?" + queryArr.join("&");
                }
            }
        };
        RequestBase.prototype._appendQueryString = function() {
            console.warn("Unsupported");
        };
        RequestBase.prototype._timeoutError = function(reason, timeout, errno) {
            if (this._aborted) {
                return;
            }
            var err = new Error("".concat(reason + timeout, "ms exceeded"));
            err.timeout = timeout;
            err.code = "ECONNABORTED";
            err.errno = errno;
            this.timedout = true;
            this.abort();
            this.callback(err);
        };
        RequestBase.prototype._setTimeouts = function() {
            var self = this;
            if (this._timeout && !this._timer) {
                this._timer = setTimeout(function() {
                    self._timeoutError("Timeout of ", self._timeout, "ETIME");
                }, this._timeout);
            }
            if (this._responseTimeout && !this._responseTimeoutTimer) {
                this._responseTimeoutTimer = setTimeout(function() {
                    self._timeoutError("Response timeout of ", self._responseTimeout, "ETIMEDOUT");
                }, this._responseTimeout);
            }
        };
    }, function(module, exports) {
        module.exports = stringify;
        stringify.default = stringify;
        stringify.stable = deterministicStringify;
        stringify.stableStringify = deterministicStringify;
        var arr = [];
        function stringify(obj, replacer, spacer) {
            decirc(obj, "", [], undefined);
            var res = JSON.stringify(obj, replacer, spacer);
            while (arr.length !== 0) {
                var part = arr.pop();
                part[0][part[1]] = part[2];
            }
            return res;
        }
        function decirc(val, k, stack, parent) {
            var i;
            if (typeof val === "object" && val !== null) {
                for (i = 0; i < stack.length; i++) {
                    if (stack[i] === val) {
                        parent[k] = "[Circular]";
                        arr.push([ parent, k, val ]);
                        return;
                    }
                }
                stack.push(val);
                if (Array.isArray(val)) {
                    for (i = 0; i < val.length; i++) {
                        decirc(val[i], i, stack, val);
                    }
                } else {
                    var keys = Object.keys(val);
                    for (i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        decirc(val[key], key, stack, val);
                    }
                }
                stack.pop();
            }
        }
        function compareFunction(a, b) {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        }
        function deterministicStringify(obj, replacer, spacer) {
            var tmp = deterministicDecirc(obj, "", [], undefined) || obj;
            var res = JSON.stringify(tmp, replacer, spacer);
            while (arr.length !== 0) {
                var part = arr.pop();
                part[0][part[1]] = part[2];
            }
            return res;
        }
        function deterministicDecirc(val, k, stack, parent) {
            var i;
            if (typeof val === "object" && val !== null) {
                for (i = 0; i < stack.length; i++) {
                    if (stack[i] === val) {
                        parent[k] = "[Circular]";
                        arr.push([ parent, k, val ]);
                        return;
                    }
                }
                if (typeof val.toJSON === "function") {
                    return;
                }
                stack.push(val);
                if (Array.isArray(val)) {
                    for (i = 0; i < val.length; i++) {
                        deterministicDecirc(val[i], i, stack, val);
                    }
                } else {
                    var tmp = {};
                    var keys = Object.keys(val).sort(compareFunction);
                    for (i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        deterministicDecirc(val[key], key, stack, val);
                        tmp[key] = val[key];
                    }
                    if (parent !== undefined) {
                        arr.push([ parent, k, val ]);
                        parent[k] = tmp;
                    } else {
                        return tmp;
                    }
                }
                stack.pop();
            }
        }
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
            if (callbacks.length === 0) {
                delete this._callbacks["$" + event];
            }
            return this;
        };
        Emitter.prototype.emit = function(event) {
            this._callbacks = this._callbacks || {};
            var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
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
        "use strict";
        function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                _typeof = function _typeof(obj) {
                    return typeof obj;
                };
            } else {
                _typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
            }
            return _typeof(obj);
        }
        var root;
        if (typeof window !== "undefined") {
            root = window;
        } else if (typeof self === "undefined") {
            console.warn("Using browser-only version of superagent in non-browser environment");
            root = void 0;
        } else {
            root = self;
        }
        var Emitter = __webpack_require__(23);
        var safeStringify = __webpack_require__(22);
        var RequestBase = __webpack_require__(21);
        var isObject = __webpack_require__(12);
        var ResponseBase = __webpack_require__(20);
        var Agent = __webpack_require__(18);
        function noop() {}
        module.exports = function(method, url) {
            if (typeof url === "function") {
                return new exports.Request("GET", method).end(url);
            }
            if (arguments.length === 1) {
                return new exports.Request("GET", method);
            }
            return new exports.Request(method, url);
        };
        exports = module.exports;
        var request = exports;
        exports.Request = Request;
        request.getXHR = function() {
            if (root.XMLHttpRequest && (!root.location || root.location.protocol !== "file:" || !root.ActiveXObject)) {
                return new XMLHttpRequest();
            }
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (err) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (err) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            } catch (err) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (err) {}
            throw new Error("Browser-only version of superagent could not find XHR");
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
                if (Object.prototype.hasOwnProperty.call(obj, key)) pushEncodedKeyValuePair(pairs, key, obj[key]);
            }
            return pairs.join("&");
        }
        function pushEncodedKeyValuePair(pairs, key, val) {
            if (val === undefined) return;
            if (val === null) {
                pairs.push(encodeURIComponent(key));
                return;
            }
            if (Array.isArray(val)) {
                val.forEach(function(v) {
                    pushEncodedKeyValuePair(pairs, key, v);
                });
            } else if (isObject(val)) {
                for (var subkey in val) {
                    if (Object.prototype.hasOwnProperty.call(val, subkey)) pushEncodedKeyValuePair(pairs, "".concat(key, "[").concat(subkey, "]"), val[subkey]);
                }
            } else {
                pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
            }
        }
        request.serializeObject = serialize;
        function parseString(str) {
            var obj = {};
            var pairs = str.split("&");
            var pair;
            var pos;
            for (var i = 0, len = pairs.length; i < len; ++i) {
                pair = pairs[i];
                pos = pair.indexOf("=");
                if (pos === -1) {
                    obj[decodeURIComponent(pair)] = "";
                } else {
                    obj[decodeURIComponent(pair.slice(0, pos))] = decodeURIComponent(pair.slice(pos + 1));
                }
            }
            return obj;
        }
        request.parseString = parseString;
        request.types = {
            html: "text/html",
            json: "application/json",
            xml: "text/xml",
            urlencoded: "application/x-www-form-urlencoded",
            form: "application/x-www-form-urlencoded",
            "form-data": "application/x-www-form-urlencoded"
        };
        request.serialize = {
            "application/x-www-form-urlencoded": serialize,
            "application/json": safeStringify
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
            for (var i = 0, len = lines.length; i < len; ++i) {
                line = lines[i];
                index = line.indexOf(":");
                if (index === -1) {
                    continue;
                }
                field = line.slice(0, index).toLowerCase();
                val = trim(line.slice(index + 1));
                fields[field] = val;
            }
            return fields;
        }
        function isJSON(mime) {
            return /[/+]json($|[^-\w])/.test(mime);
        }
        function Response(req) {
            this.req = req;
            this.xhr = this.req.xhr;
            this.text = this.req.method !== "HEAD" && (this.xhr.responseType === "" || this.xhr.responseType === "text") || typeof this.xhr.responseType === "undefined" ? this.xhr.responseText : null;
            this.statusText = this.req.xhr.statusText;
            var status = this.xhr.status;
            if (status === 1223) {
                status = 204;
            }
            this._setStatusProperties(status);
            this.headers = parseHeader(this.xhr.getAllResponseHeaders());
            this.header = this.headers;
            this.header["content-type"] = this.xhr.getResponseHeader("content-type");
            this._setHeaderProperties(this.header);
            if (this.text === null && req._responseType) {
                this.body = this.xhr.response;
            } else {
                this.body = this.req.method === "HEAD" ? null : this._parseBody(this.text ? this.text : this.xhr.response);
            }
        }
        ResponseBase(Response.prototype);
        Response.prototype._parseBody = function(str) {
            var parse = request.parse[this.type];
            if (this.req._parser) {
                return this.req._parser(this, str);
            }
            if (!parse && isJSON(this.type)) {
                parse = request.parse["application/json"];
            }
            return parse && str && (str.length > 0 || str instanceof Object) ? parse(str) : null;
        };
        Response.prototype.toError = function() {
            var req = this.req;
            var method = req.method;
            var url = req.url;
            var msg = "cannot ".concat(method, " ").concat(url, " (").concat(this.status, ")");
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
                } catch (err2) {
                    err = new Error("Parser is unable to parse the response");
                    err.parse = true;
                    err.original = err2;
                    if (self.xhr) {
                        err.rawResponse = typeof self.xhr.responseType === "undefined" ? self.xhr.responseText : self.xhr.response;
                        err.status = self.xhr.status ? self.xhr.status : null;
                        err.statusCode = err.status;
                    } else {
                        err.rawResponse = null;
                        err.status = null;
                    }
                    return self.callback(err);
                }
                self.emit("response", res);
                var new_err;
                try {
                    if (!self._isResponseOK(res)) {
                        new_err = new Error(res.statusText || "Unsuccessful HTTP response");
                    }
                } catch (err2) {
                    new_err = err2;
                }
                if (new_err) {
                    new_err.original = err;
                    new_err.response = res;
                    new_err.status = res.status;
                    self.callback(new_err, res);
                } else {
                    self.callback(null, res);
                }
            });
        }
        Emitter(Request.prototype);
        RequestBase(Request.prototype);
        Request.prototype.type = function(type) {
            this.set("Content-Type", request.types[type] || type);
            return this;
        };
        Request.prototype.accept = function(type) {
            this.set("Accept", request.types[type] || type);
            return this;
        };
        Request.prototype.auth = function(user, pass, options) {
            if (arguments.length === 1) pass = "";
            if (_typeof(pass) === "object" && pass !== null) {
                options = pass;
                pass = "";
            }
            if (!options) {
                options = {
                    type: typeof btoa === "function" ? "basic" : "auto"
                };
            }
            var encoder = function encoder(string) {
                if (typeof btoa === "function") {
                    return btoa(string);
                }
                throw new Error("Cannot use basic auth, btoa is not a function");
            };
            return this._auth(user, pass, options, encoder);
        };
        Request.prototype.query = function(val) {
            if (typeof val !== "string") val = serialize(val);
            if (val) this._query.push(val);
            return this;
        };
        Request.prototype.attach = function(field, file, options) {
            if (file) {
                if (this._data) {
                    throw new Error("superagent can't mix .send() and .attach()");
                }
                this._getFormData().append(field, file, options || file.name);
            }
            return this;
        };
        Request.prototype._getFormData = function() {
            if (!this._formData) {
                this._formData = new root.FormData();
            }
            return this._formData;
        };
        Request.prototype.callback = function(err, res) {
            if (this._shouldRetry(err, res)) {
                return this._retry();
            }
            var fn = this._callback;
            this.clearTimeout();
            if (err) {
                if (this._maxRetries) err.retries = this._retries - 1;
                this.emit("error", err);
            }
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
        Request.prototype.agent = function() {
            console.warn("This is not supported in browser version of superagent");
            return this;
        };
        Request.prototype.buffer = Request.prototype.ca;
        Request.prototype.ca = Request.prototype.agent;
        Request.prototype.write = function() {
            throw new Error("Streaming is not supported in browser version of superagent");
        };
        Request.prototype.pipe = Request.prototype.write;
        Request.prototype._isHost = function(obj) {
            return obj && _typeof(obj) === "object" && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== "[object Object]";
        };
        Request.prototype.end = function(fn) {
            if (this._endCalled) {
                console.warn("Warning: .end() was called twice. This is not supported in superagent");
            }
            this._endCalled = true;
            this._callback = fn || noop;
            this._finalizeQueryString();
            this._end();
        };
        Request.prototype._setUploadTimeout = function() {
            var self = this;
            if (this._uploadTimeout && !this._uploadTimeoutTimer) {
                this._uploadTimeoutTimer = setTimeout(function() {
                    self._timeoutError("Upload timeout of ", self._uploadTimeout, "ETIMEDOUT");
                }, this._uploadTimeout);
            }
        };
        Request.prototype._end = function() {
            if (this._aborted) return this.callback(new Error("The request has been aborted even before .end() was called"));
            var self = this;
            this.xhr = request.getXHR();
            var xhr = this.xhr;
            var data = this._formData || this._data;
            this._setTimeouts();
            xhr.onreadystatechange = function() {
                var readyState = xhr.readyState;
                if (readyState >= 2 && self._responseTimeoutTimer) {
                    clearTimeout(self._responseTimeoutTimer);
                }
                if (readyState !== 4) {
                    return;
                }
                var status;
                try {
                    status = xhr.status;
                } catch (err) {
                    status = 0;
                }
                if (!status) {
                    if (self.timedout || self._aborted) return;
                    return self.crossDomainError();
                }
                self.emit("end");
            };
            var handleProgress = function handleProgress(direction, e) {
                if (e.total > 0) {
                    e.percent = e.loaded / e.total * 100;
                    if (e.percent === 100) {
                        clearTimeout(self._uploadTimeoutTimer);
                    }
                }
                e.direction = direction;
                self.emit("progress", e);
            };
            if (this.hasListeners("progress")) {
                try {
                    xhr.addEventListener("progress", handleProgress.bind(null, "download"));
                    if (xhr.upload) {
                        xhr.upload.addEventListener("progress", handleProgress.bind(null, "upload"));
                    }
                } catch (err) {}
            }
            if (xhr.upload) {
                this._setUploadTimeout();
            }
            try {
                if (this.username && this.password) {
                    xhr.open(this.method, this.url, true, this.username, this.password);
                } else {
                    xhr.open(this.method, this.url, true);
                }
            } catch (err) {
                return this.callback(err);
            }
            if (this._withCredentials) xhr.withCredentials = true;
            if (!this._formData && this.method !== "GET" && this.method !== "HEAD" && typeof data !== "string" && !this._isHost(data)) {
                var contentType = this._header["content-type"];
                var _serialize = this._serializer || request.serialize[contentType ? contentType.split(";")[0] : ""];
                if (!_serialize && isJSON(contentType)) {
                    _serialize = request.serialize["application/json"];
                }
                if (_serialize) data = _serialize(data);
            }
            for (var field in this.header) {
                if (this.header[field] === null) continue;
                if (Object.prototype.hasOwnProperty.call(this.header, field)) xhr.setRequestHeader(field, this.header[field]);
            }
            if (this._responseType) {
                xhr.responseType = this._responseType;
            }
            this.emit("request", this);
            xhr.send(typeof data === "undefined" ? null : data);
        };
        request.agent = function() {
            return new Agent();
        };
        [ "GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE" ].forEach(function(method) {
            Agent.prototype[method.toLowerCase()] = function(url, fn) {
                var req = new request.Request(method, url);
                this._setDefaults(req);
                if (fn) {
                    req.end(fn);
                }
                return req;
            };
        });
        Agent.prototype.del = Agent.prototype.delete;
        request.get = function(url, data, fn) {
            var req = request("GET", url);
            if (typeof data === "function") {
                fn = data;
                data = null;
            }
            if (data) req.query(data);
            if (fn) req.end(fn);
            return req;
        };
        request.head = function(url, data, fn) {
            var req = request("HEAD", url);
            if (typeof data === "function") {
                fn = data;
                data = null;
            }
            if (data) req.query(data);
            if (fn) req.end(fn);
            return req;
        };
        request.options = function(url, data, fn) {
            var req = request("OPTIONS", url);
            if (typeof data === "function") {
                fn = data;
                data = null;
            }
            if (data) req.send(data);
            if (fn) req.end(fn);
            return req;
        };
        function del(url, data, fn) {
            var req = request("DELETE", url);
            if (typeof data === "function") {
                fn = data;
                data = null;
            }
            if (data) req.send(data);
            if (fn) req.end(fn);
            return req;
        }
        request.del = del;
        request.delete = del;
        request.patch = function(url, data, fn) {
            var req = request("PATCH", url);
            if (typeof data === "function") {
                fn = data;
                data = null;
            }
            if (data) req.send(data);
            if (fn) req.end(fn);
            return req;
        };
        request.post = function(url, data, fn) {
            var req = request("POST", url);
            if (typeof data === "function") {
                fn = data;
                data = null;
            }
            if (data) req.send(data);
            if (fn) req.end(fn);
            return req;
        };
        request.put = function(url, data, fn) {
            var req = request("PUT", url);
            if (typeof data === "function") {
                fn = data;
                data = null;
            }
            if (data) req.send(data);
            if (fn) req.end(fn);
            return req;
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var Q = __webpack_require__(3);
        var superagent = __webpack_require__(24);
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
        }).call(this, __webpack_require__(5), __webpack_require__(9));
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
            __webpack_require__(26);
            exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || this && this.setImmediate;
            exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || this && this.clearImmediate;
        }).call(this, __webpack_require__(5));
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
                var AMD = "function" === "function" && __webpack_require__(28);
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
        }).call(this, __webpack_require__(9), __webpack_require__(5));
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
        }).call(this, __webpack_require__(13)(module), __webpack_require__(5));
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
        exports.parse = __webpack_require__(32);
        exports.stringify = __webpack_require__(31);
    }, function(module, exports, __webpack_require__) {
        var json = typeof JSON !== "undefined" ? JSON : __webpack_require__(33);
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
        }).call(this, __webpack_require__(5), __webpack_require__(13)(module));
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
        var _constants = __webpack_require__(4);
        var _constants2 = _interopRequireDefault(_constants);
        var _httpClient = __webpack_require__(6);
        var _httpClient2 = _interopRequireDefault(_httpClient);
        var _irt = __webpack_require__(17);
        var _irt2 = _interopRequireDefault(_irt);
        var _learnerManager = __webpack_require__(11);
        var _learnerManager2 = _interopRequireDefault(_learnerManager);
        var _modelManager = __webpack_require__(8);
        var _modelManager2 = _interopRequireDefault(_modelManager);
        var _state = __webpack_require__(2);
        var _state2 = _interopRequireDefault(_state);
        var _utils = __webpack_require__(0);
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
        var KidaptiveSdkAttemptProcessor = function() {
            function KidaptiveSdkAttemptProcessor() {
                _classCallCheck(this, KidaptiveSdkAttemptProcessor);
            }
            _createClass(KidaptiveSdkAttemptProcessor, [ {
                key: "prepareAttempt",
                value: function prepareAttempt(attempt) {
                    var updatedAttempt = _utils2.default.copyObject(attempt);
                    var learnerId = _state2.default.get("learnerId");
                    if (learnerId == null) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: processAttempt called with no active learner selected. Attempt is discarded.");
                        }
                        return;
                    }
                    if (!_utils2.default.isObject(attempt)) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: processAttempt called with a non object attempt. Attempt will be discarded.");
                        }
                        return;
                    }
                    if (!_utils2.default.isString(attempt.itemURI)) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: processAttempt called with a non string itemUri. Attempt will be discarded.");
                        }
                        return;
                    }
                    if (attempt.guessingParameter != null && !_utils2.default.isNumber(attempt.guessingParameter)) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: processAttempt called with a non numeric guessingParamter. Attempt will be discarded.");
                        }
                        return;
                    }
                    if (!_utils2.default.isNumber(attempt.outcome)) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: processAttempt called with  a non numeric outcome. Attempt will be discarded.");
                        }
                        return;
                    }
                    var item = _modelManager2.default.getItemByUri(attempt.itemURI);
                    if (!item || !item.localDimension || !item.localDimension.dimension) {
                        if (_utils2.default.checkLoggingLevel("warn") && console && console.log) {
                            console.log("Warning: processAttempt called with an invalid itemUri. Attempt will be discarded.");
                        }
                        return;
                    }
                    var latentAbility = _learnerManager2.default.getLatentAbilityEstimate(item.localDimension.dimension.uri);
                    var localAbility = _learnerManager2.default.getLocalAbilityEstimate(item.localDimension.uri);
                    updatedAttempt.priorLatentMean = latentAbility.mean;
                    updatedAttempt.priorLatentStandardDeviation = latentAbility.standardDeviation;
                    updatedAttempt.priorLocalMean = localAbility.mean;
                    updatedAttempt.priorLocalStandardDeviation = localAbility.standardDeviation;
                    return updatedAttempt;
                }
            }, {
                key: "processAttempt",
                value: function processAttempt(attempt) {
                    var learnerId = _state2.default.get("learnerId");
                    var item = _modelManager2.default.getItemByUri(attempt.itemURI);
                    var estimation = _irt2.default.estimate(attempt.outcome, item.mean, attempt.guessingParameter, attempt.priorLocalMean, attempt.priorLocalStandardDeviation);
                    var newAbility = {
                        dimension: item.localDimension.dimension,
                        mean: estimation.post_mean,
                        standardDeviation: estimation.post_sd,
                        timestamp: _state2.default.get("trialTime") || 0
                    };
                    var newAbilities = _state2.default.get("latentAbilities." + learnerId) || [];
                    var updateAbilityIndex = _utils2.default.findItemIndex(newAbilities, function(newAbility) {
                        return newAbility.dimension && newAbility.dimension.uri === item.localDimension.dimension.uri;
                    });
                    if (updateAbilityIndex !== -1) {
                        newAbilities[updateAbilityIndex] = newAbility;
                    } else {
                        newAbilities.push(newAbility);
                    }
                    _state2.default.set("latentAbilities." + learnerId, newAbilities);
                    _utils2.default.cacheLatentAbilityEstimates(newAbilities);
                }
            } ]);
            return KidaptiveSdkAttemptProcessor;
        }();
        exports.default = new KidaptiveSdkAttemptProcessor();
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
        var _constants = __webpack_require__(4);
        var _constants2 = _interopRequireDefault(_constants);
        var _error = __webpack_require__(1);
        var _error2 = _interopRequireDefault(_error);
        var _eventManager = __webpack_require__(14);
        var _eventManager2 = _interopRequireDefault(_eventManager);
        var _learnerManager = __webpack_require__(11);
        var _learnerManager2 = _interopRequireDefault(_learnerManager);
        var _modelManager = __webpack_require__(8);
        var _modelManager2 = _interopRequireDefault(_modelManager);
        var _operationManager = __webpack_require__(7);
        var _operationManager2 = _interopRequireDefault(_operationManager);
        var _recommendationManager = __webpack_require__(10);
        var _recommendationManager2 = _interopRequireDefault(_recommendationManager);
        var _optimalDifficulty = __webpack_require__(16);
        var _optimalDifficulty2 = _interopRequireDefault(_optimalDifficulty);
        var _random = __webpack_require__(15);
        var _random2 = _interopRequireDefault(_random);
        var _state = __webpack_require__(2);
        var _state2 = _interopRequireDefault(_state);
        var _utils = __webpack_require__(0);
        var _utils2 = _interopRequireDefault(_utils);
        var _q = __webpack_require__(3);
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
        var KidaptiveSdk = function() {
            function KidaptiveSdk() {
                _classCallCheck(this, KidaptiveSdk);
                _state2.default.clear();
                _state2.default.set("initialized", false);
                this.eventManager = _eventManager2.default;
                this.learnerManager = _learnerManager2.default;
                this.modelManager = _modelManager2.default;
            }
            _createClass(KidaptiveSdk, [ {
                key: "init",
                value: function init(apiKey) {
                    var _this = this;
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
                        options.authMode = options.authMode == null ? _constants2.default.DEFAULT.AUTH_MODE : options.authMode;
                        options.autoFlushInterval = options.autoFlushInterval == null ? _constants2.default.DEFAULT.AUTO_FLUSH_INTERVAL : options.autoFlushInterval;
                        options.loggingLevel = options.loggingLevel == null ? _constants2.default.DEFAULT.LOGGING_LEVEL : options.loggingLevel;
                        if (apiKey == null) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "API key is required");
                        }
                        if (!_utils2.default.isString(apiKey)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "API key must be a string");
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
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Tier option must be a number");
                        }
                        if ([ 1, 2, 3 ].indexOf(options.tier) === -1) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "Tier option is not an accepted value");
                        }
                        if (!_utils2.default.isString(options.authMode)) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "AuthMode option must be a string");
                        }
                        if ([ "client", "server" ].indexOf(options.authMode) === -1) {
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "AuthMode option is not an accepted value");
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
                            throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "AutoFlushInterval option must be a number");
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
                        if (options.defaultHttpCache != null) {
                            if (!_utils2.default.isObject(options.defaultHttpCache)) {
                                throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "defaultHttpCache must be an object");
                            }
                            Object.keys(options.defaultHttpCache).forEach(function(cacheKey) {
                                if (!_utils2.default.isString(options.defaultHttpCache[cacheKey])) {
                                    throw new _error2.default(_error2.default.ERROR_CODES.INVALID_PARAMETER, "defaultHttpCache must be an object of key:value pairs with string values");
                                }
                            });
                            Object.keys(options.defaultHttpCache).forEach(function(cacheKey) {
                                try {
                                    _utils2.default.localStorageGetItem(cacheKey);
                                } catch (e) {
                                    _utils2.default.localStorageSetItem(cacheKey, options.defaultHttpCache[cacheKey], false);
                                }
                            });
                        }
                        _state2.default.set("initialized", true);
                        _state2.default.set("apiKey", apiKey);
                        _state2.default.set("options", options);
                        _state2.default.set("user", _utils2.default.getCachedUser());
                        _state2.default.set("learnerId", _utils2.default.getCachedLearnerId());
                        if (options.authMode === "client") {
                            _state2.default.set("singletonLearner", _utils2.default.getCachedSingletonLearnerFlag());
                        }
                        if (options.tier >= 3) {
                            _recommendationManager2.default.registerRecommender(new _optimalDifficulty2.default(_this), "optimalDifficulty");
                            _recommendationManager2.default.registerRecommender(new _random2.default(_this), "random");
                        }
                        var requests = [];
                        if (options.tier >= 1) {
                            requests.push(_eventManager2.default.startAutoFlush());
                        }
                        if (options.tier >= 2) {
                            requests.push(_modelManager2.default.updateModels());
                        }
                        return _q2.default.all(requests).then(function(results) {
                            var activeLearner = _learnerManager2.default.getActiveLearner();
                            if (activeLearner) {
                                return _learnerManager2.default.selectActiveLearner(activeLearner.providerId).then(function() {}, function() {});
                            } else {
                                _state2.default.set("learnerId", undefined);
                            }
                        });
                    });
                }
            }, {
                key: "getSdkVersion",
                value: function getSdkVersion() {
                    return "1.1.4";
                }
            }, {
                key: "destroy",
                value: function destroy() {
                    return _operationManager2.default.addToQueue(function() {
                        _utils2.default.checkInitialized();
                        if (_state2.default.get("options").tier >= 1) {
                            _eventManager2.default.stopAutoFlush();
                            return _eventManager2.default.flushEventQueue().then(function() {
                                _state2.default.clear();
                                _state2.default.set("initialized", false);
                            });
                        }
                        _state2.default.clear();
                        _state2.default.set("initialized", false);
                    });
                }
            } ]);
            return KidaptiveSdk;
        }();
        exports.default = new KidaptiveSdk();
    } ])["default"];
});