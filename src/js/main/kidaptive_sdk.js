/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";

(function(){
    var operationQueue = $.Deferred().resolve(); //enforces order of async operations
    var sdk = undefined; //sdk singleton

    var addToQueue = function(f) {
        var returnQueue = operationQueue.then(f);
        operationQueue = returnQueue.then(function(){}, function(){});
        return returnQueue;
    };

    var copy = function(o) {
        return o === undefined ? o : JSON.parse(JSON.stringify(o));
    };

    var _KidaptiveSdk = function(apiKey, appVersion, options) {

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

                //initialize managers
                this.userManager = new KidaptiveUserManager(this);
                this.learnerManager = new KidaptiveLearnerManager(this);

                //TODO: sync models
            }.bind(this)).then(function() {
                return this;
            }.bind(this));
        }.bind(this));

        //get user info if login is successful, but don't reject SDK promise if not successful
        sdkPromise.then(function() {
            this.userManager.refreshUser();
        }).then(function() {
            this.learnerManager.refreshLearnerList();
        });

        return sdkPromise;
    };

    //public interface for SDK
    var KidaptiveSdk = function(apiKey, appVersion, options) {
        return addToQueue(function() {
            if(!sdk) {
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
            return this.logoutUser().then(function(){
                throw error;
            });
        }
        throw error;
    };

    KidaptiveSdk.prototype.getAppInfo = function() {
        return copy(sdk.appInfo);
    };

    //User Manager
    KidaptiveSdk.prototype.getCurrentUser = function() {
        return copy(sdk.userManager.currentUser);
    };

    KidaptiveSdk.prototype.refreshUser = function() {
        return sdk.userManager.refreshUser().then(copy, handleAuthError.bind(this));
    };

    KidaptiveSdk.prototype.logoutUser = function() {
        //TODO: close all trials
        //TODO: flush events
        //TODO: clear learner abilities
        //TODO: clear insights
        sdk.learnerManager.clearLearnerList();
        return sdk.userManager.logoutUser().always(function() {
            KidaptiveHttpClient.deleteUserData();
        });
    };

    //Learner Manager
    KidaptiveSdk.prototype.refreshLearnerList = function() {
        return sdk.learnerManager.refreshLearnerList().then(copy, handleAuthError.bind(this));
    };

    KidaptiveSdk.prototype.getLearnerById = function(id) {
        return copy(sdk.learnerManager.getLearnerById(id));
    };

    KidaptiveSdk.prototype.getLearnerByProviderId = function(providerId) {
        return copy(sdk.learnerManager.getLearnerByProviderId(providerId));
    };

    //Module
    exports.KidaptiveError = KidaptiveError;
    exports.KidaptiveConstants = KidaptiveConstants;

    exports.init = function(apiKey, appVersion, options) {
        return new KidaptiveSdk(apiKey, appVersion, options);
    };
})();
