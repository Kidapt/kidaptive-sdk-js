import Promise = require("bluebird");

import {KidaptiveErrorCode, KidaptiveError} from "./kidaptive_error";
import {
    User,
    Learner,
    Game,
    Prompt,
    Item,
    AgentRequest,
    AgentRequestAppInfo,
    AgentRequestDeviceInfo,
    AgentRequestEvents,
    AgentRequestAttempts,
    LearnerApi,
    Category,
    PromptCategory,
    Instance,
    SubCategory
} from "../../../swagger-client/api";
import {KidaptiveConstants} from "./kidaptive_constants";
import {EntityType} from "./kidaptive_model_manager";

/**
 * Created by solomonliu on 7/13/16.
 */

interface EventManagerDelegate {
    //not sure if this is useful. currently 1.9.1 for hodoo
    getEventVersion: () => string;

    getCurrentUser: () => User;
    getAppInfo: () => AgentRequestAppInfo;
    getDeviceInfo: () => AgentRequestDeviceInfo;

    getCurrentTrial: (learnerId:number) => {trialTime:number, trialSalt:number};

    getLearner: (learnerId:number) => Learner;
    getEntityById: (type:EntityType, id:number) => any;
    getEntityByUri: (type:EntityType, uri:string) => any;
    getPromptCategoriesForPrompt: (promptUri: string) => PromptCategory[];

    //called on event forwarding. used for logging/notification of event forwarding failure
    payloadProcessed: (payload:Promise<AgentRequest>) => void;

    //local IRT processing
    processEvidence: (learnerId:number, attempt:AgentRequestAttempts) => void;
}

class EventManager {
    private eventSequence:number = 0;
    private eventQueue: AgentRequestEvents[] = [];
    private payloadQueue: AgentRequest[] = []; //holding area for payloads to be sent

    private learnerApi = new LearnerApi(KidaptiveConstants.ALP_BASE_URL);

    constructor(private delegate: EventManagerDelegate, private flushInterval:number) {
        if (!delegate) {
            throw new KidaptiveError(KidaptiveErrorCode.MISSING_DELEGATE, "EventManagerDelegate not found");
        }
        setTimeout(this.autoFlush.bind(this), this.flushInterval);
    }

    reportEvidence(eventName:string, learnerId:number, promptUri:string, attempts:AgentRequestAttempts[],
                   args?:{duration?:number; promptAnswers?:{[key:string]:string}; additionalFields?:{[key:string]:string}, tags?:{[key:string]:string}}):void {
        if (!eventName) {
            throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "ALP event name must not be null");
        }

        let learner:Learner = this.delegate.getLearner(learnerId);
        if (!learner) {
            throw new KidaptiveError(KidaptiveErrorCode.LEARNER_NOT_FOUND, "Learner " + learnerId + " not found");
        }

        let prompt:Prompt = this.delegate.getEntityByUri(EntityType.prompt, promptUri);
        if (!prompt) {
            throw new KidaptiveError(KidaptiveErrorCode.URI_NOT_FOUND, "Prompt " + promptUri + " not found");
        }

        let game:Game = this.delegate.getEntityById(EntityType.game, prompt.gameId);

        if (!attempts) {
            attempts = [];
        }

        if (!args) {
            args = {}
        }

        if (!args.promptAnswers) {
            args.promptAnswers = {};
        }

        //validate all categories associated with a prompt are reported
        let promptAnswers = JSON.parse(JSON.stringify(args.promptAnswers)); //deep copy

        for (let pa of this.delegate.getPromptCategoriesForPrompt(promptUri) || []) {
            let category: Category = this.delegate.getEntityById(EntityType.category, pa.categoryId);

            let value: string = promptAnswers[category.uri];
            if (!value) {
                throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Missing category " + category.uri + " for prompt " + promptUri);
            }
            if (pa.instanceId) {
                let instance: Instance = this.delegate.getEntityByUri(EntityType.instance, value);
                if (!instance) {
                    throw new KidaptiveError(KidaptiveErrorCode.URI_NOT_FOUND, "Instance " + value + " not found");
                }
                let subCat: SubCategory = this.delegate.getEntityById(EntityType.subCategory, instance.subCategoryId);
                if (!subCat || subCat.categoryId != category.id) {
                    throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Category " + category.uri + " does not have instance " + value);
                }
            }
            delete promptAnswers[category.uri];
        }

