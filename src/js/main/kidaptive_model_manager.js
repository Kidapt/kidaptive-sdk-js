/**
 * Created by solomonliu on 2017-06-14.
 */

define([
    'kidaptive_constants',
    'kidaptive_utils'
], function(
    KidaptiveConstants,
    KidaptiveUtils
) {
    'use strict';

    var KidaptiveModelManager = function(sdk) {
        this.sdk = sdk;
        this.uriToModel = {};
        this.idToModel = {};
        this.clearLearnerModels();
    };

    KidaptiveModelManager.modelParents = { //maps models to the parents of that model. Use for model query predicates
        'skills-framework': [],
        'skills-cluster': ['skills-framework'],
        'skills-domain': ['skills-cluster'],
        'dimension': ['skills-domain'],
        'game': [],
        'local-dimension': ['dimension', 'game'],
        'prompt': ['game'],
        'item': ['prompt', 'local-dimension'],
        'category': [],
        'sub-category': ['category'],
        'instance': ['sub-category'],
        'prompt-category': ['prompt', 'category', 'instance']
    };

    KidaptiveModelManager.modelOrder = []; //order of model processing to process parents before children

    //build model order based on modelParents
    var determineModelOrder = function(modelTypes) {
        modelTypes.forEach(function(type) {
            determineModelOrder(KidaptiveModelManager.modelParents[type]);
            if (KidaptiveModelManager.modelOrder.indexOf(type) === -1) {
                KidaptiveModelManager.modelOrder.push(type);
            }
        });
    }
    determineModelOrder(Object.keys(KidaptiveModelManager.modelParents));

    //App Models
    KidaptiveModelManager.getModelParents = function(type) {
        var allParents = {};
        var parents = KidaptiveModelManager.modelParents[type];
        if (parents) {
            allParents[type] = true;
            parents.forEach(function(p) {
                KidaptiveModelManager.getModelParents(p).forEach(function(p) {
                    allParents[p] = true;
                });
            });
        }
        return Object.keys(allParents);
    };

    KidaptiveModelManager.buildModelIndex = function(type, id, idToModel, modelIndex) {
        var o = KidaptiveUtils.getObject(idToModel, [type, id]);
        var index = {};

        if (o) {
            KidaptiveUtils.putObject(index, [type], [id]);
            KidaptiveModelManager.modelParents[type].forEach(function (parentType) {
                var parentIndex = KidaptiveUtils.getObject(modelIndex, [parentType, o[KidaptiveUtils.toCamelCase(parentType, '-') + 'Id']]) || {};
                Object.keys(parentIndex).forEach(function (type) {
                    KidaptiveUtils.putObject(index, [type], parentIndex[type]);
                });
            });
        }
        return index;
    };

    KidaptiveModelManager.prototype.refreshAppModels = function() {
        return KidaptiveUtils.Promise.parallel(KidaptiveModelManager.modelOrder.map(function(model) {
            return this.sdk.httpClient.ajax.bind(this.sdk.httpClient, 'GET', '/' + model);
        }.bind(this))).then(function(results) {
            var uriToModel = {};
            var idToModel = {};
            var modelIndex = {};
            for (var i = 0; i < results.length; i++) {
                if (results[i].resolved) {
                    var model = KidaptiveModelManager.modelOrder[i];
                    var uriMap = {};
                    var idMap = {};
                    results[i].value.forEach(function(o) {
                        uriMap[o.uri] = o;
                        idMap[o.id] = o;
                    });
                    uriToModel[model] = uriMap;
                    idToModel[model] = idMap;
                    Object.keys(idToModel[model]).forEach(function(id) {
                        KidaptiveUtils.putObject(modelIndex, [model, id], KidaptiveModelManager.buildModelIndex(model, id, idToModel, modelIndex));
                    });
                } else {
                    throw results[i].error;
                }
            }

            this.uriToModel = uriToModel;
            this.idToModel = idToModel;
            this.modelIndex = modelIndex;
        }.bind(this));
    };

    KidaptiveModelManager.prototype.getModels = function(type, conditions) {
        var index = this.modelIndex[type];
        if (!index) {
            return [];
        }
        var modelParents = KidaptiveModelManager.getModelParents(type);
        conditions = KidaptiveUtils.copyObject(conditions) || {};
        return Object.keys(index).filter(function(id) {
            var shouldReturn = true;
            modelParents.forEach(function(parent) {
                if (!shouldReturn) {
                    return;
                }
                var con = conditions[parent];
                if (con) {
                    var prop = index[id][parent];
                    if (!prop || !prop.length) {
                        shouldReturn = false
                    } else {
                        if (!(con instanceof Array)) {
                            con = [con];
                        }
                        prop.forEach(function(id) {
                            var uri = KidaptiveUtils.getObject(this.idToModel, [parent, id, 'uri']);
                            shouldReturn = shouldReturn && con.indexOf(uri) !== -1;
                        }.bind(this));
                    }
                }
            }.bind(this));
            return shouldReturn;
        }.bind(this)).map(function(id) {
            return KidaptiveUtils.getObject(this.idToModel, [type, id]);
        }.bind(this)).filter(function(o) {
            return o !== undefined;
        });
    };

    KidaptiveModelManager.prototype.getStoredLatentAbilities = function(learnerId) {
        try {
            var stored = KidaptiveUtils.localStorageGetItem(this.sdk.httpClient.getCacheKey('GET', KidaptiveConstants.ENDPOINTS.ABILITY, {learnerId:learnerId}));
            if (stored) {
            this.latentAbilities[learnerId] = {};
            stored.forEach(function(ability) {
                this.latentAbilities[learnerId][ability.dimensionId] = ability;
            }.bind(this));
            }
        } catch (e) {}
    };

    //Learner Models
    KidaptiveModelManager.prototype.refreshLatentAbilities = function(learnerId) {
        if (!learnerId) {
            return KidaptiveUtils.Promise.parallel(
                Object.keys(this.sdk.learnerManager.idToLearner).map(function(learner) {
                    return this.refreshLatentAbilities.bind(this, parseInt(learner));
                }.bind(this))
            );
        } else {
            return this.sdk.httpClient.ajax('GET', KidaptiveConstants.ENDPOINTS.ABILITY, {learnerId:learnerId}, {noCache:true}).then(function(abilities) {
                //load cached abilities first if manager doesn't have an entry for that learner. This prevents fetched
                //abilities from overwriting more recent locally stored abilities.
                if (!this.latentAbilities[learnerId]) {
                    this.getStoredLatentAbilities(learnerId);
                }
                abilities.forEach(function(ability) {
                    this.setLatentAbility(learnerId, ability, true);
                }.bind(this));
                return this.latentAbilities;
            }.bind(this));
        }
    };

    KidaptiveModelManager.prototype.getStoredLocalAbilities = function(learnerId) {
        try {
            var stored = KidaptiveUtils.localStorageGetItem(this.sdk.httpClient.getCacheKey('GET', KidaptiveConstants.ENDPOINTS.LOCAL_ABILITY, {learnerId:learnerId}));
            if (stored) {
            this.localAbilities[learnerId] = {};
            stored.forEach(function(ability) {
                this.localAbilities[learnerId][ability.localDimensionId] = ability;
            }.bind(this));
            }
        } catch (e) {}
    };

    KidaptiveModelManager.prototype.refreshLocalAbilities = function(learnerId) {
        if (!learnerId) {
            return KidaptiveUtils.Promise.parallel(
                Object.keys(this.sdk.learnerManager.idToLearner).map(function(learner) {
                    return this.refreshLocalAbilities.bind(this, parseInt(learner));
                }.bind(this))
            );
        } else {
            return this.sdk.httpClient.ajax('GET', KidaptiveConstants.ENDPOINTS.LOCAL_ABILITY , {learnerId:learnerId}, {noCache:true}).then(function(abilities) {
                //load cached abilities first if manager doesn't have an entry for that learner. This prevents fetched
                //abilities from overwriting more recent locally stored abilities.
                if (!this.localAbilities[learnerId]) {
                    this.getStoredLocalAbilities(learnerId);
                }
                abilities.forEach(function(ability) {
                    this.setLocalAbility(learnerId, ability, true);
                }.bind(this));
                return this.localAbilities;
            }.bind(this));
        }
    };

    KidaptiveModelManager.prototype.getLatentAbilities = function(learnerId, dimId) {
        if (dimId) {
            var dim = this.idToModel['dimension'][dimId];
            if (dim) {
                return KidaptiveUtils.getObject(this.latentAbilities, [learnerId, dimId]) ||
                    {
                        dimensionId: dim.id,
                        mean: 0,
                        standardDeviation: 1,
                        timestamp: 0
                    };
            }
        } else {
            return Object.keys(this.idToModel['dimension']).map(function(id){
                return this.getLatentAbilities(learnerId, id);
            }.bind(this));
        }
    };

    KidaptiveModelManager.prototype.getLocalAbilities = function(learnerId, dimId) {
        if (dimId) {
            var dim = this.idToModel['local-dimension'][dimId];
            if (dim) {
                return KidaptiveUtils.getObject(this.localAbilities, [learnerId, dimId]) ||
                    {
                        localDimensionId: dim.id,
                        mean: 0,
                        standardDeviation: 1,
                        timestamp: 0
                    };
            }
        } else {
            return Object.keys(this.idToModel['local-dimension']).map(function(id){
                return this.getLocalAbilities(learnerId, id);
            }.bind(this));
        }
    };

    KidaptiveModelManager.prototype.setLatentAbility = function(learnerId, ability, keepCurrent) {
        var curAbil = KidaptiveUtils.getObject(this.latentAbilities, [learnerId, ability.dimensionId]);
        if (!curAbil || curAbil.timestamp < ability.timestamp || (curAbil.timestamp === ability.timestamp && !keepCurrent)) {
            KidaptiveUtils.putObject(this.latentAbilities, [learnerId, ability.dimensionId], ability);

            KidaptiveUtils.localStorageSetItem(this.sdk.httpClient.getCacheKey('GET', KidaptiveConstants.ENDPOINTS.ABILITY, {learnerId:learnerId}),
                Object.keys(this.latentAbilities[learnerId]).map(function(dimId) {
                    return this.latentAbilities[learnerId][dimId];
                }.bind(this)));
        }
    };

    KidaptiveModelManager.prototype.setLocalAbility = function(learnerId, ability, keepCurrent) {
        var curAbil = KidaptiveUtils.getObject(this.localAbilities, [learnerId, ability.localDimensionId]);
        if (!curAbil || curAbil.timestamp < ability.timestamp || (curAbil.timestamp === ability.timestamp && !keepCurrent)) {
            KidaptiveUtils.putObject(this.localAbilities, [learnerId, ability.localDimensionId], ability);
            KidaptiveUtils.localStorageSetItem(this.sdk.httpClient.getCacheKey('GET', KidaptiveConstants.ENDPOINTS.LOCAL_ABILITY, {learnerId:learnerId}),
                Object.keys(this.localAbilities[learnerId]).map(function(dimId) {
                    return this.localAbilities[learnerId][dimId];
                }.bind(this)));
        }
    };

    KidaptiveModelManager.prototype.fetchInsights = function(learnerId, minDateCreated, latest) {
        //TODO: think about reasonable defaults and storage method
    };

    KidaptiveModelManager.prototype.clearLearnerModels = function() {
        this.latentAbilities = {};
        this.localAbilities = {};
        this.insights = {};
    };

    return KidaptiveModelManager;
});
