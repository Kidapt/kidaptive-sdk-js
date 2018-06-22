'use strict';
import Constants from '../../src/constants';
import EventManager from '../../src/event-manager';
import State from '../../src/state';
import Should from 'should';
import Sinon from 'sinon';

describe('KidaptiveSdk Event Manager Unit Tests', () => {
  before(() => {
    State.set('apiKey', 'testApiKey');
    State.set('initialized', true);
    State.set('options', {tier: 1, authMode: 'client', environment: 'dev', autoFlushInterval: 0, loggingLevel: 'none'});
  });
  after(() => {
    State.clear();
    localStorage.clear();
  });
  describe('reportSimpleEvent', () => {
    it('eventName is required', () => {
      return Should(EventManager.reportSimpleEvent(undefined, {})).rejected().then(() => {
        return Should(EventManager.reportSimpleEvent(null, {})).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved();
      });
    });
    it('eventName must be string', () => {
      return Should(EventManager.reportSimpleEvent(true, {})).rejected().then(() => {
        return Should(EventManager.reportSimpleEvent(false, {})).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent(100, {})).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent({}, {})).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent([], {})).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent(() => {}, {})).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved();
      });
    });
    it('eventFields is optional', () => {
      return Should(EventManager.reportSimpleEvent('eventName', undefined)).resolved().then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', null)).resolved();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved();
      });
    });
    it('eventFields must be object', () => {
      return Should(EventManager.reportSimpleEvent('eventName', true)).rejected().then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', false)).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', 100)).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', 'eventFields')).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', [])).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', () => {})).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved();
      });
    });
    it('eventField values must be boolean, null, number, or string', () => {
      return Should(EventManager.reportSimpleEvent('eventName', {prop: []})).rejected().then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: () => {}})).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: {}})).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: undefined})).rejected();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: true})).resolved();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: false})).resolved();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: null})).resolved();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: 100})).resolved();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: 1.234})).resolved();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: 'stringValue'})).resolved();
      });
    });
    it('conversion to scientific notation should not throw error', () => {
      return Should(EventManager.reportSimpleEvent('eventName', {prop: 1000000000000000000000000001})).resolved().then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: (1234 / 100000000000)})).resolved();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent('eventName', {prop: 1.234e-8})).resolved();
      });
    });
    it('event structure is correct', () => {
      const server = Sinon.fakeServer.create()
      server.respondImmediately = true;
      const eventName = 'simpleEventName';
      const eventFields = {a: 123, b: 'string', c: true, d: false, e: null};
      const expectedFieldsResult = {a: '123', b: 'string', c: 'true', d: 'false', e: null};
      return Should(EventManager.flushEventQueue()).resolved().then(() => {
        server.resetHistory();
        server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
        return Should(EventManager.reportSimpleEvent(eventName)).resolved();
      }).then(() => {
        return Should(EventManager.reportSimpleEvent(eventName, eventFields)).resolved()
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
        Should(firstEvent.name).equal(eventName);
        Should(firstEvent.additionalFields).Object();
        Should(firstEvent.additionalFields).deepEqual({});
        Should(secondEvent.name).equal(eventName);
        Should(secondEvent.additionalFields).Object();
        Should(secondEvent.additionalFields).deepEqual(expectedFieldsResult);
        server.restore();
      });
    });
  });

  describe('reportRawEvent', () => {
    it('rawEvent is required', () => {
      return Should(EventManager.reportRawEvent()).rejected().then(() => {
        return Should(EventManager.reportRawEvent(undefined)).rejected();
      }).then(() => {
        return Should(EventManager.reportRawEvent(null)).rejected();
      }).then(() => {
        return Should(EventManager.reportRawEvent('{}')).resolved();
      });
    });
    it('rawEvent must be a string', () => {
      return Should(EventManager.reportRawEvent(true)).rejected().then(() => {
        return Should(EventManager.reportRawEvent(false)).rejected();
      }).then(() => {
        return Should(EventManager.reportRawEvent(100)).rejected();
      }).then(() => {
        return Should(EventManager.reportRawEvent({})).rejected();
      }).then(() => {
        return Should(EventManager.reportRawEvent([])).rejected();
      }).then(() => {
        return Should(EventManager.reportRawEvent(() => {})).rejected();
      }).then(() => {
        return Should(EventManager.reportRawEvent('querString?property=value')).resolved();
      }).then(() => {
        return Should(EventManager.reportRawEvent('{"a":123}')).resolved();
      }); 
    });
    it('event structure is correct', () => {
      const server = Sinon.fakeServer.create()
      server.respondImmediately = true;
      const rawEvent = '{"name":"rawEventName","a":123,"b":"string","c":[1,2,3]}';
      return Should(EventManager.flushEventQueue()).resolved().then(() => {
        server.resetHistory();
        server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
        return Should(EventManager.reportRawEvent(rawEvent)).resolved();
      }).then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        const parsed = JSON.parse(request.requestBody);
        Should(parsed.events).Array();
        Should(parsed.events).length(1);
        const event = parsed.events[0];
        Should(event).String();
        Should(event).deepEqual(rawEvent);
        server.restore();
      });
    });
  });

  describe('All events', () => {
    let server;
    let options;
    before(() => {
      server = Sinon.fakeServer.create()
      server.respondImmediately = true;
      State.set('apiKey', 'testApiKey');
      State.set('initialized', true);
      options = {tier: 1, authMode: 'client', environment: 'dev', appUri: 'testAppUri', version: '1.0.0', build: '1.0.0.100'};
      State.set('options', options);
      State.set('user', {id: 'userAlpId'});
      State.set('learner', {id: 'learnerAlpId'});
      return EventManager.flushEventQueue();
    });
    beforeEach(() => {
      server.resetHistory();
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
    });
    after(() => {
      server.restore();
      State.clear();
    });
    it('event request is correct format', () => {
      return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(request.method).equal('POST');
        Should(request.url).endWith(Constants.ENDPOINT.INGESTION);
        const parsed = JSON.parse(request.requestBody);
        Should(parsed.events).Array();
        Should(parsed.appInfo).Object();
        Should(parsed.appInfo.uri).equal('testAppUri');
        Should(parsed.appInfo.version).equal('1.0.0');
        Should(parsed.appInfo.build).equal('1.0.0.100');
        Should(parsed.learnerInfo.userId).equal('userAlpId');
        Should(parsed.learnerInfo.learnerId).equal('learnerAlpId');
        Should(parsed.deviceInfo).Object();
        if (parsed.deviceInfo.deviceType) {
          Should(parsed.deviceInfo.deviceType).String();
        }
        if (parsed.deviceInfo.language) {
          Should(parsed.deviceInfo.language).String();
        }
      })
    });
    it('events are grouped by learner/app/device info', () => {
      return Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
        return Should(EventManager.reportRawEvent('{"name":"eventName"}')).resolved();
      }).then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        const parsed = JSON.parse(request.requestBody);
        Should(parsed.events).Array();
        Should(parsed.events.length).equal(2);
      })
    });
    it('separate events by different app info', () => {
      return Should(EventManager.reportSimpleEvent('eventName1', {})).resolved().then(() => {
        options.appUri = 'differentAppUri';
        State.set('options', options);
        return Should(EventManager.reportSimpleEvent('eventName2', {})).resolved();
      }).then(() => {
        options.appUri = 'testAppUri';
        options.version = '1.0.1';
        State.set('options', options);
        return Should(EventManager.reportSimpleEvent('eventName3', {})).resolved();
      }).then(() => {
        options.version = '1.0.0';
        options.build = '1.0.0.101';
        State.set('options', options);
        return Should(EventManager.reportSimpleEvent('eventName4', {})).resolved();
      }).then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(4);
        Should(JSON.parse(server.requests[0].requestBody).events).length(1);
        Should(JSON.parse(server.requests[0].requestBody).events[0].name).equal('eventName1');
        Should(JSON.parse(server.requests[0].requestBody).appInfo.uri).equal('testAppUri');
        Should(JSON.parse(server.requests[0].requestBody).appInfo.version).equal('1.0.0');
        Should(JSON.parse(server.requests[0].requestBody).appInfo.build).equal('1.0.0.100');
        Should(JSON.parse(server.requests[1].requestBody).events).length(1);
        Should(JSON.parse(server.requests[1].requestBody).events[0].name).equal('eventName2');
        Should(JSON.parse(server.requests[1].requestBody).appInfo.uri).equal('differentAppUri');
        Should(JSON.parse(server.requests[1].requestBody).appInfo.version).equal('1.0.0');
        Should(JSON.parse(server.requests[1].requestBody).appInfo.build).equal('1.0.0.100');
        Should(JSON.parse(server.requests[2].requestBody).events).length(1);
        Should(JSON.parse(server.requests[2].requestBody).events[0].name).equal('eventName3');
        Should(JSON.parse(server.requests[2].requestBody).appInfo.uri).equal('testAppUri');
        Should(JSON.parse(server.requests[2].requestBody).appInfo.version).equal('1.0.1');
        Should(JSON.parse(server.requests[2].requestBody).appInfo.build).equal('1.0.0.100');
        Should(JSON.parse(server.requests[3].requestBody).events).length(1);
        Should(JSON.parse(server.requests[3].requestBody).events[0].name).equal('eventName4');
        Should(JSON.parse(server.requests[3].requestBody).appInfo.uri).equal('testAppUri');
        Should(JSON.parse(server.requests[3].requestBody).appInfo.version).equal('1.0.0');
        Should(JSON.parse(server.requests[3].requestBody).appInfo.build).equal('1.0.0.101');
      });
    });
    it('separate events by different user/learner', () => {
      State.set('user', {id:'userAlpId'});
      State.set('learner', {id:'learnerAlpId'});
      return Should(EventManager.reportSimpleEvent('eventName1', {})).resolved().then(() => {
        State.set('learner', undefined);
        return Should(EventManager.reportSimpleEvent('eventName2', {})).resolved();
      }).then(() => {
        State.set('user', {id:'userAlpId2'});
        State.set('learner', {id:'learnerAlpId'});
        return Should(EventManager.reportSimpleEvent('eventName3', {})).resolved();
      }).then(() => {
        State.set('learner', {id:'learnerAlpId2'});
        return Should(EventManager.reportSimpleEvent('eventName4', {})).resolved();
      }).then(() => {
        return Should(EventManager.flushEventQueue()).resolved();
      }).then(result => {
        Should(server.requests).length(4);
        Should(JSON.parse(server.requests[0].requestBody).events).length(1);
        Should(JSON.parse(server.requests[0].requestBody).events[0].name).equal('eventName1');
        Should(JSON.parse(server.requests[0].requestBody).learnerInfo.userId).equal('userAlpId')
        Should(JSON.parse(server.requests[0].requestBody).learnerInfo.learnerId).equal('learnerAlpId')
        Should(JSON.parse(server.requests[1].requestBody).events).length(1);
        Should(JSON.parse(server.requests[1].requestBody).events[0].name).equal('eventName2');
        Should(JSON.parse(server.requests[1].requestBody).learnerInfo.userId).equal('userAlpId')
        Should(JSON.parse(server.requests[1].requestBody).learnerInfo.learnerId).equal(undefined)
        Should(JSON.parse(server.requests[2].requestBody).events).length(1);
        Should(JSON.parse(server.requests[2].requestBody).events[0].name).equal('eventName3');
        Should(JSON.parse(server.requests[2].requestBody).learnerInfo.userId).equal('userAlpId2')
        Should(JSON.parse(server.requests[2].requestBody).learnerInfo.learnerId).equal('learnerAlpId')
        Should(JSON.parse(server.requests[3].requestBody).events).length(1);
        Should(JSON.parse(server.requests[3].requestBody).events[0].name).equal('eventName4');
        Should(JSON.parse(server.requests[3].requestBody).learnerInfo.userId).equal('userAlpId2')
        Should(JSON.parse(server.requests[3].requestBody).learnerInfo.learnerId).equal('learnerAlpId2')
      });
    });
    it('event requires user to be specified when using authMode:server', () => {
      options.authMode = 'server';
      State.set('options', options);
      State.set('user', undefined);
      return Should(EventManager.reportSimpleEvent('eventName', {})).rejected().then(() => {
        State.set('user', {id:'userAlpId'});
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved();
      }).then(() => {
        options.authMode = 'client';
        State.set('options', options);
        State.set('user', undefined);
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved();
      }).then(() => {
        State.set('user', {id:'userAlpId'});
        return Should(EventManager.reportSimpleEvent('eventName', {})).resolved();
      });
    });
  });

  describe('flushEventQueue', () => {
    let server;
    const spyAutoFlushCallback = Sinon.spy();
    before(() => {
      server = Sinon.fakeServer.create()
      server.respondImmediately = true;
      State.set('apiKey', 'testApiKey');
      State.set('initialized', true);
      State.set('options', {tier: 1, autoFlushInterval: 0, environment: 'dev', autoFlushCallback: [spyAutoFlushCallback]});
      return EventManager.flushEventQueue();
    });
    beforeEach(() => {
      server.resetHistory();
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      spyAutoFlushCallback.resetHistory();
    });
    after(() => {
      server.restore();
      State.clear();
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
  });

  describe('autoFlush', () => {
    let server;
    const spyAutoFlushCallback = Sinon.spy();
    let spyFlushEventQueue;
    const autoFlushInterval = 500;
    let options = {tier: 1, autoFlushInterval, environment: 'dev', autoFlushCallback: [spyAutoFlushCallback], loggingLevel: 'none'};
    before(() => {
      server = Sinon.fakeServer.create()
      spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      server.respondImmediately = true;
      State.set('apiKey', 'testApiKey');
      State.set('initialized', true);
      return EventManager.flushEventQueue();
    });
    beforeEach(() => {
      server.resetHistory();
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      spyAutoFlushCallback.resetHistory();
      spyFlushEventQueue.resetHistory();
      State.set('options', options);
    });
    after(() => {
      spyFlushEventQueue.restore();
      server.restore();
      State.clear();
    });

    describe('startAutoFlush', () => {
      beforeEach(() => {
        return EventManager.stopAutoFlush();
      });
      it('events are flushed based on autoFlushInterval', done => {
        Should(EventManager.startAutoFlush()).resolved().then(() => {
          setTimeout(() => {
            Should(spyFlushEventQueue.callCount).equal(1);
            Should(spyAutoFlushCallback.callCount).equal(1);
          }, autoFlushInterval * 1.5)
          setTimeout(() => {
            Should(spyFlushEventQueue.callCount).equal(2);
            Should(spyAutoFlushCallback.callCount).equal(2);
            done();
          }, autoFlushInterval * 2.5)
        });
      });
      it('autoFlushCallback has http status for requests as argument', done => {
        Should(EventManager.reportSimpleEvent('eventName', {})).resolved().then(() => {
          return Should(EventManager.startAutoFlush()).resolved();
        }).then(() => {
          setTimeout(() => {
            Should(spyFlushEventQueue.callCount).equal(1);
            Should(spyAutoFlushCallback.callCount).equal(1);
            const result = spyAutoFlushCallback.firstCall.args[0];
            Should(result).Array();
            Should(result.length).equal(1);
            Should(result[0].state).equal('fulfilled');
            Should(result[0].value).equal('ok');
            done();
          }, autoFlushInterval * 1.5)
        });
      });
      it('autoFlushCallback has empty array as argument', done => {
        Should(EventManager.startAutoFlush()).resolved().then(() => {
          setTimeout(() => {
            Should(spyFlushEventQueue.callCount).equal(1);
            Should(spyAutoFlushCallback.callCount).equal(1);
            const result = spyAutoFlushCallback.firstCall.args[0]
            Should(result).Array();
            Should(result.length).equal(0);
            done();
          }, autoFlushInterval * 1.5)
        });
      });
      it('can be called multiple times', () => {
        return Should(EventManager.startAutoFlush()).resolved().then(() => {
          return Should(EventManager.startAutoFlush()).resolved();
        });
      });
      it('events can still be manaully flushed with flushEventQueue', () => {
        return Should(EventManager.startAutoFlush()).resolved().then(() => {
          return Should(EventManager.flushEventQueue()).resolved();
        });
      });
      it('autoFlushInterval of 0 disables auto flush', done => {
        options.autoFlushInterval = 0;
        State.set('options', options)
        Should(EventManager.startAutoFlush()).resolved().then(() => {
          setTimeout(() => {
            Should(spyFlushEventQueue.callCount).equal(0);
            Should(spyAutoFlushCallback.callCount).equal(0);
            done();
          }, 1000)
        });
      });
    });

    describe('stopAutoFlush', () => {
      beforeEach(() => {
        return EventManager.startAutoFlush();
      });
      it('events are no longer automatically flushed', done => {
        Should(EventManager.stopAutoFlush()).resolved().then(() => {
          setTimeout(() => {
            Should(spyAutoFlushCallback.notCalled).true();
          }, autoFlushInterval * 1.5)
          setTimeout(() => {
            Should(spyAutoFlushCallback.notCalled).true();
            done();
          }, autoFlushInterval * 2.5)
        });
      });
      it('can be called multiple times', () => {
        return Should(EventManager.stopAutoFlush()).resolved().then(() => {
          return Should(EventManager.stopAutoFlush()).resolved();
        });
      });
      it('events can still be manaully flushed with flushEventQueue', () => {
        return Should(EventManager.stopAutoFlush()).resolved().then(() => {
          return Should(EventManager.flushEventQueue()).resolved();
        });
      });
    });
  });
});
