'use strict';
import TestConstants from './test-constants';
import TestUtils from '../../test-utils';
import LearnerManager from '../../../src/learner-manager';
import Should from 'should';

export default () => {

  describe('getUser', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });
    
    it('Gets user data from state', () => {
      TestUtils.setState({
        user: true
      });
      Should(LearnerManager.getUser()).equal(true);
      TestUtils.setState({
        user: undefined
      });
      Should(LearnerManager.getUser()).equal(undefined);
    });

    it('When a falsey value is set, default to undefined', () => {
      TestUtils.setState({
        user: false
      });
      Should(LearnerManager.getUser()).equal(undefined);
      TestUtils.setState({
        user: undefined
      });
      Should(LearnerManager.getUser()).equal(undefined);
    });

  }); //END getUser

}; //END export
