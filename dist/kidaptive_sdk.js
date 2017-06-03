"use strict";

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
        USER: "/user/me",
        LOGOUT: "/user/logout"
    },
    ALP_EVENT_VERSION: "3.0"
};

"use strict";

var KidaptiveError = function(type, message) {
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
    OK: "OK",
    GENERIC_ERROR: "GENERIC_ERROR",
    NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
    INVALID_PARAMETER: "INVALID_PARAMETER",
    ILLEGAL_STATE: "ILLEGAL_STATE",
    INIT_ERROR: "INIT_ERROR",
    MISSING_DELEGATE: "MISSING_DELEGATE",
    AUTH_ERROR: "AUTH_ERROR",
    NOT_LOGGED_IN: "NOT_LOGGED_IN",
    LEARNER_NOT_FOUND: "LEARNER_NOT_FOUND",
    TRIAL_NOT_OPEN: "TRIAL_NOT_OPEN",
    URI_NOT_FOUND: "URI_NOT_FOUND",
    RECOMMENDER_ERROR: "RECOMMENDER_ERROR",
    API_KEY_ERROR: "API_KEY_ERROR",
    WEB_API_ERROR: "WEB_API_ERROR"
};

"use strict";

var KidaptiveHttpClient = function(_apiKey, dev) {
    this.host = dev ? KidaptiveConstants.HOST_DEV : KidaptiveConstants.HOST_PROD;
    this.apiKey = _apiKey;
};

KidaptiveHttpClient.USER_ENDPOINTS = [ KidaptiveConstants.ENDPOINTS.USER, KidaptiveConstants.ENDPOINTS.LEARNER, KidaptiveConstants.ENDPOINTS.ABILITY, KidaptiveConstants.ENDPOINTS.LOCAL_ABILITY, KidaptiveConstants.ENDPOINTS.INSIGHT ];

KidaptiveHttpClient.CACHE_EXCLUDE_METHODS = [ "POST" ];

KidaptiveHttpClient.CACHE_EXCLUDE_ENDPOINTS = [ KidaptiveConstants.ENDPOINTS.INSIGHT ];

(function() {
    var toJson = function(input, inArray) {
        if (typeof input === "object") {
            if (input instanceof Boolean || input instanceof Number || input instanceof String) {
                input = input.valueOf();
            }
        }
        switch (typeof input) {
          case "object":
            if (input instanceof Array) {
                return "[" + input.map(function(v) {
                    return toJson(v, true);
                }).join(",") + "]";
            } else {
                return "{" + Object.keys(input).sort().map(function(v) {
                    var value = toJson(input[v]);
                    return value === undefined ? undefined : [ JSON.stringify(v), value ].join(":");
                }).filter(function(v) {
                    return v !== undefined;
                }).join(",") + "}";
            }

          case "boolean":
          case "number":
          case "string":
            return JSON.stringify(input);

          default:
            return inArray ? JSON.stringify(null) : undefined;
        }
    };
    KidaptiveHttpClient.prototype.ajax = function(method, endpoint, params) {
        var settings = {
            headers: {
                "api-key": this.apiKey
            },
            xhrFields: {
                withCredentials: true
            }
        };
        settings.method = method;
        settings.url = this.host + endpoint;
        if (settings.method === "GET") {
            settings.data = params;
        } else if (settings.method === "POST") {
            settings.contentType = "application/json";
            settings.data = JSON.stringify(params);
        } else {
            return $.Deferred().reject(new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Method must be 'GET' or 'POST'"));
        }
        var cacheKey = KidaptiveHttpClient.CACHE_EXCLUDE_METHODS.indexOf(method) < 0 && KidaptiveHttpClient.CACHE_EXCLUDE_ENDPOINTS.indexOf(endpoint) < 0 ? sjcl.hash.sha256.hash(toJson(settings)).map(function(n) {
            var s = (n + Math.pow(2, 31)).toString(16);
            return "0".repeat(8 - s.length) + s;
        }).join("") + (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) >= 0 ? ".alpUserData" : ".alpAppData") : undefined;
        return $.ajax(settings).then(function(data) {
            if (cacheKey) {
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                } catch (e) {
                    console.log("Warning: ALP SDK unable to write to localStorage. Cached data may be inconsistent or out-of-date");
                }
            }
            return data;
        }, function(xhr) {
            if (xhr.status === 400) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, xhr.responseText);
            } else if (xhr.status === 401) {
                KidaptiveHttpClient.deleteUserData();
                if (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) < 0) {
                    KidaptiveHttpClient.deleteAppData();
                }
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR, xhr.responseText);
            } else if (xhr.status) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.WEB_API_ERROR, xhr.responseText);
            } else {
                var cached = localStorage.getItem(cacheKey);
                if (cached) {
                    return cached === "undefined" ? undefined : JSON.parse(cached);
                }
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.GENERIC_ERROR, "HTTP Client Error");
            }
        });
    };
    KidaptiveHttpClient.deleteUserData = function() {
        Object.keys(localStorage).forEach(function(k) {
            if (k.endsWith(".alpUserData")) {
                localStorage.removeItem(k);
            }
        });
    };
    KidaptiveHttpClient.deleteAppData = function() {
        Object.keys(localStorage).forEach(function(k) {
            if (k.endsWith(".alpAppData")) {
                localStorage.removeItem(k);
            }
        });
    };
})();

