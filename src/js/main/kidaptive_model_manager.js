/**
 * Created by solomonliu on 2017-06-14.
 */
var KidaptiveModelManager = function(sdk) {
    this.sdk = sdk;
    this.uriToModel = {};
    this.idToModel = {};
    this.latentAbilities = {};
    this.localAbilities = {};
    this.insights = {};
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
KidaptiveModelManager.prototype.getModelIndexKeys = function(type, id, idToModel) {
    if (!idToModel) {
        idToModel = this.idToModel;
    }

    var o = KidaptiveUtils.getObject(idToModel, [type, id]);
    if (!o) {
        return [];
    }
    var keyLeaf = [type, id];
    var keys = [];
    var parents = KidaptiveModelManager.modelParents[type];
    if (parents.length) {
        parents.forEach(function(p) {
            keys.push.apply(keys,this.getModelIndexKeys(p, KidaptiveUtils.getObject(o, KidaptiveUtils.toCamelCase(p, '-') + 'Id'), idToModel)
                .filter(function(k){
                    return k !== undefined;
                }).map(function(k) {
                    k.push.apply(k, keyLeaf);
                    return k;
                })
            );
        }.bind(this));
    } else {
        keys.push(keyLeaf);
    }

    return keys;
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
                var keys = this.getModelIndexKeys(model, id, idToModel);
                keys.forEach(function(k) {
                    var o = KidaptiveUtils.getObject(modelIndex, k);
                    if (!o) {
                        KidaptiveUtils.putObject(modelIndex, k, {});
                    }
                });
            }.bind(this));
        }.bind(this));

        this.uriToModel = uriToModel;
        this.idToModel = idToModel;
        this.modelIndex = modelIndex;
    }.bind(this));
};

KidaptiveModelManager.prototype.getModels = function(type, conditions) {
};


//Learner Models
KidaptiveModelManager.prototype.refreshLearnerModels = function() {

};

KidaptiveModelManager.prototype.refreshLatentAbilities = function(learnerId) {
    if (!learnerId) {
        //TODO: refresh all
    } else {

    }
};

KidaptiveModelManager.prototype.refreshLocalAbilities = function(learnerId) {
    if (!learnerId) {
        //TODO: refresh all
    } else {

    }
};

KidaptiveModelManager.prototype.fetchInsights = function(learnerId, minDateCreated, latest) {

};