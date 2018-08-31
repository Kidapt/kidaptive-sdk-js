'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import LearnerManager from '../../../src/learner-manager';
import State from '../../../src/state';
import Should from 'should';

export default () => {

  describe('clearActiveLearner', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('Promise is resolved when learner data is cleared', () => {
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      TestUtils.setState({
        learnerId: 200
      });
      Should(State.get('learnerId')).equal(200);
      return Should(LearnerManager.clearActiveLearner()).resolved().then(() => {
        Should(State.get('learnerId')).equal(undefined);
      });
    });

  }); //END clearActiveLearner

}; //END export
