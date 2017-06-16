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

    var filterAuthError = function(error) {
        if (error.type === KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR) {
            throw error;
        }
    };

    var handleAuthError = function(error) {
        if (error.type === KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR) {
            return sdk.userManager.logoutUser().then(function(){
                throw error;
            });
        }
        throw error;
    };

    var refreshUserData = function() {
        return KidaptiveUtils.Promise.serial([
            sdk.userManager.refreshUser.bind(sdk.userManager),
            sdk.learnerManager.refreshLearnerList.bind(sdk.learnerManager),
            function() {
                return sdk.modelManager.refreshLatentAbilities().then(function(results) {
                    results.forEach(function(r) {
                        filterAuthError(r.error);
                    });
                });
            }, function() {
                return sdk.modelManager.refreshLocalAbilities().then(function(results) {
                    results.forEach(function(r) {
                        filterAuthError(r.error);
                    });
                });
            }
            //TODO: decide whether insights refresh should be included
        ], KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR).catch(handleAuthError);
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
                this.modelManager = new KidaptiveModelManager(this);

                return this.modelManager.refreshAppModels();
            }.bind(this)).then(function() {
                sdk = this;
                return refreshUserData();
            }.bind(this)).then(function() {
                resolve(this);
            }.bind(this), reject);
        }.bind(this));
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

    exports.refresh = function() {
        return addToQueue(function() {
            sdkInitFilter();
            return refreshUserData();
        });
    };

    //User Manager
    exports.getCurrentUser = function() {
        sdkInitFilter();
        return copy(sdk.userManager.currentUser);
    };

    exports.logoutUser = function() {
        return addToQueue(function() {
            sdkInitFilter();
            //TODO: close all trials
            //TODO: flush events
            sdk.modelManager.clearLearnerModels();
            sdk.learnerManager.clearLearnerList();
            return sdk.userManager.logoutUser().always(KidaptiveHttpClient.deleteUserData);
        });
    };

    //Learner Manager
    exports.getLearnerById = function(id) {
        sdkInitFilter();
        return copy(sdk.learnerManager.idToLearner[id]);
    };

    exports.getLearnerByProviderId = function(providerId) {
        sdkInitFilter();
        return copy(sdk.learnerManager.providerIdToLearner[providerId]);
    };

    exports.getLearnerList = function() {
        sdkInitFilter();
        return copy(sdk.learnerManager.getLearnerList());
    };

    //Model Manager
    exports.getModels = function(type, conditions) {
        sdkInitFilter();
        return copy(sdk.modelManager.getModels(type, conditions));
    };

    //Module
    exports.KidaptiveError = KidaptiveError;
    exports.KidaptiveConstants = KidaptiveConstants;
    exports.KidaptiveUtils = KidaptiveUtils;
    exports.destroy = function() {
        //TODO: stop event flush
        sdk = undefined;
    };
})();
