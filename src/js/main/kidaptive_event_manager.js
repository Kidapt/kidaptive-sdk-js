/**
 * Created by solomonliu on 2017-06-19.
 */

var KidaptiveEventManager = function(sdk) {
    this.sdk = sdk;
    this.eventSequence = 0;
    try {
        this.eventQueue = KidaptiveUtils.localStorageGetItem(this.getEventQueueCacheKey());
    } catch (e) {
        this.eventQueue = [];
    }

};

KidaptiveEventManager.prototype.reportBehavior = function(eventName, properties) {
    if (!eventName) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Event name is required");
    }
    KidaptiveUtils.checkObjectFormat(eventName, "");

    properties = KidaptiveUtils.copyObject(properties) || {};
    KidaptiveUtils.checkObjectFormat(properties, {
        learnerId: 0,
        gameURI: "",
        promptURI: "",
        duration: 0,
        additionalFields: {},
        tags: {}
    });

    var agentRequest = this.createBaseEvent();
    var event = agentRequest.events[0];

    event.name = eventName;
    event.type = 'Behavior';

    var learnerId = properties.learnerId;
    if (learnerId) {
        if (!this.sdk.learnerManager.idToLearner[learnerId]) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Learner " + learnerId + " not found");
        }
        event.learnerId = learnerId;
    }

    var gameUri = properties.gameUri;
    if (gameUri) {
        if (!this.sdk.modelManager.uriToModel['game'][gameUri]) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + gameUri + " not found");
        }
        event.gameURI = gameUri;
    }

    var promptUri = properties.promptUri;
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
            event.gameURI = promptGameUri;
        }

        event.promptURI = promptUri;
    }

    var duration = properties.duration;
    if (duration) {
        if (duration < 0) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Duration must not be negative");
        }
        event.duration = duration;
    }

    var additionalFields = properties.additionalFields;
    if (additionalFields) {
        Object.keys(additionalFields).forEach(function(key) {
            if (typeof additionalFields[key] !== 'string') {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Additional fields must be strings");
            }
        });
        event.additionalFields = additionalFields;
    }

    var tags = properties.tags;
    if (tags) {
        Object.keys(tags).forEach(function(key) {
            if (typeof tags[key] !== 'string') {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Tags must be strings");
            }
        });
        event.tags = tags;
    }
    this.queueEvent(agentRequest);
};

KidaptiveEventManager.prototype.reportEvidence = function(eventName, properties) {
    if (!eventName) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Event name is required");
    }

    properties = properties || {};

};

KidaptiveEventManager.prototype.queueEvent = function(event) {
    this.eventQueue.push(event);
    KidaptiveUtils.localStorageSetItem(this.getEventQueueCacheKey(), this.eventQueue);
};

KidaptiveEventManager.prototype.flushEvents = function() {
    var user = this.sdk.userManager.currentUser;
    if (!user) {
        return KidaptiveUtils.Promise.resolve([]);
    }

    var eventQueue = this.eventQueue;
    var flushResults = KidaptiveUtils.Promise.parallel(eventQueue.map(function(event) {
        return this.sdk.httpClient.ajax('POST', KidaptiveConstants.ENDPOINTS.INGESTION, event, {noCache:true});
    }.bind(this))).then(function(results) {
        results.forEach(function(r, i) {
            r.event = KidaptiveUtils.copyObject(eventQueue[i]);
            //requeue
            if (!r.resolved && (r.error.code === KidaptiveError.KidaptiveErrorCode.GENERIC_ERROR || r.error.code === KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR)) {
                this.queueEvent(eventQueue[i]);
            }
        }.bind(this));
        return results;
    }.bind(this));

    this.eventQueue = [];
    localStorage.removeItem(this.getEventQueueCacheKey());
    return flushResults;
};

KidaptiveEventManager.prototype.getEventQueueCacheKey = function() {
    return this.sdk.httpClient.getCacheKey('POST', KidaptiveConstants.ENDPOINTS.INGESTION).replace(/[.].*/,'.alpEventData');
};

KidaptiveEventManager.prototype.createBaseEvent = function() {
    if (!this.sdk.userManager.currentUser) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "User is not logged in");
    }

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
            // "type": "Result",
            // "name": "string",
            userId: this.sdk.userManager.currentUser.id,
            // "learnerId": 0,
            // "gameURI": "string",
            // "promptURI": "string",
            // "trialTime": 0,
            // "trialSalt": 0,
            eventTime: Date.now(),
            eventSequence: ++this.eventSequence
            // "receiptTime": 0,
            // "duration": 0,
            // "attempts": [
            //     {
            //         "itemURI": "string",
            //         "outcome": 0
            //     }
            // ],
            // "promptAnswers": {},
            // "additionalFields": {},
            // "tags": {}
        }]
    };
};

