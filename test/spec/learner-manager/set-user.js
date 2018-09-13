'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import LearnerManager from '../../../src/learner-manager';
import EventManager from '../../../src/event-manager';
import Utils from '../../../src/utils';
import State from '../../../src/state';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('setUser', () => {

    let server;

    before(() => {
      server = Sinon.fakeServer.create();
    });

    beforeEach(() => {
      server.resetHistory();
      server.respondImmediately = true;
      server.respondWith(TestConstants.defaultServerResponse);
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
    });

    after(() => {
      server.restore();
      TestUtils.resetStateAndCache();
    });

    describe('validate userObject for authMode:server', () => {

      let userObject;
      beforeEach(() => {
        TestUtils.setStateOptions({
          authMode: 'server'
        });
        userObject = Utils.copyObject(TestConstants.serverUserObject);
      });

      describe('API key is required and must be a string', () => {
        const testFunction = parameter => {
          userObject.apiKey = parameter;
          return LearnerManager.setUser(userObject);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
      });
      
      describe('ID is required and must be a number', () => {
        const testFunction = parameter => {
          userObject.id = parameter;
          return LearnerManager.setUser(userObject);
        };
        TestUtils.validatePromiseProperty(testFunction, 'number', true);
      });

      describe('Learners is required and must be an array', () => {
        const testFunction = parameter => {
          userObject.learners = parameter;
          return LearnerManager.setUser(userObject);
        };
        TestUtils.validatePromiseProperty(testFunction, 'array', true);
      });

      describe('Learner must be an object if defined', () => {
        const testFunction = parameter => {
          userObject.learners = [parameter];
          return LearnerManager.setUser(userObject);
        };
        TestUtils.validatePromiseProperty(testFunction, 'object', true, [{id:200,providerId:'providerLearnerId'}], [{}]);
      });

      describe('Learner ID is required and must be a number', () => {
        const testFunction = parameter => {
          userObject.learners = [{id: parameter, providerId: 'learnerProviderId'}];
          return LearnerManager.setUser(userObject);
        };
        TestUtils.validatePromiseProperty(testFunction, 'number', true);
      });

      describe('Learner Provider ID is required and must be a string', () => {
        const testFunction = parameter => {
          userObject.learners = [{id: 100, providerId: parameter}];
          return LearnerManager.setUser(userObject);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
      });

    }); //END validate userObject for authMode:server

    describe('validate userObject for authMode:client', () => {

      let userObject;
      beforeEach(() => {
        server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
        TestUtils.setStateOptions({
          authMode: 'client'
        });
        userObject = Utils.copyObject(TestConstants.clientUserObject);
      });

      describe('Provider User ID is required and must be a string', () => {
        const testFunction = parameter => {
          userObject.providerUserId = parameter;
          return LearnerManager.setUser(userObject);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true);
      });

      describe('API key must not be defined', () => {
        const testFunction = parameter => {
          userObject.apiKey = parameter;
          return LearnerManager.setUser(userObject);
        };
        TestUtils.validatePromisePropertyNotSet(testFunction, 'string');
      });

      describe('Provider ID must not be defined', () => {
        const testFunction = parameter => {
          userObject.providerId = parameter;
          return LearnerManager.setUser(userObject);
        };
        TestUtils.validatePromisePropertyNotSet(testFunction, 'string');
      });

      describe('ID must not be defined', () => {
        const testFunction = parameter => {
          userObject.id = parameter;
          return LearnerManager.setUser(userObject);
        };
        TestUtils.validatePromisePropertyNotSet(testFunction, 'number');
      });

    }); //END validate userObject for authMode:client

    it('API call sent for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(request.method).equal('POST');
        Should(request.url).endWith(Constants.ENDPOINT.CLIENT_SESSION);
        const parsed = JSON.parse(request.requestBody);
        Should(parsed.providerUserId).equal(TestConstants.clientUserObject.providerUserId);
      });
    });

    it('No API call sent for authMode:server', () => {
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
        Should(server.requests).length(0);
      });
    });

    it('Failed API call results in promise rejection for authMode:client', () => {
      server.respondWith([500, {}, '']);
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      return Should(LearnerManager.setUser(TestConstants.clientUserObject)).rejected().then((error) => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError');
      });
    });

    it('Data is stored for authMode:server', () => {
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
        Should(State.get('user')).deepEqual(TestConstants.serverUserObject);
      });
    });

    it('Data is stored for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
        Should(server.requests).length(1);
        Should(State.get('user')).deepEqual(TestConstants.clientUserObjectResponse);
      });
    });

    it('Learner data is cleared for authMode:server', () => {
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      TestUtils.setState({
        learnerId: 100
      });
      return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
        Should(State.get('learnerId')).equal(undefined);
      });
    });

    it('Learner data is cleared for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      TestUtils.setState({
        learnerId: 100
      });
      return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
        Should(server.requests).length(1);
        Should(State.get('learnerId')).equal(undefined);
      });
    });

    it('Learner and user data not cleared for authMode:client when API error', () => {
      server.respondWith([500, {}, '']);
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      TestUtils.setState({
        user: 100,
        learnerId: 200
      });
      return Should(LearnerManager.setUser(TestConstants.clientUserObject)).rejected().then(() => {
        Should(server.requests).length(1);
        Should(State.get('user')).equal(100);
        Should(State.get('learnerId')).equal(200);
      });
    });

    it('Event queue is flushed for authMode:server', () => {
      const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      Should(spyFlushEventQueue.called).false();
      return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
        Should(spyFlushEventQueue.called).true();
        spyFlushEventQueue.restore();
      });
    });

    it('Event queue is flushed for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
      const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      Should(spyFlushEventQueue.called).false();
      return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
        Should(spyFlushEventQueue.called).true();
        spyFlushEventQueue.restore();
      });
    });

  }); //END setUser

}; //END export
