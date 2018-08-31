'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import LearnerManager from '../../../src/learner-manager';
import Should from 'should';

export default () => {

  describe('getActiveLearner', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('Gets learner data from state', () => {
      TestUtils.setState({
        user: {learners:[{id: 200, name: '123'}]},
        learnerId: 200
      });
      Should(LearnerManager.getActiveLearner()).deepEqual({id: 200, name: '123'});
      TestUtils.setState({
        learnerId: undefined
      });
      Should(LearnerManager.getActiveLearner()).equal(undefined);
    });

  }); //END getActiveLearner

}; //END export
