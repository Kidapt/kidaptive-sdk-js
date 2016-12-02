import * as irt from "../../js/main/irt/irt";
import {KidaptiveError} from "./kidaptive_error";
import {KidaptiveErrorCode} from "./kidaptive_error";
import {KidaptiveTrial} from "./kidaptive_trial_manager";
import {EntityType} from "./kidaptive_model_manager";
import {LocalAbility, LatentAbility} from "../../../swagger-client/api";
import {Item} from "../../../swagger-client/api";
import {LocalDimension} from "../../../swagger-client/api";
import {Dimension} from "../../../swagger-client/api";
/**
 * Created by solomonliu on 8/11/16.
 */

interface AttemptProcessorDelegate {
    getLocalAbility:(learnerId:number, localDimensionUri:string)=>LocalAbility;
    getLatentAbility:(learnerId:number, dimensionUri:string)=>LatentAbility;
    getEntityByUri:(type:EntityType, uri:string)=>any;
    getEntityById:(type:EntityType, id:number)=>any;
    getCurrentTrial:(learnerId:number)=>KidaptiveTrial

    isDimensionReset:(learnerId:number, localDimensionUri:string) => boolean;
    resetDimension:(learnerId:number, localDimensionUri:string)=> void;

    updateLocalAbility(learnerId:number, localDimensionUri:string, estimate:LocalAbility):void;
    updateLatentAbility(learnerId:number, dimensionUri:string, estimate:LatentAbility):void;
}

class AttemptProcessor {
    constructor(private delegate:AttemptProcessorDelegate){
        if (!delegate) {
            throw new KidaptiveError(KidaptiveErrorCode.MISSING_DELEGATE, "AttemptProcessorDelegate not found");
        }
    }

    processEvidence(learnerId:number, itemUri:string, outcome:number):void {
        let item:Item = this.delegate.getEntityByUri(EntityType.item, itemUri);
        if (!item) {
            return;
        }

        let localDim:LocalDimension = this.delegate.getEntityById(EntityType.localDimension, item.localDimensionId);
        if (!localDim) {
            return;
        }

        let dimension:Dimension = this.delegate.getEntityById(EntityType.dimension, localDim.dimensionId);
        if (!dimension) {
            return;
        }

        let localAbility = this.delegate.getLocalAbility(learnerId, localDim.uri);
        if (!localAbility) {
            return;
        }

        let latentAbility = this.delegate.getLatentAbility(learnerId, dimension.uri);
        if (!latentAbility) {
            return;
        }

        let trial = this.delegate.getCurrentTrial(learnerId);
        if (!trial) {
            return;
        }

        //reset the prior SD on first attempt on this local dimension in this session
        let priorSd = localAbility.standardDeviation;
        let priorMean = localAbility.mean;
        if (!this.delegate.isDimensionReset(learnerId, localDim.uri)) {
            priorSd = latentAbility.standardDeviation;
            priorMean = latentAbility.mean;
            if(priorSd < .65) {
                priorSd = .65;
            }
        }

        let difficulty = item.mean;
        if (difficulty == null) {
            return;
        }

        let postMean = irt._malloc(8);
        let postSd = irt._malloc(8);
        irt._estimate(outcome != 0, difficulty, priorMean, priorSd, postMean, postSd);

        let newLocalAbility = new LocalAbility();
        newLocalAbility.mean = irt.getValue(postMean, 'double');
        newLocalAbility.standardDeviation = irt.getValue(postSd, 'double');
        newLocalAbility.localDimensionId = localDim.id;
        newLocalAbility.timestamp = trial.trialTime;

        //copy latent ability from local ability
        let newLatentAbility = new LatentAbility();
        newLatentAbility.mean = newLocalAbility.mean;
        newLatentAbility.standardDeviation = newLocalAbility.standardDeviation;
        newLatentAbility.dimensionId = dimension.id;
        newLatentAbility.timestamp = newLocalAbility.timestamp;

        irt._free(postMean);
        irt._free(postSd);

        this.delegate.updateLocalAbility(learnerId, localDim.uri, newLocalAbility);
        this.delegate.updateLatentAbility(learnerId, dimension.uri, newLatentAbility);
        this.delegate.resetDimension(learnerId, localDim.uri);
    }
}

export {AttemptProcessorDelegate, AttemptProcessor};