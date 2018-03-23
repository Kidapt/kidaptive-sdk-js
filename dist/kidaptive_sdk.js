(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(); else if (typeof define === "function" && define.amd) define("kidaptive_sdk", [], factory); else if (typeof exports === "object") exports["kidaptive_sdk"] = factory(); else root["KidaptiveSdk"] = factory();
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
        return __webpack_require__(__webpack_require__.s = 26);
    }([ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var _kidaptive_error = __webpack_require__(1);
        var _kidaptive_error2 = _interopRequireDefault(_kidaptive_error);
        var _q = __webpack_require__(6);
        var _q2 = _interopRequireDefault(_q);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var KidaptiveUtils = {};
        KidaptiveUtils.Promise = function(func) {
            var def = _q2.default.defer();
            var resolve = function resolve(value) {
                def.resolve(value);
            };
            var reject = function reject(error) {
                def.reject(error);
            };
            setTimeout(function() {
                try {
                    func(resolve, reject);
                } catch (e) {
                    def.reject(e);
                }
            });
            return def.promise.then(function(v) {
                return v;
            });
        };
        KidaptiveUtils.Promise.resolve = function(value) {
            return KidaptiveUtils.Promise(function(resolve) {
                resolve(value);
            });
        };
        KidaptiveUtils.Promise.reject = function(err) {
            return KidaptiveUtils.Promise(function(_, reject) {
                reject(err);
            });
        };
        KidaptiveUtils.Promise.wrap = function(obj) {
            if (typeof obj === "function") {
                return KidaptiveUtils.Promise(function(resolve, reject) {
                    try {
                        resolve(obj());
                    } catch (e) {
                        reject(e);
                    }
                });
            } else {
                return KidaptiveUtils.Promise.resolve(obj);
            }
        };
        KidaptiveUtils.Promise.parallel = function(objArray) {
            return KidaptiveUtils.Promise(function(resolve) {
                var results = [];
                objArray.forEach(function(o, i) {
                    KidaptiveUtils.Promise.wrap(o).then(function(v) {
                        return {
                            resolved: true,
                            value: v
                        };
                    }, function(e) {
                        return {
                            resolved: false,
                            error: e
                        };
                    }).then(function(r) {
                        results[i] = r;
                        if (Object.keys(results).length === objArray.length) {
                            resolve(results);
                        }
                    });
                });
                if (objArray.length === 0) {
                    resolve(results);
                }
            });
        };
        KidaptiveUtils.Promise.serial = function(funcArray, errors) {
            errors = KidaptiveUtils.copyObject(errors);
            if (typeof errors === "string") {
                errors = [ errors ];
            } else if (!(errors instanceof Array)) {
                errors = undefined;
            }
            var promise = KidaptiveUtils.Promise.resolve();
            funcArray.forEach(function(f) {
                promise = promise.then(KidaptiveUtils.Promise.wrap.bind(undefined, f)).catch(errors ? function(e) {
                    if (errors.indexOf(e.type) !== -1) {
                        throw e;
                    }
                } : undefined);
            });
            return promise.then(function() {});
        };
        var jsonHelper = function jsonHelper(o, inArray) {
            o = KidaptiveUtils.copyObject(o);
            switch (typeof o === "undefined" ? "undefined" : _typeof(o)) {
              case "object":
                if (o !== null) {
                    if (o instanceof Array) {
                        return "[" + o.map(function(i) {
                            return jsonHelper(i, true);
                        }).join(",") + "]";
                    } else {
                        return "{" + Object.keys(o).sort().map(function(i) {
                            var value = jsonHelper(o[i]);
                            return value === undefined ? value : [ JSON.stringify(i), value ].join(":");
                        }).filter(function(i) {
                            return i !== undefined;
                        }).join(",") + "}";
                    }
                }

              case "boolean":
              case "number":
              case "string":
                return JSON.stringify(o);

              default:
                return inArray ? "null" : undefined;
            }
        };
        KidaptiveUtils.toJson = function(o) {
            return jsonHelper(o);
        };
        KidaptiveUtils.getObject = function(object, key) {
            key = KidaptiveUtils.copyObject(key);
            if (key === undefined) {
                return object;
            } else if (key instanceof Array) {
                key.forEach(function(i) {
                    object = (object || {})[i];
                });
                return object;
            }
            return (object || {})[key];
        };
        KidaptiveUtils.putObject = function(object, key, value) {
            key = KidaptiveUtils.copyObject(key);
            var o = object;
            if (key instanceof Array) {
                if (key.length === 0) {
                    return object;
                }
                key.forEach(function(k, i) {
                    if (i === key.length - 1) {
                        key = k;
                    } else {
                        o = o[k] || (o[k] = {});
                    }
                });
            }
            if (value === undefined) {
                delete o[key];
            } else {
                o[key] = value;
            }
            return object;
        };
        KidaptiveUtils.toCamelCase = function(str, delimiters) {
            return str.split(delimiters).filter(function(s) {
                return s.length > 0;
            }).map(function(s, i) {
                s = s.toLowerCase();
                if (i) {
                    return s[0].toUpperCase() + s.substr(1);
                }
                return s;
            }).join("");
        };
        KidaptiveUtils.localStorageSetItem = function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.log("Warning: ALP SDK unable to write to localStorage. Cached data may be inconsistent or out-of-date");
            }
        };
        KidaptiveUtils.localStorageGetItem = function(key) {
            var cached = localStorage.getItem(key);
            if (cached === null) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "No item found for key " + key + " in localStorage");
            }
            return cached === "undefined" ? undefined : JSON.parse(cached);
        };
        KidaptiveUtils.copyObject = function(o, preserveFunctions) {
            var oCopy = JSON.stringify(o);
            oCopy = oCopy === undefined ? oCopy : JSON.parse(oCopy);
            if (preserveFunctions) {
                if (typeof o === "function") {
                    return o;
                } else if (oCopy instanceof Array) {
                    for (var i = 0; i < o.length; i++) {
                        var v = KidaptiveUtils.copyObject(o[i], true);
                        oCopy[i] = v === undefined ? null : v;
                    }
                } else if (oCopy instanceof Object) {
                    Object.keys(o).forEach(function(k) {
                        var v = KidaptiveUtils.copyObject(o[k], true);
                        if (v !== undefined) {
                            oCopy[k] = v;
                        }
                    });
                }
            }
            return oCopy;
        };
        KidaptiveUtils.checkObjectFormat = function(object, format) {
            object = KidaptiveUtils.copyObject(object, true);
            format = KidaptiveUtils.copyObject(format, true);
            if (object === undefined || format === undefined) {
                return;
            }
            if (format === null) {
                if (object !== null) {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Expected null");
                }
            } else if (typeof format === "function") {
                if (typeof object !== "function") {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Expected function");
                }
            } else if (format instanceof Array) {
                if (!(object instanceof Array)) {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Expected array");
                }
                object.forEach(function(v, i) {
                    try {
                        KidaptiveUtils.checkObjectFormat(v, format[Math.min(i, format.length - 1)]);
                    } catch (e) {
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Error at index " + i + ": " + e.message);
                    }
                });
            } else if (format instanceof Object) {
                if (!(object instanceof Object) || object instanceof Array || typeof object === "function") {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Expected object");
                }
                Object.keys(format).forEach(function(k) {
                    try {
                        KidaptiveUtils.checkObjectFormat(object[k], format[k]);
                    } catch (e) {
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Error at property " + k + ": " + e.message);
                    }
                });
            } else if ((typeof object === "undefined" ? "undefined" : _typeof(object)) !== (typeof format === "undefined" ? "undefined" : _typeof(format))) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Expected " + (typeof format === "undefined" ? "undefined" : _typeof(format)));
            }
        };
        exports.default = KidaptiveUtils;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var KidaptiveError = function KidaptiveError(type, message) {
            var e = new Error(message);
            Object.getOwnPropertyNames(e).map(function(k) {
                Object.defineProperty(this, k, Object.getOwnPropertyDescriptor(e, k));
            }.bind(this));
            this.type = type;
        };
        KidaptiveError.prototype = Object.create(Error.prototype);
        KidaptiveError.prototype.constructor = KidaptiveError;
        KidaptiveError.prototype.name = "KidaptiveError";
        KidaptiveError.prototype.toString = function() {
            return this.name + " (" + this.type + "): " + this.message;
        };
        KidaptiveError.KidaptiveErrorCode = {
            GENERIC_ERROR: "GENERIC_ERROR",
            INVALID_PARAMETER: "INVALID_PARAMETER",
            ILLEGAL_STATE: "ILLEGAL_STATE",
            API_KEY_ERROR: "API_KEY_ERROR",
            WEB_API_ERROR: "WEB_API_ERROR"
        };
        exports.default = KidaptiveError;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var KidaptiveConstants = {
            HOST_PROD: "https://service.kidaptive.com/v3",
            HOST_DEV: "https://develop.kidaptive.com/v3",
            ENDPOINTS: {
                APP: "/app/me",
                GAME: "/game",
                PROMPT: "/prompt",
                CATEGORY: "/category",
                SUB_CATEGORY: "/sub-category",
                INSTANCE: "/instance",
                PROMPT_CATEGORY: "/prompt-category",
                SKILLS_FRAMEWORK: "/skills-framework",
                SKILLS_CLUSTER: "/skills-cluster",
                SKILLS_DOMAIN: "/skills-domain",
                DIMENSION: "/dimension",
                LOCAL_DIMENSION: "/local-dimension",
                ITEM: "/item",
                LEARNER: "/learner",
                ABILITY: "/ability",
                LOCAL_ABILITY: "/local-ability",
                INSIGHT: "/insight",
                INGESTION: "/ingestion",
                CREATE_USER: "/user",
                USER: "/user/me",
                LOGIN: "/user/login",
                LOGOUT: "/user/logout"
            },
            ALP_EVENT_VERSION: "3.0"
        };
        exports.default = KidaptiveConstants;
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
    }, function(module, exports) {
        function isObject(obj) {
            return null != obj && "object" == typeof obj;
        }
        module.exports = isObject;
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
        }).call(this, __webpack_require__(4), __webpack_require__(23).setImmediate);
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _kidaptive_constants = __webpack_require__(2);
        var _kidaptive_constants2 = _interopRequireDefault(_kidaptive_constants);
        var _kidaptive_error = __webpack_require__(1);
        var _kidaptive_error2 = _interopRequireDefault(_kidaptive_error);
        var _kidaptive_utils = __webpack_require__(0);
        var _kidaptive_utils2 = _interopRequireDefault(_kidaptive_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var KidaptiveUserManager = function KidaptiveUserManager(sdk) {
            this.sdk = sdk;
            this.apiKeyCacheKey = sdk.httpClient.getCacheKey("GET", _kidaptive_constants2.default.ENDPOINTS.APP).replace(/[.].*/, ".alpApiKey");
            try {
                this.apiKey = _kidaptive_utils2.default.getObject(_kidaptive_utils2.default.localStorageGetItem(this.apiKeyCacheKey), [ "apiKey" ]) || sdk.httpClient.apiKey;
            } catch (e) {
                this.apiKey = sdk.httpClient.apiKey;
            }
        };
        KidaptiveUserManager.prototype.storeUser = function(user) {
            if (user.apiKey) {
                this.apiKey = user.apiKey;
                _kidaptive_utils2.default.localStorageSetItem(this.apiKeyCacheKey, user);
                delete user.apiKey;
            }
            this.currentUser = user;
            _kidaptive_utils2.default.localStorageSetItem(this.sdk.httpClient.getCacheKey("GET", _kidaptive_constants2.default.ENDPOINTS.USER), user);
        };
        KidaptiveUserManager.prototype.createUser = function(params) {
            params = _kidaptive_utils2.default.copyObject(params) || {};
            var format = {
                email: "",
                password: "",
                nickname: ""
            };
            _kidaptive_utils2.default.checkObjectFormat(params, format);
            if (!params.email) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "email is required");
            }
            if (!params.password) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "password is required");
            }
            Object.keys(params).forEach(function(key) {
                if (format[key] === undefined) {
                    delete params[key];
                }
            });
            return this.sdk.httpClient.ajax("POST", _kidaptive_constants2.default.ENDPOINTS.CREATE_USER, params, {
                noCache: true
            }).then(function(user) {
                this.storeUser(user);
                return user;
            }.bind(this));
        };
        KidaptiveUserManager.prototype.updateUser = function(params) {
            params = _kidaptive_utils2.default.copyObject(params) || {};
            var format = {
                password: "",
                nickname: "",
                deviceId: ""
            };
            _kidaptive_utils2.default.checkObjectFormat(params, format);
            Object.keys(params).forEach(function(key) {
                if (format[key] === undefined) {
                    delete params[key];
                }
            });
            [ "nickname", "deviceId" ].forEach(function(prop) {
                if (params[prop] === undefined) {
                    params[prop] = this.currentUser[prop];
                }
            }.bind(this));
            return this.sdk.httpClient.ajax("POST", _kidaptive_constants2.default.ENDPOINTS.USER, params, {
                noCache: true
            }).then(function(user) {
                this.storeUser(user);
                return user;
            }.bind(this));
        };
        KidaptiveUserManager.prototype.loginUser = function(params) {
            params = _kidaptive_utils2.default.copyObject(params) || {};
            var format = {
                email: "",
                password: ""
            };
            _kidaptive_utils2.default.checkObjectFormat(params, format);
            if (!params.email) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "email is required");
            }
            if (!params.password) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "password is required");
            }
            Object.keys(params).forEach(function(key) {
                if (format[key] === undefined) {
                    delete params[key];
                }
            });
            return this.sdk.httpClient.ajax("POST", _kidaptive_constants2.default.ENDPOINTS.LOGIN, params, {
                noCache: true
            }).then(function(user) {
                this.storeUser(user);
                return user;
            }.bind(this));
        };
        KidaptiveUserManager.prototype.refreshUser = function() {
            return this.sdk.httpClient.ajax("GET", _kidaptive_constants2.default.ENDPOINTS.USER).then(function(user) {
                this.currentUser = user;
                return user;
            }.bind(this));
        };
        KidaptiveUserManager.prototype.logoutUser = function() {
            this.currentUser = undefined;
            return this.sdk.httpClient.ajax("POST", _kidaptive_constants2.default.ENDPOINTS.LOGOUT, undefined, {
                noCache: true
            }).then(function() {
                this.apiKey = this.sdk.httpClient.apiKey;
                localStorage.removeItem(this.apiKeyCacheKey);
            }.bind(this), function(error) {
                this.apiKey = this.sdk.httpClient.apiKey;
                localStorage.removeItem(this.apiKeyCacheKey);
                throw error;
            }.bind(this));
        };
        exports.default = KidaptiveUserManager;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _kidaptive_utils = __webpack_require__(0);
        var _kidaptive_utils2 = _interopRequireDefault(_kidaptive_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var KidaptiveTrialManager = function KidaptiveTrialManager(sdk) {
            this.sdk = sdk;
            this.openTrials = {};
        };
        KidaptiveTrialManager.prototype.startTrial = function(learnerId) {
            if (this.openTrials[learnerId]) {
                this.endTrial(learnerId);
            }
            var min = 1 << 31;
            this.openTrials[learnerId] = {
                trialTime: Date.now(),
                trialSalt: Math.floor(Math.random() * (-min * 2) + min),
                dimensionsReset: {}
            };
        };
        KidaptiveTrialManager.prototype.endTrial = function(learnerId) {
            if (this.openTrials[learnerId]) {
                Object.keys(this.openTrials[learnerId].dimensionsReset).forEach(function(localDimId) {
                    var latentAbil = _kidaptive_utils2.default.copyObject(this.sdk.modelManager.getLatentAbilities(learnerId, this.sdk.modelManager.idToModel["local-dimension"][localDimId].dimensionId));
                    var localAbil = this.sdk.modelManager.getLocalAbilities(learnerId, localDimId);
                    latentAbil.mean = localAbil.mean;
                    latentAbil.standardDeviation = localAbil.standardDeviation;
                    latentAbil.timestamp = localAbil.timestamp;
                    this.sdk.modelManager.setLatentAbility(learnerId, latentAbil);
                }.bind(this));
                delete this.openTrials[learnerId];
            }
        };
        KidaptiveTrialManager.prototype.endAllTrials = function() {
            Object.keys(this.openTrials).forEach(function(learnerId) {
                this.endTrial(learnerId);
            }.bind(this));
        };
        KidaptiveTrialManager.prototype.resetDimension = function(learnerId, localDimensionId) {
            this.openTrials[learnerId].dimensionsReset[localDimensionId] = true;
        };
        exports.default = KidaptiveTrialManager;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _kidaptive_error = __webpack_require__(1);
        var _kidaptive_error2 = _interopRequireDefault(_kidaptive_error);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var KidaptiveRecommendationManager = function KidaptiveRecommendationManager(sdk) {
            this.sdk = sdk;
            this.recommenders = {};
            this.ODRec = new OptimalDifficultyRecommender(sdk);
            this.RPRec = new RandomPromptRecommender(sdk);
        };
        KidaptiveRecommendationManager.checkRecommender = function(rec) {
            if (!rec || typeof rec.getRecommendations !== "function") {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Recommender must have function 'getRecommendations(params)'");
            }
        };
        KidaptiveRecommendationManager.prototype.registerRecommender = function(key, rec) {
            KidaptiveRecommendationManager.checkRecommender(rec);
            this.recommenders[key] = rec;
        };
        KidaptiveRecommendationManager.prototype.unregisterRecommender = function(key) {
            delete this.recommenders[key];
        };
        KidaptiveRecommendationManager.prototype.getRecommendations = function(key, params) {
            var rec = this.recommenders[key];
            if (!rec) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "No recommender registered for key " + key);
            }
            KidaptiveRecommendationManager.checkRecommender(rec);
            return rec.getRecommendations(params);
        };
        var OptimalDifficultyRecommender = function OptimalDifficultyRecommender(sdk) {
            this.sdk = sdk;
        };
        OptimalDifficultyRecommender.prototype.getRecommendations = function(params) {
            params = params || {};
            if (!params.learnerId) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "learnerId is required");
            } else if (!this.sdk.learnerManager.idToLearner[params.learnerId]) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Learner " + params.learnerId + " not found");
            }
            if (!params.game) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Game is required");
            } else if (!this.sdk.modelManager.uriToModel["game"][params.game]) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + params.game + " not found");
            }
            var localDim = this.sdk.modelManager.uriToModel["local-dimension"][params["local-dimension"]];
            if (!params["local-dimension"]) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "local-dimension is required");
            } else if (!localDim) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Local dimension " + params["local-dimension"] + " not found");
            }
            var probSuccess = params.successProbability || .7;
            var mean = this.sdk.modelManager.getLocalAbilities(params.learnerId, localDim.id).mean;
            var context = {};
            var prompts = this.sdk.modelManager.getModels("item", params).map(function(i) {
                return {
                    key: Math.random(),
                    value: i
                };
            }).sort(function(a, b) {
                return a.key - b.key;
            }).map(function(p) {
                var i = p.value;
                return {
                    key: 1 / (1 + Math.exp(Math.sqrt(8 / Math.PI) * (i.mean - mean))),
                    value: i.promptId
                };
            }).sort(function(a, b) {
                return Math.abs(a.key - probSuccess) - Math.abs(b.key - probSuccess);
            }).slice(0, params.numResults || 10).map(function(p) {
                var uri = this.sdk.modelManager.idToModel["prompt"][p.value].uri;
                context[uri] = {
                    successProbability: p.key
                };
                return uri;
            }.bind(this));
            return {
                type: "prompt",
                recommendations: prompts,
                context: context
            };
        };
        var RandomPromptRecommender = function RandomPromptRecommender(sdk) {
            this.sdk = sdk;
        };
        RandomPromptRecommender.prototype.getRecommendations = function(params) {
            params = params || {};
            if (!params.game) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Game is required");
            } else if (!this.sdk.modelManager.uriToModel["game"][params.game]) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + params.game + " not found");
            }
            var prompts = {};
            this.sdk.modelManager.getModels("item", params).forEach(function(i) {
                prompts[this.sdk.modelManager.idToModel["prompt"][i.promptId].uri] = true;
            }.bind(this));
            prompts = Object.keys(prompts).map(function(uri) {
                return {
                    key: Math.random(),
                    value: uri
                };
            }).sort(function(a, b) {
                return a.key - b.key;
            }).slice(0, params.numResults || 10).map(function(p) {
                return p.value;
            });
            return {
                type: "prompt",
                recommendations: prompts
            };
        };
        exports.default = KidaptiveRecommendationManager;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _kidaptive_constants = __webpack_require__(2);
        var _kidaptive_constants2 = _interopRequireDefault(_kidaptive_constants);
        var _kidaptive_utils = __webpack_require__(0);
        var _kidaptive_utils2 = _interopRequireDefault(_kidaptive_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var KidaptiveModelManager = function KidaptiveModelManager(sdk) {
            this.sdk = sdk;
            this.uriToModel = {};
            this.idToModel = {};
            this.clearLearnerModels();
        };
        KidaptiveModelManager.modelParents = {
            "skills-framework": [],
            "skills-cluster": [ "skills-framework" ],
            "skills-domain": [ "skills-cluster" ],
            dimension: [ "skills-domain" ],
            game: [],
            "local-dimension": [ "dimension", "game" ],
            prompt: [ "game" ],
            item: [ "prompt", "local-dimension" ],
            category: [],
            "sub-category": [ "category" ],
            instance: [ "sub-category" ],
            "prompt-category": [ "prompt", "category", "instance" ]
        };
        KidaptiveModelManager.modelOrder = [];
        var determineModelOrder = function determineModelOrder(modelTypes) {
            modelTypes.forEach(function(type) {
                determineModelOrder(KidaptiveModelManager.modelParents[type]);
                if (KidaptiveModelManager.modelOrder.indexOf(type) === -1) {
                    KidaptiveModelManager.modelOrder.push(type);
                }
            });
        };
        determineModelOrder(Object.keys(KidaptiveModelManager.modelParents));
        KidaptiveModelManager.getModelParents = function(type) {
            var allParents = {};
            var parents = KidaptiveModelManager.modelParents[type];
            if (parents) {
                allParents[type] = true;
                parents.forEach(function(p) {
                    KidaptiveModelManager.getModelParents(p).forEach(function(p) {
                        allParents[p] = true;
                    });
                });
            }
            return Object.keys(allParents);
        };
        KidaptiveModelManager.buildModelIndex = function(type, id, idToModel, modelIndex) {
            var o = _kidaptive_utils2.default.getObject(idToModel, [ type, id ]);
            var index = {};
            if (o) {
                _kidaptive_utils2.default.putObject(index, [ type ], [ id ]);
                KidaptiveModelManager.modelParents[type].forEach(function(parentType) {
                    var parentIndex = _kidaptive_utils2.default.getObject(modelIndex, [ parentType, o[_kidaptive_utils2.default.toCamelCase(parentType, "-") + "Id"] ]) || {};
                    Object.keys(parentIndex).forEach(function(type) {
                        _kidaptive_utils2.default.putObject(index, [ type ], parentIndex[type]);
                    });
                });
            }
            return index;
        };
        KidaptiveModelManager.prototype.refreshAppModels = function() {
            return _kidaptive_utils2.default.Promise.parallel(KidaptiveModelManager.modelOrder.map(function(model) {
                return this.sdk.httpClient.ajax.bind(this.sdk.httpClient, "GET", "/" + model);
            }.bind(this))).then(function(results) {
                var uriToModel = {};
                var idToModel = {};
                var modelIndex = {};
                for (var i = 0; i < results.length; i++) {
                    if (results[i].resolved) {
                        var model = KidaptiveModelManager.modelOrder[i];
                        var uriMap = {};
                        var idMap = {};
                        results[i].value.forEach(function(o) {
                            uriMap[o.uri] = o;
                            idMap[o.id] = o;
                        });
                        uriToModel[model] = uriMap;
                        idToModel[model] = idMap;
                        Object.keys(idToModel[model]).forEach(function(id) {
                            _kidaptive_utils2.default.putObject(modelIndex, [ model, id ], KidaptiveModelManager.buildModelIndex(model, id, idToModel, modelIndex));
                        });
                    } else {
                        throw results[i].error;
                    }
                }
                this.uriToModel = uriToModel;
                this.idToModel = idToModel;
                this.modelIndex = modelIndex;
            }.bind(this));
        };
        KidaptiveModelManager.prototype.getModels = function(type, conditions) {
            var index = this.modelIndex[type];
            if (!index) {
                return [];
            }
            var modelParents = KidaptiveModelManager.getModelParents(type);
            conditions = _kidaptive_utils2.default.copyObject(conditions) || {};
            return Object.keys(index).filter(function(id) {
                var shouldReturn = true;
                modelParents.forEach(function(parent) {
                    if (!shouldReturn) {
                        return;
                    }
                    var con = conditions[parent];
                    if (con) {
                        var prop = index[id][parent];
                        if (!prop || !prop.length) {
                            shouldReturn = false;
                        } else {
                            if (!(con instanceof Array)) {
                                con = [ con ];
                            }
                            prop.forEach(function(id) {
                                var uri = _kidaptive_utils2.default.getObject(this.idToModel, [ parent, id, "uri" ]);
                                shouldReturn = shouldReturn && con.indexOf(uri) !== -1;
                            }.bind(this));
                        }
                    }
                }.bind(this));
                return shouldReturn;
            }.bind(this)).map(function(id) {
                return _kidaptive_utils2.default.getObject(this.idToModel, [ type, id ]);
            }.bind(this)).filter(function(o) {
                return o !== undefined;
            });
        };
        KidaptiveModelManager.prototype.refreshLatentAbilities = function(learnerId) {
            if (!learnerId) {
                return _kidaptive_utils2.default.Promise.parallel(Object.keys(this.sdk.learnerManager.idToLearner).map(function(learner) {
                    return this.refreshLatentAbilities.bind(this, learner);
                }.bind(this)));
            } else {
                return this.sdk.httpClient.ajax("GET", _kidaptive_constants2.default.ENDPOINTS.ABILITY, {
                    learnerId: learnerId
                }, {
                    noCache: true
                }).then(function(abilities) {
                    if (!this.latentAbilities[learnerId]) {
                        try {
                            var stored = _kidaptive_utils2.default.localStorageGetItem(this.sdk.httpClient.getCacheKey("GET", _kidaptive_constants2.default.ENDPOINTS.ABILITY, {
                                learnerId: learnerId
                            }));
                            if (stored) {
                                this.latentAbilities[learnerId] = stored;
                            }
                        } catch (e) {}
                    }
                    abilities.forEach(function(ability) {
                        this.setLatentAbility(learnerId, ability, true);
                    }.bind(this));
                    return this.latentAbilities;
                }.bind(this));
            }
        };
        KidaptiveModelManager.prototype.refreshLocalAbilities = function(learnerId) {
            if (!learnerId) {
                return _kidaptive_utils2.default.Promise.parallel(Object.keys(this.sdk.learnerManager.idToLearner).map(function(learner) {
                    return this.refreshLocalAbilities.bind(this, learner);
                }.bind(this)));
            } else {
                return this.sdk.httpClient.ajax("GET", _kidaptive_constants2.default.ENDPOINTS.LOCAL_ABILITY, {
                    learnerId: learnerId
                }, {
                    noCache: true
                }).then(function(abilities) {
                    if (!this.localAbilities[learnerId]) {
                        try {
                            var stored = _kidaptive_utils2.default.localStorageGetItem(this.sdk.httpClient.getCacheKey("GET", _kidaptive_constants2.default.ENDPOINTS.LOCAL_ABILITY, {
                                learnerId: learnerId
                            }));
                            if (stored) {
                                this.localAbilities[learnerId] = stored;
                            }
                        } catch (e) {}
                    }
                    abilities.forEach(function(ability) {
                        this.setLocalAbility(learnerId, ability, true);
                    }.bind(this));
                    return this.localAbilities;
                }.bind(this));
            }
        };
        KidaptiveModelManager.prototype.getLatentAbilities = function(learnerId, dimId) {
            if (dimId) {
                var dim = this.idToModel["dimension"][dimId];
                if (dim) {
                    return _kidaptive_utils2.default.getObject(this.latentAbilities, [ learnerId, dimId ]) || {
                        dimensionId: dim.id,
                        mean: 0,
                        standardDeviation: 1,
                        timestamp: 0
                    };
                }
            } else {
                return Object.keys(this.idToModel["dimension"]).map(function(id) {
                    return this.getLatentAbilities(learnerId, id);
                }.bind(this));
            }
        };
        KidaptiveModelManager.prototype.getLocalAbilities = function(learnerId, dimId) {
            if (dimId) {
                var dim = this.idToModel["local-dimension"][dimId];
                if (dim) {
                    return _kidaptive_utils2.default.getObject(this.localAbilities, [ learnerId, dimId ]) || {
                        localDimensionId: dim.id,
                        mean: 0,
                        standardDeviation: 1,
                        timestamp: 0
                    };
                }
            } else {
                return Object.keys(this.idToModel["local-dimension"]).map(function(id) {
                    return this.getLocalAbilities(learnerId, id);
                }.bind(this));
            }
        };
        KidaptiveModelManager.prototype.setLatentAbility = function(learnerId, ability, keepCurrent) {
            var curAbil = _kidaptive_utils2.default.getObject(this.latentAbilities, [ learnerId, ability.dimensionId ]);
            if (!curAbil || curAbil.timestamp < ability.timestamp || curAbil.timestamp === ability.timestamp && !keepCurrent) {
                _kidaptive_utils2.default.putObject(this.latentAbilities, [ learnerId, ability.dimensionId ], ability);
                _kidaptive_utils2.default.localStorageSetItem(this.sdk.httpClient.getCacheKey("GET", _kidaptive_constants2.default.ENDPOINTS.ABILITY, {
                    learnerId: learnerId
                }), Object.keys(this.latentAbilities[learnerId]).map(function(dimId) {
                    return this.latentAbilities[learnerId][dimId];
                }.bind(this)));
            }
        };
        KidaptiveModelManager.prototype.setLocalAbility = function(learnerId, ability, keepCurrent) {
            var curAbil = _kidaptive_utils2.default.getObject(this.localAbilities, [ learnerId, ability.localDimensionId ]);
            if (!curAbil || curAbil.timestamp < ability.timestamp || curAbil.timestamp === ability.timestamp && !keepCurrent) {
                _kidaptive_utils2.default.putObject(this.localAbilities, [ learnerId, ability.localDimensionId ], ability);
                _kidaptive_utils2.default.localStorageSetItem(this.sdk.httpClient.getCacheKey("GET", _kidaptive_constants2.default.ENDPOINTS.LOCAL_ABILITY, {
                    learnerId: learnerId
                }), Object.keys(this.localAbilities[learnerId]).map(function(dimId) {
                    return this.localAbilities[learnerId][dimId];
                }.bind(this)));
            }
        };
        KidaptiveModelManager.prototype.fetchInsights = function(learnerId, minDateCreated, latest) {};
        KidaptiveModelManager.prototype.clearLearnerModels = function() {
            this.latentAbilities = {};
            this.localAbilities = {};
            this.insights = {};
        };
        exports.default = KidaptiveModelManager;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _kidaptive_constants = __webpack_require__(2);
        var _kidaptive_constants2 = _interopRequireDefault(_kidaptive_constants);
        var _kidaptive_error = __webpack_require__(1);
        var _kidaptive_error2 = _interopRequireDefault(_kidaptive_error);
        var _kidaptive_utils = __webpack_require__(0);
        var _kidaptive_utils2 = _interopRequireDefault(_kidaptive_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var KidaptiveLearnerManager = function KidaptiveLearnerManager(sdk) {
            this.sdk = sdk;
            this.clearLearnerList();
        };
        KidaptiveLearnerManager.prototype.createLearner = function(params) {
            params = _kidaptive_utils2.default.copyObject(params) || {};
            var format = {
                name: "",
                birthday: 0,
                gender: ""
            };
            _kidaptive_utils2.default.checkObjectFormat(params, format);
            if (!params.name) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "name is required");
            }
            if (params.gender && [ "decline", "male", "female" ].indexOf(params.gender) === -1) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "gender must be 'decline', 'male', or 'female'");
            }
            Object.keys(params).forEach(function(key) {
                if (format[key] === undefined) {
                    delete params[key];
                }
            });
            return this.sdk.httpClient.ajax("POST", _kidaptive_constants2.default.ENDPOINTS.LEARNER, params, {
                noCache: true
            });
        };
        KidaptiveLearnerManager.prototype.updateLearner = function(learnerId, params) {
            params = _kidaptive_utils2.default.copyObject(params) || {};
            var format = {
                name: "",
                birthday: 0,
                gender: "",
                icon: ""
            };
            _kidaptive_utils2.default.checkObjectFormat(params, format);
            if (params.gender && [ "decline", "male", "female" ].indexOf(params.gender) === -1) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "gender must be 'decline', 'male', or 'female'");
            }
            Object.keys(params).forEach(function(key) {
                if (format[key] === undefined) {
                    delete params[key];
                }
            });
            [ "name", "birthday", "gender", "icon" ].forEach(function(prop) {
                if (params[prop] === undefined) {
                    params[prop] = this.idToLearner[learnerId][prop];
                }
            }.bind(this));
            return this.sdk.httpClient.ajax("POST", _kidaptive_constants2.default.ENDPOINTS.LEARNER + "/" + learnerId, params, {
                noCache: true
            });
        };
        KidaptiveLearnerManager.prototype.deleteLearner = function(learnerId) {
            return this.sdk.httpClient.ajax("DELETE", _kidaptive_constants2.default.ENDPOINTS.LEARNER + "/" + learnerId, undefined, {
                noCache: true
            });
        };
        KidaptiveLearnerManager.prototype.refreshLearnerList = function() {
            return this.sdk.httpClient.ajax("GET", _kidaptive_constants2.default.ENDPOINTS.LEARNER).then(function(learners) {
                var idToLearner = {};
                var providerIdToLearner = {};
                learners.forEach(function(l) {
                    if (l.id) {
                        idToLearner[l.id] = l;
                        if (l.providerId) {
                            providerIdToLearner[l.providerId] = l;
                        }
                    }
                });
                this.idToLearner = idToLearner;
                this.providerIdToLearner = providerIdToLearner;
                return learners;
            }.bind(this));
        };
        KidaptiveLearnerManager.prototype.getLearnerList = function() {
            return Object.keys(this.idToLearner).map(function(id) {
                return this.idToLearner[id];
            }.bind(this));
        };
        KidaptiveLearnerManager.prototype.clearLearnerList = function() {
            this.idToLearner = {};
            this.providerIdToLearner = {};
        };
        exports.default = KidaptiveLearnerManager;
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
        var isObject = __webpack_require__(5);
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
        var Emitter = __webpack_require__(15);
        var reduce = __webpack_require__(14);
        var requestBase = __webpack_require__(13);
        var isObject = __webpack_require__(5);
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
        var request = module.exports = __webpack_require__(12).bind(null, Request);
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
        var Q = __webpack_require__(6);
        var superagent = __webpack_require__(16);
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
        }).call(this, __webpack_require__(4), __webpack_require__(3));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _jsSha = __webpack_require__(19);
        var _jsSha2 = _interopRequireDefault(_jsSha);
        var _superagentQ = __webpack_require__(17);
        var _superagentQ2 = _interopRequireDefault(_superagentQ);
        var _kidaptive_constants = __webpack_require__(2);
        var _kidaptive_constants2 = _interopRequireDefault(_kidaptive_constants);
        var _kidaptive_error = __webpack_require__(1);
        var _kidaptive_error2 = _interopRequireDefault(_kidaptive_error);
        var _kidaptive_utils = __webpack_require__(0);
        var _kidaptive_utils2 = _interopRequireDefault(_kidaptive_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var KidaptiveHttpClient = function KidaptiveHttpClient(_apiKey, dev, defaultCache) {
            this.host = dev ? _kidaptive_constants2.default.HOST_DEV : _kidaptive_constants2.default.HOST_PROD;
            this.apiKey = _apiKey;
            defaultCache = defaultCache || {};
            Object.keys(defaultCache).forEach(function(k) {
                try {
                    _kidaptive_utils2.default.localStorageGetItem(k);
                } catch (e) {
                    localStorage[k] = defaultCache[k];
                }
            });
        };
        KidaptiveHttpClient.USER_ENDPOINTS = [ _kidaptive_constants2.default.ENDPOINTS.USER, _kidaptive_constants2.default.ENDPOINTS.LEARNER, _kidaptive_constants2.default.ENDPOINTS.ABILITY, _kidaptive_constants2.default.ENDPOINTS.LOCAL_ABILITY, _kidaptive_constants2.default.ENDPOINTS.INSIGHT, _kidaptive_constants2.default.ENDPOINTS.INGESTION, _kidaptive_constants2.default.ENDPOINTS.LOGOUT ];
        KidaptiveHttpClient.isUserEndpoint = function(endpoint) {
            var isUserEndpoint = false;
            KidaptiveHttpClient.USER_ENDPOINTS.forEach(function(e) {
                if (!isUserEndpoint && endpoint.match("^" + e)) {
                    isUserEndpoint = true;
                }
            });
            return isUserEndpoint;
        };
        KidaptiveHttpClient.prototype.ajax = function(method, endpoint, params, options) {
            options = options || {};
            return _kidaptive_utils2.default.Promise.wrap(function() {
                var settings = {};
                var cacheKey = this.getCacheKey(method, endpoint, params, settings);
                var request = (0, _superagentQ2.default)(settings.method, settings.url);
                if (settings.xhrFields && settings.xhrFields.withCredentials) {
                    request.withCredentials();
                }
                if (settings.method === "POST") {
                    request.send(settings.data);
                } else {
                    request.query(settings.data);
                }
                if (settings.contentType) {
                    request.set("Content-Type", settings.contentType);
                }
                request.set("api-key", settings.headers["api-key"]);
                return request.end().then(function(result) {
                    if (!options.noCache) {
                        _kidaptive_utils2.default.localStorageSetItem(cacheKey, result.body);
                    }
                    return result.body;
                }, function(error) {
                    if (error && error.status === 400) {
                        localStorage.removeItem(cacheKey);
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, error.response && error.response.text);
                    } else if (error && error.status === 401) {
                        KidaptiveHttpClient.deleteUserData();
                        if (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) < 0) {
                            KidaptiveHttpClient.deleteAppData();
                        }
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.API_KEY_ERROR, error.response && error.response.text);
                    } else if (error.status) {
                        localStorage.removeItem(cacheKey);
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.WEB_API_ERROR, error.response && error.response.text);
                    } else {
                        try {
                            return _kidaptive_utils2.default.localStorageGetItem(cacheKey);
                        } catch (e) {
                            throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.GENERIC_ERROR, "HTTP Client Error");
                        }
                    }
                });
            }.bind(this));
        };
        KidaptiveHttpClient.deleteUserData = function() {
            Object.keys(localStorage).forEach(function(k) {
                if (k.match(/^[\w-]*[.]alpUserData$/)) {
                    localStorage.removeItem(k);
                }
            });
        };
        KidaptiveHttpClient.deleteAppData = function() {
            Object.keys(localStorage).forEach(function(k) {
                if (k.match(/^[\w-]*[.]alpAppData$/)) {
                    localStorage.removeItem(k);
                }
            });
        };
        KidaptiveHttpClient.prototype.getCacheKey = function(method, endpoint, params, settings) {
            settings = settings || {};
            settings.headers = {
                "api-key": KidaptiveHttpClient.isUserEndpoint(endpoint) ? this.sdk.userManager.apiKey : this.apiKey
            };
            settings.xhrFields = {
                withCredentials: true
            };
            settings.method = method;
            settings.url = this.host + endpoint;
            if (settings.method === "GET") {
                settings.data = params;
            } else if (settings.method === "POST") {
                settings.contentType = "application/json";
                settings.data = JSON.stringify(params);
            }
            var d = _jsSha2.default.array(_kidaptive_utils2.default.toJson(settings));
            return btoa(String.fromCharCode.apply(undefined, d)).replace(/[+]/g, "-").replace(/[/]/g, "_").replace(/=+/, "") + (KidaptiveHttpClient.isUserEndpoint(endpoint) ? ".alpUserData" : ".alpAppData");
        };
        exports.default = KidaptiveHttpClient;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _kidaptive_constants = __webpack_require__(2);
        var _kidaptive_constants2 = _interopRequireDefault(_kidaptive_constants);
        var _kidaptive_error = __webpack_require__(1);
        var _kidaptive_error2 = _interopRequireDefault(_kidaptive_error);
        var _kidaptive_utils = __webpack_require__(0);
        var _kidaptive_utils2 = _interopRequireDefault(_kidaptive_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var KidaptiveEventManager = function KidaptiveEventManager(sdk) {
            this.sdk = sdk;
            this.eventSequence = 0;
            try {
                this.eventQueue = _kidaptive_utils2.default.localStorageGetItem(this.getEventQueueCacheKey());
            } catch (e) {
                this.eventQueue = [];
            }
        };
        KidaptiveEventManager.prototype.reportBehavior = function(eventName, properties) {
            this.queueEvent(this.createAgentRequest(eventName, "Behavior", properties));
        };
        KidaptiveEventManager.prototype.reportEvidence = function(eventName, properties) {
            this.queueEvent(this.createAgentRequest(eventName, "Result", properties));
        };
        KidaptiveEventManager.prototype.queueEvent = function(event) {
            this.eventQueue.push(event);
            _kidaptive_utils2.default.localStorageSetItem(this.getEventQueueCacheKey(), this.eventQueue);
        };
        KidaptiveEventManager.prototype.flushEvents = function(callbacks) {
            if (!callbacks) {
                callbacks = [];
            }
            var user = this.sdk.userManager.currentUser;
            if (!user) {
                return _kidaptive_utils2.default.Promise.resolve([]);
            }
            var eventQueue = this.eventQueue;
            var flushResults = _kidaptive_utils2.default.Promise.parallel(eventQueue.map(function(event) {
                return this.sdk.httpClient.ajax("POST", _kidaptive_constants2.default.ENDPOINTS.INGESTION, event, {
                    noCache: true
                });
            }.bind(this))).then(function(results) {
                results.forEach(function(r, i) {
                    r.event = _kidaptive_utils2.default.copyObject(eventQueue[i]);
                    if (!r.resolved && (r.error.code === _kidaptive_error2.default.KidaptiveErrorCode.GENERIC_ERROR || r.error.code === _kidaptive_error2.default.KidaptiveErrorCode.API_KEY_ERROR)) {
                        this.queueEvent(eventQueue[i]);
                    }
                }.bind(this));
                return results;
            }.bind(this));
            this.eventQueue = [];
            localStorage.removeItem(this.getEventQueueCacheKey());
            callbacks.forEach(function(c) {
                c(flushResults);
            });
            return flushResults;
        };
        KidaptiveEventManager.prototype.getEventQueueCacheKey = function() {
            return this.sdk.httpClient.getCacheKey("POST", _kidaptive_constants2.default.ENDPOINTS.INGESTION).replace(/[.].*/, ".alpEventData");
        };
        KidaptiveEventManager.prototype.createAgentRequest = function(name, type, properties) {
            if (!name) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Event name is required");
            }
            _kidaptive_utils2.default.checkObjectFormat(name, "");
            properties = _kidaptive_utils2.default.copyObject(properties) || {};
            if (type === "Behavior") {
                delete properties["attempts"];
                delete properties["promptAnswers"];
            }
            _kidaptive_utils2.default.checkObjectFormat(properties, {
                learnerId: 0,
                gameURI: "",
                promptURI: "",
                duration: 0,
                attempts: [ {
                    itemURI: "",
                    outcome: 0,
                    guessingParameter: 0
                } ],
                promptAnswers: {},
                additionalFields: {},
                tags: {}
            });
            var learnerId = properties.learnerId;
            if (type === "Result" && !learnerId) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "learnerId is required");
            }
            if (learnerId) {
                this.sdk.checkLearner(learnerId);
            }
            var trial = this.sdk.trialManager.openTrials[learnerId] || {};
            if (type === "Result" && (!trial.trialTime || !trial.trialSalt)) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.ILLEGAL_STATE, "Must start a trial for learner " + learnerId + " before reporting evidence");
            }
            var gameUri = properties.gameURI;
            if (gameUri) {
                if (!this.sdk.modelManager.uriToModel["game"][gameUri]) {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + gameUri + " not found");
                }
            }
            var promptUri = properties.promptURI;
            if (type === "Result" && !promptUri) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "promptURI is required");
            }
            if (promptUri) {
                var prompt = this.sdk.modelManager.uriToModel["prompt"][promptUri];
                if (!prompt) {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Prompt " + promptUri + " not found");
                }
                var promptGameUri = this.sdk.modelManager.idToModel["game"][prompt.gameId].uri;
                if (gameUri && promptGameUri !== gameUri) {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + promptUri + " has no prompt " + promptUri);
                }
                if (!gameUri) {
                    gameUri = promptGameUri;
                }
            }
            var duration = properties.duration;
            if (duration) {
                if (duration < 0) {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Duration must not be negative");
                }
            }
            var attempts = properties.attempts;
            if (type === "Result") {
                attempts = properties.attempts || [];
                var itemUris = this.sdk.modelManager.getModels("item", {
                    prompt: promptUri
                }).map(function(item) {
                    return item.uri;
                });
                attempts.forEach(function(attempt, i) {
                    if (itemUris.indexOf(attempt.itemURI) < 0) {
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Prompt " + promptUri + " has no item " + attempt.itemURI);
                    }
                    if (attempt.outcome === undefined || attempt.outcome < 0 || attempt.outcome > 1) {
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Outcome in attempt " + i + " must be between 0 and 1 (inclusive)");
                    }
                    if (attempt.guessingParameter < 0 || attempt.guessingParameter > 1) {
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Guessing parameter in attempt " + i + " must be between 0 and 1 (inclusive)");
                    }
                });
            }
            var promptAnswers;
            if (type === "Result") {
                promptAnswers = properties.promptAnswers || {};
                var categoryUris = this.sdk.modelManager.getModels("prompt-category", {
                    prompt: promptUri
                }).map(function(pc) {
                    return this.sdk.modelManager.idToModel["category"][pc.categoryId].uri;
                }.bind(this));
                Object.keys(promptAnswers).forEach(function(key) {
                    if (typeof promptAnswers[key] !== "string") {
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Prompt answers must be strings");
                    }
                    var i = categoryUris.indexOf(key);
                    if (i < 0) {
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Prompt " + promptUri + " has no category " + key);
                    } else {
                        categoryUris.splice(i, 1);
                    }
                });
                if (categoryUris.length > 0) {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Missing category " + categoryUris[0] + " for prompt " + promptUri);
                }
            }
            var additionalFields = properties.additionalFields;
            if (additionalFields) {
                Object.keys(additionalFields).forEach(function(key) {
                    if (typeof additionalFields[key] !== "string") {
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Additional fields must be strings");
                    }
                });
            }
            var tags = properties.tags;
            if (tags) {
                Object.keys(tags).forEach(function(key) {
                    if (typeof tags[key] !== "string") {
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Tags must be strings");
                    }
                });
            }
            if (type === "Result" && (_kidaptive_utils2.default.getObject(tags, [ "SKIP_IRT" ]) || "").toLowerCase() !== "true" && (_kidaptive_utils2.default.getObject(tags, [ "SKIP_LEARNER_IRT" ]) || "").toLowerCase() !== "true") {
                attempts.forEach(this.sdk.attemptProcessor.processAttempt.bind(this.sdk.attemptProcessor, learnerId));
            }
            var userId = this.sdk.anonymousSession ? 0 : this.sdk.userManager.currentUser.id;
            return {
                appInfo: {
                    uri: this.sdk.appInfo.uri,
                    version: this.sdk.appInfo.version,
                    build: this.sdk.appInfo.build
                },
                deviceInfo: {
                    deviceType: _kidaptive_utils2.default.getObject(window, [ "navigator", "userAgent" ]),
                    language: _kidaptive_utils2.default.getObject(window, [ "navigator", "language" ])
                },
                events: [ {
                    version: _kidaptive_constants2.default.ALP_EVENT_VERSION,
                    type: type,
                    name: name,
                    userId: userId,
                    learnerId: learnerId,
                    gameURI: gameUri,
                    promptURI: promptUri,
                    trialTime: trial.trialTime,
                    trialSalt: trial.trialSalt,
                    eventTime: Date.now(),
                    eventSequence: ++this.eventSequence,
                    duration: duration,
                    attempts: attempts,
                    promptAnswers: promptAnswers,
                    additionalFields: additionalFields,
                    tags: tags
                } ]
            };
        };
        exports.default = KidaptiveEventManager;
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
        }).call(this, __webpack_require__(3), __webpack_require__(4));
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
            __webpack_require__(22);
            exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || this && this.setImmediate;
            exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || this && this.clearImmediate;
        }).call(this, __webpack_require__(3));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var KidaptiveIrt = {};
        var normal_dist = function normal_dist(x, mu, sigma) {
            return Math.exp(-Math.pow(x - mu, 2) / 2 / Math.pow(sigma, 2)) / sigma / Math.sqrt(2 * Math.PI);
        };
        var logistic_dist = function logistic_dist(x, mu, alpha) {
            return 1 / (1 + Math.exp(-alpha * (x - mu)));
        };
        var inv_logis = function inv_logis(p) {
            return Math.log(1 / p - 1) * Math.sqrt(Math.PI / 8);
        };
        var estimate = function estimate(y, beta, theta, sigma, post_mean, post_sd) {
            if (sigma === 0) {
                post_mean = theta;
                post_sd = sigma;
                return {
                    post_mean: post_mean,
                    post_sd: post_sd
                };
            }
            var x = theta;
            var s1 = 0;
            var s2 = 0;
            var x_new = theta;
            var a = Math.sqrt(8 / Math.PI);
            var delta = 1;
            var max = 0;
            var upper = Infinity;
            var lower = -Infinity;
            var phi = 0;
            var g = 0;
            var y0 = 0;
            var y1 = 0;
            var y1sign0 = 0;
            var y1sign1 = 0;
            var sd_ratio = Math.exp(-.5);
            if (!y) {
                a = -a;
            }
            while (true) {
                phi = normal_dist(x, theta, sigma);
                g = logistic_dist(x, beta, a);
                y0 = phi * g;
                y1sign0 = a * (1 - g) - (x - theta) / Math.pow(sigma, 2);
                y1sign1 = -Math.pow(a, 2) * g * (1 - g) - 1 / Math.pow(sigma, 2);
                if (y0 > max) {
                    max = y0;
                }
                if (Math.abs(y1sign0) < 1e-6) {
                    break;
                } else if (y1sign0 > 0) {
                    lower = x;
                } else if (y1sign0 < 0) {
                    upper = x;
                }
                x_new = x - y1sign0 / y1sign1;
                if (x_new > lower && x_new < upper) {
                    x = x_new;
                    continue;
                }
                if (lower > -Infinity && upper < Infinity) {
                    x_new = (upper + lower) / 2;
                } else if (lower === -Infinity) {
                    x_new = x - delta;
                    delta = delta * 2;
                } else {
                    x_new = x + delta;
                    delta = delta * 2;
                }
                x = x_new;
            }
            max = normal_dist(x, theta, sigma) * logistic_dist(x, beta, a);
            s1 = x - sigma;
            delta = 1;
            lower = -Infinity;
            upper = x;
            while (true) {
                phi = normal_dist(s1, theta, sigma);
                g = logistic_dist(s1, beta, a);
                y0 = phi * g;
                y1 = y0 * (a * (1 - g) - (s1 - theta) / Math.pow(sigma, 2));
                y0 = y0 - sd_ratio * max;
                if (Math.abs(y0) < max * 1e-6) {
                    break;
                } else if (y0 < 0) {
                    lower = s1;
                } else {
                    upper = s1;
                }
                x_new = s1 - y0 / y1;
                if (x_new > lower && x_new < upper) {
                    s1 = x_new;
                    continue;
                }
                if (lower > -Infinity && upper < Infinity) {
                    x_new = (upper + lower) / 2;
                } else if (lower === -Infinity) {
                    x_new = s1 - delta;
                    delta = delta * 2;
                } else {
                    x_new = s1 + delta;
                    delta = delta * 2;
                }
                s1 = x_new;
            }
            s2 = x + sigma;
            delta = 1;
            lower = x;
            upper = Infinity;
            while (true) {
                phi = normal_dist(s2, theta, sigma);
                g = logistic_dist(s2, beta, a);
                y0 = phi * g;
                y1 = y0 * (a * (1 - g) - (s2 - theta) / Math.pow(sigma, 2));
                y0 = y0 - sd_ratio * max;
                if (Math.abs(y0) < max * 1e-6) {
                    break;
                } else if (y0 > 0) {
                    lower = s2;
                } else {
                    upper = s2;
                }
                x_new = s2 - y0 / y1;
                if (x_new > lower && x_new < upper) {
                    s2 = x_new;
                    continue;
                }
                if (lower > -Infinity && upper < Infinity) {
                    x_new = (upper + lower) / 2;
                } else if (lower === -Infinity) {
                    x_new = s2 - delta;
                    delta = delta * 2;
                } else {
                    x_new = s2 + delta;
                    delta = delta * 2;
                }
                s2 = x_new;
            }
            var postSigma1 = x - s1;
            var postSigma2 = s2 - x;
            post_mean = x + Math.sqrt(2 / Math.PI) * (postSigma2 - postSigma1);
            post_sd = Math.sqrt((Math.pow(postSigma1, 3) + Math.pow(postSigma2, 3)) / (postSigma1 + postSigma2) - 2 * Math.pow(postSigma2 - postSigma1, 2) / Math.PI);
            return {
                post_mean: post_mean,
                post_sd: post_sd
            };
        };
        KidaptiveIrt.estimate = function(y, beta, theta, sigma, post_mean, post_sd) {
            return estimate(y || 0, beta || 0, theta || 0, sigma || 0, post_mean || 0, post_sd || 0);
        };
        exports.default = KidaptiveIrt;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _irt = __webpack_require__(24);
        var _irt2 = _interopRequireDefault(_irt);
        var _kidaptive_utils = __webpack_require__(0);
        var _kidaptive_utils2 = _interopRequireDefault(_kidaptive_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var KidaptiveAttemptProcessor = function KidaptiveAttemptProcessor(sdk) {
            this.sdk = sdk;
        };
        KidaptiveAttemptProcessor.prototype.processAttempt = function(learnerId, attempt) {
            var item = this.sdk.modelManager.uriToModel["item"][attempt.itemURI];
            var ability = _kidaptive_utils2.default.copyObject(this.sdk.modelManager.getLocalAbilities(learnerId, item.localDimensionId));
            if (!this.sdk.trialManager.openTrials[learnerId].dimensionsReset[item.localDimensionId]) {
                if (ability.standardDeviation < .65) {
                    ability.standardDeviation = .65;
                }
                this.sdk.trialManager.resetDimension(learnerId, item.localDimensionId);
            }
            var postAbility = _irt2.default.estimate(!!attempt.outcome, item.mean, ability.mean, ability.standardDeviation);
            ability.mean = postAbility.post_mean;
            ability.standardDeviation = postAbility.post_sd;
            ability.timestamp = this.sdk.trialManager.openTrials[learnerId].trialTime;
            this.sdk.modelManager.setLocalAbility(learnerId, ability);
        };
        exports.default = KidaptiveAttemptProcessor;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _kidaptive_attempt_processor = __webpack_require__(25);
        var _kidaptive_attempt_processor2 = _interopRequireDefault(_kidaptive_attempt_processor);
        var _kidaptive_constants = __webpack_require__(2);
        var _kidaptive_constants2 = _interopRequireDefault(_kidaptive_constants);
        var _kidaptive_error = __webpack_require__(1);
        var _kidaptive_error2 = _interopRequireDefault(_kidaptive_error);
        var _kidaptive_event_manager = __webpack_require__(21);
        var _kidaptive_event_manager2 = _interopRequireDefault(_kidaptive_event_manager);
        var _kidaptive_http_client = __webpack_require__(20);
        var _kidaptive_http_client2 = _interopRequireDefault(_kidaptive_http_client);
        var _kidaptive_learner_manager = __webpack_require__(11);
        var _kidaptive_learner_manager2 = _interopRequireDefault(_kidaptive_learner_manager);
        var _kidaptive_model_manager = __webpack_require__(10);
        var _kidaptive_model_manager2 = _interopRequireDefault(_kidaptive_model_manager);
        var _kidaptive_recommendation_manager = __webpack_require__(9);
        var _kidaptive_recommendation_manager2 = _interopRequireDefault(_kidaptive_recommendation_manager);
        var _kidaptive_trial_manager = __webpack_require__(8);
        var _kidaptive_trial_manager2 = _interopRequireDefault(_kidaptive_trial_manager);
        var _kidaptive_user_manager = __webpack_require__(7);
        var _kidaptive_user_manager2 = _interopRequireDefault(_kidaptive_user_manager);
        var _kidaptive_utils = __webpack_require__(0);
        var _kidaptive_utils2 = _interopRequireDefault(_kidaptive_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var KidaptiveSdk = {};
        var operationQueue = _kidaptive_utils2.default.Promise.resolve();
        var sdk = undefined;
        var defaultFlushInterval;
        var flushInterval;
        var flushTimeoutId;
        var flushing;
        var sdkInitFilter = function sdkInitFilter() {
            if (!sdk) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.ILLEGAL_STATE, "SDK not initialized");
            }
        };
        var addToQueue = function addToQueue(f) {
            var returnQueue = operationQueue.then(f);
            operationQueue = returnQueue.then(function() {}, function() {});
            return returnQueue;
        };
        var filterAuthError = function filterAuthError(error) {
            if (error.type === _kidaptive_error2.default.KidaptiveErrorCode.API_KEY_ERROR) {
                throw error;
            }
        };
        var handleAuthError = function handleAuthError(error) {
            if (error.type === _kidaptive_error2.default.KidaptiveErrorCode.API_KEY_ERROR) {
                return logout(true).then(function() {
                    throw error;
                });
            }
            throw error;
        };
        var logout = function logout(authError) {
            return _kidaptive_utils2.default.Promise.wrap(function() {
                if (!authError) {
                    return sdk.eventManager.flushEvents(sdk.options.autoFlushCallbacks);
                }
            }).then(function() {
                sdk.trialManager.endAllTrials();
                sdk.modelManager.clearLearnerModels();
                sdk.learnerManager.clearLearnerList();
                _kidaptive_http_client2.default.deleteUserData();
                if (sdk.anonymousSession) {
                    sdk.anonymousSession = false;
                } else {
                    return sdk.userManager.logoutUser();
                }
            });
        };
        var refreshUserData = function refreshUserData() {
            return _kidaptive_utils2.default.Promise.serial([ function() {
                return sdk.userManager.refreshUser();
            }, function() {
                return sdk.learnerManager.refreshLearnerList();
            }, function() {
                return sdk.modelManager.refreshLatentAbilities().then(function(results) {
                    results.forEach(function(r) {
                        if (!r.resolved) {
                            filterAuthError(r.error);
                        }
                    });
                });
            }, function() {
                return sdk.modelManager.refreshLocalAbilities().then(function(results) {
                    results.forEach(function(r) {
                        if (!r.resolved) {
                            filterAuthError(r.error);
                        }
                    });
                });
            } ], _kidaptive_error2.default.KidaptiveErrorCode.API_KEY_ERROR).catch(handleAuthError);
        };
        var autoFlush = function autoFlush() {
            clearTimeout(flushTimeoutId);
            if (!flushing && flushInterval > 0) {
                flushTimeoutId = setTimeout(function() {
                    flushing = true;
                    flushEvents(sdk.options.autoFlushCallbacks).then(function() {
                        flushing = false;
                        autoFlush();
                    });
                }, flushInterval);
            }
        };
        var flushEvents = function flushEvents(callbacks) {
            return addToQueue(function() {
                sdkInitFilter();
                var r;
                return sdk.eventManager.flushEvents(callbacks).then(function(results) {
                    r = returnResults.bind(undefined, results);
                    results.forEach(function(r) {
                        if (!r.resolved) {
                            filterAuthError(r.error);
                        }
                    });
                }).catch(handleAuthError).then(function() {
                    return r();
                }, function() {
                    return r();
                });
            });
        };
        var returnResults = function returnResults(results) {
            return results;
        };
        var KidaptiveSdkClass = function KidaptiveSdkClass(apiKey, appVersion, options) {
            return _kidaptive_utils2.default.Promise(function(resolve, reject) {
                apiKey = _kidaptive_utils2.default.copyObject(apiKey);
                if (!apiKey || _kidaptive_utils2.default.checkObjectFormat(apiKey, "")) {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Api key is required");
                }
                appVersion = _kidaptive_utils2.default.copyObject(appVersion) || {};
                _kidaptive_utils2.default.checkObjectFormat(appVersion, {
                    version: "",
                    build: ""
                });
                options = _kidaptive_utils2.default.copyObject(options, true) || {};
                if (!(options.autoFlushCallbacks instanceof Array) && options.autoFlushCallbacks) {
                    options.autoFlushCallbacks = [ options.autoFlushCallbacks ];
                }
                _kidaptive_utils2.default.checkObjectFormat(options, {
                    dev: false,
                    flushInterval: 0,
                    noOidc: false,
                    defaultHttpCache: {},
                    autoFlushCallbacks: [ function() {} ]
                });
                this.options = options;
                this.httpClient = new _kidaptive_http_client2.default(apiKey, options.dev, options.defaultHttpCache);
                this.httpClient.ajax("GET", _kidaptive_constants2.default.ENDPOINTS.APP).then(function(app) {
                    if (appVersion.version < app.minVersion) {
                        throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Version >= " + app.minVersion + " required. Provided " + appVersion.version);
                    }
                    app.version = appVersion.version;
                    app.build = appVersion.build;
                    this.appInfo = app;
                    this.userManager = new _kidaptive_user_manager2.default(this);
                    this.learnerManager = new _kidaptive_learner_manager2.default(this);
                    this.modelManager = new _kidaptive_model_manager2.default(this);
                    this.attemptProcessor = new _kidaptive_attempt_processor2.default(this);
                    this.trialManager = new _kidaptive_trial_manager2.default(this);
                    this.eventManager = new _kidaptive_event_manager2.default(this);
                    this.recManager = new _kidaptive_recommendation_manager2.default(this);
                    return this.modelManager.refreshAppModels();
                }.bind(this)).then(function() {
                    sdk = this;
                    this.httpClient.sdk = this;
                    defaultFlushInterval = options.flushInterval === undefined ? 6e4 : options.flushInterval;
                    KidaptiveSdk.startAutoFlush();
                    return refreshUserData().catch(function() {});
                }.bind(this)).then(function() {
                    resolve(this);
                }.bind(this), reject);
            }.bind(this));
        };
        KidaptiveSdkClass.prototype.checkOidc = function() {
            if (!this.options.noOidc) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.ILLEGAL_STATE, "This operation is not permitted in OIDC context");
            }
        };
        KidaptiveSdkClass.prototype.checkUser = function() {
            if (!this.userManager.currentUser) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.ILLEGAL_STATE, "User not logged in");
            }
        };
        KidaptiveSdkClass.prototype.checkLearner = function(learnerId) {
            if (!this.learnerManager.idToLearner[learnerId]) {
                throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.INVALID_PARAMETER, "Learner " + learnerId + " not found");
            }
        };
        KidaptiveSdk.init = function(apiKey, appVersion, options) {
            return addToQueue(function() {
                if (!sdk) {
                    return new KidaptiveSdkClass(apiKey, appVersion, options).then(function() {
                        return KidaptiveSdk;
                    });
                } else if (apiKey || appVersion || options) {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.ILLEGAL_STATE, "SDK already initialized");
                }
                return KidaptiveSdk;
            });
        };
        KidaptiveSdk.getAppInfo = function() {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(sdk.appInfo);
        };
        KidaptiveSdk.startAnonymousSession = function() {
            return addToQueue(function() {
                sdkInitFilter();
                return logout().catch(function() {}).then(function() {
                    sdk.learnerManager.idToLearner[-1] = {
                        id: -1
                    };
                    sdk.anonymousSession = true;
                });
            });
        };
        KidaptiveSdk.isAnonymousSession = function() {
            sdkInitFilter();
            return sdk.anonymousSession;
        };
        KidaptiveSdk.refresh = function() {
            return addToQueue(function() {
                sdkInitFilter();
                if (sdk.anonymousSession) {
                    throw new _kidaptive_error2.default(_kidaptive_error2.default.KidaptiveErrorCode.ILLEGAL_STATE, "This operation is not permitted in an anonymous session");
                }
                return refreshUserData();
            });
        };
        KidaptiveSdk.getCurrentUser = function() {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(sdk.userManager.currentUser);
        };
        KidaptiveSdk.logoutUser = function() {
            return addToQueue(function() {
                sdkInitFilter();
                return logout();
            });
        };
        KidaptiveSdk.loginUser = function(params) {
            return addToQueue(function() {
                sdkInitFilter();
                sdk.checkOidc();
                return logout().catch(function() {}).then(function() {
                    return sdk.userManager.loginUser(params);
                }).then(function(user) {
                    return refreshUserData().then(function() {
                        return user;
                    });
                });
            });
        };
        KidaptiveSdk.createUser = function(params) {
            return addToQueue(function() {
                sdkInitFilter();
                sdk.checkOidc();
                return logout().catch(function() {}).then(function() {
                    return sdk.userManager.createUser(params);
                }).then(function(user) {
                    return refreshUserData().then(function() {
                        return user;
                    });
                });
            });
        };
        KidaptiveSdk.updateUser = function(params) {
            return addToQueue(function() {
                sdkInitFilter();
                sdk.checkOidc();
                sdk.checkUser();
                return sdk.userManager.updateUser(params).then(function(user) {
                    return refreshUserData().then(function() {
                        return user;
                    });
                });
            });
        };
        KidaptiveSdk.createLearner = function(params) {
            return addToQueue(function() {
                sdkInitFilter();
                sdk.checkOidc();
                sdk.checkUser();
                return sdk.learnerManager.createLearner(params).then(function(learner) {
                    return refreshUserData().then(function() {
                        return learner;
                    });
                });
            });
        };
        KidaptiveSdk.updateLearner = function(learnerId, params) {
            return addToQueue(function() {
                sdkInitFilter();
                sdk.checkOidc();
                sdk.checkUser();
                sdk.checkLearner(learnerId);
                return sdk.learnerManager.updateLearner(learnerId, params).then(function(learner) {
                    return refreshUserData().then(function() {
                        return learner;
                    });
                });
            });
        };
        KidaptiveSdk.deleteLearner = function(learnerId) {
            return addToQueue(function() {
                sdkInitFilter();
                sdk.checkOidc();
                sdk.checkUser();
                sdk.checkLearner(learnerId);
                return sdk.learnerManager.deleteLearner(learnerId).then(function(learner) {
                    return refreshUserData().then(function() {
                        return learner;
                    });
                });
            });
        };
        KidaptiveSdk.getLearnerById = function(id) {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(sdk.learnerManager.idToLearner[id]);
        };
        KidaptiveSdk.getLearnerByProviderId = function(providerId) {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(sdk.learnerManager.providerIdToLearner[providerId]);
        };
        KidaptiveSdk.getLearnerList = function() {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(sdk.learnerManager.getLearnerList());
        };
        KidaptiveSdk.getModels = function(type, conditions) {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(sdk.modelManager.getModels(type, conditions));
        };
        KidaptiveSdk.getModelById = function(type, id) {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(_kidaptive_utils2.default.getObject(sdk.modelManager.idToModel, [ type, id ]));
        };
        KidaptiveSdk.getModelByUri = function(type, uri) {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(_kidaptive_utils2.default.getObject(sdk.modelManager.uriToModel, [ type, uri ]));
        };
        KidaptiveSdk.getLatentAbilities = function(learnerId, uri) {
            sdkInitFilter();
            sdk.checkLearner(learnerId);
            var dimId;
            if (uri) {
                dimId = _kidaptive_utils2.default.getObject(sdk.modelManager.uriToModel["dimension"], [ uri, "id" ]);
                if (!dimId) {
                    return;
                }
            }
            return _kidaptive_utils2.default.copyObject(sdk.modelManager.getLatentAbilities(learnerId, dimId));
        };
        KidaptiveSdk.getLocalAbilities = function(learnerId, uri) {
            sdkInitFilter();
            sdk.checkLearner(learnerId);
            var dimId;
            if (uri) {
                dimId = _kidaptive_utils2.default.getObject(sdk.modelManager.uriToModel["local-dimension"], [ uri, "id" ]);
                if (!dimId) {
                    return;
                }
            }
            return _kidaptive_utils2.default.copyObject(sdk.modelManager.getLocalAbilities(learnerId, dimId));
        };
        KidaptiveSdk.startTrial = function(learnerId) {
            sdkInitFilter();
            sdk.checkLearner(learnerId);
            sdk.trialManager.startTrial(learnerId);
        };
        KidaptiveSdk.endTrial = function(learnerId) {
            sdkInitFilter();
            sdk.trialManager.endTrial(learnerId);
        };
        KidaptiveSdk.endAllTrials = function() {
            sdkInitFilter();
            sdk.trialManager.endAllTrials();
        };
        KidaptiveSdk.reportBehavior = function(eventName, properties) {
            sdkInitFilter();
            sdk.checkUser();
            sdk.eventManager.reportBehavior(eventName, properties);
        };
        KidaptiveSdk.reportEvidence = function(eventName, properties) {
            sdkInitFilter();
            if (!sdk.anonymousSession) {
                sdk.checkUser();
                sdk.eventManager.reportEvidence(eventName, properties);
            } else {
                sdk.eventManager.createAgentRequest(eventName, "Result", properties);
            }
        };
        KidaptiveSdk.flushEvents = function() {
            return flushEvents();
        };
        KidaptiveSdk.startAutoFlush = function(interval) {
            sdkInitFilter();
            _kidaptive_utils2.default.checkObjectFormat(interval, 0);
            if (interval === undefined) {
                interval = defaultFlushInterval;
            }
            flushInterval = interval;
            autoFlush();
        };
        KidaptiveSdk.stopAutoFlush = function() {
            KidaptiveSdk.startAutoFlush(0);
        };
        KidaptiveSdk.registerRecommender = function(key, rec) {
            sdkInitFilter();
            sdk.recManager.registerRecommender(key, rec);
        };
        KidaptiveSdk.unregisterRecommender = function(key) {
            sdkInitFilter();
            sdk.recManager.unregisterRecommender(key);
        };
        KidaptiveSdk.getRecommendations = function(key, params) {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(sdk.recManager.getRecommendations(key, params));
        };
        KidaptiveSdk.getRandomRecommendations = function(params) {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(sdk.recManager.RPRec.getRecommendations(params));
        };
        KidaptiveSdk.getOptimalDifficultyRecommendations = function(params) {
            sdkInitFilter();
            return _kidaptive_utils2.default.copyObject(sdk.recManager.ODRec.getRecommendations(params));
        };
        KidaptiveSdk.KidaptiveError = _kidaptive_error2.default;
        KidaptiveSdk.KidaptiveConstants = _kidaptive_constants2.default;
        KidaptiveSdk.KidaptiveUtils = _kidaptive_utils2.default;
        KidaptiveSdk.destroy = function() {
            addToQueue(function() {
                sdk.trialManager.endAllTrials();
                KidaptiveSdk.stopAutoFlush();
            });
            flushEvents(sdk.options.autoFlushCallbacks);
            return addToQueue(function() {
                sdk = undefined;
            });
        };
        exports.default = KidaptiveSdk;
    } ])["default"];
});