'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import LearnerManager from '../../../src/learner-manager';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('getLatentAbilityEsimates', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setState({
        uriToModel: {dimension: TestConstants.uriToDimension},
        modelListLookup: {dimension: TestConstants.dimensionList}
      });
      TestUtils.setStateOptions({tier: 2});
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('Returns ability estimates set in state', () => {
      const learnerId = 100;
      TestUtils.setState({
        learnerId,
        ['latentAbilities.' + learnerId]: TestConstants.latentAbilities
      });
      Should(LearnerManager.getLatentAbilityEstimates()).deepEqual(TestConstants.latentAbilities);
    });

    it('Returns empty array if no learner is set', () => {
        Should(LearnerManager.getLatentAbilityEstimates()).deepEqual([]);
    });

    it('Fills in missing ability estimate with default value', () => {
      const learnerId = 100;
      TestUtils.setState({
        learnerId,
        ['latentAbilities.' + learnerId]: [
          TestConstants.latentAbilities[0],
          TestConstants.latentAbilities[1]
        ]
      });
      const ability3 = Utils.copyObject(TestConstants.defaultAbility);
      ability3.dimension = TestConstants.latentAbilities[2].dimension;
      const expected = [
        TestConstants.latentAbilities[0],
        TestConstants.latentAbilities[1],
        ability3
      ];
      Should(LearnerManager.getLatentAbilityEstimates()).deepEqual(expected);
    });

    it('Returns default value if no ability estimates are set', () => {
      TestUtils.setState({learnerId: 100});
      const ability1 = Utils.copyObject(TestConstants.defaultAbility);
      ability1.dimension = TestConstants.latentAbilities[0].dimension;
      const ability2 = Utils.copyObject(TestConstants.defaultAbility);
      ability2.dimension = TestConstants.latentAbilities[1].dimension;
      const ability3 = Utils.copyObject(TestConstants.defaultAbility);
      ability3.dimension = TestConstants.latentAbilities[2].dimension;
      const expected = [
        ability1,
        ability2,
        ability3
      ];
      Should(LearnerManager.getLatentAbilityEstimates()).deepEqual(expected);
    });

  }); //END getLatentAbilityEsimates

}; //END export
