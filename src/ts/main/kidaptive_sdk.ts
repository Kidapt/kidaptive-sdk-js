/// <reference path="../../../typings/index.d.ts" />

import {KidaptiveHttpClient} from "./kidaptive_http_client";
import {AttemptProcessor, AttemptProcessorDelegate} from "./kidaptive_attempt_processor";
import {EventManager, EventManagerDelegate} from "./kidaptive_event_manager";
import {LearnerManager, LearnerManagerDelegate} from "./kidaptive_learner_manager";
import {ModelManager, ModelManagerDelegate, EntityType} from "./kidaptive_model_manager";
import {TrialManager, TrialManagerDelegate} from "./kidaptive_trial_manager";
import {UserManager, UserManagerDelegate} from "./kidaptive_user_manager";
import {KidaptiveConstants} from "./kidaptive_constants";
import {KidaptiveError, KidaptiveErrorCode} from "./kidaptive_error";
import {
    User,
    Learner,
    AgentRequestAttempts,
    AgentRequest,
    LearnerInsight,
    LatentAbility,
    AgentRequestAppInfo,
    App,
    Item,
    LocalAbility,
    Game,
    Prompt,
    Dimension,
    LocalDimension,
    Category,
    Instance
} from "../../../swagger-client/api";
import {
    RecommenderManager,
    RecommenderManagerDelegate,
    Recommender,
    RecommendationResult
} from "./kidaptive_recommender_manager";

/**
 * Created by solomonliu on 9/9/16.
 */

