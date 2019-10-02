import Error from '../error';
import State from '../state';
import Utils from '../utils';

const FIXED_ITEM_DISCRIMINATION = 1;
const FIXED_ITEM_GUESSING_PARAM = 0;

class KidaptiveSdkMaximumItemInformationRecommender {
  constructor(sdk) {
    this.sdk = sdk;
  }

  /**
   * Returns recommendations based on the prompts associated with the local dimension 
   * and the learner's ability estimate for that local dimension. The recommendation
   * is chosen so as to maximize the item information function.
   *
   * @param {string} localDimensionUri
   *   The localDimensionUri to be used for getting associated prompts and the learner's ability estimate
   *
   * @param {number} targetSuccessProbability
   *   IGNORED - argument is kept for consistency with LearnerManager.getSuggestedPrompts() 
   *
   * @param {number} maxResults
   *   The maximum number of recommendations that are desired
   *
   * @param {array} excludedPromptUris
   *   An array of promptUris which determine which prompts should be excluded from consideration when generating the recommendations
   *
   * @param {array} includedPromptUris
   *   An array of promptUris which determine which prompts should be included from used when generating the recommendations.
   *   ExcludedPromptUris will take priority and potentially exclude items from this list.
   * 
   * @return
   *   An array of recommendations in the form of an array of prompt uris
   */
  getSuggestedPrompts(localDimensionUri, targetSuccessProbability, maxResults, excludedPromptUris, includedPromptUris) {
    Utils.checkTier(3);

    //get recommendation
    const result = this.getRecommendation({localDimensionUri, maxResults, excludedPromptUris, includedPromptUris});

    //if an error is present, throw it
    if (result.error) {
      throw result.error;
    }

    //return recommendations
    return result.recommendations;
  }

  getRecommendation(params = {}) {

    //wrap in try catch statement in order to return error
    try {

      //check learner
      if (this.sdk.learnerManager.getActiveLearner() === undefined) {
        throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'No active learner selected.');
      }

      //validate params
      if (!Utils.isObject(params)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Params must be an object.');
      }

      //destructure params with defaults
      const {localDimensionUri, excludedPromptUris, includedPromptUris} = params;
      const maxResults = params.maxResults == null ? 10 : params.maxResults;

      //validate localDimensionUri
      if (localDimensionUri == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'localDimensionUri is required.');
      }
      if (!Utils.isString(localDimensionUri)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'localDimensionUri must be a string.');
      }
      const localDimension = this.sdk.modelManager.getLocalDimensionByUri(localDimensionUri);
      if (!localDimension) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'localDimensionUri does not map to a local dimension.');
      }

      //validate max results
      if (!Utils.isInteger(maxResults)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'maxResults must be an integer.');   
      }
      if (maxResults < 1) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'maxResults must be an integer greater than 0.');   
      }

      //validate excludedPromptUris
      if (excludedPromptUris != null) {
        if (!Utils.isArray(excludedPromptUris)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'excludedPromptUris must be an array.');   
        }
        excludedPromptUris.forEach(promptUri => {
          if (!Utils.isString(promptUri)) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'excludedPromptUris must be an array of strings.');   
          }
        });
      }

      //validate includedPromptUris
      if (includedPromptUris != null) {
        if (!Utils.isArray(includedPromptUris)) {
          throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'includedPromptUris must be an array.');   
        }
        includedPromptUris.forEach(promptUri => {
          if (!Utils.isString(promptUri)) {
            throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'includedPromptUris must be an array of strings.');   
          }
        });
      }

      // get and validate d (IRT scaling parameter)
      let options = State.get('options');
      const irtScalingFactor = (options == null || options.irtScalingFactor == null) ? 1.7 : options.irtScalingFactor;
      if (!Utils.isNumber(irtScalingFactor)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'irtScalingFactor must be a number.');   
      }

      //get ability estimate
      const localAbilityEstimate = this.sdk.learnerManager.getLocalAbilityEstimate(localDimensionUri);

      //setup results variable
      let items = this.sdk.modelManager.getItems().filter(item => item.localDimension && (item.localDimension.uri === localDimensionUri));
      
      //filter items based on included prompts
      if (includedPromptUris) {
        //filter items based on included prompts
        items = items.filter(item => includedPromptUris.indexOf(item.prompt && item.prompt.uri) !== -1);
      }

      //filter items based on excludedPromptsUris
      if (excludedPromptUris && excludedPromptUris.length) {
        items = items.filter(item => excludedPromptUris.indexOf(item.prompt && item.prompt.uri) === -1);
      }

      //randomize list of items
      items = items.map(item => ({sort: Math.random(), item: item}))
        .sort((objectA, objectB) => objectA.sort - objectB.sort)

      //sort in order of decreasing iif
        .map(object => ({
          sort: this.iif(FIXED_ITEM_DISCRIMINATION, object.item.mean, FIXED_ITEM_GUESSING_PARAM, irtScalingFactor, localAbilityEstimate.mean),
          item: object.item
        }))
        .sort((objectA, objectB) => objectB.sort - objectA.sort)


      //slice the items array
        .slice(0, maxResults);

      //map the items to the recommendation object
      const recommendations = items.map(object => ({
          itemUri: object.item.uri,
          promptUri: object.item.prompt && object.item.prompt.uri,
          itemInformation: object.sort
        }));

      //return recommendation
      return {
        recommendations,
        type: 'prompt'
      };

    } catch (error) {

      //if there was an error, return it
      return {
        error
      };
    }
  }

  iif(a, b, c, d, theta) {
    let p = c + (1 - c) / (1 + Math.exp(a * d * (-theta + b)));
    if (p <= 0 | p >= 1) {
        return 0;
    } 
    let q = 1 - p;
    let x = a * (p - c) / (1 - c);
    let res = x * x * (q / p);
    return res;
  }
}

export default KidaptiveSdkMaximumItemInformationRecommender;
