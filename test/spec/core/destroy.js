'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import KidaptiveSdk from '../../../src/index';
import State from '../../../src/state';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('destroy', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('promise resolved after destroy complete', () => {
      TestUtils.setState(TestConstants.defaultState);
      Should(State.get('initialized')).equal(true);
      return Should(KidaptiveSdk.destroy()).resolved().then(() => {
        Should(State.get('initialized')).equal(false);
      });
    });

    it('requires init to be called first', () => {
      TestUtils.setState({
        initialized: false
      });
      Should(State.get('initialized')).equal(false);
      return Should(KidaptiveSdk.destroy()).rejected()
    });

    it('calls State.clear()', () => {
      TestUtils.setState(TestConstants.defaultState);
      const spyStateClear = Sinon.spy(State, 'clear');
      Should(spyStateClear.called).false();
      return Should(KidaptiveSdk.destroy()).resolved().then(() => {
        Should(spyStateClear.called).true();
        spyStateClear.restore();
      });
    });

  }); //END destroy

}; //END export
