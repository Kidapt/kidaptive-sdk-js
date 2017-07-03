/**
 * Created by solomonliu on 2017-06-29.
 */
"use strict";

var KidaptiveRecommendationManager = function(sdk) {
    this.sdk = sdk;
    this.recommenders = {};
    this.ODRec = new OptimalDifficultyRecommender(sdk);
    this.RPRec = new RandomPromptRecommender(sdk);
};

KidaptiveRecommendationManager.checkRecommender = function(rec) {
    if (!rec || typeof rec.getRecommendations !== 'function') {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Recommender must have function 'getRecommendations(params)'")
    }
};

KidaptiveRecommendationManager.prototype.registerRecommender = function(key, rec) {
    KidaptiveRecommendationManager.checkRecommender(rec);
    this.recommenders[key] = rec;
};

KidaptiveRecommendationManager.prototype.unregisterRecommender = function(key) {
    delete this.recommenders[key];
};

KidaptiveRecommendationManager.prototype.getRecommendations = function(key, params) {
    var rec = this.recommenders[key];
    if (!rec) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "No recommender registered for key " + key);
    }
    KidaptiveRecommendationManager.checkRecommender(rec);
    return rec.getRecommendations(params)
};

var OptimalDifficultyRecommender = function(sdk) {
    this.sdk = sdk;
};

OptimalDifficultyRecommender.prototype.getRecommendations = function(params) {
    params = params || {};

    if (!params.learnerId) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "learnerId is required");
    } else if (!this.sdk.learnerManager.idToLearner[params.learnerId]) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Learner " + params.learnerId + " not found");
    }

    if (!params.game) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Game is required");
    } else if (!this.sdk.modelManager.uriToModel['game'][params.game]) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + params.game + " not found");
    }

    var localDim = this.sdk.modelManager.uriToModel['local-dimension'][params['local-dimension']];
    if (!params['local-dimension']) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "local-dimension is required");
    } else if (!localDim) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Local dimension " + params['local-dimension'] + " not found");
    }

    var probSuccess = params.successProbability || 0.7;
    var mean = this.sdk.modelManager.getLocalAbilities(params.learnerId, localDim.id).mean;
    var context = {};
    var prompts = this.sdk.modelManager.getModels('item', params).map(function(i) {
        //randomize order to break ties
        return {
            key: Math.random(),
            value: i
        };
    }).sort(function(a,b) {
        return a.key - b.key;
    }).map(function(p) {
        //sort by closeness to prob success;
        var i = p.value;
        return {
            key: 1 / (1 + Math.exp(Math.sqrt(8 / Math.PI) * (i.mean - mean))),
            value: i.promptId
        };
    }).sort(function(a,b) {
        return Math.abs(a.key - probSuccess) - Math.abs(b.key - probSuccess);
    }).slice(0, params.numResults || 10).map(function(p) {
        var uri = this.sdk.modelManager.idToModel['prompt'][p.value].uri;
        context[uri] = {
            successProbability:p.key
        };
        return uri;
    }.bind(this));

    return {
        type:'prompt',
        recommendations:prompts,
        context:context
    }
};

var RandomPromptRecommender = function(sdk) {
    this.sdk = sdk;
};

RandomPromptRecommender.prototype.getRecommendations = function(params) {
    params = params || {};

    if (!params.game) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Game is required");
    } else if (!this.sdk.modelManager.uriToModel['game'][params.game]) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Game " + params.game + " not found");
    }

    var prompts = {};
    this.sdk.modelManager.getModels('item', params).forEach(function(i) {
        prompts[this.sdk.modelManager.idToModel['prompt'][i.promptId].uri] = true;
    }.bind(this));
    prompts = Object.keys(prompts).map(function(uri) {
        return {
            key: Math.random(),
            value: uri
        };
    }).sort(function(a,b) {
        return a.key - b.key;
    }).slice(0, params.numResults || 10).map(function(p) {
        return p.value;
    });

    return {
        type:'prompt',
        recommendations:prompts
    }
};