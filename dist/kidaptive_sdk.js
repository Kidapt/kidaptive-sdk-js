(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.KidaptiveSdk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";
module.exports = {
    HOST_PROD:"https://service.kidaptive.com/v3",
    HOST_DEV:"https://develop.kidaptive.com/v3",

    ENDPOINTS: {
        APP:"/app/me",
        GAME:"/game",
        PROMPT:"/prompt",
        CATEGORY:"/category",
        SUB_CATEGORY:"/sub-category",
        INSTANCE:"/instance",
        PROMPT_CATEGORY:"/prompt-category",
        SKILLS_FRAMEWORK:"/skills-framework",
        SKILLS_CLUSTER:"/skills-cluster",
        SKILLS_DOMAIN:"/skills-domain",
        DIMENSION:"/dimension",
        LOCAL_DIMENSION:"/local-dimension",
        ITEM:"/item",

        LEARNER:"/learner",
        ABILITY:"/ability",
        LOCAL_ABILITY:"/local-ability",
        INGESTION:"/ingestion",

        USER:"/user/me",
        LOGOUT:"/user/logout"
    },

    ALP_EVENT_VERSION:"3.0",

    LOCAL_STORAGE: {
        API_KEY: "kidaptive.api_key",
        APP: "kidaptive.app"
    }
};
},{}],2:[function(require,module,exports){
/**
 * Created by solomonliu on 2017-05-23.
 */
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
KidaptiveError.prototype.name = 'KidaptiveError';
KidaptiveError.prototype.toString = function() {
    return this.name + ' (' + this.type + '): ' + this.message;
};

KidaptiveError.KidaptiveErrorCode = {};
[
    "OK",
    "GENERIC_ERROR",
    "NOT_IMPLEMENTED",
    "INVALID_PARAMETER",
    "ILLEGAL_STATE",
    "INIT_ERROR",
    "MISSING_DELEGATE",
    "AUTH_ERROR",
    "NOT_LOGGED_IN",
    "LEARNER_NOT_FOUND",
    "TRIAL_NOT_OPEN",
    "URI_NOT_FOUND",

    "RECOMMENDER_ERROR",

    "API_KEY_ERROR",
    "WEB_API_ERROR"
].forEach(function(e) {
    KidaptiveError.KidaptiveErrorCode[e] = e;
});

module.exports = KidaptiveError;
},{}],3:[function(require,module,exports){
/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";
var constants = require("./kidaptive_constants");
var KidaptiveError = require("./kidaptive_error");

var KidaptiveHttpClient = function(apiKey, dev) {
    var host = dev ? constants.HOST_DEV : constants.HOST_PROD;

    var promiseHelper = function(jqxhr) {
        return jqxhr.then(function(data) {
            return data;
        }, function(xhr) {
            if (xhr.status == 400) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, xhr.responseText);
            } else if (xhr.status == 401) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR, xhr.responseText);
            } else if (xhr.status) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.WEB_API_ERROR, xhr.responseText);
            } else {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.GENERIC_ERROR, "HTTP Client Error");
            }
        });
    };

    var getCommonSettings = function() {
        return {
            headers: {
                "api-key": apiKey
            },
            xhrFields: {
                withCredentials: true
            }
        }
    };

    this.ajax = function(method, endpoint, params) {
        var settings = getCommonSettings();
        settings.method = method;
        settings.url = host + endpoint;

        if (settings.method == 'GET') {
            settings.data = params;
        } else if (settings.method == 'POST') {
            settings.contentType = "application/json";
            settings.data = JSON.stringify(params);
        } else {
            return $.Deferred().reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Method must be 'GET' or 'POST'"));
        }

        return promiseHelper($.ajax(settings));
    }
};

