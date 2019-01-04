'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import RecommendationManager from '../../../src/recommendation-manager';
import Utils from '../../../src/utils';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('getRecommendation', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('validate key', () => {

      describe('key is required and must be an string', () => {

        const testFunction = parameter => {
          return RecommendationManager.getRecommendation(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);

      });

    }); //END validate key

    describe('validate parameters', () => {

      describe('paramters must be an string if defined', () => {

        const testFunction = parameter => {
          return RecommendationManager.getRecommendation(TestConstants.defaultKey, parameter);
        };
        TestUtils.validateProperty(testFunction, 'object', false, [{}]);

      });

    }); //END validate parameters

    it('if key doesnt exist, returns recommendation result object with error', () => {
      const recommendationResult = RecommendationManager.getRecommendation('random key');
      Should(recommendationResult).Object();
      Should(Object.keys(recommendationResult)).deepEqual(['error']);
      Should(recommendationResult.error).Error();
    });

    it('correct recommender is called', () => {
      const recommender1 = {
        getRecommendation: Sinon.spy()
      };
      const recommender2 = {
        getRecommendation: Sinon.spy()
      };
      const recommender3 = {
        getRecommendation: Sinon.spy()
      };
      RecommendationManager.registerRecommender(recommender1, 'key1');
      RecommendationManager.registerRecommender(recommender2, 'key2');
      RecommendationManager.registerRecommender(recommender3, 'key3');
      RecommendationManager.getRecommendation('key1');
      Should(recommender1.getRecommendation.callCount).equal(1);
      Should(recommender2.getRecommendation.callCount).equal(0);
      Should(recommender3.getRecommendation.callCount).equal(0);
      RecommendationManager.getRecommendation('key2');
      Should(recommender1.getRecommendation.callCount).equal(1);
      Should(recommender2.getRecommendation.callCount).equal(1);
      Should(recommender3.getRecommendation.callCount).equal(0);
      RecommendationManager.getRecommendation('key3');
      Should(recommender1.getRecommendation.callCount).equal(1);
      Should(recommender2.getRecommendation.callCount).equal(1);
      Should(recommender3.getRecommendation.callCount).equal(1);
    });

    it('recommender error is passed through getRecommendation', () => {
    });

    describe('if recommender result is invalid results in error in result', () => {

      const resultTester = (result, testCase, value) => {
        if (testCase.expected) {
          Should(result).Object;
          Should(result.error).equal(undefined);
        } else {
          Should(result).Object;
          Should(result.error).Error();
        }
      }

      it('getRecommendation returns recomendationResult error', () => {
        RecommendationManager.registerRecommender({
          getRecommendation: () => ({
            error: new Error()
          })
        }, TestConstants.defaultKey);
        const recommendationResult = RecommendationManager.getRecommendation(TestConstants.defaultKey);
        Should(recommendationResult).Object();
        Should(Object.keys(recommendationResult)).deepEqual(['error']);
        Should(recommendationResult.error).Error();    
      });

      describe('recomendationResult is required and must be an object', () => {

        const testCases = [
          {name: 'array', values: [[]], expected: false},
          {name: 'bool', values: [false, true], expected: false},
          {name: 'function', values: [() => {}], expected: false},
          {name: 'object', values: [{}], expected: false},
          {name: 'object', values: [TestConstants.defaultResult], expected: true},
          {name: 'string', values: ['', 'random value'], expected: false},
          {name: 'number', values: [0, 100], expected: false},
          {name: 'null', values: [null], expected: false},
          {name: 'undefined', values: [undefined], expected: false}
        ];

        const functionWrapper = (value) => {
          RecommendationManager.registerRecommender({getRecommendation: () => value}, 'testRecommender');
          return RecommendationManager.getRecommendation('testRecommender');
        }

        TestUtils.testRunner(testCases, functionWrapper, resultTester);

      }); //END recomendationResult is required and must be an object

      describe('type is required and must be a string', () => {

        const testCases = [
          {name: 'array', values: [[]], expected: false},
          {name: 'bool', values: [false, true], expected: false},
          {name: 'function', values: [() => {}], expected: false},
          {name: 'object', values: [{}], expected: false},
          {name: 'string', values: ['', 'random value'], expected: true},
          {name: 'number', values: [0, 100], expected: false},
          {name: 'null', values: [null], expected: false},
          {name: 'undefined', values: [undefined], expected: false}
        ];

        const functionWrapper = (value) => {
          const result = Utils.copyObject(TestConstants.defaultResult);
          result.type = value;
          RecommendationManager.registerRecommender({getRecommendation: () => result}, 'testRecommender');
          return RecommendationManager.getRecommendation('testRecommender');
        }

        TestUtils.testRunner(testCases, functionWrapper, resultTester);

      }); //END type is required and must be a string

      describe('recommendations is required and must be an array', () => {

        const testCases = [
          {name: 'array', values: [[], ['result'], [{}]], expected: true},
          {name: 'bool', values: [false, true], expected: false},
          {name: 'function', values: [() => {}], expected: false},
          {name: 'object', values: [{}], expected: false},
          {name: 'string', values: ['', 'random value'], expected: false},
          {name: 'number', values: [0, 100], expected: false},
          {name: 'null', values: [null], expected: false},
          {name: 'undefined', values: [undefined], expected: false}
        ];

        const functionWrapper = (value) => {
          const result = Utils.copyObject(TestConstants.defaultResult);
          result.recommendations = value;
          RecommendationManager.registerRecommender({getRecommendation: () => result}, 'testRecommender');
          return RecommendationManager.getRecommendation('testRecommender');
        }

        TestUtils.testRunner(testCases, functionWrapper, resultTester);

      }); //END recommendations is required and must be an array

      describe('context is an optional object', () => {

        const testCases = [
          {name: 'array', values: [[], ['result'], [{}]], expected: false},
          {name: 'bool', values: [false, true], expected: false},
          {name: 'function', values: [() => {}], expected: false},
          {name: 'object', values: [{}], expected: true},
          {name: 'string', values: ['', 'random value'], expected: false},
          {name: 'number', values: [0, 100], expected: false},
          {name: 'null', values: [null], expected: true},
          {name: 'undefined', values: [undefined], expected: true}
        ];

        const functionWrapper = (value) => {
          const result = Utils.copyObject(TestConstants.defaultResult);
          result.context = value;
          RecommendationManager.registerRecommender({getRecommendation: () => result}, 'testRecommender');
          return RecommendationManager.getRecommendation('testRecommender');
        }

        TestUtils.testRunner(testCases, functionWrapper, resultTester);

      }); //END context is an optional object

      describe('context is an optional object of key:value string pairs', () => {

        const testCases = [
          {name: 'array', values: [[], ['result'], [{}]], expected: false},
          {name: 'bool', values: [false, true], expected: false},
          {name: 'function', values: [() => {}], expected: false},
          {name: 'object', values: [{}], expected: false},
          {name: 'string', values: ['', 'random value'], expected: true},
          {name: 'number', values: [0, 100], expected: false},
          {name: 'null', values: [null], expected: false},
          {name: 'undefined', values: [undefined], expected: false}
        ];

        const functionWrapper = (value) => {
          const result = Utils.copyObject(TestConstants.defaultResult);
          result.context = {someProp: value};
          RecommendationManager.registerRecommender({getRecommendation: () => result}, 'testRecommender');
          return RecommendationManager.getRecommendation('testRecommender');
        }

        TestUtils.testRunner(testCases, functionWrapper, resultTester);

      }); //END context is an optional object of key:value string pairs

    }); //END if recommender result is invalid results in error in result

  }); //END getRecommendation

}; //END export
