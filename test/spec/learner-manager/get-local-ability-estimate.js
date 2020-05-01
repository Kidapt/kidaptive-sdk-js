'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import LearnerManager from '../../../src/learner-manager';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('getLocalAbilityEsimate', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setState({
        uriToModel: {dimension: TestConstants.uriToDimension, 'local-dimension': TestConstants.uriToLocalDimension}
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

      describe('localDimensionUri is required and must be a string', () => {
        const testFunction = parameter => {
          LearnerManager.getLocalAbilityEstimate(parameter);
        };
        TestUtils.validateProperty(testFunction, 'string', true);
      }); //END localDimensionUri is required and must be a string

    }) //END Validate

    it('Returns latent ability from state with local dimension attached', () => {
      const learnerId = 100;
      TestUtils.setState({
        learnerId,
        ['latentAbilities.' + learnerId]: TestConstants.latentAbilities
      });
      TestConstants.localDimensionList.forEach(localDimension => {
        const ability = Utils.copyObject(Utils.findItem(TestConstants.latentAbilities, ability => ability.dimension.uri === localDimension.dimension.uri));
        delete ability.dimension;
        ability.localDimension = localDimension;
        Should(LearnerManager.getLocalAbilityEstimate(localDimension.uri)).deepEqual(ability);
      });
    });

    it('Returns undefined if no learner is set', () => {
      Should(LearnerManager.getLocalAbilityEstimate(TestConstants.localDimensionList[0].uri)).equal(undefined);
    });

    it('Returns undefined if localDimensionUri does not exist', () => {
      TestUtils.setState({learnerId: 100});
      Should(LearnerManager.getLocalAbilityEstimate('random local dimension ID')).equal(undefined);
    });

    it('Returns default value if ability estimate does not exist', () => {
      TestUtils.setState({learnerId: 100});
      const expected = Utils.copyObject(TestConstants.defaultAbility);
      expected.localDimension = TestConstants.localDimensionList[0];
      Should(LearnerManager.getLocalAbilityEstimate(TestConstants.localDimensionList[0].uri)).deepEqual(expected);
    });

    it('Uses non-null irt extension to return customized default estimate', () => {
      TestUtils.setState({learnerId: 100, irtExtension: TestConstants.irtExtension});
      const expected = Utils.copyObject(TestConstants.defaultExtensionLocalEstimate);
      expected.localDimension = TestConstants.localDimensionList[0];
      Should(LearnerManager.getLocalAbilityEstimate(TestConstants.localDimensionList[0].uri)).deepEqual(expected);
    });

  }); //END getLocalAbilityEsimate

}; //END export
