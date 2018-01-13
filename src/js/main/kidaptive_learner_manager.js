/**
 * Created by solomonliu on 2017-06-03.
 */

define([
    './kidaptive_constants.js',
    './kidaptive_error.js',
    './kidaptive_utils.js'
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
        params = KidaptiveUtils.copyObject(params) || {};
        var format = {name:'', birthday:0, gender:''};
        KidaptiveUtils.checkObjectFormat(params, format);

        if (!params.name) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "name is required");
        }

        if (params.gender && ['decline','male','female'].indexOf(params.gender) === -1) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "gender must be 'decline', 'male', or 'female'");
        }

        Object.keys(params).forEach(function(key) {
            if (format[key] === undefined) {
                delete params[key];
            }
        });
        return this.sdk.httpClient.ajax('POST', KidaptiveConstants.ENDPOINTS.LEARNER, params, {noCache:true})
    };

    KidaptiveLearnerManager.prototype.updateLearner = function(learnerId, params) {
        params = KidaptiveUtils.copyObject(params) || {};
        var format = {name:'', birthday:0, gender:'', icon:''};
        KidaptiveUtils.checkObjectFormat(params, format);

        if (params.gender && ['decline','male','female'].indexOf(params.gender) === -1) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "gender must be 'decline', 'male', or 'female'");
        }

        Object.keys(params).forEach(function(key) {
            if (format[key] === undefined) {
                delete params[key];
            }
        });

        ['name', 'birthday', 'gender', 'icon'].forEach(function(prop) {
            if (params[prop] === undefined) {
                params[prop] = this.idToLearner[learnerId][prop];
            }
        }.bind(this));

        return this.sdk.httpClient.ajax('POST', KidaptiveConstants.ENDPOINTS.LEARNER + "/" + learnerId, params, {noCache:true});
    };

    KidaptiveLearnerManager.prototype.deleteLearner = function(learnerId) {
        return this.sdk.httpClient.ajax('DELETE', KidaptiveConstants.ENDPOINTS.LEARNER + "/" + learnerId, undefined, {noCache:true});
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
            });
            this.idToLearner = idToLearner;
            this.providerIdToLearner = providerIdToLearner;
            return learners;
        }.bind(this));
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

    //TODO:preferences

    return KidaptiveLearnerManager;
});
