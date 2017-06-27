/**
 * Created by solomonliu on 2017-06-27.
 */

KidaptiveTrialManager = function(sdk) {
    this.sdk = sdk;
    this.openTrials = {};
};

KidaptiveTrialManager.prototype.startTrial = function(learnerId) {
    if (!sdk.learnerManager.idToLearner[learnerId]) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Learner " + learnerId + " not found");
    }
    this.openTrials[learnerId] = {
        trialTime: Date.now(),
        trialSalt: window.crypto.getRandomValues(new Int32Array(1))[0],
        dimensionsReset: {}
    };
};

KidaptiveTrialManager.prototype.endTrial = function(learnerId) {
    delete this.openTrials[learnerId];
};

KidaptiveTrialManager.prototype.endAllTrials = function() {
    this.openTrials = {};
};

KidaptiveTrialManager.prototype.resetDimension = function(learnerId, localDimensionId) {
    if (!sdk.learnerManager.idToLearner[learnerId]) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Learner " + learnerId + " not found");
    }
    if (!this.openTrials[learnerId]) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "No trial open for learner " + learnerId);
    }
    if (!this.sdk.modelManager.idToModel[localDimensionId]) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Local dimension " + localDimensionId + " not found");
    }

    this.openTrials[learnerId][localDimensionId] = true;
};