'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import LearnerManager from '../../../src/learner-manager';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('getLatentAbilityEsimate', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setState({
        uriToModel: {dimension: TestConstants.uriToDimension}
      });
      TestUtils.setStateOptions({tier: 2});
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('Validate', () => {

      beforeEach(() => {
        TestUtils.setState({learnerId: 100})
      });

      describe('dimensionUri is required and must be a string', () => {
        const testFunction = parameter => {
          LearnerManager.getLatentAbilityEstimate(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      }); //END dimensionUri is required and must be a string

    }) //END Validate

    it('Returns latent ability from state', () => {
      const learnerId = 100;
      TestUtils.setState({
        learnerId,
        ['latentAbilities.' + learnerId]: TestConstants.latentAbilities
      });
      Should(LearnerManager.getLatentAbilityEstimate(TestConstants.dimensionList[0].uri)).deepEqual(TestConstants.latentAbilities[0]);
      Should(LearnerManager.getLatentAbilityEstimate(TestConstants.dimensionList[1].uri)).deepEqual(TestConstants.latentAbilities[1]);
      Should(LearnerManager.getLatentAbilityEstimate(TestConstants.dimensionList[2].uri)).deepEqual(TestConstants.latentAbilities[2]);
    });

    it('Returns undefined if no learner is set', () => {
      Should(LearnerManager.getLatentAbilityEstimate(TestConstants.dimensionList[0].uri)).equal(undefined);
    });

    it('Returns undefined if dimensionUri does not exist', () => {
      TestUtils.setState({learnerId: 100});
      Should(LearnerManager.getLatentAbilityEstimate('random dimension ID')).equal(undefined);
    });

    it('Returns default value if ability estimate does not exist', () => {
      TestUtils.setState({learnerId: 100});
      const expected = Utils.copyObject(TestConstants.defaultAbility);
      expected.dimension = TestConstants.dimensionList[0];
      Should(LearnerManager.getLatentAbilityEstimate(TestConstants.dimensionList[0].uri)).deepEqual(expected);
    });

  }); //END getLatentAbilityEsimate

}; //END export
