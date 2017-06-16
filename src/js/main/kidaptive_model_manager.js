/**
 * Created by solomonliu on 2017-06-14.
 */
var KidaptiveModelManager = function(sdk) {
    this.sdk = sdk;
    this.uriToModel = {};
    this.idToModel = {};
    this.loadLearnerModels();
};

KidaptiveModelManager.LATENT_ABILITY_KEY = "kidaptive.alp.latentAbility";
KidaptiveModelManager.LOCAL_ABILITY_KEY = "kidaptive.alp.localAbility";
KidaptiveModelManager.INSIGHTS_KEY = "kidaptive.alp.insights";

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
    conditions = conditions || {};
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
        return KidaptiveUtils.parallel(
            Object.keys(this.sdk.learnerManager.idToLearner).map(function(learner) {
                return this.refreshLatentAbilities.bind(this, learner);
            })
        );
    } else {
        return this.sdk.httpClient.ajax('GET', KidaptiveConstants.ENDPOINTS.ABILITY + "/" + learnerId).then(function(abilities) {
            abilities.forEach(function(ability) {
                var dim  = ability.dimensionId;
                var curAbil = KidaptiveUtils.getObject(this.latentAbilities, [learnerId, dim]);
                if (curAbil && curAbil.timestamp <= ability.timestamp) {
                    this.setLatentAbility(learnerId, dim, ability);
                }
            }.bind(this));
            return this.latentAbilities;
        }.bind(this));
    }
};

KidaptiveModelManager.prototype.refreshLocalAbilities = function(learnerId) {
    if (!learnerId) {
        return KidaptiveUtils.parallel(
            Object.keys(this.sdk.learnerManager.idToLearner).map(function(learner) {
                return this.refreshLocalAbilities.bind(this, learner);
            })
        );
    } else {
        return this.sdk.httpClient.ajax('GET', KidaptiveConstants.ENDPOINTS.LOCAL_ABILITY + "/" + learnerId).then(function(abilities) {
            abilities.forEach(function(ability) {
                var dim  = ability.localDimensionId;
                var curAbil = KidaptiveUtils.getObject(this.localAbilities, [learnerId, dim]);
                if (curAbil && curAbil.timestamp <= ability.timestamp) {
                    this.setLocalAbility(learnerId, dim, ability);
                }
                return this.localAbilities;
            }.bind(this));
        }.bind(this));
    }
};

KidaptiveModelManager.prototype.setLatentAbility = function(learnerId, dimensionId, ability) {
    KidaptiveUtils.putObject(this.latentAbilities, [learnerId, dimensionId], ability);
    localStorage.setItem(KidaptiveModelManager.LATENT_ABILITY_KEY, JSON.stringify(this.latentAbilities));
};

KidaptiveModelManager.prototype.setLocalAbility = function(learnerId, localDimensionId, ability) {
    KidaptiveUtils.putObject(this.localAbilities, [learnerId, localDimensionId], ability);
    localStorage.setItem(KidaptiveModelManager.LOCAL_ABILITY_KEY, JSON.stringify(this.localAbilities));
};

KidaptiveModelManager.prototype.fetchInsights = function(learnerId, minDateCreated, latest) {
    //TODO: think about reasonable defaults and storage method
};

KidaptiveModelManager.prototype.loadLearnerModels = function() {
    this.latentAbilities = JSON.parse(localStorage.getItem(KidaptiveModelManager.LOCAL_ABILITY_KEY)) || {};
    this.localAbilities = JSON.parse(localStorage.getItem(KidaptiveModelManager.LATENT_ABILITY_KEY)) || {};
    this.insights = JSON.parse(localStorage.getItem(KidaptiveModelManager.INSIGHTS_KEY)) || {};
};

KidaptiveModelManager.prototype.clearLearnerModels = function() {
    this.latentAbilities = {};
    this.localAbilities = {};
    this.insights = {};
    localStorage.removeItem(KidaptiveModelManager.LOCAL_ABILITY_KEY);
    localStorage.removeItem(KidaptiveModelManager.LATENT_ABILITY_KEY);
    localStorage.removeItem(KidaptiveModelManager.INSIGHTS_KEY);
};