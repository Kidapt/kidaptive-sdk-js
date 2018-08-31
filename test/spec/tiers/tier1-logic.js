'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import KidaptiveSdk from '../../../src/index';
import EventManager from '../../../src/event-manager';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('Tier 1 Logic', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('KidaptiveSdk.init()', () => {
      it('EventManager.startAutoFlush() gets called', () => {
        const spyStartAutoFlush = Sinon.spy(EventManager, 'startAutoFlush');
        Should(spyStartAutoFlush.called).false();
        return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev'})).resolved().then(() => {
          Should(spyStartAutoFlush.called).true();
          spyStartAutoFlush.restore();
        });
      });
    });

    describe('KidaptiveSdk.destroy()', () => {
      it('calls EventManager.stopAutoFlush()', () => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions({tier: 1});
        const spyStopAutoFlush = Sinon.spy(EventManager, 'stopAutoFlush');
        Should(spyStopAutoFlush.called).false();
        return Should(KidaptiveSdk.destroy()).resolved().then(() => {
          Should(spyStopAutoFlush.called).true();
          spyStopAutoFlush.restore();
        });
      });

      it('calls EventManager.flushEventQueue()', () => {
        TestUtils.setState(TestConstants.defaultState);
        TestUtils.setStateOptions({tier: 1});
        const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
        Should(spyFlushEventQueue.called).false();
        return Should(KidaptiveSdk.destroy()).resolved().then(() => {
          Should(spyFlushEventQueue.called).true();
          spyFlushEventQueue.restore();
        });
      });
    });

  }); //END Tier 1 Logic

}; //END export

/*
*/
