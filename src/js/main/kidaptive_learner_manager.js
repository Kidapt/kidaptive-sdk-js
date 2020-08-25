/**
 * Created by solomonliu on 2017-06-03.
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

    var KidaptiveLearnerManager = function(sdk) {
        this.sdk = sdk;
        this.clearLearnerList();
    };

    KidaptiveLearnerManager.prototype.createLearner = function(params) {
        console.error("KidaptiveLearnerManager.createLearner - not supported in offline-only SDK");
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveLearnerManager.createLearner - not supported in offline-only SDK");
    };

    KidaptiveLearnerManager.prototype.updateLearner = function(learnerId, params) {
        console.error("KidaptiveLearnerManager.updateLearner - not supported in offline-only SDK");
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveLearnerManager.updateLearner - not supported in offline-only SDK");
    };

    KidaptiveLearnerManager.prototype.deleteLearner = function(learnerId) {
        console.error("KidaptiveLearnerManager.deleteLearner - not supported in offline-only SDK");
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveLearnerManager.deleteLearner - not supported in offline-only SDK");
    };

    KidaptiveLearnerManager.prototype.refreshLearnerList = function() {
        console.error("KidaptiveLearnerManager.refreshLearnerList - not supported in offline-only SDK; returning empty list");
        return KidaptiveUtils.Promise(function(resolve) {
            resolve([]);
        });
    };

    KidaptiveLearnerManager.prototype.getLearnerList = function() {
        return Object.keys(this.idToLearner).map(function(id) {
            return this.idToLearner[id];
        }.bind(this));
    };

    KidaptiveLearnerManager.prototype.clearLearnerList = function() {
        this.idToLearner = {};
        this.providerIdToLearner = {};
    };

    return KidaptiveLearnerManager;
});
