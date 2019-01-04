'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import AttemptProcessor from '../../../src/attempt-processor';
import Constants from '../../../src/constants';
import EventManager from '../../../src/event-manager';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('All Events', () => {

    let server;

    const defaultEventName = 'eventName';
    const defaultVersion = '1.0.0';
    const defaultBuild = '1.0.0.100';

    const defaultUserId = 100;
    const defaultUserObject = {id: defaultUserId};
    const defaultLearnerId = 200;
    const defaultTrialTime = 50000;

    before(() => {
      server = Sinon.fakeServer.create();
    });

    beforeEach(() => {
      server.resetHistory();
      server.respondImmediately = true;
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      TestUtils.setState({
        user: defaultUserObject,
        learnerId: defaultLearnerId,
        trialTime: defaultTrialTime
      });
      TestUtils.setStateOptions({
        version: defaultVersion,
        build: defaultBuild
      });
    });

    after(() => {
      server.restore();
      TestUtils.resetStateAndCache();
    });

    it('event request is correct format', () => {
      return Should(EventManager.reportSimpleEvent(defaultEventName, {})).resolved().then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(request.method).equal('POST');
        Should(request.url).endWith(Constants.ENDPOINT.INGESTION);
        const parsed = JSON.parse(request.requestBody);
        Should(parsed.events).Array();
        var event = parsed.events[0];
        Should(event).Object();
        Should(event.eventTime).Number();
        Should(event.trialTime).Number();
        Should(event.trialTime).equal(defaultTrialTime);
        Should(parsed.appInfo).Object();
        Should(parsed.appInfo.version).equal(defaultVersion);
        Should(parsed.appInfo.build).equal(defaultBuild);
        Should(parsed.deviceInfo).Object();
        if (parsed.deviceInfo.deviceType) {
          Should(parsed.deviceInfo.deviceType).String();
        }
        if (parsed.deviceInfo.language) {
          Should(parsed.deviceInfo.language).String();
        }
        Should(event.userId).equal(defaultUserId);
        Should(event.learnerId).equal(defaultLearnerId);
        Should(event.name).equal(defaultEventName);
        Should(event.additionalFields).deepEqual({});
      });
    });

    it('events are grouped by app/device info', () => {
      return Should(EventManager.reportSimpleEvent(defaultEventName, {})).resolved().then(() => {
        return Should(EventManager.reportRawEvent('{"name":"' + defaultEventName + '"}')).resolved();
      }).then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        const parsed = JSON.parse(request.requestBody);
        Should(parsed.events).Array();
        Should(parsed.events.length).equal(2);
      });
    });

    it('separate events by different app info', () => {
      const eventName1 = 'eventName1';
      const version1 = '1.0.2';
      const build1 = defaultBuild;

      const eventName2 = 'eventName2';
      const version2 = '1.0.1';
      const build2 = defaultBuild;

      const eventName3 = 'eventName3';
      const version3 = defaultVersion;
      const build3 = '1.0.0.101';

      return Should(EventManager.reportSimpleEvent(defaultEventName, {})).resolved().then(() => {
        TestUtils.setStateOptions({
          version: version1,
          build: build1
        });
        return Should(EventManager.reportSimpleEvent(eventName1, {})).resolved();
      }).then(() => {
        TestUtils.setStateOptions({
          version: version2,
          build: build2
        });
        return Should(EventManager.reportSimpleEvent(eventName2, {})).resolved();
      }).then(() => {
        TestUtils.setStateOptions({
          version: version3,
          build: build3
        });
        return Should(EventManager.reportSimpleEvent(eventName3, {})).resolved();
      }).then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(4);
        Should(JSON.parse(server.requests[0].requestBody).events).length(1);
        Should(JSON.parse(server.requests[0].requestBody).events[0].name).equal(defaultEventName);
        Should(JSON.parse(server.requests[0].requestBody).appInfo.version).equal(defaultVersion);
        Should(JSON.parse(server.requests[0].requestBody).appInfo.build).equal(defaultBuild);
        Should(JSON.parse(server.requests[1].requestBody).events).length(1);
        Should(JSON.parse(server.requests[1].requestBody).events[0].name).equal(eventName1);
        Should(JSON.parse(server.requests[1].requestBody).appInfo.version).equal(version1);
        Should(JSON.parse(server.requests[1].requestBody).appInfo.build).equal(build1);
        Should(JSON.parse(server.requests[2].requestBody).events).length(1);
        Should(JSON.parse(server.requests[2].requestBody).events[0].name).equal(eventName2);
        Should(JSON.parse(server.requests[2].requestBody).appInfo.version).equal(version2);
        Should(JSON.parse(server.requests[2].requestBody).appInfo.build).equal(build2);
        Should(JSON.parse(server.requests[3].requestBody).events).length(1);
        Should(JSON.parse(server.requests[3].requestBody).events[0].name).equal(eventName3);
        Should(JSON.parse(server.requests[3].requestBody).appInfo.version).equal(version3);
        Should(JSON.parse(server.requests[3].requestBody).appInfo.build).equal(build3);
      });
    });

    it('event requires user to be specified when using authMode:server', () => {
      TestUtils.setState({
        user: undefined
      });
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      return Should(EventManager.reportSimpleEvent('eventName', {})).rejected().then(() => {
        TestUtils.setState({
          user: defaultUserObject
        });
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved();
      }).then(() => {
        TestUtils.setState({
          user: undefined
        });
        TestUtils.setStateOptions({
          authMode: 'client'
        });
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved();
      }).then(() => {
        TestUtils.setState({
          user: defaultUserObject
        });
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved();
      });
    });

    describe('eventTransformer is applied to event', () => {

      beforeEach(() => { 
        TestUtils.setStateOptions({
          tier: 3
        });
      });

      it('returned event gets sent to server', () => {
        EventManager.setEventTransformer(event => {
          event.name = 'adjusted event name';
          return event;
        });
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          return Should(EventManager.flushEventQueue()).resolved();
        }).then(result => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          const parsed = JSON.parse(request.requestBody);
          Should(parsed.events).Array();
          Should(parsed.events.length).equal(1);
          Should(parsed.events[0].name).equal('adjusted event name');
        });
      });

      it('eventTransformer does not return an object, event is discarded', () => {
        EventManager.setEventTransformer(event => {
          return false;
        });
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          return Should(EventManager.flushEventQueue()).resolved();
        }).then(result => {
          Should(server.requests).length(0);
        });
      });

      it('invalid event still gets sent to server', () => {
        EventManager.setEventTransformer(event => {
          return {randomProp: 'value'};
        });
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          return Should(EventManager.flushEventQueue()).resolved();
        }).then(result => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          const parsed = JSON.parse(request.requestBody);
          Should(parsed.events).Array();
          Should(parsed.events.length).equal(1);
          Should(parsed.events[0].randomProp).equal('value');
        });
      });

    }); //END eventTransformer is applied to event

    describe('prepareAttempt processes attempt with events', () => {

      beforeEach(() => { 
        TestUtils.setStateOptions({
          tier: 3
        });
      });

      it('AttemptProcessor.prepareAttempt() not called when no attempts', () => {
        EventManager.setEventTransformer(event => {
          return event;
        });
        const spyPrepareAttempt = Sinon.spy(AttemptProcessor, 'prepareAttempt');
        Should(spyPrepareAttempt.called).false();
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          Should(spyPrepareAttempt.called).false();
          spyPrepareAttempt.restore();
        });
      });

      it('AttemptProcessor.prepareAttempt() called for each attempts', () => {
        EventManager.setEventTransformer(event => {
          event.attempts = [{}, {}, {}];
          return event;
        });
        const spyPrepareAttempt = Sinon.spy(AttemptProcessor, 'prepareAttempt');
        Should(spyPrepareAttempt.called).false();
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          Should(spyPrepareAttempt.called).true();
          Should(spyPrepareAttempt.callCount).equal(3);
          return Should(EventManager.flushEventQueue()).resolved();
        }).then(result => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          const parsed = JSON.parse(request.requestBody);
          Should(parsed.events).Array();
          Should(parsed.events.length).equal(1);
          Should(parsed.events[0].attempts).length(3);
          spyPrepareAttempt.restore();
        });
      });

      it('invalid/discarded attempts are still sent to server', () => {
        EventManager.setEventTransformer(event => {
          event.attempts = [{}, {}, {}];
          return event;
        });
        const prepareAttemptStub = Sinon.stub(AttemptProcessor, 'prepareAttempt').callsFake(() => {
          return;
        });
        Should(prepareAttemptStub.called).false();
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          Should(prepareAttemptStub.callCount).equal(3);
          return Should(EventManager.flushEventQueue()).resolved();
        }).then(result => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          const parsed = JSON.parse(request.requestBody);
          Should(parsed.events).Array();
          Should(parsed.events.length).equal(1);
          Should(parsed.events[0].attempts).deepEqual([{}, {}, {}]);
          prepareAttemptStub.restore();
        });
      });

      it('AttemptProcessor.prepareAttempt() still called with skipIrt', () => {
        EventManager.setEventTransformer(event => {
          event.attempts = [{}, {}, {}];
          event.skipIrt = true;
          return event;
        });
        const spyPrepareAttempt = Sinon.spy(AttemptProcessor, 'prepareAttempt');
        Should(spyPrepareAttempt.called).false();
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          Should(spyPrepareAttempt.called).true();
          Should(spyPrepareAttempt.callCount).equal(3);
          spyPrepareAttempt.restore();
        });
      });

    }); //END prepareAttempt processes attempt with events

    describe('processAttempt called for attempts', () => {

      let processAttemptStub;

      before(() => {
        processAttemptStub = Sinon.stub(AttemptProcessor, 'processAttempt').callsFake(attempt => {
          return;
        });
      });

      beforeEach(() => { 
        TestUtils.setStateOptions({
          tier: 3
        });
        EventManager.setEventTransformer(event => {
          event.attempts = [{}, {}, {}];
          return event;
        });
        processAttemptStub.resetHistory();
      });

      after(() => {
        processAttemptStub.restore();
      });
      
      it('AttemptProcessor.processAttempt() gets called for each attempt when skipIrt is false', () => {
        const prepareAttemptStub = Sinon.stub(AttemptProcessor, 'prepareAttempt').callsFake(attempt => {
          return attempt;
        });
        Should(processAttemptStub.called).false();
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          Should(processAttemptStub.called).true();
          Should(processAttemptStub.callCount).equal(3);
          prepareAttemptStub.restore();
        });
      });
      
      it('AttemptProcessor.processAttempt() is not called when prepareAttempt returns undefined', () => {
        const prepareAttemptStub = Sinon.stub(AttemptProcessor, 'prepareAttempt').callsFake(attempt => {
          return;
        });
        Should(processAttemptStub.called).false();
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          Should(processAttemptStub.called).false();
          Should(processAttemptStub.callCount).equal(0);
          prepareAttemptStub.restore();
        }); 
      });

      it('AttemptProcessor.processAttempt() is not called when attempt skipIrt is true', () => {
        EventManager.setEventTransformer(event => {
          event.attempts = [{}, {}, {}];
          event.tags = {skipIrt: true};
          return event;
        });
        const prepareAttemptStub = Sinon.stub(AttemptProcessor, 'prepareAttempt').callsFake(attempt => {
          return attempt;
        });
        Should(processAttemptStub.called).false();
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          Should(processAttemptStub.called).false();
          Should(processAttemptStub.callCount).equal(0);
          prepareAttemptStub.restore();
        });
      });

    }); //END processAttempt called for attempts
    
  }); //END All Events

}; //END export
