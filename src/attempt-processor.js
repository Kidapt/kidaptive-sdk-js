
import Constants from './constants';
import HttpClient from './http-client';
import Irt from './irt';
import LearnerManager from './learner-manager';
import ModelManager from './model-manager';
import State from './state';
import Utils from './utils';

class KidaptiveSdkAttemptProcessor {
  
  /**
   * Process an attempt for the current learner
   * This function is a private function within the SDK called when events with attempts are processed
   * 
   * @param {object} attempt
   *   The attempt object to be processed
   */
  processAttempt(attempt) {
    //check learner
    const learner = State.get('learner');
    if (!learner || !learner.id) {
      //log a warning
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: processAttempt called with no active learner selected.');       
      }
      return;
    }

    //validate attempt is an object
    if (!Utils.isObject(attempt)) {
      //log a warning
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: processAttempt called with a non object attempt.');       
      }
      return;
    }

    //validate item uri is a string
    if (!Utils.isString(attempt.itemURI)) {
      //log a warning
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: processAttempt called with an invalid itemUri.');       
      }
      return
    }

    //get item
    const item = ModelManager.getItemByUri(attempt.itemURI);

    //if item doesn't exist, or item dimension / localDimension, something went wrong
    if (!item || !item.localDimension || !item.localDimension.dimension) {
      //log a warning
      if (Utils.checkLoggingLevel('warn') && console && console.log) {
        console.log('Warning: processAttempt called with an invalid itemUri.');       
      }
      return;
    }

    //get abilities
    const localAbility = LearnerManager.getLocalAbilityEstimate(item.localDimension.uri);
    const latentAbility = LearnerManager.getLatentAbilityEstimate(item.localDimension.dimension.uri);

    //process data in IRT to get new ability
    const estimation = Irt.estimate(!!attempt.outcome, item.mean, localAbility.mean, localAbility.standardDeviation);

    //new ability is based off latentAbility
    const newAbility = Utils.copyObject(latentAbility);

    //set new ability values
    newAbility.mean = estimation.post_mean;
    newAbility.standardDeviation = estimation.post_sd;
    newAbility.timestamp = State.get('trialTime') || 0;

    //setup variables to update abilities based off of latent abilities
    const newAbilities = State.get('latentAbilities.' + learner.id) || [];

    //if the ability already exists, replace it in the array
    const updateAbilityIndex = Utils.findItemIndex(newAbilities, newAbility => newAbility.dimension.id === latentAbility.dimension.id);
    if (updateAbilityIndex !== -1) {
      newAbilities[updateAbilityIndex] = newAbility;

    //if ability doesn't exist, push new ability onto array
    } else {
      newAbilities.push(newAbility);
    }

    //update latentAbilities in state
    State.set('latentAbilities.' + learner.id, newAbilities);

    //prepare data for local storage cache, removing dimension references
    newAbilities.forEach(newAbility => {
      newAbility.dimensionId = newAbility.dimension && newAbility.dimension.id;
      delete newAbility.dimension;
    });

    //update local storage cache
    const cacheKey = HttpClient.getCacheKey(HttpClient.getRequestSettings('GET', Constants.ENDPOINT.ABILITY , {learnerId: learner.id}));
    Utils.localStorageSetItem(cacheKey, newAbilities);
  }

}

export default new KidaptiveSdkAttemptProcessor();
