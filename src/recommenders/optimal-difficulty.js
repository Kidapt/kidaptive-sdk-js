import Error from '../error';
import Utils from '../utils';

class KidaptiveSdkRecommenderOptimalDifficulty {
  constructor(sdk) {
    this.sdk = sdk;
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
      const targetSuccessProbability = params.targetSuccessProbability == null ? 0.7 : params.targetSuccessProbability;

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

      //validate target success probability
      if (!Utils.isNumber(targetSuccessProbability)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'targetSuccessProbability must be a number.');   
      }
      if (targetSuccessProbability < 0 || targetSuccessProbability > 1) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'targetSuccessProbability must be a number between  0 and 1.');   
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

      //sort by closeness to prob success
        .map(object => ({
          sort: 1 / (1 + Math.exp(Math.sqrt(8 / Math.PI) * (object.item.mean - localAbilityEstimate.mean))),
          item: object.item
        }))
        .sort((objectA, objectB) => Math.abs(objectA.sort - targetSuccessProbability) - Math.abs(objectB.sort - targetSuccessProbability))


      //slice the items array
        .slice(0, maxResults);

      //map the items to the recommendation object
      const recommendations = items.map(object => ({
          itemUri: object.item.uri,
          promptUri: object.item.prompt && object.item.prompt.uri,
          successProbability: object.sort
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
}

export default KidaptiveSdkRecommenderOptimalDifficulty;
