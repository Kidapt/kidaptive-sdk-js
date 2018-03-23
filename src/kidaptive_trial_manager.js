/**
 * Created by solomonliu on 2017-06-27.
 */
'use strict';
import KidaptiveUtils from './kidaptive_utils';

var KidaptiveTrialManager = function(sdk) {
    this.sdk = sdk;
    this.openTrials = {};
};

KidaptiveTrialManager.prototype.startTrial = function(learnerId) {
    if (this.openTrials[learnerId]) {
        this.endTrial(learnerId);
    }

    var min = 1 << 31;

    this.openTrials[learnerId] = {
        trialTime: Date.now(),
        trialSalt: Math.floor(Math.random() * (-min * 2) + min),
        dimensionsReset: {}
    };
};

KidaptiveTrialManager.prototype.endTrial = function(learnerId) {
    if (this.openTrials[learnerId]) {
        Object.keys(this.openTrials[learnerId].dimensionsReset).forEach(function(localDimId) {
            var latentAbil = KidaptiveUtils.copyObject(this.sdk.modelManager.getLatentAbilities(learnerId,
                this.sdk.modelManager.idToModel['local-dimension'][localDimId].dimensionId));
            var localAbil = this.sdk.modelManager.getLocalAbilities(learnerId, localDimId);
            latentAbil.mean = localAbil.mean;
            latentAbil.standardDeviation = localAbil.standardDeviation;
            latentAbil.timestamp = localAbil.timestamp;
            this.sdk.modelManager.setLatentAbility(learnerId, latentAbil);
        }.bind(this));
        delete this.openTrials[learnerId];
    }
};

KidaptiveTrialManager.prototype.endAllTrials = function() {
    Object.keys(this.openTrials).forEach(function(learnerId) {
        this.endTrial(learnerId);
    }.bind(this))
};

KidaptiveTrialManager.prototype.resetDimension = function(learnerId, localDimensionId) {
    this.openTrials[learnerId].dimensionsReset[localDimensionId] = true;
};

export default KidaptiveTrialManager;
