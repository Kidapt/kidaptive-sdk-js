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

KidaptiveRecommendationManager.prototype.registerRecommender = function(key, recommender) {
    this.recommenders[key] = recommender;
};

KidaptiveRecommendationManager.prototype.unregisterRecommender = function(key) {
    delete this.recommenders[key];
}

var OptimalDifficultyRecommender = function(sdk) {
    this.sdk = sdk;
};

var RandomPromptRecommender = function(sdk) {
    this.sdk = sdk;
};

RandomPromptRecommender.prototype.getRecommendations = function(params) {
    params = params || {};
    var prompts = this.sdk.modelManager.getModels('prompt', params).map(function(p) {
        return {key:Math.random(), value:p};
    });
    prompts = prompts.sort(function(a,b) {
        return a.key - b.key;
    }).map(function(p) {
        return p.value.uri;
    });
    return {
        type:'prompt',
        recommendations:prompts.slice(0, params.numResults || 10)
    }
};