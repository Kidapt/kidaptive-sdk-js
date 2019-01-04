'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import LearnerManager from '../../../src/learner-manager';
import Should from 'should';

export default () => {

  describe('getLearnerList', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('Gets learner array from user state', () => {
      TestUtils.setState({
        user: {learners: [true]}
      });
      Should(LearnerManager.getLearnerList()).Array;
      Should(LearnerManager.getLearnerList().length).equal(1);
      Should(LearnerManager.getLearnerList()[0]).equal(true);
    });

    it('Defaults to empty array if non array value set', () => {
      TestUtils.setState({
        user: {learners: true}
      });
      Should(LearnerManager.getLearnerList()).Array;
      Should(LearnerManager.getLearnerList().length).equal(0);
    });

    it('Defaults to empty array if no learner list set', () => {
      TestUtils.setState({
        user: {learners: undefined}
      });
      Should(LearnerManager.getLearnerList()).Array();
      Should(LearnerManager.getLearnerList().length).equal(0);
    });

    it('Defaults to empty array if no user set', () => {
      TestUtils.setState({
        user: undefined
      });
      Should(LearnerManager.getLearnerList()).Array();
      Should(LearnerManager.getLearnerList().length).equal(0);
    });

  }); //END getLearnerList

}; //END export
