import {KidaptiveError, KidaptiveErrorCode} from "./kidaptive_error";
import {EntityType} from "./kidaptive_model_manager";
import {Learner} from "../../../swagger-client/api";
/**
 * Created by solomonliu on 7/18/16.
 */

interface TrialManagerDelegate {
    getLearner:(learnerId:number) => Learner;
    getEntityByUri: (type: EntityType, uri:string) => any;
}

class KidaptiveTrial {
    constructor(public trialTime:number, public trialSalt:number){}
}

class TrialManager {
    private trialMap: {[key: number]: {trial: KidaptiveTrial, dimensionsReset:{[key:string]:boolean}}} = {};

    constructor(private delegate:TrialManagerDelegate){
        if (!delegate) {
            throw new KidaptiveError(KidaptiveErrorCode.MISSING_DELEGATE, "TrialManagerDelegate not found");
        }
    };

    //start a trial for specified learner, implicitly close previously open trial for this learner
    startTrial(learnerId:number): void {
        if (!this.delegate.getLearner(learnerId)) {
            throw new KidaptiveError(KidaptiveErrorCode.LEARNER_NOT_FOUND, "Learner " + learnerId + " not found");
        }
        this.trialMap[learnerId] = {trial: new KidaptiveTrial(Date.now(), Math.floor(Math.random() * Math.pow(2,32)) - Math.pow(2,31)), dimensionsReset:{}};
    }

    getCurrentTrial(learnerId:number): {trialTime:number, trialSalt:number} {
        let trialInfo = this.trialMap[learnerId];
        if (trialInfo) {
            return trialInfo.trial;
        }
        return null;
    }

    closeTrial(learnerId:number): void {
        delete this.trialMap[learnerId];
    }

    closeAllTrials():void {
        this.trialMap = {};
    }

    resetDimension(learnerId:number, localDimensionUri:string):void {
        if (!this.delegate.getLearner(learnerId)) {
            throw new KidaptiveError(KidaptiveErrorCode.LEARNER_NOT_FOUND, "Learner " + learnerId + " not found");
        }

        if (!this.delegate.getEntityByUri(EntityType.localDimension, localDimensionUri)) {
            throw new KidaptiveError(KidaptiveErrorCode.URI_NOT_FOUND, "Dimension " + localDimensionUri + " not found");
        }

        if (!this.isDimensionReset(learnerId, localDimensionUri)) {
            this.trialMap[learnerId].dimensionsReset[localDimensionUri] = true;
        }
    }

    isDimensionReset(learnerId:number, localDimensionUri:string):boolean {
        let trialInfo = this.trialMap[learnerId];
        if (trialInfo) {
            return trialInfo.dimensionsReset[localDimensionUri] == true;
        } else {
            throw new KidaptiveError(KidaptiveErrorCode.TRIAL_NOT_OPEN, "No session open for learner" + learnerId);
        }
    }
}

export {TrialManagerDelegate, KidaptiveTrial, TrialManager}