class KidaptiveSdk implements AttemptProcessorDelegate,EventManagerDelegate,LearnerManagerDelegate,
    ModelManagerDelegate, TrialManagerDelegate, UserManagerDelegate, RecommenderManagerDelegate {
    private attemptProcessor:AttemptProcessor;
    private eventManager:EventManager;
    private learnerManager:LearnerManager;
    private modelManager:ModelManager;
    private trialManager:TrialManager;
    private userManager:UserManager;
    private recommenderManager: RecommenderManager;

    private networkQueue: JQueryPromise<KidaptiveSdk>;

    private deviceInfo = null;

    constructor(private appInfo:AgentRequestAppInfo, private appSecret:string, private httpClient:KidaptiveHttpClient) {
        this.attemptProcessor = new AttemptProcessor(this);
        this.eventManager = new EventManager(this, 60000);
        this.learnerManager = new LearnerManager(this);
        this.modelManager = new ModelManager(this);
        this.trialManager = new TrialManager(this);
        this.userManager = new UserManager(this);
        this.recommenderManager = new RecommenderManager(this);

        this.networkQueue = $.Deferred().resolve(this);
    }

    static init(appSecret:string, appVersion:{version:string, build:string} = null, options: any) {
        if (!appSecret) {
            throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "App Secret is required");
        }

        options = options ? options : {};

        //start building app info from available information
        let version = '';
        let build = '';
        if (appVersion) {
            if (appVersion.version) {
                version = appVersion.version;
            }
            if (appVersion.build) {
                build = appVersion.build;
            }
        }

        let httpClient = new KidaptiveHttpClient(options.dev, appSecret);
        let sdk;
        return httpClient.ajax("GET", KidaptiveConstants.APP, null).then(function(app:App) {
            if (app.minVersion > version) {
                return $..reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Version >= " + app.minVersion + " required. Provided " + version));
            }
            let appInfo = new AgentRequestAppInfo();
            appInfo.build = build;
            appInfo.version = version;
            appInfo.uri = app.uri;
            sdk = new KidaptiveSdk(appInfo, appSecret, httpClient);
            return sdk.syncModels().then(function() {
                //app metadata successfully loaded, save to localStorage
                localStorage.setItem("kidaptive.alp.app", JSON.stringify(app));
                return sdk;
            });
        }).catch(function(error) {
            if (error instanceof KidaptiveError && error.code == KidaptiveErrorCode.API_KEY_ERROR) {
                //TODO: unauthorized; clear all data
                throw error;
            } else { //possibly recoverable error. load from localStorage
                if (!sdk) {
                    let appString = localStorage.getItem("kidaptive.alp.app");
                    if (appString) {
                        let app = JSON.parse(appString);
                        if (app.minVersion > version) {
                            return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Version >= " + app.minVersion + " required. Provided " + version));
                        }
                        let appInfo = new AgentRequestAppInfo();
                        appInfo.build = build;
                        appInfo.version = version;
                        appInfo.uri = app.uri;
                        sdk = new KidaptiveSdk(appInfo, appSecret, httpClient);
                    }
                }

                    sdk.modelManager.loadStoredModels();
                    return Promise.resolve(sdk);
                } else {
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR, error));
                }
            }
        }).then(function(sdk:KidaptiveSdk) {
            //load stored user, if there is one
            sdk.eventManager.loadStoredEventQueue();
            sdk.eventManager.loadStoredPayloadQueue();
            sdk.userManager.loadStoredUser();
            if (sdk.getCurrentUser()) {
                //load available learner and ability information, update from network if available.
                sdk.learnerManager.loadStoredLearners();
                sdk.modelManager.loadStoredLocalAbilities();
                sdk.modelManager.loadStoredLatentAbilities();
                sdk.modelManager.loadStoredInsights();

                sdk.refreshUser();
            }

            return sdk.updateNetworkQueue(function(sdk) {
                return Promise.resolve(sdk);
            });
        }) as Promise<KidaptiveSdk>;
    }

    /* User Management */
    refreshUser(): Promise<User> {
        return this.updateNetworkQueue(function(sdk) {
            return sdk.userManager.refreshUser();
        }).then(function() {
            return this.learnerManager.syncLearnerList();
        }.bind(this)).then(function() {
            return this.getCurrentUser();
        }.bind(this)) as Promise<User>;

    }

    getCurrentUser(): User {
        return this.userManager.currentUser;
    }

    logoutUser(): void {
        this.flushEvents();
        this.closeAllTrials();
        this.modelManager.clearLearnerAbility();
        this.modelManager.clearInsights();
        this.learnerManager.clearLearnerList();
        this.userManager.logoutUser();
    }

    /* Learner Management */

    syncLearnerList(): Promise<Learner[]> {
        let learnerListPromise = this.updateNetworkQueue(function(sdk) {
            return sdk.learnerManager.syncLearnerList();
        });
        //TODO: ability/insight sync is broken
        // this.syncAbilities(); //TODO: fails silently, may want to log
        // this.syncInsights(); //TODO: fails silently, may want to log
        return this.updateNetworkQueue(function() {
            return learnerListPromise;
        });
    }

    getLearnerList(): Learner[] {
        return this.learnerManager.listLearners();
    }

    getLearner(learnerId: number) {
        return this.learnerManager.getLearner(learnerId);
    }

    /* Model Management */
    syncModels(): Promise<any> {
        return this.updateNetworkQueue(function(sdk) {
            return sdk.modelManager.syncModels();
        });
    }

    syncAbilities(learners?: number[]): Promise<any> {
        return this.updateNetworkQueue(function(sdk) {
            return sdk.modelManager.syncAbilities(learners);
        });
    }

    syncInsights(learners?: number[]) {
        return this.updateNetworkQueue(function(sdk) {
            return sdk.modelManager.syncInsights(learners);
        });
    }

    getInsights(learnerId:number, uriFilter:string[], startDate:Date, endDate:Date, latest:boolean): LearnerInsight[] {
        return this.modelManager.getInsights(learnerId, uriFilter, startDate, endDate, latest);
    }

    getGames():Game[] {
        return this.modelManager.getGames();
    }

    getPrompts(gameUri):Prompt[] {
        return this.modelManager.getPrompts(gameUri)
    }

    getItems(gameUri:string, promptUri:string, dimensionUri:string, localDimensionUri:string): Item[] {
        return this.modelManager.getItems(gameUri, promptUri, dimensionUri, localDimensionUri);
    }

    getDimensions():Dimension[] {
        return this.modelManager.getDimensions();
    }

    getLocalDimensions(dimensionUri, gameUri):LocalDimension[] {
        return this.modelManager.getLocalDimensions(dimensionUri, gameUri);
    }

    getCategories(promptUri, gameUri):Category[] {
        return this.modelManager.getCategories(promptUri, gameUri);
    }

    getInstances(categoryUri):Instance[] {
        return this.modelManager.getInstances(categoryUri);
    }

    /* Trial Management */
    startTrial(learnerId: number): void {
        this.trialManager.startTrial(learnerId);
    }

    getCurrentTrial(learnerId: number){
        return this.trialManager.getCurrentTrial(learnerId);
    }

    closeTrial(learnerId: number): void {
        this.trialManager.closeTrial(learnerId);
    }

    closeAllTrials(): void {
        this.trialManager.closeAllTrials();
    }

    /* Event Management */
    reportEvidence(eventName:string, learnerId:number, promptUri:string, attempts:AgentRequestAttempts[],
                   args?:{duration?:number; promptAnswers?:{[key:string]:string}; additionalFields?:{[key:string]:string}, tags?:{[key:string]:string}}):void {
        this.eventManager.reportEvidence(eventName, learnerId, promptUri, attempts, args);
    }

    reportBehavior(eventName:string, args:{learnerId?:number; gameUri?:string; promptUri?:string; duration?:number; additionalFields?:{[key:string]:string}, tags?:{[key:string]:string}} = {}):void {
        this.eventManager.reportBehavior(eventName, args);
    }

    startAutoFlush(): void {
        this.eventManager.startAutoFlush();
    }

    stopAutoFlush(): void {
        this.eventManager.stopAutoFlush();
    }

    flushEvents(): void {
        this.eventManager.flushEvents();
    }

    /* Recommender Management */
    registerRecommender(recommender: Recommender, recommenderKey:string): void {
        this.recommenderManager.registerRecommender(recommender, recommenderKey);
    }

    unregisterRecommender(recommenderKey:string): void {
        this.recommenderManager.unregisterRecommender(recommenderKey);
    }

    getRecommenderKeys(): string[] {
        return this.recommenderManager.getRecommenderKeys();
    }

    provideRecommendation(recommenderKey: string, parameters: {[key:string]: string}): RecommendationResult {
        return this.recommenderManager.provideRecommendation(recommenderKey, parameters);
    }

    recommendRandomPrompts(gameUri: string, localDimensionUri: string = null, numResults:number = null): RecommendationResult {
        return this.recommenderManager.recommendRandomPrompts(gameUri, localDimensionUri, numResults);
    }

    recommendOptimalDifficultyPrompts(learnerId:number, gameUri:string, localDimensionUri: string = null, numResults:number = null, successProbability:number = null):RecommendationResult {
        return this.recommenderManager.recommendOptimalDifficultyPrompts(learnerId, gameUri, localDimensionUri, numResults, successProbability);
    }

    /* Delegate Methods */
    getSwagger() {
        return this.swagger;
    }

    getEntityById(type:EntityType, id:number) {
        return this.modelManager.getEntityById(type, id);
    }

    getEntityByUri(type:EntityType, uri:string) {
        return this.modelManager.getEntityByUri(type, uri);
    }

    isDimensionReset(learnerId:number, localDimensionUri:string) {
        return this.trialManager.isDimensionReset(learnerId, localDimensionUri);
    }

    resetDimension(learnerId:number, localDimensionUri:string) {
        return this.trialManager.resetDimension(learnerId, localDimensionUri);
    }

    updateLocalAbility(learnerId:number, localDimensionUri:string, newAbility:LocalAbility) {
        this.modelManager.updateLocalAbility(learnerId, localDimensionUri, newAbility);
    }

    updateLatentAbility(learnerId:number, dimensionUri:string, newAbility:LatentAbility) {
        this.modelManager.updateLatentAbility(learnerId, dimensionUri, newAbility);
    }

    getAppApiKey() {
        return this.appSecret;
    }

    getAppInfo() {
        return this.appInfo;
    }

    getEventVersion() {
        return KidaptiveConstants.ALP_EVENT_VERSION;
    }

    getDeviceInfo() {
        return this.deviceInfo;
    }

    getPromptCategoriesForPrompt(promptUri) {
        return this.modelManager.getPromptCategoriesForPrompt(promptUri);
    }

    payloadProcessed(payload:Promise<AgentRequest>) {
        //TODO: SDK delegate for access to payload processing updates
    }

    processEvidence(learnerId:number, attempt:AgentRequestAttempts) {
        this.attemptProcessor.processEvidence(learnerId, attempt.itemURI, attempt.outcome);
    }

    getLocalAbility(learnerId:number, localDimensionUri:string): LocalAbility {
        return this.modelManager.getLocalAbility(learnerId, localDimensionUri);
    }

    getLatentAbility(learnerId:number, dimensionUri:string):LatentAbility {
        return this.modelManager.getLatentAbility(learnerId, dimensionUri);
    }

    //Helper method for ensuring that user-called network operations are completed in the order they are submitted.
    //This helps prevent inconsistent states resulting from delayed responses.
    private updateNetworkQueue(fn: (sdk:KidaptiveSdk) => Promise<any>): Promise<any> {
        let returnPromise = this.networkQueue.then(fn);
        this.networkQueue = returnPromise.then(function() {
            return this;
        }.bind(this), function() {
            return this; //prevent errors from propagating
        }.bind(this)) as Promise<KidaptiveSdk>;

        return returnPromise;
    }
}

//export for TS, Node
export {KidaptiveSdk};

//export for browser
module.exports = KidaptiveSdk;