module.exports = KidaptiveHttpClient;
},{"./kidaptive_constants":1,"./kidaptive_error":2}],4:[function(require,module,exports){
/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";
var KidaptiveError = require('./kidaptive_error');
var KidaptiveConstants = require('./kidaptive_constants');
var KidaptiveHttpClient = require('./kidaptive_http_client');
var KidaptiveUserManager = require('./kidaptive_user_manager');

//check jquery version
if ($().jquery < '3') {
    //promises not implemented correctly, throw normal error
    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.GENERIC_ERROR, "jQuery version must be >= 3");
}

var operationQueue = $.Deferred().resolve(); //enforces order of async operations
var sdk; //sdk singleton

var addToQueue = function(f) {
    var returnQueue = operationQueue.then(f);
    operationQueue = returnQueue.then(function(){}, function(){});
    return returnQueue;
};

var copy = function(o) {
    return o === undefined ? o : JSON.parse(JSON.stringify(o));
};

//this constructor returns a promise. which fails if app info or models fail to sync
var KidaptiveSdk = function(apiKey, appVersion, options) {

    var sdkPromise = $.Deferred().resolve().then(function () {
        if (!apiKey) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Api key is required");
        }

        if (!appVersion) {
            appVersion = {};
        }
        appVersion.version = appVersion.version || '';
        appVersion.build = appVersion.build || '';

        options = options || {};

        this.httpClient = new KidaptiveHttpClient(apiKey, options.dev);
        return this.httpClient.ajax("GET", KidaptiveConstants.ENDPOINTS.APP).then(function (app) {
            if (appVersion.version < app.minVersion) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER,
                    "Version >= " + app.minVersion + " required. Provided " + appVersion.version);
            }

            app.version = appVersion.version;
            app.build = appVersion.build;
            this.appInfo = app;
            //TODO: sync models
        }.bind(this)).then(function() {
            return this;
        }.bind(this));
    }.bind(this));

    //get user info if login is successful, but don't reject SDK promise if not successful
    sdkPromise.then(function() {
        //TODO: Load user info
    }).then(function() {
        //TODO: Load learner info
    });

    //initialize managers
    this.userManager = new KidaptiveUserManager(this);

    return sdkPromise;
};

//public interface for SDK
var KidaptiveSdkInterface = function(apiKey, appVersion, options) {
    return addToQueue(function() {
        if(!sdk) {
            return new KidaptiveSdk(apiKey, appVersion, options).then(function(newSdk) {
                sdk = newSdk;
                return this;
            }.bind(this));
        } else if (apiKey || appVersion || options) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "SDK already initialized");
        }
        return this;
    }.bind(this));
};

KidaptiveSdkInterface.prototype.getAppInfo = function() {
    return copy(sdk.appInfo);
};

KidaptiveSdkInterface.prototype.getCurrentUser = function() {
    return copy(sdk.userManager.currentUser);
};

KidaptiveSdkInterface.prototype.refreshUser = function() {
    return sdk.userManager.refreshUser().then(copy, function(error) {
        if (error.type == KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR) {
            this.logoutUser();
        }
        throw error;
    }.bind(this));
};

KidaptiveSdkInterface.prototype.logoutUser = function() {
    //TODO: close all trials
    //TODO: flush events
    //TODO: clear learner abilities
    //TODO: clear insights
    //TODO: clear learner list
    return sdk.userManager.logoutUser();
};

KidaptiveSdkInterface.KidaptiveError = KidaptiveError;
KidaptiveSdkInterface.KidaptiveConstants = KidaptiveConstants;

