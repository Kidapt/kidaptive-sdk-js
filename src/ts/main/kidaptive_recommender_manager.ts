import {EntityType} from "./kidaptive_model_manager";
import {KidaptiveError, KidaptiveErrorCode} from "./kidaptive_error";
import {
    PromptCategory,
    LearnerInsight,
    LatentAbility,
    Learner,
    Item,
    Prompt,
    LocalAbility,
    LocalDimension,
    Game,
    Dimension,
    Category,
    Instance
} from "../../../swagger-client/api";
/**
 * Created by solomonliu on 11/7/16.
 */

interface RecommenderManagerDelegate {
    getLearner:(learnerId:number) => Learner;
    getEntityByUri: (type:EntityType, uri:string) => any;
    getEntityById: (type:EntityType, id:number) => any;
    getPromptCategoriesForPrompt: (promptUri: string) => PromptCategory[];
    getLocalAbility: (learnerId:number, localDimensionUri:string) => LocalAbility;
    getLatentAbility: (learnerId:number, dimensionUri:string) => LatentAbility;
    getInsights: (learnerId:number, uriFilter:string[], startDate:Date, endDate:Date, latest:boolean) => LearnerInsight[];
    getGames: () => Game[];
    getPrompts: (gameUri:string) => Prompt[];
    getItems: (gameUri: string, promptUri:string, dimensionUri:string, localDimensionUri:string) => Item[];
    getDimensions: () => Dimension[];
    getLocalDimensions: (dimensionUri:string, gameUri:string) => LocalDimension[];
    getCategories: (promptUri:string, gameUri:string) => Category[];
    getInstances: (categoryUri:string) => Instance[];
}

class RecommendationResult {
    type: EntityType;
    recommendations: string[];
    context: {[key:string] : string};
}

interface Recommender {
    delegate: RecommenderManagerDelegate;
    provideRecommendation: (parameters: {[key:string]: string}) => RecommendationResult;
}

class RandomRecommender implements Recommender {
    delegate: RecommenderManagerDelegate = null;
    provideRecommendation(parameters: {[key:string]: string}) {
        if (!parameters || !parameters['gameUri']) {
            throw new KidaptiveError(KidaptiveErrorCode.RECOMMENDER_ERROR, "Random recommender requires gameUri");
        }

        if (!this.delegate.getEntityByUri(EntityType.game, parameters['gameUri'])) {
            throw new KidaptiveError(KidaptiveErrorCode.RECOMMENDER_ERROR,"Game " + parameters['gameUri'] + " not found");
        }

        if (parameters['localDimensionUri'] && !this.delegate.getEntityByUri(EntityType.localDimension, parameters['localDimensionUri'])) {
            throw new KidaptiveError(KidaptiveErrorCode.RECOMMENDER_ERROR,"Local dimension " + parameters['localDimensionUri'] + " not found");
        }

        let promptUris:string[] = this.delegate.getItems(parameters['gameUri'], null, null, parameters['localDimensionUri']).map(function(item) {
            let prompt:Prompt = this.delegate.getEntityById(EntityType.prompt, item ? item.promptId : null);
            return prompt ? prompt.uri : null;
        }.bind(this)).filter(function(uri) {
            return uri != null;
        }) as string[];

        let numResults = Math.max(Math.min(parseFloat(parameters['numResults']), promptUris.length), 0);
        numResults = numResults || (numResults === 0 ? 0 : 10);

        for (let i = 0; i < numResults; i++) {
            let j = i + Math.floor(Math.random() * (promptUris.length - i));
            let temp = promptUris[i];
            promptUris[i] = promptUris[j];
            promptUris[j] = temp;
        }

        let recResult = new RecommendationResult();

        recResult.type = EntityType.prompt;
        recResult.recommendations = promptUris.slice(0, numResults);

        return recResult;
    }
}

