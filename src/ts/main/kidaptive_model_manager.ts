import Promise = require("bluebird");

import {KidaptiveErrorCode, KidaptiveError} from "./kidaptive_error";
import {
    User,
    Learner,
    PromptCategory,
    Dimension,
    LearnerInsight,
    AppApi,
    CategoryApi,
    SkillsframeworkApi,
    LearnerApi,
    LatentAbility,
    Item,
    Prompt,
    LocalAbility,
    LocalDimension,
    Game,
    Category,
    Instance,
    SubCategory
} from "../../../swagger-client/api";
import {KidaptiveConstants} from "./kidaptive_constants";

/**
 * Created by solomonliu on 8/9/16.
 */

interface ModelManagerDelegate {
    getCurrentUser: () => User;
    getLearner:(learnerId:number) => Learner;
    getLearnerList:() => Learner[];
    getAppApiKey: () => string;
}

enum EntityType {
    game = <any> "game",
    prompt = <any> "prompt",
    category = <any> "category",
    subCategory = <any> "subCategory",
    instance = <any> "instance",
    skillsFramework = <any> "skillsFramework",
    skillsCluster = <any> "skillsCluster",
    skillsDomain = <any> "skillsDomain",
    dimension = <any> "dimension",
    localDimension = <any> "localDimension",
    item = <any> "item"
}

class ModelManager{

    private uriToId : {
        [key: string]: {[key:string]: number}
    } = {};

    private idToEntity : {
        [key: string]: {[key:number]: any}
    } = {};

    private localAbilities: {
        [key:number]: {[key:number]: LocalAbility}
    } = {};

    private latentAbilities: {
        [key:number]: {[key:number]: LatentAbility}
    } = {};

    private insights: {
        [key:number]: LearnerInsight[]
    } = {};

    private promptCategories: {
        [key:number]: PromptCategory[]
    } = {};

    private appApi = new AppApi(KidaptiveConstants.ALP_BASE_URL);
    private categoryApi = new CategoryApi(KidaptiveConstants.ALP_BASE_URL);
    private frameworkApi = new SkillsframeworkApi(KidaptiveConstants.ALP_BASE_URL);
    private learnerApi = new LearnerApi(KidaptiveConstants.ALP_BASE_URL);

    constructor(private delegate: ModelManagerDelegate) {
        if (!delegate) {
            throw new KidaptiveError(KidaptiveErrorCode.MISSING_DELEGATE, "ModelManagerDelegate not found");
        }
        for (let i of Object.keys(EntityType).map(function(v) {return EntityType[v]}).filter(function(v) {return typeof v === 'number'})) {
            this.uriToId[i] = {};
            this.idToEntity[i] = {};
        }
    }

    getEntityById(type:EntityType, id:number) {
        return this.idToEntity[type][id];
    }

    getEntityByUri(type:EntityType, uri:string) {
        return this.getEntityById(type, this.uriToId[type][uri]);
    }

    getGames(): Game[] {
        return Object.keys(this.idToEntity[EntityType.game]).map(function(gameId) {
            return this.idToEntity[EntityType.game][gameId];
        }.bind(this)) as Game[];
    }

    getPrompts(gameUri): Prompt[] {
        let gameId = this.uriToId[EntityType.game][gameUri];
        return Object.keys(this.idToEntity[EntityType.prompt]).map(function(promptId) {
            return this.idToEntity[EntityType.prompt][promptId];
        }.bind(this)).filter(function(prompt:Prompt) {
            return !gameUri || (prompt.gameId && prompt.gameId == gameId);
        }) as Prompt[];
    }