module.exports = KidaptiveSdkInterface;
},{"./kidaptive_constants":1,"./kidaptive_error":2,"./kidaptive_http_client":3,"./kidaptive_user_manager":5}],5:[function(require,module,exports){
/**
 * Created by solomonliu on 2017-05-24.
 */
"use strict";
var KidaptiveConstants = require('./kidaptive_constants');

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

module.exports = KidaptiveUserManager;
},{"./kidaptive_constants":1}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi9raWRhcHRpdmVfY29uc3RhbnRzLmpzIiwic3JjL2pzL21haW4va2lkYXB0aXZlX2Vycm9yLmpzIiwic3JjL2pzL21haW4va2lkYXB0aXZlX2h0dHBfY2xpZW50LmpzIiwic3JjL2pzL21haW4va2lkYXB0aXZlX3Nkay5qcyIsInNyYy9qcy9tYWluL2tpZGFwdGl2ZV91c2VyX21hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBzb2xvbW9ubGl1IG9uIDIwMTctMDUtMjMuXG4gKi9cblwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgSE9TVF9QUk9EOlwiaHR0cHM6Ly9zZXJ2aWNlLmtpZGFwdGl2ZS5jb20vdjNcIixcbiAgICBIT1NUX0RFVjpcImh0dHBzOi8vZGV2ZWxvcC5raWRhcHRpdmUuY29tL3YzXCIsXG5cbiAgICBFTkRQT0lOVFM6IHtcbiAgICAgICAgQVBQOlwiL2FwcC9tZVwiLFxuICAgICAgICBHQU1FOlwiL2dhbWVcIixcbiAgICAgICAgUFJPTVBUOlwiL3Byb21wdFwiLFxuICAgICAgICBDQVRFR09SWTpcIi9jYXRlZ29yeVwiLFxuICAgICAgICBTVUJfQ0FURUdPUlk6XCIvc3ViLWNhdGVnb3J5XCIsXG4gICAgICAgIElOU1RBTkNFOlwiL2luc3RhbmNlXCIsXG4gICAgICAgIFBST01QVF9DQVRFR09SWTpcIi9wcm9tcHQtY2F0ZWdvcnlcIixcbiAgICAgICAgU0tJTExTX0ZSQU1FV09SSzpcIi9za2lsbHMtZnJhbWV3b3JrXCIsXG4gICAgICAgIFNLSUxMU19DTFVTVEVSOlwiL3NraWxscy1jbHVzdGVyXCIsXG4gICAgICAgIFNLSUxMU19ET01BSU46XCIvc2tpbGxzLWRvbWFpblwiLFxuICAgICAgICBESU1FTlNJT046XCIvZGltZW5zaW9uXCIsXG4gICAgICAgIExPQ0FMX0RJTUVOU0lPTjpcIi9sb2NhbC1kaW1lbnNpb25cIixcbiAgICAgICAgSVRFTTpcIi9pdGVtXCIsXG5cbiAgICAgICAgTEVBUk5FUjpcIi9sZWFybmVyXCIsXG4gICAgICAgIEFCSUxJVFk6XCIvYWJpbGl0eVwiLFxuICAgICAgICBMT0NBTF9BQklMSVRZOlwiL2xvY2FsLWFiaWxpdHlcIixcbiAgICAgICAgSU5HRVNUSU9OOlwiL2luZ2VzdGlvblwiLFxuXG4gICAgICAgIFVTRVI6XCIvdXNlci9tZVwiLFxuICAgICAgICBMT0dPVVQ6XCIvdXNlci9sb2dvdXRcIlxuICAgIH0sXG5cbiAgICBBTFBfRVZFTlRfVkVSU0lPTjpcIjMuMFwiLFxuXG4gICAgTE9DQUxfU1RPUkFHRToge1xuICAgICAgICBBUElfS0VZOiBcImtpZGFwdGl2ZS5hcGlfa2V5XCIsXG4gICAgICAgIEFQUDogXCJraWRhcHRpdmUuYXBwXCJcbiAgICB9XG59OyIsIi8qKlxuICogQ3JlYXRlZCBieSBzb2xvbW9ubGl1IG9uIDIwMTctMDUtMjMuXG4gKi9cblwidXNlIHN0cmljdFwiO1xudmFyIEtpZGFwdGl2ZUVycm9yID0gZnVuY3Rpb24odHlwZSwgbWVzc2FnZSkge1xuICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGUpLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGUsIGspKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG59O1xuXG5LaWRhcHRpdmVFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5LaWRhcHRpdmVFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBLaWRhcHRpdmVFcnJvcjtcbktpZGFwdGl2ZUVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0tpZGFwdGl2ZUVycm9yJztcbktpZGFwdGl2ZUVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWUgKyAnICgnICsgdGhpcy50eXBlICsgJyk6ICcgKyB0aGlzLm1lc3NhZ2U7XG59O1xuXG5LaWRhcHRpdmVFcnJvci5LaWRhcHRpdmVFcnJvckNvZGUgPSB7fTtcbltcbiAgICBcIk9LXCIsXG4gICAgXCJHRU5FUklDX0VSUk9SXCIsXG4gICAgXCJOT1RfSU1QTEVNRU5URURcIixcbiAgICBcIklOVkFMSURfUEFSQU1FVEVSXCIsXG4gICAgXCJJTExFR0FMX1NUQVRFXCIsXG4gICAgXCJJTklUX0VSUk9SXCIsXG4gICAgXCJNSVNTSU5HX0RFTEVHQVRFXCIsXG4gICAgXCJBVVRIX0VSUk9SXCIsXG4gICAgXCJOT1RfTE9HR0VEX0lOXCIsXG4gICAgXCJMRUFSTkVSX05PVF9GT1VORFwiLFxuICAgIFwiVFJJQUxfTk9UX09QRU5cIixcbiAgICBcIlVSSV9OT1RfRk9VTkRcIixcblxuICAgIFwiUkVDT01NRU5ERVJfRVJST1JcIixcblxuICAgIFwiQVBJX0tFWV9FUlJPUlwiLFxuICAgIFwiV0VCX0FQSV9FUlJPUlwiXG5dLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgIEtpZGFwdGl2ZUVycm9yLktpZGFwdGl2ZUVycm9yQ29kZVtlXSA9IGU7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBLaWRhcHRpdmVFcnJvcjsiLCIvKipcbiAqIENyZWF0ZWQgYnkgc29sb21vbmxpdSBvbiAyMDE3LTA1LTIzLlxuICovXG5cInVzZSBzdHJpY3RcIjtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9raWRhcHRpdmVfY29uc3RhbnRzXCIpO1xudmFyIEtpZGFwdGl2ZUVycm9yID0gcmVxdWlyZShcIi4va2lkYXB0aXZlX2Vycm9yXCIpO1xuXG52YXIgS2lkYXB0aXZlSHR0cENsaWVudCA9IGZ1bmN0aW9uKGFwaUtleSwgZGV2KSB7XG4gICAgdmFyIGhvc3QgPSBkZXYgPyBjb25zdGFudHMuSE9TVF9ERVYgOiBjb25zdGFudHMuSE9TVF9QUk9EO1xuXG4gICAgdmFyIHByb21pc2VIZWxwZXIgPSBmdW5jdGlvbihqcXhocikge1xuICAgICAgICByZXR1cm4ganF4aHIudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSwgZnVuY3Rpb24oeGhyKSB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSA0MDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgS2lkYXB0aXZlRXJyb3IoS2lkYXB0aXZlRXJyb3IuS2lkYXB0aXZlRXJyb3JDb2RlLklOVkFMSURfUEFSQU1FVEVSLCB4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeGhyLnN0YXR1cyA9PSA0MDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgS2lkYXB0aXZlRXJyb3IoS2lkYXB0aXZlRXJyb3IuS2lkYXB0aXZlRXJyb3JDb2RlLkFQSV9LRVlfRVJST1IsIHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh4aHIuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEtpZGFwdGl2ZUVycm9yKEtpZGFwdGl2ZUVycm9yLktpZGFwdGl2ZUVycm9yQ29kZS5XRUJfQVBJX0VSUk9SLCB4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEtpZGFwdGl2ZUVycm9yKEtpZGFwdGl2ZUVycm9yLktpZGFwdGl2ZUVycm9yQ29kZS5HRU5FUklDX0VSUk9SLCBcIkhUVFAgQ2xpZW50IEVycm9yXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIGdldENvbW1vblNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJhcGkta2V5XCI6IGFwaUtleVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHhockZpZWxkczoge1xuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuYWpheCA9IGZ1bmN0aW9uKG1ldGhvZCwgZW5kcG9pbnQsIHBhcmFtcykge1xuICAgICAgICB2YXIgc2V0dGluZ3MgPSBnZXRDb21tb25TZXR0aW5ncygpO1xuICAgICAgICBzZXR0aW5ncy5tZXRob2QgPSBtZXRob2Q7XG4gICAgICAgIHNldHRpbmdzLnVybCA9IGhvc3QgKyBlbmRwb2ludDtcblxuICAgICAgICBpZiAoc2V0dGluZ3MubWV0aG9kID09ICdHRVQnKSB7XG4gICAgICAgICAgICBzZXR0aW5ncy5kYXRhID0gcGFyYW1zO1xuICAgICAgICB9IGVsc2UgaWYgKHNldHRpbmdzLm1ldGhvZCA9PSAnUE9TVCcpIHtcbiAgICAgICAgICAgIHNldHRpbmdzLmNvbnRlbnRUeXBlID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XG4gICAgICAgICAgICBzZXR0aW5ncy5kYXRhID0gSlNPTi5zdHJpbmdpZnkocGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAkLkRlZmVycmVkKCkucmVqZWN0KG5ldyBLaWRhcHRpdmVFcnJvcihLaWRhcHRpdmVFcnJvckNvZGUuSU5WQUxJRF9QQVJBTUVURVIsIFwiTWV0aG9kIG11c3QgYmUgJ0dFVCcgb3IgJ1BPU1QnXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm9taXNlSGVscGVyKCQuYWpheChzZXR0aW5ncykpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gS2lkYXB0aXZlSHR0cENsaWVudDsiLCIvKipcbiAqIENyZWF0ZWQgYnkgc29sb21vbmxpdSBvbiAyMDE3LTA1LTIzLlxuICovXG5cInVzZSBzdHJpY3RcIjtcbnZhciBLaWRhcHRpdmVFcnJvciA9IHJlcXVpcmUoJy4va2lkYXB0aXZlX2Vycm9yJyk7XG52YXIgS2lkYXB0aXZlQ29uc3RhbnRzID0gcmVxdWlyZSgnLi9raWRhcHRpdmVfY29uc3RhbnRzJyk7XG52YXIgS2lkYXB0aXZlSHR0cENsaWVudCA9IHJlcXVpcmUoJy4va2lkYXB0aXZlX2h0dHBfY2xpZW50Jyk7XG52YXIgS2lkYXB0aXZlVXNlck1hbmFnZXIgPSByZXF1aXJlKCcuL2tpZGFwdGl2ZV91c2VyX21hbmFnZXInKTtcblxuLy9jaGVjayBqcXVlcnkgdmVyc2lvblxuaWYgKCQoKS5qcXVlcnkgPCAnMycpIHtcbiAgICAvL3Byb21pc2VzIG5vdCBpbXBsZW1lbnRlZCBjb3JyZWN0bHksIHRocm93IG5vcm1hbCBlcnJvclxuICAgIHRocm93IG5ldyBLaWRhcHRpdmVFcnJvcihLaWRhcHRpdmVFcnJvci5LaWRhcHRpdmVFcnJvckNvZGUuR0VORVJJQ19FUlJPUiwgXCJqUXVlcnkgdmVyc2lvbiBtdXN0IGJlID49IDNcIik7XG59XG5cbnZhciBvcGVyYXRpb25RdWV1ZSA9ICQuRGVmZXJyZWQoKS5yZXNvbHZlKCk7IC8vZW5mb3JjZXMgb3JkZXIgb2YgYXN5bmMgb3BlcmF0aW9uc1xudmFyIHNkazsgLy9zZGsgc2luZ2xldG9uXG5cbnZhciBhZGRUb1F1ZXVlID0gZnVuY3Rpb24oZikge1xuICAgIHZhciByZXR1cm5RdWV1ZSA9IG9wZXJhdGlvblF1ZXVlLnRoZW4oZik7XG4gICAgb3BlcmF0aW9uUXVldWUgPSByZXR1cm5RdWV1ZS50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oKXt9KTtcbiAgICByZXR1cm4gcmV0dXJuUXVldWU7XG59O1xuXG52YXIgY29weSA9IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gbyA9PT0gdW5kZWZpbmVkID8gbyA6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpO1xufTtcblxuLy90aGlzIGNvbnN0cnVjdG9yIHJldHVybnMgYSBwcm9taXNlLiB3aGljaCBmYWlscyBpZiBhcHAgaW5mbyBvciBtb2RlbHMgZmFpbCB0byBzeW5jXG52YXIgS2lkYXB0aXZlU2RrID0gZnVuY3Rpb24oYXBpS2V5LCBhcHBWZXJzaW9uLCBvcHRpb25zKSB7XG5cbiAgICB2YXIgc2RrUHJvbWlzZSA9ICQuRGVmZXJyZWQoKS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghYXBpS2V5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgS2lkYXB0aXZlRXJyb3IoS2lkYXB0aXZlRXJyb3IuS2lkYXB0aXZlRXJyb3JDb2RlLklOVkFMSURfUEFSQU1FVEVSLCBcIkFwaSBrZXkgaXMgcmVxdWlyZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWFwcFZlcnNpb24pIHtcbiAgICAgICAgICAgIGFwcFZlcnNpb24gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBhcHBWZXJzaW9uLnZlcnNpb24gPSBhcHBWZXJzaW9uLnZlcnNpb24gfHwgJyc7XG4gICAgICAgIGFwcFZlcnNpb24uYnVpbGQgPSBhcHBWZXJzaW9uLmJ1aWxkIHx8ICcnO1xuXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIHRoaXMuaHR0cENsaWVudCA9IG5ldyBLaWRhcHRpdmVIdHRwQ2xpZW50KGFwaUtleSwgb3B0aW9ucy5kZXYpO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwQ2xpZW50LmFqYXgoXCJHRVRcIiwgS2lkYXB0aXZlQ29uc3RhbnRzLkVORFBPSU5UUy5BUFApLnRoZW4oZnVuY3Rpb24gKGFwcCkge1xuICAgICAgICAgICAgaWYgKGFwcFZlcnNpb24udmVyc2lvbiA8IGFwcC5taW5WZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEtpZGFwdGl2ZUVycm9yKEtpZGFwdGl2ZUVycm9yLktpZGFwdGl2ZUVycm9yQ29kZS5JTlZBTElEX1BBUkFNRVRFUixcbiAgICAgICAgICAgICAgICAgICAgXCJWZXJzaW9uID49IFwiICsgYXBwLm1pblZlcnNpb24gKyBcIiByZXF1aXJlZC4gUHJvdmlkZWQgXCIgKyBhcHBWZXJzaW9uLnZlcnNpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcHAudmVyc2lvbiA9IGFwcFZlcnNpb24udmVyc2lvbjtcbiAgICAgICAgICAgIGFwcC5idWlsZCA9IGFwcFZlcnNpb24uYnVpbGQ7XG4gICAgICAgICAgICB0aGlzLmFwcEluZm8gPSBhcHA7XG4gICAgICAgICAgICAvL1RPRE86IHN5bmMgbW9kZWxzXG4gICAgICAgIH0uYmluZCh0aGlzKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvL2dldCB1c2VyIGluZm8gaWYgbG9naW4gaXMgc3VjY2Vzc2Z1bCwgYnV0IGRvbid0IHJlamVjdCBTREsgcHJvbWlzZSBpZiBub3Qgc3VjY2Vzc2Z1bFxuICAgIHNka1Byb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgLy9UT0RPOiBMb2FkIHVzZXIgaW5mb1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vVE9ETzogTG9hZCBsZWFybmVyIGluZm9cbiAgICB9KTtcblxuICAgIC8vaW5pdGlhbGl6ZSBtYW5hZ2Vyc1xuICAgIHRoaXMudXNlck1hbmFnZXIgPSBuZXcgS2lkYXB0aXZlVXNlck1hbmFnZXIodGhpcyk7XG5cbiAgICByZXR1cm4gc2RrUHJvbWlzZTtcbn07XG5cbi8vcHVibGljIGludGVyZmFjZSBmb3IgU0RLXG52YXIgS2lkYXB0aXZlU2RrSW50ZXJmYWNlID0gZnVuY3Rpb24oYXBpS2V5LCBhcHBWZXJzaW9uLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGFkZFRvUXVldWUoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCFzZGspIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgS2lkYXB0aXZlU2RrKGFwaUtleSwgYXBwVmVyc2lvbiwgb3B0aW9ucykudGhlbihmdW5jdGlvbihuZXdTZGspIHtcbiAgICAgICAgICAgICAgICBzZGsgPSBuZXdTZGs7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9IGVsc2UgaWYgKGFwaUtleSB8fCBhcHBWZXJzaW9uIHx8IG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBLaWRhcHRpdmVFcnJvcihLaWRhcHRpdmVFcnJvci5LaWRhcHRpdmVFcnJvckNvZGUuSUxMRUdBTF9TVEFURSwgXCJTREsgYWxyZWFkeSBpbml0aWFsaXplZFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuS2lkYXB0aXZlU2RrSW50ZXJmYWNlLnByb3RvdHlwZS5nZXRBcHBJbmZvID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNvcHkoc2RrLmFwcEluZm8pO1xufTtcblxuS2lkYXB0aXZlU2RrSW50ZXJmYWNlLnByb3RvdHlwZS5nZXRDdXJyZW50VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjb3B5KHNkay51c2VyTWFuYWdlci5jdXJyZW50VXNlcik7XG59O1xuXG5LaWRhcHRpdmVTZGtJbnRlcmZhY2UucHJvdG90eXBlLnJlZnJlc2hVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNkay51c2VyTWFuYWdlci5yZWZyZXNoVXNlcigpLnRoZW4oY29weSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgaWYgKGVycm9yLnR5cGUgPT0gS2lkYXB0aXZlRXJyb3IuS2lkYXB0aXZlRXJyb3JDb2RlLkFQSV9LRVlfRVJST1IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nb3V0VXNlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5LaWRhcHRpdmVTZGtJbnRlcmZhY2UucHJvdG90eXBlLmxvZ291dFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAvL1RPRE86IGNsb3NlIGFsbCB0cmlhbHNcbiAgICAvL1RPRE86IGZsdXNoIGV2ZW50c1xuICAgIC8vVE9ETzogY2xlYXIgbGVhcm5lciBhYmlsaXRpZXNcbiAgICAvL1RPRE86IGNsZWFyIGluc2lnaHRzXG4gICAgLy9UT0RPOiBjbGVhciBsZWFybmVyIGxpc3RcbiAgICByZXR1cm4gc2RrLnVzZXJNYW5hZ2VyLmxvZ291dFVzZXIoKTtcbn07XG5cbktpZGFwdGl2ZVNka0ludGVyZmFjZS5LaWRhcHRpdmVFcnJvciA9IEtpZGFwdGl2ZUVycm9yO1xuS2lkYXB0aXZlU2RrSW50ZXJmYWNlLktpZGFwdGl2ZUNvbnN0YW50cyA9IEtpZGFwdGl2ZUNvbnN0YW50cztcblxubW9kdWxlLmV4cG9ydHMgPSBLaWRhcHRpdmVTZGtJbnRlcmZhY2U7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHNvbG9tb25saXUgb24gMjAxNy0wNS0yNC5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgS2lkYXB0aXZlQ29uc3RhbnRzID0gcmVxdWlyZSgnLi9raWRhcHRpdmVfY29uc3RhbnRzJyk7XG5cbnZhciBLaWRhcHRpdmVVc2VyTWFuYWdlciA9IGZ1bmN0aW9uKHNkaykge1xuICAgIHRoaXMuc2RrID0gc2RrO1xufTtcblxuS2lkYXB0aXZlVXNlck1hbmFnZXIucHJvdG90eXBlLnJlZnJlc2hVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc2RrLmh0dHBDbGllbnQuYWpheChcIkdFVFwiLCBLaWRhcHRpdmVDb25zdGFudHMuRU5EUE9JTlRTLlVTRVIpLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbktpZGFwdGl2ZVVzZXJNYW5hZ2VyLnByb3RvdHlwZS5sb2dvdXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc2RrLmh0dHBDbGllbnQuYWpheChcIlBPU1RcIiwgS2lkYXB0aXZlQ29uc3RhbnRzLkVORFBPSU5UUy5MT0dPVVQpLmFsd2F5cyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IHVuZGVmaW5lZDtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLaWRhcHRpdmVVc2VyTWFuYWdlcjsiXX0=
