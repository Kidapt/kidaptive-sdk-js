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

                //initialize managers
                this.userManager = new KidaptiveUserManager(this);
                this.learnerManager = new KidaptiveLearnerManager(this);

                //TODO: sync models
            }.bind(this)).then(function() {
                sdk = this;
                return this.userManager.refreshUser().then(function() {
                    //TODO: load stored insights
                    return this.learnerManager.refreshLearnerList();
                }.bind(this)).catch(handleAuthError).catch(function() {});
            }.bind(this)).then(function() {
                return this;
            }.bind(this));
        }.bind(this));

        //get user info if login is successful, but don't reject SDK promise if not successful

        return sdkPromise;
    };

    var handleAuthError = function(error) {
        if (error.type === KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR) {
            return exports.logoutUser().then(function(){
                throw error;
            });
        }
        throw error;
    };

    var sdkInitFilter = function() {
        if (!sdk) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "SDK not initialized");
        }
    };

    //public interface for SDK
    exports.init = function(apiKey, appVersion, options) {
        return addToQueue(function() {
            if(!sdk) {
                return new KidaptiveSdk(apiKey, appVersion, options).then(function() {
                    return exports;
                });
            } else if (apiKey || appVersion || options) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "SDK already initialized");
            }
            return exports;
        });
    };

    exports.getAppInfo = function() {
        sdkInitFilter();
        return copy(sdk.appInfo);
    };

    //User Manager
    exports.getCurrentUser = function() {
        sdkInitFilter();
        return copy(sdk.userManager.currentUser);
    };

    exports.refreshUser = function() {
        sdkInitFilter();
        return sdk.userManager.refreshUser().then(copy, handleAuthError);
    };

    exports.logoutUser = function() {
        sdkInitFilter();
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
    exports.refreshLearnerList = function() {
        sdkInitFilter();
        return sdk.learnerManager.refreshLearnerList().then(copy, handleAuthError);
    };

    exports.getLearnerById = function(id) {
        sdkInitFilter();
        return copy(sdk.learnerManager.getLearnerById(id));
    };

    exports.getLearnerByProviderId = function(providerId) {
        sdkInitFilter();
        return copy(sdk.learnerManager.getLearnerByProviderId(providerId));
    };

    //Module
    exports.KidaptiveError = KidaptiveError;
    exports.KidaptiveConstants = KidaptiveConstants;
})();