    getItems(gameUri:string, promptUri:string, dimensionUri:string, localDimensionUri: string): Item[] {
        let gameId = this.uriToId[EntityType.game][gameUri];
        let promptId = this.uriToId[EntityType.prompt][promptUri];
        let dimensionId = this.uriToId[EntityType.dimension][dimensionUri];
        let localDimensionId = this.uriToId[EntityType.localDimension][localDimensionUri];

        return Object.keys(this.idToEntity[EntityType.item]).map(function(itemId) {
            return this.idToEntity[EntityType.item][itemId];
        }.bind(this)).filter(function(item:Item) {
            let prompt:Prompt = this.idToEntity[EntityType.prompt][item.promptId];
            let localDimension:LocalDimension = this.idToEntity[EntityType.localDimension][item.localDimensionId];
            if (gameUri && (!prompt || !prompt.gameId || gameId != prompt.gameId)) {
                return false;
            }
            if (promptUri && (!item.promptId || promptId != item.promptId)) {
                return false;
            }
            if (dimensionUri && (!localDimension || !localDimension.dimensionId || dimensionId != localDimension.dimensionId)) {
                return false
            }

            return !localDimensionUri || (item.localDimensionId && localDimensionId == item.localDimensionId);
        }.bind(this)) as Item[];
    }

    getDimensions():Dimension[] {
        return Object.keys(this.idToEntity[EntityType.dimension]).map(function(dimensionId) {
            return this.idToEntity[EntityType.dimension][dimensionId];
        }.bind(this)) as Dimension[];
    }

    getLocalDimensions(dimensionUri:string, gameUri:string): LocalDimension[] {
        let dimensionId = this.uriToId[EntityType.dimension][dimensionUri];
        let gameId = this.uriToId[EntityType.game][gameUri];
        return Object.keys(this.idToEntity[EntityType.localDimension]).map(function(localDimensionId) {
            return this.idToEntity[EntityType.localDimension][localDimensionId];
        }.bind(this)).filter(function(localDimension:LocalDimension) {
            if (dimensionUri && (!localDimension.dimensionId || dimensionId != localDimension.dimensionId)) {
                return false;
            }

            return !gameUri || (localDimension.gameId && gameId == localDimension.gameId);
        }) as LocalDimension[]
    }

    getCategories(promptUri:string, gameUri:string): Category[] {
        if (!promptUri && !gameUri) {
            return Object.keys(this.idToEntity[EntityType.category]).map(function(categoryId) {
                return this.idToEntity[EntityType.category][categoryId];
            }.bind(this)) as Category[];
        }

        let promptIds;
        if (promptUri) {
            let prompt:Prompt = this.getEntityByUri(EntityType.prompt, promptUri);
            let game:Game = this.getEntityByUri(EntityType.game, gameUri);
            if (!prompt || (gameUri && (!game || !prompt.gameId || prompt.gameId != game.id))) {
                return [];
            }
            promptIds = [prompt.id];
        } else {
            promptIds = this.getPrompts(gameUri).map(function(prompt) {
                return prompt.id;
            });
        }

        let categories: Category[] = [];
        let catMap :{[key:number]:boolean} = {};
        promptIds.forEach(function(promptId) {
            this.promptCategories[promptId].forEach(function(promptCategory:PromptCategory) {
                if (catMap[promptCategory.categoryId]) {
                    return;
                }
                catMap[promptCategory.categoryId] = true;
                categories.push(this.idToEntity[EntityType.category][promptCategory.categoryId]);
            }.bind(this));
        }.bind(this))

        return categories;
    }

    getInstances(categoryUri:string): Instance[] {
        let categoryId = this.uriToId[EntityType.category][categoryUri];
        return Object.keys(this.idToEntity[EntityType.instance]).map(function(instanceId) {
            return this.idToEntity[EntityType.instance][instanceId];
        }).filter(function(instance:Instance) {
            let subCategory:SubCategory = this.idToEntity[EntityType.subCategory][instance.subCategoryId];
            return !categoryUri || (subCategory && subCategory.categoryId && subCategory.categoryId == categoryId);
        });
    }

