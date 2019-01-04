'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import LearnerManager from '../../../src/learner-manager';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('getLocalAbilityEsimates', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setState({
        uriToModel: {dimension: TestConstants.uriToDimension, 'local-dimension': TestConstants.uriToLocalDimension},
        modelListLookup: {dimension: TestConstants.dimensionList, 'local-dimension': TestConstants.localDimensionList}
      });
      TestUtils.setStateOptions({tier: 2});
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('Returns latent abilities from state with local dimensions attached', () => {
      const learnerId = 100;
      TestUtils.setState({
        learnerId,
        ['latentAbilities.' + learnerId]: TestConstants.latentAbilities
      });
      const expected = TestConstants.localDimensionList.map(localDimension => {
        const ability = Utils.copyObject(Utils.findItem(TestConstants.latentAbilities, ability => ability.dimension.uri === localDimension.dimension.uri));
        delete ability.dimension;
        ability.localDimension = localDimension;
        return ability;
      });
      Should(LearnerManager.getLocalAbilityEstimates()).deepEqual(expected);
    });

    it('Returns empty array if no learner is set', () => {
        Should(LearnerManager.getLocalAbilityEstimates()).deepEqual([]);
    });

    it('Fills in missing ability estimate with default value', () => {
      const learnerId = 100;
      const latentAbilities = [
        TestConstants.latentAbilities[0],
        TestConstants.latentAbilities[1]
      ];
      TestUtils.setState({
        learnerId,
        ['latentAbilities.' + learnerId]: latentAbilities
      });
      const expected = TestConstants.localDimensionList.map(localDimension => {
        let found = Utils.findItem(latentAbilities, ability => ability.dimension.uri === localDimension.dimension.uri);
        if (!found) {
          found = TestConstants.defaultAbility;
        }
        const ability = Utils.copyObject(found);
        delete ability.dimension;
        ability.localDimension = localDimension;
        return ability;
      });
      Should(LearnerManager.getLocalAbilityEstimates()).deepEqual(expected);
    });

    it('Returns default value if no ability estimates are set', () => {
      TestUtils.setState({learnerId: 100});
      const expected = TestConstants.localDimensionList.map(localDimension => {
        const ability = Utils.copyObject(TestConstants.defaultAbility);
        ability.localDimension = localDimension;
        return ability;
      });
      Should(LearnerManager.getLocalAbilityEstimates()).deepEqual(expected);
    });

  }); //END getLocalAbilityEsimates

}; //END export