        //validate all categories reported are associated with the prompt
        let extra = Object.keys(promptAnswers)[0];
        if (extra) {
            throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Category " + extra + " is not associated with prompt " + promptUri);
        }


        for (let a of attempts) {
            let item:Item = this.delegate.getEntityByUri(EntityType.item, a.itemURI);
            if (!item) {
                throw new KidaptiveError(KidaptiveErrorCode.URI_NOT_FOUND, "Item " + a.itemURI + " not found");
            }
            if (item.promptId != prompt.id) {
                throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Prompt " + promptUri + " does not have item " + a.itemURI);
            }
            if (!(a.outcome >= 0 && a.outcome <= 1)) {
                throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Outcome must be between 0 and 1 (inclusive)");
            }
        }

        let trial = this.delegate.getCurrentTrial(learnerId);

        if (!trial) {
            throw new KidaptiveError(KidaptiveErrorCode.TRIAL_NOT_OPEN, "Learner must have a open trial to report evidence");
        }

        let alp_event:AgentRequestEvents = this.generateBaseEvent();

        alp_event.type = AgentRequestEvents.TypeEnum.Result;
        alp_event.name = eventName;
        alp_event.learnerId = learner.id;
        if (game) {
            alp_event.gameURI = game.uri;
        }
        alp_event.promptURI = prompt.uri;
        alp_event.trialTime = trial.trialTime;
        alp_event.trialSalt = trial.trialSalt;

        alp_event.duration = args.duration;

        alp_event.attempts = attempts;
        alp_event.promptAnswers = args.promptAnswers;
        alp_event.additionalFields = args.additionalFields;
        alp_event.tags = args.tags;

        this.eventQueue.push(alp_event);
        this.storeEventQueue();

        let skipIRT = false;
        if (args.tags) {
            if (args.tags['SKIP_IRT'] && args.tags['SKIP_IRT'].toUpperCase() == 'TRUE') {
                skipIRT = true;
            }
            if (args.tags['SKIP_LEARNER_IRT'] && args.tags['SKIP_LEARNER_IRT'].toUpperCase() == 'TRUE') {
                skipIRT = true;
            }
        }

