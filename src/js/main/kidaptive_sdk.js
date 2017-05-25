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