/**
 * Created by solomonliu on 2017-06-28.
 */
'use strict';
import KidaptiveIrt from './irt/irt';
import KidaptiveUtils from './kidaptive_utils';

var KidaptiveAttemptProcessor = function(sdk) {
    this.sdk = sdk;
};

KidaptiveAttemptProcessor.prototype.processAttempt = function(learnerId, attempt) {
    var item = this.sdk.modelManager.uriToModel['item'][attempt.itemURI];
    var ability = KidaptiveUtils.copyObject(this.sdk.modelManager.getLocalAbilities(learnerId, item.localDimensionId));
    if (!this.sdk.trialManager.openTrials[learnerId].dimensionsReset[item.localDimensionId]) {
        if (ability.standardDeviation < .65) {
            ability.standardDeviation = .65;
        }
        this.sdk.trialManager.resetDimension(learnerId, item.localDimensionId)
    }
    var postAbility = KidaptiveIrt.estimate(!!attempt.outcome, item.mean, ability.mean, ability.standardDeviation);
    ability.mean = postAbility.post_mean;
    ability.standardDeviation = postAbility.post_sd;
    ability.timestamp = this.sdk.trialManager.openTrials[learnerId].trialTime;
    this.sdk.modelManager.setLocalAbility(learnerId, ability);
};

export default KidaptiveAttemptProcessor;
