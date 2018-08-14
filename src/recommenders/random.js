import Error from '../error';
import Utils from '../utils';

class KidaptiveSdkRecommenderRandom {
  constructor(sdk) {
    this.sdk = sdk;
  }

  getRecommendation(params) {

    //wrap in try catch statement in order to return error
    try {

      //check learner
      if (this.sdk.learnerManager.getActiveLearner() === undefined) {
        throw new Error(Error.ERROR_CODES.ILLEGAL_STATE, 'OptimalDifficulty getRecommendation called with no active learner selected.');
      }

      //validate params
      if (!Utils.isObject(params)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'Params must be an object.');
      }

      //destructure params with defaults
      const {
        gameUri,
        maxResults = 10,
        excludedPromptUris,
        includedPromptUris
      } = params;

      //validate gameUri
      if (gameUri == null) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'gameUri is required.');
      }
      if (!Utils.isString(gameUri)) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'gameUri must be a string.');
      }
      const game = this.sdk.modelManager.getGameByUri(gameUri);
      if (!game) {
        throw new Error(Error.ERROR_CODES.INVALID_PARAMETER, 'gameUri does not map to a game.');
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

      //setup results variable
      let prompts;

      //get prompts based on included prompts
      if (includedPromptUris) {
        //map prompts to include list
        prompts = includedPromptUris.map(promptUri => this.sdk.modelManager.getPromptByUri(promptUri));
        //filter included array list based on specified gameUri
        prompts = prompts.filter(prompt => prompt && prompt.game && (prompt.game.uri === gameUri));

      //or get prompts based off gameUri
      } else {
        prompts = this.sdk.modelManager.getPromptsByGameUri(gameUri);
      }

      //filter prompts based on excludedPromptsUris
      if (excludedPromptUris && excludedPromptUris.length) {
        prompts = prompts.filter(prompt => excludedPromptUris.indexOf(prompt.uri) === -1);
      }

      //randomize the list of prompts
      prompts = prompts.map((prompt) => ({sort: Math.random(), prompt: prompt}))
        .sort((objectA, objectB) => objectA.sort - objectB.sort)

      //slice the prompts array to select the max results
        .slice(0, maxResults);


      //map the prompts to the recommendation object
      const recommendations = prompts.map(object => ({
          promptUri: object.prompt.uri
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

export default KidaptiveSdkRecommenderRandom;
