'use strict';
import TestUtils from '../test-utils';
import TestConstants from './test-constants';
import KidaptiveSdk from '../../../src/index';
import OptimalDifficultyRecommender from '../../../src/recommenders/optimal-difficulty';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('optimalDifficultyRecommender', () => {

    const recommender = new OptimalDifficultyRecommender(KidaptiveSdk);
    const dimensions = [
      {id: 1, uri: 'dimension/1'}
    ];
    const localDimensions = [
      {id: 1, uri: 'local-dimension/1', dimension: dimensions[0]},
      {id: 2, uri: 'local-dimension/2', dimension: dimensions[0]},
      {id: 3, uri: 'local-dimension/3', dimension: dimensions[0]},
    ];
    const defaultParams = {
      localDimensionUri: localDimensions[0].uri,
      maxResults: 10, 
      excludedPromptUris: ['exclude'], 
      includedPromptUris: ['include'],
      targetSuccessProbability: 0.5
    }
    const prompts = [
      {id: 1, uri: 'prompt/1'},
      {id: 2, uri: 'prompt/2'},
      {id: 3, uri: 'prompt/3'},
      {id: 4, uri: 'prompt/4'},
      {id: 5, uri: 'prompt/5'},
      {id: 6, uri: 'prompt/6'},
      {id: 7, uri: 'prompt/7'},
      {id: 8, uri: 'prompt/8'},
      {id: 9, uri: 'prompt/9'},
      {id: 10, uri: 'prompt/10'},
      {id: 11, uri: 'prompt/11'},
    ];
    const items = [
      {id: 1, uri: 'item/1', localDimension: localDimensions[0], prompt: prompts[0], mean: -2},
      {id: 2, uri: 'item/2', localDimension: localDimensions[1], prompt: prompts[0], mean: -2},

      {id: 3, uri: 'item/3', localDimension: localDimensions[0], prompt: prompts[1], mean: -1.5},
      {id: 4, uri: 'item/4', localDimension: localDimensions[1], prompt: prompts[1], mean: -1.5},

      {id: 5, uri: 'item/5', localDimension: localDimensions[0], prompt: prompts[2], mean: -1.25},
      {id: 6, uri: 'item/6', localDimension: localDimensions[0], prompt: prompts[3], mean: -1},
      {id: 7, uri: 'item/7', localDimension: localDimensions[0], prompt: prompts[4], mean: -0.5},
      {id: 8, uri: 'item/8', localDimension: localDimensions[0], prompt: prompts[5], mean: 0},
      {id: 9, uri: 'item/9', localDimension: localDimensions[0], prompt: prompts[6], mean: 0.5},
      {id: 10, uri: 'item/10', localDimension: localDimensions[0], prompt: prompts[7], mean: 1},
      {id: 11, uri: 'item/11', localDimension: localDimensions[0], prompt: prompts[8], mean: 1.25},
      {id: 12, uri: 'item/12', localDimension: localDimensions[0], prompt: prompts[9], mean: 1.5},
      {id: 13, uri: 'item/13', localDimension: localDimensions[0], prompt: prompts[10], mean: 2}
    ]
    const dimensionUriToModel = {};
    dimensions.forEach(dimension => {
      dimensionUriToModel[dimension.uri] = dimension;
    });
    const localDimensionUriToModel = {};
    localDimensions.forEach(localDimension => {
      localDimensionUriToModel[localDimension.uri] = localDimension;
    });
    const promptUriToModel = {};
    prompts.forEach(prompt => {
      promptUriToModel[prompt.uri] = prompt;
    });
    const itemUriToModel = {};
    items.forEach(item => {
      itemUriToModel[item.uri] = item;
    });

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setState({
        uriToModel: {
          diension: dimensionUriToModel,
          'local-dimension': localDimensionUriToModel,
          prompt: promptUriToModel,
          item: itemUriToModel
        },
        modelListLookup: {
          diension: dimensions,
          'local-dimension': localDimensions,
          prompt: prompts,
          item: items
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

      describe('localDimensionUri is required and must be a string', () => {
        const testFunction = parameter => {
          const params = Utils.copyObject(defaultParams);
          params.localDimensionUri = parameter;
          const result = recommender.getRecommendation(params);
          if (result.error) { throw result.error; }
        };
        TestUtils.validateProperty(testFunction, 'string', true, [localDimensions[0].uri], ['', 'random string']);
      }); //END localDimensionUri is required and must be a string

      describe('targetSuccessProbability must be a number between or equal to 0 and 1', () => {
        const testFunction = parameter => {
          const params = Utils.copyObject(defaultParams);
          params.targetSuccessProbability = parameter;
          const result = recommender.getRecommendation(params);
          if (result.error) { throw result.error; }
        };
        TestUtils.validateProperty(testFunction, 'number', false, [0, 1, 0.5], [-1, -0.1, 1.1]);
      }); //END targetSuccessProbability must be a number between or equal to 0 and 1

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

    it('localDimensionUri determines what prompts to use', () => {
      const params1 = {localDimensionUri: localDimensions[0].uri, maxResults: 20};
      const result1Expected = items.filter(item => item.localDimension.uri === params1.localDimensionUri).length;
      const result1 = recommender.getRecommendation(params1);
      Should(result1.recommendations).not.length(0);
      Should(result1.recommendations).length(result1Expected);
      const params2 = {localDimensionUri: localDimensions[1].uri, maxResults: 20};
      const result2Expected = items.filter(item => item.localDimension.uri === params2.localDimensionUri).length;
      const result2 = recommender.getRecommendation(params2);
      Should(result2.recommendations).not.length(0);
      Should(result2.recommendations).length(result2Expected);
      const params3 = {localDimensionUri: localDimensions[2].uri, maxResults: 20};
      const result3Expected = items.filter(item => item.localDimension.uri === params3.localDimensionUri).length;
      const result3 = recommender.getRecommendation(params3);
      Should(result3.recommendations).length(0);
      Should(result3.recommendations).length(result3Expected);
    });

    describe('targetSuccessProbability determines difficulty of prompts that are selected', () => {

      beforeEach(() => {
        const abilityStateKey = 'latentAbilities.' + TestConstants.defaultState.learnerId;
        TestUtils.setState({
          [abilityStateKey]: [{dimension: dimensions[0], mean: 0, standardDeviation: 1, timestamp: 0}]
        });
      });

      it('targetSuccessProbability 1 returns prompts easiest to hardest', () => {
        const params = {localDimensionUri: localDimensions[0].uri, targetSuccessProbability: 1};
        const result = recommender.getRecommendation(params);
        let lastPromptId
        result.recommendations.forEach(rec => {
          const thisPromptId = promptUriToModel[rec.promptUri].id
          if (lastPromptId !== undefined) {
            Should(thisPromptId).greaterThan(lastPromptId);
          }
          lastPromptId = thisPromptId;
        });
      });

      it('targetSuccessProbability 0 returns prompts hardest to easiest', () => {
        const params = {localDimensionUri: localDimensions[0].uri, targetSuccessProbability: 0};
        const result = recommender.getRecommendation(params);
        let lastPromptId
        result.recommendations.forEach(rec => {
          const thisPromptId = promptUriToModel[rec.promptUri].id
          if (lastPromptId !== undefined) {
            Should(thisPromptId).lessThan(lastPromptId);
          }
          lastPromptId = thisPromptId;
        });

      });

      it('targetSuccessProbability 0.7 returns prompts ordered by closeness of probability of success', () => {
        const targetSuccessProbability = 0.7;
        const params = {localDimensionUri: localDimensions[0].uri, targetSuccessProbability};
        const result = recommender.getRecommendation(params);
        let lastDistance;
        result.recommendations.forEach(rec => {
          const thisDistance = Math.abs(rec.successProbability - targetSuccessProbability);
          if (lastDistance !== undefined) {
            Should(thisDistance).greaterThanOrEqual(lastDistance);
          }
          lastDistance = thisDistance;
        });
      });

    }); //END targetSuccessProbability determines difficulty of prompts that are selected

    it('maxResults limits number of results', () => {
      const params1 = {localDimensionUri: localDimensions[0].uri, maxResults: 20};
      const result1Expected = items.filter(item => item.localDimension.uri === params1.localDimensionUri).length;
      const result1 = recommender.getRecommendation(params1);
      Should(result1.recommendations).length(result1Expected);
      Should(result1.recommendations.length).greaterThan(5);
      const params2 = {localDimensionUri: localDimensions[0].uri, maxResults: 5};
      const result2 = recommender.getRecommendation(params2);
      Should(result2.recommendations).length(5);
    });

    it('includedPromptUris determines the set of prompts to use', () => {
      const params = {
        localDimensionUri: localDimensions[0].uri, 
        includedPromptUris: [prompts[0].uri, prompts[1].uri, prompts[2].uri]
      };
      const result = recommender.getRecommendation(params);
      Should(result.recommendations).length(params.includedPromptUris.length);
    });

    it('invalid promptUris in includedPromptUris are ignored', () => {
      const params = {
        localDimensionUri: localDimensions[0].uri, 
        includedPromptUris: [prompts[0].uri, prompts[1].uri, prompts[2].uri, 'invalid']
      };
      const result = recommender.getRecommendation(params);
      Should(result.recommendations).length(params.includedPromptUris.length - 1);
    });

    it('excludedPromptUris determines the set of prompts to use', () => {
      const params = {
        localDimensionUri: localDimensions[0].uri, 
        maxResults: 100, 
        excludedPromptUris: [prompts[0].uri, prompts[1].uri, prompts[2].uri]
      };
      const resultExpected = items.filter(item => item.localDimension.uri === params.localDimensionUri).length;
      const result = recommender.getRecommendation(params);
      Should(result.recommendations).length(resultExpected - params.excludedPromptUris.length);
    });

    it('invalid promptUris in excludedPromptUris are ignored', () => {
      const params = {
        localDimensionUri: localDimensions[0].uri, 
        maxResults: 100, 
        excludedPromptUris: [prompts[0].uri, prompts[1].uri, prompts[2].uri, 'invalid']
      };
      const resultExpected = items.filter(item => item.localDimension.uri === params.localDimensionUri).length;
      const result = recommender.getRecommendation(params);
      Should(result.recommendations).length(resultExpected - params.excludedPromptUris.length + 1);
    });

    it('excludedPromptUris are removed from prompt list set by includedPromptUris', () => {
      const params = {
        localDimensionUri: localDimensions[0].uri, 
        includedPromptUris: [prompts[0].uri, prompts[1].uri, prompts[2].uri],
        excludedPromptUris: [prompts[0].uri]
      };
      const result = recommender.getRecommendation(params);
      Should(result.recommendations).length(params.includedPromptUris.length - params.excludedPromptUris.length);
    });

  }); //END optimalDifficultyRecommender

}; //END export
