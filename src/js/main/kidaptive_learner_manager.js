/**
 * Created by solomonliu on 2017-06-03.
 */

var KidaptiveLearnerManager = function(sdk) {
    this.sdk = sdk;
    this.clearLearnerList();
};

KidaptiveLearnerManager.prototype.refreshLearnerList = function() {
    return this.sdk.httpClient.ajax('GET', KidaptiveConstants.ENDPOINTS.LEARNER).then(function(learners) {
        var idToLearner = {};
        var providerIdToLearner = {};
        learners.forEach(function(l){
            if (l.id) {
                idToLearner[l.id] = l;

                if (l.providerId) {
                    providerIdToLearner[l.providerId] = l;
                }
            }
        }.bind(this));
        this.idToLearner = idToLearner;
        this.providerIdToLearner = providerIdToLearner;
        return learners;
    }.bind(this));
};

KidaptiveLearnerManager.prototype.getLearnerById = function(id) {
    return this.idToLearner[id];
};

KidaptiveLearnerManager.prototype.getLearnerByProviderId = function(providerId) {
    return this.providerIdToLearner[providerId];
};

KidaptiveLearnerManager.prototype.clearLearnerList = function() {
    this.idToLearner = {};
    this.providerIdToLearner = {};
};