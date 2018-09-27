'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import LearnerManager from '../../../src/learner-manager';
import State from '../../../src/state';
import Should from 'should';

export default () => {

  describe('startTrial', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });
      
    it('does not throw error for no learner', () => {
      Should(State.get('trialTime')).equal(undefined);
      return Should(LearnerManager.startTrial()).resolved().then(() => {
        Should(State.get('trialTime')).equal(undefined);
      });
    });

    it('trial time is stored', () => {
      const user = TestConstants.clientUserObjectResponse;
      const learnerId = user.learners[0].id;
      TestUtils.setState({
        user,
        learnerId
      });
      Should(State.get('trialTime')).equal(undefined);
      return Should(LearnerManager.startTrial()).resolved().then(() => {
        Should(State.get('trialTime')).not.equal(undefined);
        Should(State.get('trialTime')).Number();
      });
    });

    it('trial time is updated', () => {
      const defaultTrialTime = 100;
      const user = TestConstants.clientUserObjectResponse;
      const learnerId = user.learners[0].id;
      TestUtils.setState({
        user,
        learnerId
      });
      State.set('trialTime', defaultTrialTime);
      Should(State.get('trialTime')).equal(defaultTrialTime);
      return Should(LearnerManager.startTrial()).resolved().then(() => {
        Should(State.get('trialTime')).not.equal(undefined);
        Should(State.get('trialTime')).not.equal(defaultTrialTime);
        Should(State.get('trialTime')).Number();
      });
    });

  }); //END startTrial

}; //END export
