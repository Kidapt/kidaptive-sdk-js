/**
 * Created by solomonliu on 2017-06-14.
 */

define([
    './kidaptive_constants.js',
    './kidaptive_utils.js'
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

    KidaptiveModelManager.buildModelIndex = function(type, id, idToModel) {
        var o = KidaptiveUtils.getObject(idToModel, [type, id]);
        var index = {};

        if (o) {
            KidaptiveUtils.putObject(index, [type, id], true);
            KidaptiveModelManager.modelParents[type].forEach(function (p) {
                var parentIndex = KidaptiveModelManager.buildModelIndex(p, o[KidaptiveUtils.toCamelCase(p, '-') + 'Id'], idToModel);
                Object.keys(parentIndex).forEach(function (type) {
                    parentIndex[type].forEach(function (id) {
                        KidaptiveUtils.putObject(index, [type, id], true);
                    });
                });
            });
        }

        Object.keys(index).forEach(function(type) {
            index[type] = Object.keys(index[type]);
        });
        return index;
    };

    KidaptiveModelManager.prototype.refreshAppModels = function() {
        var modelList = Object.keys(KidaptiveModelManager.modelParents);
        return KidaptiveUtils.Promise.parallel(modelList.map(function(model) {
            return this.sdk.httpClient.ajax.bind(this.sdk.httpClient, 'GET', '/' + model);
        }.bind(this))).then(function(results) {
            var uriToModel = {};
            var idToModel = {};
            for (var i = 0; i < results.length; i++) {
                if (results[i].resolved) {
                    var model = modelList[i];
                    var uriMap = {};
                    var idMap = {};
                    results[i].value.forEach(function(o) {
                        uriMap[o.uri] = o;
                        idMap[o.id] = o;
                    });
                    uriToModel[model] = uriMap;
                    idToModel[model] = idMap;
                } else {
                    throw results[i].error;
                }
            }

            var modelIndex = {};
            //build index
            Object.keys(idToModel).forEach(function(model) {
                Object.keys(idToModel[model]).forEach(function(id) {
                    KidaptiveUtils.putObject(modelIndex, [model, id], KidaptiveModelManager.buildModelIndex(model, id, idToModel));
                });
            });

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
                        con = con.map(function(uri) {
                            var id = KidaptiveUtils.getObject(this.uriToModel, [parent, uri, 'id']);
                            return id ? id.toString() : id;
                        }.bind(this));
                        prop.forEach(function(id) {
                            shouldReturn = shouldReturn && (con.indexOf(id) !== -1);
                        });
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


    //Learner Models
    KidaptiveModelManager.prototype.refreshLatentAbilities = function(learnerId) {
        if (!learnerId) {
            return KidaptiveUtils.Promise.parallel(
                Object.keys(this.sdk.learnerManager.idToLearner).map(function(learner) {
                    return this.refreshLatentAbilities.bind(this, learner);
                }.bind(this))
            );
        } else {
            return this.sdk.httpClient.ajax('GET', KidaptiveConstants.ENDPOINTS.ABILITY, {learnerId:learnerId}, {noCache:true}).then(function(abilities) {
                //load cached abilities first if manager doesn't have an entry for that learner. This prevents fetched
                //abilities from overwriting more recent locally stored abilities.
                if (!this.latentAbilities[learnerId]) {
                    try {
                        var stored = KidaptiveUtils.localStorageGetItem(this.sdk.httpClient.getCacheKey('GET', KidaptiveConstants.ENDPOINTS.ABILITY, {learnerId:learnerId}));
                        if (stored) {
                            this.latentAbilities[learnerId] = stored;
                        }
                    } catch (e) {}
                }

                abilities.forEach(function(ability) {
                    this.setLatentAbility(learnerId, ability, true);
                }.bind(this));
                return this.latentAbilities;
            }.bind(this));
        }
    };

    KidaptiveModelManager.prototype.refreshLocalAbilities = function(learnerId) {
        if (!learnerId) {
            return KidaptiveUtils.Promise.parallel(
                Object.keys(this.sdk.learnerManager.idToLearner).map(function(learner) {
                    return this.refreshLocalAbilities.bind(this, learner);
                }.bind(this))
            );
        } else {
            return this.sdk.httpClient.ajax('GET', KidaptiveConstants.ENDPOINTS.LOCAL_ABILITY , {learnerId:learnerId}, {noCache:true}).then(function(abilities) {
                //load cached abilities first if manager doesn't have an entry for that learner. This prevents fetched
                //abilities from overwriting more recent locally stored abilities.
                if (!this.localAbilities[learnerId]) {
                    try {
                        var stored = KidaptiveUtils.localStorageGetItem(this.sdk.httpClient.getCacheKey('GET', KidaptiveConstants.ENDPOINTS.LOCAL_ABILITY, {learnerId:learnerId}));
                        if (stored) {
                            this.localAbilities[learnerId] = stored;
                        }
                    } catch (e) {}
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
