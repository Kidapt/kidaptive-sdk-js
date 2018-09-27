'use strict';
import TestUtils from '../test-utils';
import TestConstants from './test-constants';
import KidaptiveSdk from '../../../src/index';
import RandomRecommender from '../../../src/recommenders/random';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('randomRecommender', () => {

    const recommender = new RandomRecommender(KidaptiveSdk);
    const games = [
      {id: 1, uri: 'game/1'},
      {id: 2, uri: 'game/2'},
      {id: 3, uri: 'game/3'}
    ];
    const defaultParams = {
      gameUri: games[0].uri,
      maxResults: 10, 
      excludedPromptUris: ['exclude'], 
      includedPromptUris: ['include']
    };
    const prompts = [
      {id: 1, uri: 'prompt/1', game: games[0]},
      {id: 2, uri: 'prompt/2', game: games[0]},
      {id: 3, uri: 'prompt/3', game: games[0]},
      {id: 4, uri: 'prompt/4', game: games[0]},
      {id: 5, uri: 'prompt/5', game: games[0]},
      {id: 6, uri: 'prompt/6', game: games[0]},
      {id: 7, uri: 'prompt/7', game: games[0]},
      {id: 8, uri: 'prompt/8', game: games[0]},
      {id: 9, uri: 'prompt/9', game: games[0]},
      {id: 10, uri: 'prompt/10', game: games[0]},
      {id: 11, uri: 'prompt/11', game: games[0]},
      {id: 12, uri: 'prompt/12', game: games[0]},
      {id: 13, uri: 'prompt/13', game: games[0]},
      {id: 14, uri: 'prompt/14', game: games[0]},
      {id: 15, uri: 'prompt/15', game: games[0]},
      {id: 16, uri: 'prompt/16', game: games[0]},
      {id: 17, uri: 'prompt/17', game: games[0]},
      {id: 18, uri: 'prompt/18', game: games[0]},
      {id: 19, uri: 'prompt/19', game: games[0]},
      {id: 20, uri: 'prompt/20', game: games[0]},
      {id: 21, uri: 'prompt/21', game: games[1]},
      {id: 22, uri: 'prompt/22', game: games[1]}
    ];
    const gameUriToModel = {};
    games.forEach(game => {
      gameUriToModel[game.uri] = game;
    });
    const promptUriToModel = {};
    prompts.forEach(prompt => {
      promptUriToModel[prompt.uri] = prompt;
    });

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setState({
        uriToModel: {
          game: gameUriToModel,
          prompt: promptUriToModel
        },
        modelListLookup: {
          games: games,
          prompt: prompts
        }
      });
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('Validate', () => {

      describe('params is required and must be an object', () => {
        const testFunction = parameter => {
          const result = recommender.getRecommendation(parameter);
          if (result.error) { throw result.error; }
        };
        TestUtils.validateProperty(testFunction, 'object', true, [defaultParams], [{}]);
      }); //END params is required and must be an object

      describe('gameUri is required and must be a string', () => {
        const testFunction = parameter => {
          const params = Utils.copyObject(defaultParams);
          params.gameUri = parameter;
          const result = recommender.getRecommendation(params);
          if (result.error) { throw result.error; }
        };
        TestUtils.validateProperty(testFunction, 'string', true, [games[0].uri], ['', 'random string']);
      }); //END gameUri is required and must be a string

      describe('maxResults must be a positive integer if it is defined', () => {
        const testFunction = parameter => {
          const params = Utils.copyObject(defaultParams);
          params.maxResults = parameter;
          const result = recommender.getRecommendation(params);
          if (result.error) { throw result.error; }
        };
        TestUtils.validateProperty(testFunction, 'number', false, [1, 100], [0, -1, 1.5]);
      }); //END maxResults must be a positive integer if it is defined

      describe('excludedPromptUris must be an array if defined', () => {
        const testFunction = parameter => {
          const params = Utils.copyObject(defaultParams);
          params.excludedPromptUris = parameter;
          const result = recommender.getRecommendation(params);
          if (result.error) { throw result.error; }
        };
        TestUtils.validateProperty(testFunction, 'array', false);
      }); //END excludedPromptUris must be an array if defined

      describe('excludedPromptUris array must only contain strings.', () => {
        const testFunction = parameter => {
          const params = Utils.copyObject(defaultParams);
          params.excludedPromptUris = [parameter];
          const result = recommender.getRecommendation(params);
          if (result.error) { throw result.error; }
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      }); //END excludedPromptUris array must only contain strings

      describe('includedPromptUris must be an array if defined', () => {
        const testFunction = parameter => {
          const params = Utils.copyObject(defaultParams);
          params.includedPromptUris = parameter;
          const result = recommender.getRecommendation(params);
          if (result.error) { throw result.error; }
        };
        TestUtils.validateProperty(testFunction, 'array', false);
      }); //END includedPromptUris must be an array if defined

      describe('includedPromptUris array must only contain strings.', () => {
        const testFunction = parameter => {
          const params = Utils.copyObject(defaultParams);
          params.includedPromptUris = [parameter];
          const result = recommender.getRecommendation(params);
          if (result.error) { throw result.error; }
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      }); //END includedPromptUris array must only contain strings

      it('learner is required', () => {
        const result1 = recommender.getRecommendation(defaultParams);
        Should(result1.error).equal(undefined);
        TestUtils.setState({learnerId: undefined});
        const result2 = recommender.getRecommendation(defaultParams);
        Should(result2.error).not.equal(undefined);
      });

    }); //END Validate

    it('gameUri determines what prompts to use', () => {
      const params1 = {gameUri: games[0].uri, maxResults: 20};
      const result1Expected = prompts.filter(prompt => prompt.game.uri === params1.gameUri).length;
      const result1 = recommender.getRecommendation(params1);
      Should(result1.recommendations).not.length(0);
      Should(result1.recommendations).length(result1Expected);
      const params2 = {gameUri: games[1].uri, maxResults: 20};
      const result2Expected = prompts.filter(prompt => prompt.game.uri === params2.gameUri).length;
      const result2 = recommender.getRecommendation(params2);
      Should(result2.recommendations).not.length(0);
      Should(result2.recommendations).length(result2Expected);
      const params3 = {gameUri: games[2].uri, maxResults: 20};
      const result3Expected = prompts.filter(prompt => prompt.game.uri === params3.gameUri).length;
      const result3 = recommender.getRecommendation(params3);
      Should(result3.recommendations).length(0);
      Should(result3.recommendations).length(result3Expected);
    });

    it('random prompts are selected', () => {
      const params = {gameUri: games[0].uri};
      const result1 = recommender.getRecommendation(params);
      const result2 = recommender.getRecommendation(params);
      //this can cause an invalid failure, but is 1 / 6.7 quadrillion chance
      Should(result1.recommendations).not.deepEqual(result2.recommendations);
    });

    it('maxResults limits number of results', () => {
      const params1 = {gameUri: games[0].uri, maxResults: 20};
      const result1Expected = prompts.filter(prompt => prompt.game.uri === params1.gameUri).length;
      const result1 = recommender.getRecommendation(params1);
      Should(result1.recommendations).length(result1Expected);
      Should(result1.recommendations.length).greaterThan(5);
      const params2 = {gameUri: games[0].uri, maxResults: 5};
      const result2 = recommender.getRecommendation(params2);
      Should(result2.recommendations).length(5);
    });

    it('includedPromptUris determines the set of prompts to use', () => {
      const params = {
        gameUri: games[0].uri, 
        includedPromptUris: [prompts[0].uri, prompts[1].uri, prompts[2].uri]
      };
      const result = recommender.getRecommendation(params);
      Should(result.recommendations).length(params.includedPromptUris.length);
    });

    it('invalid promptUris in includedPromptUris are ignored', () => {
      const params = {
        gameUri: games[0].uri, 
        includedPromptUris: [prompts[0].uri, prompts[1].uri, prompts[2].uri, 'invalid']
      };
      const result = recommender.getRecommendation(params);
      Should(result.recommendations).length(params.includedPromptUris.length - 1);
    });

    it('excludedPromptUris determines the set of prompts to use', () => {
      const params = {
        gameUri: games[0].uri, 
        maxResults: 100, 
        excludedPromptUris: [prompts[0].uri, prompts[1].uri, prompts[2].uri]
      };
      const resultExpected = prompts.filter(prompt => prompt.game.uri === params.gameUri).length;
      const result = recommender.getRecommendation(params);
      Should(result.recommendations).length(resultExpected - params.excludedPromptUris.length);
    });

    it('invalid promptUris in excludedPromptUris are ignored', () => {
      const params = {
        gameUri: games[0].uri, 
        maxResults: 100, 
        excludedPromptUris: [prompts[0].uri, prompts[1].uri, prompts[2].uri, 'invalid']
      };
      const resultExpected = prompts.filter(prompt => prompt.game.uri === params.gameUri).length;
      const result = recommender.getRecommendation(params);
      Should(result.recommendations).length(resultExpected - params.excludedPromptUris.length + 1);
    });

    it('excludedPromptUris are removed from prompt list set by includedPromptUris', () => {
      const params = {
        gameUri: games[0].uri, 
        includedPromptUris: [prompts[0].uri, prompts[1].uri, prompts[2].uri],
        excludedPromptUris: [prompts[0].uri]
      };
      const result = recommender.getRecommendation(params);
      Should(result.recommendations).length(params.includedPromptUris.length - params.excludedPromptUris.length);
    });

  }); //END randomRecommender

}; //END export
