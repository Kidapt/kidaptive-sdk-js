/**
 * Created by solomonliu on 2017-06-19.
 */

define([
    'kidaptive_constants',
    'kidaptive_error',
    'kidaptive_utils'
], function(
    KidaptiveConstants,
    KidaptiveError,
    KidaptiveUtils
) {
    'use strict';

    var KidaptiveEventManager = function(sdk) {
        this.sdk = sdk;
        this.eventSequence = 0;
        try {
            this.eventQueue = KidaptiveUtils.localStorageGetItem(this.getEventQueueCacheKey());
        } catch (e) {
            this.eventQueue = [];
        }
        try {
            this.batchesPending = KidaptiveUtils.localStorageGetItem(this.getEventQueueCacheKey() + ".pending");
        } catch (e) {
            this.batchesPending = {};
        }
        var batchKeys = Object.keys(this.batchesPending);
        if (batchKeys.length) {
            batchKeys.forEach(function(k) {
                this.batchesPending[k].forEach(function(v) {
                    this.eventQueue.push(v);
                }.bind(this));
            }.bind(this));
            KidaptiveUtils.localStorageSetItem(this.getEventQueueCacheKey(),this.eventQueue);
            this.batchesPending = {};
            localStorage.removeItem(this.getEventQueueCacheKey() + ".pending");
        }
    };

    KidaptiveEventManager.prototype.reportBehavior = function(eventName, properties) {
        this.queueEvent(this.createAgentRequest(eventName, 'Behavior', properties));
    };

    KidaptiveEventManager.prototype.reportEvidence = function(eventName, properties) {
        this.queueEvent(this.createAgentRequest(eventName, 'Result', properties));
    };

    KidaptiveEventManager.prototype.queueEvent = function(event) {
        this.eventQueue.push(event);
        KidaptiveUtils.localStorageSetItem(this.getEventQueueCacheKey(), this.eventQueue);
    };

    KidaptiveEventManager.prototype.flushEvents = function(callbacks) {
        if (!callbacks) {
            callbacks = [];
        }
        var user = this.sdk.userManager.currentUser;
        if (!user) {
            return KidaptiveUtils.Promise.resolve([]);
        }

        var flushTime = Date.now();
        var eventQueue = this.eventQueue;
        this.batchesPending[flushTime] = eventQueue;
        KidaptiveUtils.localStorageSetItem(this.getEventQueueCacheKey() + ".pending", this.batchesPending);
        this.eventQueue = [];
        localStorage.removeItem(this.getEventQueueCacheKey());

        var flushResultsPromise = KidaptiveUtils.Promise(function(resolve) {
            var flushResults = [];
            var queueNext = function() {
                if (eventQueue.length) {
                    var event = eventQueue[0];
                    KidaptiveUtils.Promise(function(res) {
                        res({resolved: true, value: 'no-op event forwarding'});
                    }).then(function(r) {
                        eventQueue.splice(0,1);
                        KidaptiveUtils.localStorageSetItem(this.getEventQueueCacheKey() + ".pending", this.batchesPending);
                        r.event = KidaptiveUtils.copyObject(event);
                        flushResults.push(r);
                        queueNext();
                    }.bind(this));
                } else {
                    delete this.batchesPending[flushTime];
                    KidaptiveUtils.localStorageSetItem(this.getEventQueueCacheKey() + ".pending", this.batchesPending);
                    resolve(flushResults);
                }
            }.bind(this);
            queueNext();
        }.bind(this));

        callbacks.forEach(function(c) {
            c(flushResultsPromise);
        });
        return flushResultsPromise;
    };

    KidaptiveEventManager.prototype.getEventQueueCacheKey = function() {
        return this.sdk.httpClient.getCacheKey('POST', KidaptiveConstants.ENDPOINTS.INGESTION).replace(/[.].*/,'.alpEventData');
    };

    KidaptiveEventManager.prototype.createAgentRequest = function(name, type, properties) {
        if (!name) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Event name is required");
        }
        KidaptiveUtils.checkObjectFormat(name, "");

        properties = KidaptiveUtils.copyObject(properties) || {};
        if (type === 'Behavior') {
            delete properties['attempts'];
            delete properties['promptAnswers'];
        }
        KidaptiveUtils.checkObjectFormat(properties, {
            learnerId: 0,
            gameURI: "",
            promptURI: "",
            duration: 0,
            attempts: [
                {
                    itemURI:'',
                    outcome:0,
                    guessingParameter:0
                }
            ],
            promptAnswers: {},
            additionalFields: {},
            tags: {}
        });

        var learnerId = properties.learnerId;
        if (type === 'Result' && !learnerId) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "learnerId is required");
        }
        if (learnerId) {
            this.sdk.checkLearner(learnerId);
        }

        var trial = this.sdk.trialManager.openTrials[learnerId] || {};
        if (type === 'Result' && (!trial.trialTime || !trial.trialSalt)) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "Must start a trial for learner " + learnerId + " before reporting evidence");
        }

        var gameUri = properties.gameURI;
        if (gameUri) {
            if (!this.sdk.modelManager.uriToModel['game'][gameUri]) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + gameUri + " not found");
            }
        }

        var promptUri = properties.promptURI;
        if (type === 'Result' && !promptUri) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "promptURI is required");
        }
        if (promptUri) {
            var prompt = this.sdk.modelManager.uriToModel['prompt'][promptUri];
            if (!prompt) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Prompt " + promptUri + " not found");
            }

            var promptGameUri = this.sdk.modelManager.idToModel['game'][prompt.gameId].uri;
            if (gameUri && promptGameUri !== gameUri) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + promptUri + " has no prompt " + promptUri);
            }

            if (!gameUri) {
                gameUri = promptGameUri;
            }
        }

        var duration = properties.duration;
        if (duration) {
            if (duration < 0) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Duration must not be negative");
            }
        }

        var attempts = properties.attempts;
        if (type === 'Result') {
            attempts = properties.attempts || [];
            var itemUris = this.sdk.modelManager.getModels('item', {prompt: promptUri}).map(function(item) {
                return item.uri;
            });
            attempts.forEach(function(attempt, i) {
                if (itemUris.indexOf(attempt.itemURI) < 0) {
                    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Prompt " + promptUri + " has no item " + attempt.itemURI);
                }
                if (attempt.outcome === undefined || attempt.outcome < 0 || attempt.outcome > 1) {
                    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Outcome in attempt " + i + " must be between 0 and 1 (inclusive)");
                }
                if (attempt.guessingParameter < 0 || attempt.guessingParameter > 1) {
                    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Guessing parameter in attempt " + i + " must be between 0 and 1 (inclusive)");
                }
            });
        }

        var promptAnswers;
        if (type === 'Result') {
            promptAnswers = properties.promptAnswers || {};
            var categoryUris = this.sdk.modelManager.getModels('prompt-category', {prompt: promptUri}).map(function(pc) {
                return this.sdk.modelManager.idToModel['category'][pc.categoryId].uri;
            }.bind(this));
            Object.keys(promptAnswers).forEach(function(key) {
                if (typeof promptAnswers[key] !== 'string') {
                    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Prompt answers must be strings");
                }
                var i = categoryUris.indexOf(key);
                if (i < 0) {
                    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Prompt " + promptUri + " has no category " + key);
                } else {
                    categoryUris.splice(i,1);
                }
            });
            if (categoryUris.length > 0) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Missing category " + categoryUris[0] + " for prompt " + promptUri);
            }
        }

        var additionalFields = properties.additionalFields;
        if (additionalFields) {
            Object.keys(additionalFields).forEach(function(key) {
                if (typeof additionalFields[key] !== 'string') {
                    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Additional fields must be strings");
                }
            });
        }

        var tags = properties.tags;
        if (tags) {
            Object.keys(tags).forEach(function(key) {
                if (typeof tags[key] !== 'string') {
                    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Tags must be strings");
                }
            });
        }

        if (type === 'Result' &&
            (KidaptiveUtils.getObject(tags, ['SKIP_IRT']) || '').toLowerCase() !== 'true' &&
            (KidaptiveUtils.getObject(tags, ['SKIP_LEARNER_IRT']) || '').toLowerCase() !== 'true') {
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
                deviceType: KidaptiveUtils.getObject(window, ['navigator', 'userAgent']),
                language: KidaptiveUtils.getObject(window, ['navigator', 'language'])
            },
            events: [{
                version: KidaptiveConstants.ALP_EVENT_VERSION,
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
            }]
        };
    };

    return KidaptiveEventManager;
});
