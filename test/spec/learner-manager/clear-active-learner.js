'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import LearnerManager from '../../../src/learner-manager';
import State from '../../../src/state';
import Utils from '../../../src/utils';
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

    it('learner is cleared, user is not cleared from state and cache', () => {
      const user = TestConstants.clientUserObjectResponse;
      const learnerId = user.learners[0].id;
      TestUtils.setState({
        user,
        learnerId,
        singletonLearner: false
      });
      Utils.cacheUser(user);
      Utils.cacheLearnerId(learnerId);
      Should(State.get('user')).deepEqual(user);
      Should(Utils.getCachedUser()).deepEqual(user);
      Should(State.get('learnerId')).equal(learnerId);
      Should(Utils.getCachedLearnerId()).equal(learnerId);
      return Should(LearnerManager.clearActiveLearner()).resolved().then(() => {
        Should(State.get('user')).deepEqual(user);
        Should(Utils.getCachedUser()).deepEqual(user);
        Should(State.get('learnerId')).equal(undefined);
        Should(Utils.getCachedLearnerId()).equal(undefined);
      });
    });

    it('if singletonLearner, learner and user is cleared from state and cache', () => {
      const user = TestConstants.singletonUserObjectResponse;
      const learnerId = user.learners[0].id;
      TestUtils.setState({
        user,
        learnerId,
        singletonLearner: true
      });
      Utils.cacheUser(user);
      Utils.cacheLearnerId(learnerId);
      Should(State.get('user')).deepEqual(user);
      Should(Utils.getCachedUser()).deepEqual(user);
      Should(State.get('learnerId')).equal(learnerId);
      Should(Utils.getCachedLearnerId()).equal(learnerId);
      return Should(LearnerManager.clearActiveLearner()).resolved().then(() => {
        Should(State.get('user')).deepEqual(undefined);
        Should(Utils.getCachedUser()).deepEqual(undefined);
        Should(State.get('learnerId')).equal(undefined);
        Should(Utils.getCachedLearnerId()).equal(undefined);
      });
    });

  }); //END clearActiveLearner

}; //END export
