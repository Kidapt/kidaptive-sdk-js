'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import EventManager from '../../../src/event-manager';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('flushEventQueue', () => {

    let server;

    const autoFlushInterval = 500;
    const spyAutoFlushCallback = Sinon.spy();

    before(() => {
      server = Sinon.fakeServer.create();
    });

    beforeEach(() => {
      server.resetHistory();
      server.respondImmediately = true;
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      spyAutoFlushCallback.resetHistory();
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setStateOptions({
        autoFlushInterval,
        autoFlushCallback: [spyAutoFlushCallback]
      });
    });

    after(() => {
      server.restore();
      TestUtils.resetStateAndCache();
    });

    it('sends http request when events in queue', () => {
      return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(request.url).endWith(Constants.ENDPOINT.INGESTION);
        Should(JSON.parse(request.requestBody).events).Array();
        Should(JSON.parse(request.requestBody).events.length).equal(1);
      });
    });

    it('resolves http statuses for successful requests', () => {
      return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(result).Array();
        Should(result.length).equal(1);
        Should(result[0].state).equal('fulfilled');
        Should(result[0].value).equal('ok');
      });
    });

    it('resolves http statuses for rejected requests', () => {
      server.respondWith([500, {}, 'Some server error']);
      return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(result).Array();
        Should(result.length).equal(1);
        Should(result[0].state).equal('rejected');
        Should(result[0].reason.message).endWith('Some server error');
      });
    });

    it('does not send http request when no queue', () => {
      return Should(EventManager.flushEventQueue()).resolved().then(result => {
        Should(server.requests).length(0);
      });
    });

    it('resolves empty array when no queue', () => {
      return Should(EventManager.flushEventQueue()).resolved().then(result => {
        Should(result).Array();
        Should(result.length).equal(0);
      });
    });

    it('autoFlushCallback option ignored for manually flushed events', () => {
      return Should(EventManager.flushEventQueue()).resolved().then(() => {
        Should(spyAutoFlushCallback.called).false();
      });
    });

  }); //END flushEventQueue

}; //END export
