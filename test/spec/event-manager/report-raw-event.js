'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import EventManager from '../../../src/event-manager';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('reportRawEvent', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('validate rawEvent', () => {

      describe('rawEvent is required and must be a string', () => {
        const testFunction = parameter => {
          return EventManager.reportRawEvent(parameter);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
      });

    });

    it('event structure is correct', () => {
      const server = Sinon.fakeServer.create()
      server.respondImmediately = true;
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      const rawEvent = '{"name":"rawEventName","a":123,"b":"string","c":[1,2,3]}';
      Should(EventManager.reportRawEvent(rawEvent)).resolved().then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        const parsed = JSON.parse(request.requestBody);
        Should(parsed.events).Array();
        Should(parsed.events).length(1);
        const event = parsed.events[0];
        Should(event.name).equal('raw_custom_event');
        Should(event.additionalFields).Object();
        Should(event.additionalFields).deepEqual({'raw_event_payload':rawEvent});
        server.restore();
      });
    });
    
  }); //END reportRawEvent

}; //END export
