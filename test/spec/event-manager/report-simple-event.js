'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import EventManager from '../../../src/event-manager';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('reportSimpleEvent', () => {

    const defaultEventName = 'eventName';

    beforeEach(() => {
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('validate eventName', () => {

      describe('eventName is required and must be a string', () => {
        const testFunction = parameter => {
          return EventManager.reportSimpleEvent(parameter, {});
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
      });

    });

    describe('validate eventFields', () => {

      describe('eventFields is an optional object', () => {
        const testFunction = parameter => {
          return EventManager.reportSimpleEvent('eventName', parameter);
        };
        TestUtils.validatePromiseProperty(testFunction, 'object', false);
      });

    });

    it('eventField values must be boolean, null, number, or string', () => {
      return TestUtils.createPromiseChain([
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: []})).rejected(); },
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: () => {}})).rejected(); },
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: {}})).rejected(); },
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: undefined})).rejected(); },
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: true})).resolved(); },
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: false})).resolved(); },
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: null})).resolved(); },
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: 100})).resolved(); },
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: 1.234})).resolved(); },
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: 'stringValue'})).resolved(); },
        () => { return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: ''})).resolved(); }
      ]);
    });

    it('conversion to scientific notation should not throw error', () => {
      return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: 1000000000000000000000000001})).resolved().then(() => {
        return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: (1234 / 100000000000)})).resolved();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent(defaultEventName, {prop: 1.234e-8})).resolved();
      });
    });

    it('event structure is correct', () => {
      const server = Sinon.fakeServer.create()
      server.respondImmediately = true;
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      const eventFields = {a: 123, b: 'string', c: true, d: false, e: null};
      const expectedFieldsResult = {a: '123', b: 'string', c: 'true', d: 'false', e: null};
      return Should(EventManager.reportSimpleEvent(defaultEventName)).resolved().then(() => {
        return Should(EventManager.reportSimpleEvent(defaultEventName, eventFields)).resolved()
      }).then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        const parsed = JSON.parse(request.requestBody);
        Should(parsed.events).Array();
        Should(parsed.events).length(2);
        const firstEvent = parsed.events[0];
        const secondEvent = parsed.events[1];
        Should(firstEvent.name).equal(defaultEventName);
        Should(firstEvent.additionalFields).Object();
        Should(firstEvent.additionalFields).deepEqual({});
        Should(secondEvent.name).equal(defaultEventName);
        Should(secondEvent.additionalFields).Object();
        Should(secondEvent.additionalFields).deepEqual(expectedFieldsResult);
        server.restore();
      });
    });

  }); //END reportSimpleEvent

}; //END export
