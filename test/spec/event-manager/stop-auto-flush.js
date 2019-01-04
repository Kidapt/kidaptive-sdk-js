'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import EventManager from '../../../src/event-manager';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('stopAutoFlush', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    it('events are no longer automatically flushed', done => {
      const autoFlushInterval = 500;
      const spyAutoFlushCallback = Sinon.spy();

      TestUtils.setStateOptions({
        autoFlushInterval,
        autoFlushCallback: [spyAutoFlushCallback]
      });
      EventManager.startAutoFlush();

      setTimeout(() => {
        Should(spyAutoFlushCallback.notCalled).false();
        spyAutoFlushCallback.resetHistory();

        Should(EventManager.stopAutoFlush()).resolved().then(() => {
          setTimeout(() => {
            Should(spyAutoFlushCallback.notCalled).true();
          }, autoFlushInterval * 1.5)
          setTimeout(() => {
            Should(spyAutoFlushCallback.notCalled).true();
            done();
          }, autoFlushInterval * 2.5)
        });
      }, autoFlushInterval * 1.5)

    });

    it('can be called multiple times', () => {
      EventManager.startAutoFlush();
      return Should(EventManager.stopAutoFlush()).resolved().then(() => {
        return Should(EventManager.stopAutoFlush()).resolved();
      });
    });

    it('events can still be manaully flushed with flushEventQueue', () => {
      EventManager.startAutoFlush();
      return Should(EventManager.stopAutoFlush()).resolved().then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      });
    });
    
  }); //END stopAutoFlush

}; //END export
