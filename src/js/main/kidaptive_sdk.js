/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";

(function(){
    var operationQueue = KidaptiveUtils.Promise.resolve(); //enforces order of async operations
    var sdk = undefined; //sdk singleton

    var sdkInitFilter = function() {
        if (!sdk) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "SDK not initialized");
        }
    };

    var addToQueue = function(f) {
        var returnQueue = operationQueue.then(f);
        operationQueue = returnQueue.then(function(){}, function(){});
        return returnQueue;
    };

    var copy = function(o) {
        return o === undefined ? o : JSON.parse(JSON.stringify(o));
    };

    var handleAuthError = function(error) {
        if (error.type === KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR) {
            return sdk.userManager.logoutUser().then(function(){
                throw error;
            });
        }
        throw error;
    };

    var KidaptiveSdk = function(apiKey, appVersion, options) {
        return KidaptiveUtils.Promise(function(resolve, reject) {
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

            this.httpClient.ajax("GET", KidaptiveConstants.ENDPOINTS.APP).then(function (app) {
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
                return this.refreshUser().then(function() {
                    //TODO: load stored insights
                    return this.refreshLearnerList();
                }.bind(this)).catch(handleAuthError);
            }.bind(this)).then(function() {
                resolve(this);
            }.bind(this), function(error) {
                reject(error);
            });
        }.bind(this));
    };

    KidaptiveSdk.prototype.refreshUser = function() {
        return this.userManager.refreshUser().then(copy,handleAuthError);
    };

    KidaptiveSdk.prototype.logoutUser = function() {
        //TODO: close all trials
        //TODO: flush events
        //TODO: clear learner abilities
        //TODO: clear insights
        this.learnerManager.clearLearnerList();
        return this.userManager.logoutUser().always(function() {
            KidaptiveHttpClient.deleteUserData();
        });
    };

    KidaptiveSdk.prototype.refreshLearnerList = function() {
        return this.learnerManager.refreshLearnerList().then(copy, handleAuthError);
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
        return addToQueue(function() {
            sdkInitFilter();
            return sdk.refreshUser();
        });
    };

    exports.logoutUser = function() {
        return addToQueue(function() {
            sdkInitFilter();
            return sdk.logoutUser();
        });
    };

    //Learner Manager
    exports.refreshLearnerList = function() {
        return addToQueue(function() {
            sdkInitFilter();
            return sdk.refreshLearnerList();
        });
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
    exports.destroy = function() {
        sdk.httpClient.deleteUserData();
        sdk.httpClient.deleteAppData();
        //TODO: stop event flush
        //TODO: clear local storage
        sdk = undefined;
    };
})();