    syncModels(): Promise<any> {
        let entities = [
            {entityType: EntityType.game, api: this.appApi.gameGet.bind(this.appApi)},
            {entityType: EntityType.prompt, api: this.appApi.promptGet.bind(this.appApi)},
            {entityType: EntityType.category, api: this.categoryApi.categoryGet.bind(this.categoryApi)},
            {entityType: EntityType.subCategory, api: this.categoryApi.subCategoryGet.bind(this.categoryApi)},
            {entityType: EntityType.instance, api: this.categoryApi.instanceGet.bind(this.categoryApi)},
            {entityType: EntityType.skillsFramework, api: this.frameworkApi.skillsFrameworkGet.bind(this.frameworkApi)},
            {entityType: EntityType.skillsCluster, api: this.frameworkApi.skillsClusterGet.bind(this.frameworkApi)},
            {entityType: EntityType.skillsDomain, api: this.frameworkApi.skillsDomainGet.bind(this.frameworkApi)},
            {entityType: EntityType.dimension, api: this.frameworkApi.dimensionGet.bind(this.frameworkApi)},
            {entityType: EntityType.localDimension, api: this.frameworkApi.localDimensionGet.bind(this.frameworkApi)},
            {entityType: EntityType.item, api: this.frameworkApi.itemGet.bind(this.frameworkApi)},
        ];

        return Promise.all(
            [Promise.all(
                entities.map(function(entity) {
                    return entity.api(this.delegate.getAppApiKey()).then(function(data) {
                        let entityResult = {entityType: entity.entityType, uriToId: {}, idToEntity: {}};
                        for (let d of data.body) {
                            entityResult.uriToId[d.uri] = d.id;
                            entityResult.idToEntity[d.id] = d;
                        }
                        return entityResult;
                    });
                }.bind(this))
            ),
            this.categoryApi.promptCategoryGet(this.delegate.getAppApiKey()).then(function(data) { //promptCategory is handled differently
                let promptCategories = {};

                for (let d of data.body) {
                    let prompt = promptCategories[d.promptId];
                    if (!prompt) {
                        prompt = [];
                        promptCategories[d.promptId] = prompt;
                    }
                    prompt.push(d);
                }
                return promptCategories;
            })]
        ).then(function(data) { //we don't update data until all of the metadata has been retrieved without error
            this.uriToId = {};  //this prevents inconsistent states from partial fetches
            this.idToEntity = {};
            for (let d of data[0]) {
                this.uriToId[d.entityType] = d.uriToId;
                this.idToEntity[d.entityType] = d.idToEntity;
            }

            this.promptCategories = data[1];

            localStorage.setItem("kidaptive.alp.models.uriToId", JSON.stringify(this.uriToId));
            localStorage.setItem("kidaptive.alp.models.idToEntity", JSON.stringify(this.idToEntity));
            localStorage.setItem("kidaptive.alp.models.promptCategories", JSON.stringify(this.promptCategories));

            return data;
        }.bind(this)).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        });
    }

    loadStoredModels() {
        //make sure all models successfully load before applying
        let uriToId = JSON.parse(localStorage.getItem("kidaptive.alp.models.uriToId"));
        let idToEntity = JSON.parse(localStorage.getItem("kidaptive.alp.models.idToEntity"));
        let promptCategories = JSON.parse(localStorage.getItem("kidaptive.alp.models.promptCategories"));
        this.uriToId = uriToId;
        this.idToEntity = idToEntity;
        this.promptCategories = promptCategories;
    }

    //sync ability estimates for a list of learners. Returns a promise that is always resolved. Value will be list of
    //{learnerId:number; abilities:LocalAbility[]|LatentAbility[]} or {learnerId:number; error:KidaptiveError} for each learner
    syncAbilities(learners:number[] = null):Promise<any> {
        if (learners == null) {
            learners = this.delegate.getLearnerList().map(function(d) {return d.id});
        }

        return Promise.all(learners.map(function(learnerId) {
            this.syncLocalAbility(learnerId).then(function(data:LocalAbility[]) {
                let updated: LocalAbility[] = [];
                for (let ability of data) {
                    let localDimension: LocalDimension = this.getEntityById(EntityType.localDimension, ability.localDimensionId);
                    if (localDimension) {
                        this.updateLocalAbility(learnerId,localDimension.uri, ability);
                        updated.push(ability);
                    }
                }
                return {learnerId:learnerId, localAbilities: updated};
            }.bind(this)).catch(function(error) {
                return {learnerId:learnerId, error:error};
            });
        }.bind(this)).concat(learners.map(function(learnerId) {
            this.syncLatentAbility(learnerId).then(function(data:LatentAbility[]) {
                let updated: LatentAbility[] = [];
                for (let ability of data) {
                    let dimension: Dimension = this.getEntityById(EntityType.dimension, ability.dimensionId);
                    if (dimension) {
                        this.updateLocalAbility(learnerId,dimension.uri, ability);
                        updated.push(ability);
                    }
                }
                return {learnerId:learnerId, latentAbilities: updated};
            }.bind(this)).catch(function(error) {
                return {learnerId:learnerId, error:error};
            });
        }.bind(this))));
    }

    syncInsights(learners:number[] = null):Promise<any> {
        if (learners == null) {
            learners = this.delegate.getLearnerList().map(function(d) {return d.id});
        }

        return Promise.all(learners.map(function(learnerId) {
            let after:number = 0;
            let insights = this.insights[learnerId];
            if (insights && insights.length > 0) {
                after = insights[insights.length - 1].dateCreated + 1;
            }
            return this.syncLearnerInsight(learnerId, after).then(function(data:LearnerInsight[]) {
                data.sort(function(a,b) {return a.dateCreated - b.dateCreated});
                let insights = this.insights[learnerId];
                if (!insights) {
                    insights = [];
                }

                this.insights[learnerId] = insights.concat(data);
                this.storeInsights();
                return {learnerId: learnerId, insights: data};
            }.bind(this)).catch(function(error){
                return {learnerId: learnerId, error:error};
            });
        }.bind(this)));
    }

    updateLocalAbility(learnerId:number, localDimensionUri:string, newAbility:LocalAbility):void {
        let learner = this.delegate.getLearner(learnerId);
        if (!learner) {
            throw new KidaptiveError(KidaptiveErrorCode.LEARNER_NOT_FOUND, "Learner " + learnerId + " not found");
        }

        let localDimension:LocalDimension = this.getEntityByUri(EntityType.localDimension, localDimensionUri);
        if (!localDimensionUri) {
            throw new KidaptiveError(KidaptiveErrorCode.URI_NOT_FOUND, "Dimension " + localDimensionUri + " not found");
        }

        let abilities = this.localAbilities[learnerId];
        if (!abilities) {
            abilities = {};
            this.localAbilities[learnerId] = abilities;
        }

        if (!abilities[localDimension.id] || abilities[localDimension.id].timestamp <= newAbility.timestamp) {
            this.storeLocalAbilities();
            abilities[localDimension.id] = newAbility;
        }
    }

    updateLatentAbility(learnerId:number, dimensionUri:string, newAbility:LatentAbility):void {
        let learner = this.delegate.getLearner(learnerId);
        if (!learner) {
            throw new KidaptiveError(KidaptiveErrorCode.LEARNER_NOT_FOUND, "Learner " + learnerId + " not found");
        }

        let dimension:Dimension = this.getEntityByUri(EntityType.dimension, dimensionUri);
        if (!dimensionUri) {
            throw new KidaptiveError(KidaptiveErrorCode.URI_NOT_FOUND, "Dimension " + dimensionUri + " not found");
        }

        let abilities = this.latentAbilities[learnerId];
        if (!abilities) {
            abilities = {};
            this.latentAbilities[learnerId] = abilities;
        }

        if (!abilities[dimension.id] || abilities[dimension.id].timestamp <= newAbility.timestamp) {
            abilities[dimension.id] = newAbility;
            this.storeLatentAbilities();
        }
    }

    //used to clear data on logout or when deleting a learner
    clearLearnerAbility(learnerList:number[] = null) {
        if (!learnerList) {
            this.localAbilities = {};
            this.latentAbilities = {};
            ModelManager.deleteStoredLocalAbilities();
            ModelManager.deleteStoredLatentAbilities();
        } else {
            for (let l of learnerList) {
                delete this.localAbilities[l];
                delete this.latentAbilities[l];
            }
            this.storeLocalAbilities();
            this.storeLatentAbilities();
        }
    }

    clearInsights(learnerList:number[] = null) {
        if (!learnerList) {
            this.insights = {};
            ModelManager.deleteStoredInsights();
        } else {
            for (let l of learnerList) {
                delete this.insights[l];
            }
            this.storeInsights();
        }
    }

    getLocalAbility(learnerId:number, localDimensionUri:string):LocalAbility {
        if (!this.delegate.getLearner(learnerId)) {
            return null;
        }
        let localDimension:LocalDimension = this.getEntityByUri(EntityType.localDimension, localDimensionUri);
        if (!localDimension) {
            return null;
        }

        let dimension:Dimension = this.getEntityById(EntityType.dimension, localDimension.dimensionId);
        if (!dimension) {
            return null;
        }

        let abilities = this.localAbilities[learnerId];
        if (abilities) {
            let ability = abilities[localDimension.id];
            if (ability) {
                return ability;
            }
        }

        let latentAbility = this.getLatentAbility(learnerId, dimension.uri);
        let ability = new LocalAbility();
        ability.localDimensionId = localDimension.id;
        ability.mean = latentAbility.mean;
        ability.standardDeviation = latentAbility.standardDeviation;
        ability.timestamp = latentAbility.timestamp;
        return ability;
    }

    getLatentAbility(learnerId:number, dimensionUri:string):LatentAbility {
        if (!this.delegate.getLearner(learnerId)) {
            return null;
        }
        let dimension = this.getEntityByUri(EntityType.dimension, dimensionUri);
        if (!dimension) {
            return null;
        }

        let abilities = this.latentAbilities[learnerId];
        if (!abilities) {
            let ability = new LatentAbility();
            ability.dimensionId = dimension.id;
            ability.mean = 0;
            ability.standardDeviation = 1;
            ability.timestamp = 0;
            return ability;
        }

        let ability = abilities[dimension.id];
        if (!ability) {
            ability = new LatentAbility();
            ability.dimensionId = dimension.id;
            ability.mean = 0;
            ability.standardDeviation = 1;
            ability.timestamp = 0;
        }

        return ability;
    }

    getInsights(learnerId:number, uriFilter:string[], startDate:Date, endDate:Date, latest:boolean): LearnerInsight[]{
        if (!this.delegate.getLearner(learnerId)) {
            return null;
        }

        let learnerInsights = this.insights[learnerId];
        if (!learnerInsights) {
            return [];
        }
        let lower = 0;
        let upper = learnerInsights.length;
        let endDateNumber = endDate ? endDate.getTime() : Date.now();
        let startDateNumber = startDate ? startDate.getTime() : 0;
        let upperIndex = 0;
        //find lowest index for element greater than endDate
        while (lower != upper) {
            upperIndex = Math.floor((lower + upper) / 2);
            if (learnerInsights[upperIndex].dateCreated <= endDateNumber) {
                upperIndex += 1;
                lower = upperIndex;
            } else {
                upper = upperIndex;
            }
        }

        if (latest) {
            let slice = [];
            if (uriFilter) {
                let uriFilterCopy = JSON.parse(JSON.stringify(uriFilter));
                for (let i = upper - 1; i >= 0 && learnerInsights[i].dateCreated >= startDateNumber && uriFilterCopy.length > 0; i--) {
                    for (let j = 0; j < uriFilterCopy.length; j++) {
                        if (learnerInsights[i].uri == uriFilterCopy[j]) {
                            slice.push(learnerInsights[i]);
                            uriFilterCopy.splice(j,1);
                            break;
                        }
                    }
                }
            } else {
                let seenUri = [];
                for (let i = upper - 1; i >= 0 && learnerInsights[i].dateCreated >= startDateNumber; i--) {
                    if (seenUri.indexOf(learnerInsights[i].uri) == -1) {
                        slice.push(learnerInsights[i]);
                        seenUri.push(learnerInsights[i].uri);
                    }
                }
            }
            return slice;
        } else {
            lower = 0;
            upper = upperIndex;
            let lowerIndex = 0;
            //find highest index for element less than startDate
            while (lower != upper) {
                lowerIndex = Math.floor((lower + upper) / 2);
                if (learnerInsights[lowerIndex].dateCreated < startDateNumber) {
                    lowerIndex += 1;
                    lower = lowerIndex;
                } else {
                    upper = lowerIndex;
                }
            }

            let slice = learnerInsights.slice(lowerIndex, upperIndex);
            if (uriFilter) {
                return slice.filter(function(x:LearnerInsight) {
                    return uriFilter.indexOf(x.uri) > -1;
                });
            }
            return slice;
        }
    }

    getPromptCategoriesForPrompt(promptUri) {
        return this.promptCategories[this.uriToId[EntityType.prompt][promptUri]];
    }

    private syncLocalAbility(learnerId:number):Promise<LocalAbility[]> {
        let currentUser = this.delegate.getCurrentUser();
        if (!currentUser) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.NOT_LOGGED_IN, "User not logged in"));
        }
        let learner = this.delegate.getLearner(learnerId);
        if (!learner) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.LEARNER_NOT_FOUND, "Learner " + learnerId + " not found"));
        }

        return this.learnerApi.localAbilityGet(currentUser.apiKey, learnerId).then(function(data) {
            return data.body;
        }).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        }) as Promise<LocalAbility[]>;
    }

    private syncLatentAbility(learnerId:number):Promise<LatentAbility[]> {
        let currentUser = this.delegate.getCurrentUser();
        if (!currentUser) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.NOT_LOGGED_IN, "User not logged in"));
        }
        let learner = this.delegate.getLearner(learnerId);
        if (!learner) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.LEARNER_NOT_FOUND, "Learner " + learnerId + " not found"));
        }

        return this.learnerApi.abilityGet(currentUser.apiKey, learnerId).then(function(data) {
            return data.body;
        }).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        }) as Promise<LatentAbility[]>;
    }

    private syncLearnerInsight(learnerId:number, after:number = 0) {
        let currentUser = this.delegate.getCurrentUser();
        if (!currentUser) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.NOT_LOGGED_IN, "User not logged in"));
        }
        let learner = this.delegate.getLearner(learnerId);
        if (!learner) {
            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.LEARNER_NOT_FOUND, "Learner " + learnerId + " not found"));
        }

        return this.learnerApi.insightGet(currentUser.apiKey, learnerId, after).then(function(data) {
            return data.body;
        }).catch(function(error) {
            if (error.response) {
                if (error.response.statusCode == 401) {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR, error.response.statusMessage));
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR, error.response.statusMessage));
                }
            } else {
                return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
            }
        });
    }

    private storeLocalAbilities() {
        localStorage.setItem('kidaptive.alp.models.localAbilities', JSON.stringify(this.localAbilities));
    }

    loadStoredLocalAbilities() {
        this.localAbilities = JSON.parse(localStorage.getItem('kidaptive.alp.models.localAbilities')) || {};
    }

    private static deleteStoredLocalAbilities() {
        localStorage.removeItem('kidaptive.alp.models.localAbilities');
    }

    private storeLatentAbilities() {
        localStorage.setItem('kidaptive.alp.models.latentAbilities', JSON.stringify(this.latentAbilities));
    }

    loadStoredLatentAbilities() {
        this.latentAbilities = JSON.parse(localStorage.getItem('kidaptive.alp.models.latentAbilities')) || {};
    }

    private static deleteStoredLatentAbilities() {
        localStorage.removeItem('kidaptive.alp.models.latentAbilities');
    }

    private storeInsights() {
        localStorage.setItem('kidaptive.alp.models.insights', JSON.stringify(this.insights));
    }

    loadStoredInsights() {
        this.insights = JSON.parse(localStorage.getItem('kidaptive.alp.models.insights')) || {};
    }

    private static deleteStoredInsights() {
        localStorage.removeItem('kidaptive.alp.models.insights');
    }
}

export {EntityType, ModelManagerDelegate, ModelManager};