class OptimalDifficultyRecommender implements Recommender {
    delegate: RecommenderManagerDelegate = null;
    provideRecommendation(parameters: {[key:string]: string}) {
        if (!parameters) {
            throw new KidaptiveError(KidaptiveErrorCode.RECOMMENDER_ERROR, "OptimalDifficultyRecommender requires parameters learnerId, gameId");
        }

        let learnerId = parseInt(parameters['learnerId']);
        let gameUri = parameters['gameUri'];
        let localDimensionUri = parameters['localDimensionUri'];
        let probSuccess = Math.max(Math.min(parseFloat(parameters['successProbability']), 1), 0);
        probSuccess = probSuccess || (probSuccess === 0 ? 0 : 0.7);

        if (!learnerId) {
            throw new KidaptiveError(KidaptiveErrorCode.RECOMMENDER_ERROR, "LearnerId required for optimal difficulty recommendation");
        }

        if (!gameUri) {
            throw new KidaptiveError(KidaptiveErrorCode.RECOMMENDER_ERROR, "GameUri required for optimal difficulty recommendation");
        }

        if (!this.delegate.getLearner(learnerId)) {
            throw new KidaptiveError(KidaptiveErrorCode.RECOMMENDER_ERROR, "Learner " + learnerId + " not found");
        }

        if (!this.delegate.getEntityByUri(EntityType.game, gameUri)) {
            throw new KidaptiveError(KidaptiveErrorCode.RECOMMENDER_ERROR,"Game " + gameUri + " not found");
        }

        if (localDimensionUri && !this.delegate.getEntityByUri(EntityType.localDimension, localDimensionUri)) {
            throw new KidaptiveError(KidaptiveErrorCode.RECOMMENDER_ERROR,"Local dimension " + localDimensionUri + " not found");
        }

        let items: Item[] = this.delegate.getItems(gameUri, null, null, localDimensionUri);

        let sortedItems : Item[] = items.sort(function(item1:Item, item2:Item) {
                let localDim1:LocalDimension = this.delegate.getEntityById(EntityType.localDimension, item1.localDimensionId);
                let ability1: LocalAbility = localDim1 ? this.delegate.getLocalAbility(learnerId, localDim1.uri) : undefined;
                let probSucDiff1 = Math.abs(1 / (1 + Math.exp(Math.sqrt(8 / Math.PI) * (item1.mean - ability1.mean))) - probSuccess);
                let localDim2:LocalDimension = this.delegate.getEntityById(EntityType.localDimension, item2.localDimensionId);
                let ability2: LocalAbility = localDim2 ? this.delegate.getLocalAbility(learnerId, localDim2.uri) : undefined;
                let probSucDiff2 = Math.abs(1 / (1 + Math.exp(Math.sqrt(8 / Math.PI) * (item2.mean - ability2.mean))) - probSuccess);

                return probSucDiff1 - probSucDiff2;
            }.bind(this));

        let promptUris: string[] = sortedItems.map(function(item:Item) {
            let prompt:Prompt = this.delegate.getEntityById(EntityType.prompt, item.promptId);
            return prompt ? prompt.uri : null;
        }.bind(this)).filter(function(promptUri) {
            return promptUri != null;
        }) as string[];

        let numResults = Math.max(Math.min(parseFloat(parameters['numResults']), promptUris.length), 0);
        numResults = numResults || (numResults === 0 ? 0 : 10);

        let rec = new RecommendationResult();
        rec.type = EntityType.prompt;
        rec.recommendations = promptUris.slice(0, numResults);

        return rec;
    }
}

class RecommenderManager {

    private recommenders: {[key:string]:Recommender} = {};
    private defaultRecommenders: {[key:string]:Recommender} = {};

    constructor(private delegate: RecommenderManagerDelegate) {
        if (!delegate) {
            throw new KidaptiveError(KidaptiveErrorCode.MISSING_DELEGATE, "RecommenderManagerDelegate not found");
        }

        let randRec = new RandomRecommender();
        randRec.delegate = this.delegate;
        this.defaultRecommenders['random'] = randRec;

        let ODRec = new OptimalDifficultyRecommender();
        ODRec.delegate = this.delegate;
        this.defaultRecommenders['optimalDifficulty'] = ODRec;
    }

    registerRecommender(recommender: Recommender, recommenderKey:string) {
        if (!recommender) {
            throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Cannot register null recommender");
        }

        if (!recommenderKey) {
            throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Cannot register recommender with null key");
        }

        if (this.recommenders[recommenderKey]) {
            throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Recommender already exists for key " + recommenderKey);
        }

        this.recommenders[recommenderKey] = recommender;
        recommender.delegate = this.delegate;
    }

    unregisterRecommender(recommenderKey:string) {
        let recommender = this.recommenders[recommenderKey];
        delete this.recommenders[recommenderKey];
        if (recommender) {
            recommender.delegate = null;
        }
    }

    getRecommenderKeys(): string[] {
        return Object.keys(this.recommenders);
    }

    provideRecommendation(recommenderKey: string, parameters: {[key:string]: string}): RecommendationResult {
        let recommender = this.recommenders[recommenderKey];
        if (!recommender) {
            throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Recommender for key " + recommenderKey + " not found");
        }

        return recommender.provideRecommendation(parameters);
    }

    recommendRandomPrompts(gameUri: string, localDimensionUri: string = null, numResults:number = null): RecommendationResult {
        return this.defaultRecommenders['random'].provideRecommendation({gameUri:gameUri, localDimensionUri: localDimensionUri, numResults:(numResults || numResults === 0) ? numResults.toString() : null});
    }

    recommendOptimalDifficultyPrompts(learnerId:number, gameUri:string, localDimensionUri: string = null, numResults:number = null, successProbability:number = null): RecommendationResult {
        return this.defaultRecommenders['optimalDifficulty'].provideRecommendation({
            learnerId:learnerId.toString(),
            gameUri:gameUri,
            localDimensionUri:localDimensionUri,
            numResults:(numResults || numResults === 0) ? numResults.toString() : null,
            successProbability:(successProbability || successProbability === 0) ? successProbability.toString() : null
        });
    }
}

export {RecommenderManagerDelegate, RecommendationResult, Recommender, RecommenderManager}