        if (!skipIRT) {
            for (let a of attempts) {
                this.delegate.processEvidence(learnerId, a);
            }
        }

    }

    reportBehavior(eventName:string, args:{learnerId?:number; gameUri?:string; promptUri?:string; duration?:number; additionalFields?:{[key:string]:string}, tags?:{[key:string]:string}} = {}):void {
        if (!eventName) {
            throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "ALP event name must not be null");
        }

        if (!args) {
            args = {};
        }

        let learner: Learner;
        if (args.learnerId) {
            learner = this.delegate.getLearner(args.learnerId); //check that learner exists
            if (!learner) {
                throw new KidaptiveError(KidaptiveErrorCode.LEARNER_NOT_FOUND, "Learner " + args.learnerId + " not found");
            }
        }

        let prompt:Prompt;
        if (args.promptUri) {
            prompt = this.delegate.getEntityByUri(EntityType.prompt, args.promptUri);
            if (!prompt) {
                throw new KidaptiveError(KidaptiveErrorCode.URI_NOT_FOUND, "Prompt " + args.promptUri + " not found");
            }
        }

        let game:Game;
        if (args.gameUri) {
            game = this.delegate.getEntityByUri(EntityType.game, args.gameUri);
            if (!game) {
                throw new KidaptiveError(KidaptiveErrorCode.URI_NOT_FOUND, "Game " + args.gameUri + " not found");
            }
        } else if (prompt) {
            game = this.delegate.getEntityById(EntityType.game, prompt.gameId);
        }

        //make sure game and prompt don't conflict
        if (game && prompt && (game.id != prompt.gameId)) {
            throw new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Reported promptUri does not match reported gameUri.");
        }

        let alp_event:AgentRequestEvents = this.generateBaseEvent();
        alp_event.type = AgentRequestEvents.TypeEnum.Behavior;
        alp_event.name = eventName;
        alp_event.learnerId = args.learnerId;
        if (game) {
            alp_event.gameURI = game.uri;
        }
        if (prompt) {
            alp_event.promptURI = prompt.uri;
        }
        alp_event.duration = args.duration;
        alp_event.additionalFields = args.additionalFields;
        alp_event.tags = args.tags;

        this.eventQueue.push(alp_event);
        this.storeEventQueue();


    }

    flushEvents(): void {
        for (let event of this.eventQueue) {
            let payload = new AgentRequest();
            payload.appInfo = this.delegate.getAppInfo();
            payload.deviceInfo = this.delegate.getDeviceInfo();
            payload.events = [event];
            this.payloadQueue.push(payload);
        }
        this.eventQueue = [];
        this.storeEventQueue();

        let currentUser = this.delegate.getCurrentUser();
        if (!currentUser) {
            return;
        }

        for (let payload of this.payloadQueue) {
            let p: Promise<AgentRequest> = this.learnerApi.ingestionPost(currentUser.apiKey, payload).then(function() {
                return payload;
            }).catch(function(error) {
                if (error.response) {
                    if (error.response.statusCode == 400) { // bad/invalid data, not recoverable
                        return Promise.reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER,
                            "error: " + error.response.statusMessage + "; payload: " + payload));
                    } else if (error.response.statusCode == 401) { // bad api-key, not recoverable
                        return Promise.reject(new KidaptiveError(KidaptiveErrorCode.API_KEY_ERROR,
                            "error: " + error.response.statusMessage + "; payload: " + payload));
                    } else {
                        this.payloadQueue.push(payload); // possibly recoverable
                        this.storePayloadQueue();
                        return Promise.reject(new KidaptiveError(KidaptiveErrorCode.WEB_API_ERROR,
                            "error: " + error.response.statusMessage + "; payload: " + payload));
                    }
                } else {
                    this.payloadQueue.push(payload); // possibly recoverable
                    this.storePayloadQueue();
                    return Promise.reject(new KidaptiveError(KidaptiveErrorCode.GENERIC_ERROR,
                        "error: " + error + "; payload: " + payload));
                }
            }.bind(this));
            this.delegate.payloadProcessed(p);
        }
        this.payloadQueue = []; //clear payload queue
        this.storePayloadQueue();
    }

    private autoFlush() {
        this.flushEvents();
        setTimeout(this.autoFlush.bind(this), this.flushInterval); //schedule next flush
    }

    private generateBaseEvent(): AgentRequestEvents{
        let currentUser:User = this.delegate.getCurrentUser();
        if (!currentUser) {
            throw new KidaptiveError(KidaptiveErrorCode.NOT_LOGGED_IN, "User not logged in");
        }

        let event = new AgentRequestEvents();
        event.version = this.delegate.getEventVersion();
        event.userId = currentUser.id;
        event.eventTime = Date.now();
        event.eventSequence = this.eventSequence++;
        return event;
    }

    private storeEventQueue() {
        localStorage.setItem("kidaptive.alp.events.eventQueue", JSON.stringify(this.eventQueue));
    }

    loadStoredEventQueue() {
        this.eventQueue = JSON.parse(localStorage.getItem("kidaptive.alp.events.eventQueue")) || [];
    }

    private storePayloadQueue() {
        localStorage.setItem("kidaptive.alp.events.payloadQueue", JSON.stringify(this.payloadQueue));
    }

    loadStoredPayloadQueue() {
        this.payloadQueue = JSON.parse(localStorage.getItem("kidaptive.alp.events.payloadQueue")) || [];
    }
}

export {EventManagerDelegate, EventManager};