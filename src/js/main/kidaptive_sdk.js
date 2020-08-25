/**
 * Created by solomonliu on 2017-05-23.
 */

define([
    'kidaptive_attempt_processor',
    'kidaptive_constants',
    'kidaptive_error',
    'kidaptive_event_manager',
    'kidaptive_http_client',
    'kidaptive_learner_manager',
    'kidaptive_model_manager',
    'kidaptive_recommendation_manager',
    'kidaptive_trial_manager',
    'kidaptive_user_manager',
    'kidaptive_utils'
], function(
    KidaptiveAttemptProcessor,
    KidaptiveConstants,
    KidaptiveError,
    KidaptiveEventManager,
    KidaptiveHttpClient,
    KidaptiveLearnerManager,
    KidaptiveModelManager,
    KidaptiveRecommendationManager,
    KidaptiveTrialManager,
    KidaptiveUserManager,
    KidaptiveUtils
) {
    'use strict';

    var KidaptiveSdk = {};
    try {
        KidaptiveSdk = KidaptiveSdkGlobal;
    } catch (e) {}

    var operationQueue = KidaptiveUtils.Promise.resolve(); //enforces order of async operations
    var sdk = undefined; //sdk singleton
    var defaultFlushInterval;

    var flushInterval;
    var flushTimeoutId;
    var flushing;

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

    //ignore everything that's not a auth error
    var filterAuthError = function(error) {
        if (error.type === KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR) {
            throw error;
        }
    };

    var logout = function() {
        console.log("KidaptiveSDK.logout called");
        return KidaptiveUtils.Promise.wrap(function() {
            return sdk.eventManager.flushEvents(sdk.options.autoFlushCallbacks);
        }).then(function() {
            if (!KidaptiveUtils.hasStoredAnonymousSession()) {
                sdk.trialManager.endAllTrials();
                sdk.modelManager.clearLearnerModels();
                sdk.learnerManager.clearLearnerList();
                KidaptiveHttpClient.deleteUserData();
            }

            if (sdk.anonymousSession) {
                sdk.anonymousSession = false;
            } else {
                return sdk.userManager.logoutUser();
            }
        });
    };

    var removeAnonymousSession = function() {
        console.log("KidaptiveSDK.logout called");
        return KidaptiveUtils.Promise.wrap(function() {
            if (KidaptiveUtils.hasStoredAnonymousSession()) {
                sdk.trialManager.endAllTrials();
                sdk.modelManager.clearLearnerModels();
                sdk.learnerManager.clearLearnerList();
                KidaptiveHttpClient.deleteUserData();
                sdk.anonymousSession = false;
                KidaptiveUtils.localStorageSetItem('anonymousSession.alpUserData', false);
            }
        });
    }

    var refreshUserData = function() {
        
        // offline-only refreshUserData will simply check for and re-instantiate a stored anonymous session
        if (KidaptiveUtils.hasStoredAnonymousSession()) {
            //continue anonymous session if no user was loaded and anonymous session exists
            setAnonymousSession();
            sdk.modelManager.getStoredLatentAbilities(-1);
            sdk.modelManager.getStoredLocalAbilities(-1);
        }
    };

    var setAnonymousSession = function() {
        sdk.learnerManager.idToLearner[-1] = {id:-1};
        sdk.anonymousSession = true;
        KidaptiveUtils.localStorageSetItem('anonymousSession.alpUserData', true);
    };

    var autoFlush = function() {
        clearTimeout(flushTimeoutId);
        if (!flushing && flushInterval > 0) {
            flushTimeoutId = setTimeout(function () {
                flushing = true;
                flushEvents(sdk.options.autoFlushCallbacks).then(function () {
                    flushing = false;
                    autoFlush();
                });
            }, flushInterval);
        }
    };

    var flushEvents = function(callbacks) {
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
            }).then(function() {
                return r();
            }, function() {
                return r();
            });
        });
    };

    var returnResults = function(results) {
        return results;
    };

    var KidaptiveSdkClass = function(apiKey, appVersion, options) {
        return KidaptiveUtils.Promise(function(resolve, reject) {
            apiKey = KidaptiveUtils.copyObject(apiKey);
            if (!apiKey || KidaptiveUtils.checkObjectFormat(apiKey, '')) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Api key is required");
            }

            appVersion = KidaptiveUtils.copyObject(appVersion) || {};
            KidaptiveUtils.checkObjectFormat(appVersion, {version:'', build:''});

            options = KidaptiveUtils.copyObject(options, true) || {};

            if (!(options.autoFlushCallbacks instanceof Array) && options.autoFlushCallbacks) {
                options.autoFlushCallbacks = [options.autoFlushCallbacks];
            }

            KidaptiveUtils.checkObjectFormat(options, {
                dev: false,
                flushInterval: 0,
                noOidc: false,
                defaultHttpCache:{},
                autoFlushCallbacks:[function(){}]
            });

            this.options = options;

            this.httpClient = new KidaptiveHttpClient(apiKey, options.dev, options.defaultHttpCache);
            this.httpClient.sdk = this;

            this.httpClient.ajaxLocal("GET", KidaptiveConstants.ENDPOINTS.APP).then(function (app) {
                console.log("app: " + JSON.stringify(app));
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
                this.attemptProcessor = new KidaptiveAttemptProcessor(this);
                this.trialManager = new KidaptiveTrialManager(this);
                this.eventManager = new KidaptiveEventManager(this);
                this.recManager = new KidaptiveRecommendationManager(this);

                return this.modelManager.refreshAppModels();
            }.bind(this)).then(function() {
                sdk = this;
                defaultFlushInterval = options.flushInterval === undefined ? 60000 : options.flushInterval;
                KidaptiveSdk.startAutoFlush();
                return refreshUserData(); //this should never return an error
            }.bind(this)).then(function() {
                resolve(this);
            }.bind(this), reject);
        }.bind(this));
    };

    KidaptiveSdkClass.prototype.checkOidc = function() {
        if (!this.options.noOidc) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "This operation is not permitted in OIDC context");
        }
    };

    KidaptiveSdkClass.prototype.checkUser = function() {
        if (!this.userManager.currentUser) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "User not logged in");
        }
    };

    KidaptiveSdkClass.prototype.checkLearner = function(learnerId) {
        if (!this.learnerManager.idToLearner[learnerId]) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, 'Learner ' + learnerId + ' not found');
        }
    };

    //public interface for SDK
    KidaptiveSdk.init = function(apiKey, appVersion, options) {
        return addToQueue(function() {
            if(!sdk) {
                return new KidaptiveSdkClass(apiKey, appVersion, options).then(function() {
                    return KidaptiveSdk;
                });
            } else if (apiKey || appVersion || options) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "SDK already initialized");
            }
            return KidaptiveSdk;
        });
    };

    KidaptiveSdk.getAppInfo = function() {
        sdkInitFilter();
        return KidaptiveUtils.copyObject(sdk.appInfo);
    };

    KidaptiveSdk.startAnonymousSession = function() {
        return addToQueue(function() {
            sdkInitFilter();
            return logout().catch(function(){}).then(function(){
                setAnonymousSession();
            });
        });
    };

    KidaptiveSdk.clearAnonymousSession = function() {
        return addToQueue(function() {
            sdkInitFilter();
            return removeAnonymousSession();
        });
    }

    KidaptiveSdk.isAnonymousSession = function() {
        sdkInitFilter();
        return sdk.anonymousSession;
    };

    KidaptiveSdk.refresh = function() {
        return addToQueue(function() {
            sdkInitFilter();
            if (sdk.anonymousSession) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "KidaptiveSdk.refresh is not permitted in an anonymous session");
            }
            return refreshUserData();
        });
    };

    //User Manager
    KidaptiveSdk.getCurrentUser = function() {
        sdkInitFilter();
        return KidaptiveUtils.copyObject(sdk.userManager.currentUser);
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
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveSdk.loginUser is not supported in an offline-only SDK");
        });
    };

    KidaptiveSdk.createUser = function(params) {
        return addToQueue(function() {
            sdkInitFilter();
            sdk.checkOidc();
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveSdk.createUser is not supported in an offline-only SDK");
        });
    };

    KidaptiveSdk.updateUser = function(params) {
        return addToQueue(function() {
            sdkInitFilter();
            sdk.checkOidc();
            sdk.checkUser();
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveSdk.updateUser is not supported in an offline-only SDK");
        });
    };

    //Learner Manager
    KidaptiveSdk.createLearner = function(params) {
        return addToQueue(function() {
            sdkInitFilter();
            sdk.checkOidc();
            sdk.checkUser();
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveSdk.createLearner is not supported in an offline-only SDK");

            // return sdk.learnerManager.createLearner(params).then(function(learner) {
            //     return refreshUserData().then(function() {
            //         return learner;
            //     });
            // });
        });
    };

    KidaptiveSdk.updateLearner = function(learnerId, params) {
        return addToQueue(function() {
            sdkInitFilter();
            sdk.checkOidc();
            sdk.checkUser();
            sdk.checkLearner(learnerId);
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveSdk.updateLearner is not supported in an offline-only SDK");
        });
    };

    KidaptiveSdk.deleteLearner = function(learnerId) {
        return addToQueue(function() {
            sdkInitFilter();
            sdk.checkOidc();
            sdk.checkUser();
            sdk.checkLearner(learnerId);
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveSdk.deleteLearner is not supported in an offline-only SDK");
        });
    };

    KidaptiveSdk.getLearnerById = function(id) {
        sdkInitFilter();
        return KidaptiveUtils.copyObject(sdk.learnerManager.idToLearner[id]);
    };

    KidaptiveSdk.getLearnerByProviderId = function(providerId) {
        sdkInitFilter();
        return KidaptiveUtils.copyObject(sdk.learnerManager.providerIdToLearner[providerId]);
    };

    KidaptiveSdk.getLearnerList = function() {
        sdkInitFilter();
        return KidaptiveUtils.copyObject(sdk.learnerManager.getLearnerList());
    };

    //Model Manager
    KidaptiveSdk.getModels = function(type, conditions) {
        sdkInitFilter();
        return KidaptiveUtils.copyObject(sdk.modelManager.getModels(type, conditions));
    };

    KidaptiveSdk.getModelById = function(type, id) {
        sdkInitFilter();
        return KidaptiveUtils.copyObject(KidaptiveUtils.getObject(sdk.modelManager.idToModel, [type, id]));
    };

    KidaptiveSdk.getModelByUri = function(type, uri) {
        sdkInitFilter();
        return KidaptiveUtils.copyObject(KidaptiveUtils.getObject(sdk.modelManager.uriToModel, [type, uri]));
    };

    KidaptiveSdk.getLatentAbilities = function(learnerId, uri) {
        sdkInitFilter();
        sdk.checkLearner(learnerId);
        var dimId;
        if (uri) {
            dimId = KidaptiveUtils.getObject(sdk.modelManager.uriToModel['dimension'], [uri, 'id']);
            if (!dimId) {
                return;
            }
        }
        return KidaptiveUtils.copyObject(sdk.modelManager.getLatentAbilities(learnerId,dimId));
    };

    KidaptiveSdk.getLocalAbilities = function(learnerId, uri) {
        sdkInitFilter();
        sdk.checkLearner(learnerId);
        var dimId;
        if (uri) {
            dimId = KidaptiveUtils.getObject(sdk.modelManager.uriToModel['local-dimension'], [uri, 'id']);
            if (!dimId) {
                return;
            }
        }
        return KidaptiveUtils.copyObject(sdk.modelManager.getLocalAbilities(learnerId,dimId));
    };

    //Trial Manager
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

    //Event Manager
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
            //this verifies the event and runs IRT without putting it in the event queue.
            sdk.eventManager.createAgentRequest(eventName, 'Result', properties)
        }
    };

    KidaptiveSdk.flushEvents = function() {
        return flushEvents();
    };

    KidaptiveSdk.startAutoFlush = function(interval) {
        sdkInitFilter();
        KidaptiveUtils.checkObjectFormat(interval, 0);
        if (interval === undefined) {
            interval = defaultFlushInterval;
        }
        flushInterval = interval;
        autoFlush();
    };

    KidaptiveSdk.stopAutoFlush = function() {
        KidaptiveSdk.startAutoFlush(0);
    };

    //Recommendation Manager
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
        return KidaptiveUtils.copyObject(sdk.recManager.getRecommendations(key, params));
    };

    KidaptiveSdk.getRandomRecommendations = function(params) {
        sdkInitFilter();
        return KidaptiveUtils.copyObject(sdk.recManager.RPRec.getRecommendations(params));
    };

    KidaptiveSdk.getOptimalDifficultyRecommendations = function(params) {
        sdkInitFilter();
        return KidaptiveUtils.copyObject(sdk.recManager.ODRec.getRecommendations(params));
    };

    //Module
    KidaptiveSdk.KidaptiveError = KidaptiveError;
    KidaptiveSdk.KidaptiveConstants = KidaptiveConstants;
    KidaptiveSdk.KidaptiveUtils = KidaptiveUtils;
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

    return KidaptiveSdk;
});
