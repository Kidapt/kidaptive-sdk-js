'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import AttemptProcessor from '../../../src/attempt-processor';
import Should from 'should';

export default () => {

  describe('prepareAttempt', () => {

    const resultTester = (result, testCase, value) => {
      if (testCase.expected) {
        Should(result).Object;
      } else {
        Should(result).equal(undefined);
      }
    }

    const functionWithParams = () => {};
    functionWithParams.itemURI = TestConstants.defaultAttempt.itemURI;
    functionWithParams.outcome = TestConstants.defaultAttempt.outcome;

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('Invalid attempt returns undefined', () => {

      describe('missing active learner', () => {

        it('valid when active learner is set', () => {
          Should(AttemptProcessor.prepareAttempt(TestConstants.defaultAttempt)).Object();
        });

        it('invalid when no active learner', () => {
          TestUtils.setState({learnerId: undefined});
          Should(AttemptProcessor.prepareAttempt(TestConstants.defaultAttempt)).equal(undefined);
        });

      }); //END missing active learner

      describe('attempt is not an object', () => {

        const testCases = [
          {name: 'array', values: [[]], expected: false},
          {name: 'bool', values: [false, true], expected: false},
          {name: 'function', values: [() => {}, functionWithParams], expected: false},
          {name: 'object', values: [{}], expected: false},
          {name: 'object', values: [TestConstants.defaultAttempt], expected: true},
          {name: 'string', values: ['', 'attempt'], expected: false},
          {name: 'number', values: [0, 100], expected: false},
          {name: 'null', values: [null], expected: false},
          {name: 'undefined', values: [undefined], expected: false}
        ];

        const functionWrapper = (value) => {
          return AttemptProcessor.prepareAttempt(value);
        }

        TestUtils.testRunner(testCases, functionWrapper, resultTester);

      }); //END attempt is not an object

      describe('invalid itemURI', () => {

        const testCases = [
          {name: 'array', values: [[]], expected: false},
          {name: 'bool', values: [false, true], expected: false},
          {name: 'function', values: [() => {}, functionWithParams], expected: false},
          {name: 'object', values: [{}], expected: false},
          {name: 'string', values: ['', 'random value'], expected: false},
          {name: 'string', values: [TestConstants.defaultAttempt.itemURI], expected: true},
          {name: 'number', values: [0, 100], expected: false},
          {name: 'null', values: [null], expected: false},
          {name: 'undefined', values: [undefined], expected: false}
        ];

        const functionWrapper = (value) => {
          return AttemptProcessor.prepareAttempt({
            itemURI: value,
            outcome: TestConstants.defaultAttempt.outcome
          });
        }

        TestUtils.testRunner(testCases, functionWrapper, resultTester);

      }); //END invalid itemURI

      describe('optional guessingParamter is not a number', () => {

        const testCases = [
          {name: 'array', values: [[]], expected: false},
          {name: 'bool', values: [false, true], expected: false},
          {name: 'function', values: [() => {}, functionWithParams], expected: false},
          {name: 'object', values: [{}], expected: false},
          {name: 'string', values: ['', '1'], expected: false},
          {name: 'number', values: [0, 0.5, 1, 100], expected: true},
          {name: 'null', values: [null], expected: true},
          {name: 'undefined', values: [undefined], expected: true}
        ];

        const functionWrapper = (value) => {
          return AttemptProcessor.prepareAttempt({
            itemURI: TestConstants.defaultAttempt.itemURI,
            guessingParameter: value,
            outcome: TestConstants.defaultAttempt.outcome
          });
        }

        TestUtils.testRunner(testCases, functionWrapper, resultTester);

      }); //END guessingParamter is not a number

      describe('outcome is not set or is not a number', () => {

        const testCases = [
          {name: 'array', values: [[]], expected: false},
          {name: 'bool', values: [false, true], expected: false},
          {name: 'function', values: [() => {}, functionWithParams], expected: false},
          {name: 'object', values: [{}], expected: false},
          {name: 'string', values: ['', '1'], expected: false},
          {name: 'number', values: [0, 0.5, 1, 100], expected: true},
          {name: 'null', values: [null], expected: false},
          {name: 'undefined', values: [undefined], expected: false}
        ];

        const functionWrapper = (value) => {
          return AttemptProcessor.prepareAttempt({
            itemURI: TestConstants.defaultAttempt.itemURI,
            outcome: value
          });
        }

        TestUtils.testRunner(testCases, functionWrapper, resultTester);

      }); //END outcome is not set or is not a number

    });

    describe('Valid attempt returns attempt with added properties', () => {

      describe('previous properties are still there', () => {
        let preparedAttempt;

        beforeEach(() => {
          preparedAttempt = AttemptProcessor.prepareAttempt({
            itemURI: TestConstants.items[0].uri,
            outcome: 1,
            guessingParameter: 0.5
          });
        });

        it('itemURI', () => {
          Should(preparedAttempt.itemURI).not.equal(undefined);
          Should(preparedAttempt.itemURI).equal(TestConstants.items[0].uri);
        });

        it('outcome', () => {
          Should(preparedAttempt.outcome).not.equal(undefined);
          Should(preparedAttempt.outcome).equal(1);
        });

        it('guessingParameter', () => {
          Should(preparedAttempt.guessingParameter).not.equal(undefined);
          Should(preparedAttempt.guessingParameter).equal(0.5);
        });
      }); //END revious properties are still there

      describe('values are set to a number', () => {
        let preparedAttempt;

        beforeEach(() => {
          preparedAttempt = AttemptProcessor.prepareAttempt({
            itemURI: TestConstants.items[0].uri,
            outcome: 1
          });
        });

        it('priorLatentMean', () => {
          Should(preparedAttempt.priorLatentMean).not.equal(undefined);
          Should(preparedAttempt.priorLatentMean).Number();
        });

        it('priorLatentStandardDeviation', () => {
          Should(preparedAttempt.priorLatentStandardDeviation).not.equal(undefined);
          Should(preparedAttempt.priorLatentStandardDeviation).Number();
        });

        it('priorLocalMean', () => {
          Should(preparedAttempt.priorLocalMean).not.equal(undefined);
          Should(preparedAttempt.priorLocalMean).Number();
        });

        it('priorLocalStandardDeviation', () => {
          Should(preparedAttempt.priorLocalStandardDeviation).not.equal(undefined);
          Should(preparedAttempt.priorLocalStandardDeviation).Number();
        });

      }); //END Valid attempt returns attempt with added properties

      describe('values set to correct values based on itemUri', () => {

        let preparedAttempt1;
        let preparedAttempt2;

        beforeEach(() => {
          preparedAttempt1 = AttemptProcessor.prepareAttempt({
            itemURI: TestConstants.items[0].uri,
            outcome: 1,
          });
          
          preparedAttempt2 = AttemptProcessor.prepareAttempt({
            itemURI: TestConstants.items[1].uri,
            outcome: 1,
          });
        });

        it('item maps to abilities set in state', () => {
          Should(preparedAttempt1.priorLatentMean).equal(TestConstants.defaultAbility.mean);
          Should(preparedAttempt1.priorLatentStandardDeviation).equal(TestConstants.defaultAbility.standardDeviation);
          Should(preparedAttempt1.priorLocalMean).equal(TestConstants.defaultAbility.mean);
          Should(preparedAttempt1.priorLocalStandardDeviation).equal(TestConstants.defaultAbility.standardDeviation);
        });

        it('item maps to default abilities', () => {
          Should(preparedAttempt2.priorLatentMean).equal(0);
          Should(preparedAttempt2.priorLatentStandardDeviation).equal(1);
          Should(preparedAttempt2.priorLocalMean).equal(0);
          Should(preparedAttempt2.priorLocalStandardDeviation).equal(1);
        });

      }); //END values set to correct values based on itemUri

    }); //END Valid attempt returns attempt with added properties

  }); //END prepareAttempt

}; //END export