"use strict";

var KidaptiveUserManager = function(sdk) {
    this.sdk = sdk;
};

KidaptiveUserManager.prototype.refreshUser = function() {
    return this.sdk.httpClient.ajax("GET", KidaptiveConstants.ENDPOINTS.USER).then(function(user) {
        this.currentUser = user;
        return user;
    }.bind(this));
};

KidaptiveUserManager.prototype.logoutUser = function() {
    return this.sdk.httpClient.ajax("POST", KidaptiveConstants.ENDPOINTS.LOGOUT).always(function() {
        this.currentUser = undefined;
    }.bind(this));
};

"use strict";

(function() {
    var operationQueue = $.Deferred().resolve();
    var sdk = undefined;
    var addToQueue = function(f) {
        var returnQueue = operationQueue.then(f);
        operationQueue = returnQueue.then(function() {}, function() {});
        return returnQueue;
    };
    var copy = function(o) {
        return o === undefined ? o : JSON.parse(JSON.stringify(o));
    };
    var _KidaptiveSdk = function(apiKey, appVersion, options) {
        var sdkPromise = $.Deferred().resolve().then(function() {
            if (!apiKey) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Api key is required");
            }
            if (!appVersion) {
                appVersion = {};
            }
            appVersion.version = appVersion.version || "";
            appVersion.build = appVersion.build || "";
            options = options || {};
            this.httpClient = new KidaptiveHttpClient(apiKey, options.dev);
            return this.httpClient.ajax("GET", KidaptiveConstants.ENDPOINTS.APP).then(function(app) {
                if (appVersion.version < app.minVersion) {
                    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Version >= " + app.minVersion + " required. Provided " + appVersion.version);
                }
                app.version = appVersion.version;
                app.build = appVersion.build;
                this.appInfo = app;
                this.userManager = new KidaptiveUserManager(this);
            }.bind(this)).then(function() {
                return this;
            }.bind(this));
        }.bind(this));
        sdkPromise.then(function() {}).then(function() {});
        return sdkPromise;
    };
    var KidaptiveSdk = function(apiKey, appVersion, options) {
        return addToQueue(function() {
            if (!sdk) {
                return new _KidaptiveSdk(apiKey, appVersion, options).then(function(newSdk) {
                    sdk = newSdk;
                    return this;
                }.bind(this));
            } else if (apiKey || appVersion || options) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "SDK already initialized");
            }
            return this;
        }.bind(this));
    };
    var handleAuthError = function(error) {
        if (error.type === KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR) {
            return this.logoutUser().then(function() {
                throw error;
            });
        }
        throw error;
    };
    KidaptiveSdk.prototype.getAppInfo = function() {
        return copy(sdk.appInfo);
    };
    KidaptiveSdk.prototype.getCurrentUser = function() {
        return copy(sdk.userManager.currentUser);
    };
    KidaptiveSdk.prototype.refreshUser = function() {
        return sdk.userManager.refreshUser().then(copy, handleAuthError.bind(this));
    };
    KidaptiveSdk.prototype.logoutUser = function() {
        return sdk.userManager.logoutUser().always(function() {
            KidaptiveHttpClient.deleteUserData();
        });
    };
    exports.KidaptiveError = KidaptiveError;
    exports.KidaptiveConstants = KidaptiveConstants;
    exports.init = function(apiKey, appVersion, options) {
        return new KidaptiveSdk(apiKey, appVersion, options);
    };
})();
