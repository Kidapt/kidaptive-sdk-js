/**
 * Created by solomonliu on 2017-06-19.
 */

var KidaptiveEventManager = function(sdk) {
    this.sdk = sdk;
    this.eventSequence = 0;
    this.eventQueue = [];
};

KidaptiveEventManager.prototype.reportBehavior = function(eventName, properties) {
    if (!eventName) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Event name is required");
    }

    properties = properties || {};

    var event = this.createBaseEvent();

    var learnerId = properties.learnerId;
    if (learnerId) {
        if (!this.sdk.learnerManager.idToLearner[learnerId]) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Learner " + learnerId + " not found");
        }
        event.events[0].learnerId = learnerId;
    }

    var gameUri = properties.gameUri;
    if (gameUri) {
        if (!this.sdk.modelManager.uriToModel['game'][gameUri]) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + gameUri + " not found");
        }
        event.events[0].gameURI = gameUri;
    }

    var promptUri = properties.promptUri;
    if (promptUri) {
        var prompt = this.sdk.modelManager.uriToModel['prompt'][promptUri];
        if (!prompt) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Prompt " + promptUri + " not found");
        }

        var promptGameUri = this.sdk.modelManager.idToModel['game'][prompt.gameId];
        if (gameUri && promptGameUri !== gameUri) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + promptUri + " has no prompt " + promptUri);
        }

        if (!gameUri) {
            event.events[0].gameURI = promptGameUri;
        }

        event.events[0].promptURI = promptUri;
    }

    var duration = properties.duration;
    if (duration) {
        if (typeof duration !== 'number' || duration < 0) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Duration must be a positive number");
        }

        event.events[0].duration = duration;
    }

    var additionalFields = properties.additionalFields;
    if (additionalFields) {
        if (typeof additionalFields !== 'object') {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Additional fields must be an object");
        }
        additionalFields = KidaptiveUtils.copyObject(additionalFields);
        Object.keys(additionalFields).forEach(function(key) {
            if (additionalFields[key] === undefined) {
                delete additionalFields[key];
            } else if (typeof additionalFields[key] !== 'string') {
                additionalFields[key] = JSON.stringify(additionalFields[key]);
            }
        });
        event.events[0].additionalFields = additionalFields;
    }

    var tags = properties.tags;
    if (tags) {
        if (typeof tags !== 'object') {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Tags must be an object");
        }
        tags = KidaptiveUtils.copyObject(tags);
        Object.keys(tags).forEach(function(key) {
            if (tags[key] === undefined) {
                delete tags[key];
            } else if (typeof tags[key] !== 'string') {
                tags[key] = JSON.stringify(tags[key]);
            }
        });
        event.events[0].tags = tags;
    }
};

KidaptiveEventManager.prototype.reportEvidence = function(eventName, properties) {
    if (!eventName) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Event name is required");
    }

    properties = properties || {};

};

KidaptiveEventManager.prototype.queueEvent = function(event) {
    this.eventQueue.append(event);
};

KidaptiveEventManager.prototype.startAutoFlush = function() {

};

KidaptiveEventManager.prototype.stopAutoFlush = function() {

};

KidaptiveEventManager.prototype.flushEvents = function() {

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
            deviceType: KidaptiveUtils.getObject(window, ['navigator', 'userAgent']) || null,
            language: KidaptiveUtils.getObject(window, ['navigator', 'language']) || null
        },
        events: [{
            "version": KidaptiveConstants.ALP_EVENT_VERSION,
            // "type": "Result",
            // "name": "string",
            "userId": this.sdk.userManager.currentUser.id,
            // "learnerId": 0,
            // "gameURI": "string",
            // "promptURI": "string",
            // "trialTime": 0,
            // "trialSalt": 0,
            "eventTime": Date.now(),
            "eventSequence": ++this.eventSequence
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

