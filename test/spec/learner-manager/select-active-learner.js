'use strict';
import TestConstants from './test-constants';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import LearnerManager from '../../../src/learner-manager';
import State from '../../../src/state';
import Should from 'should';
import Sinon from 'sinon';

export default () => {

  describe('selectActiveLearner', () => {

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

    describe('Validate providerLearnerId', () => {

      describe('providerLearnerId is required and must be a string', () => {
        beforeEach(() => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          TestUtils.setStateOptions({
            authMode: 'client'
          });
        });

        const learnerId = TestConstants.clientUserObjectResponse.learners[0].providerId;
        const testFunction = parameter => {
          return LearnerManager.selectActiveLearner(parameter);
        };
        TestUtils.validatePromiseProperty(testFunction, 'string', true, [learnerId]);
      });

    }); //END Validate providerLearnerId

    describe('authMode:server', () => {

      beforeEach(() => {
        TestUtils.setStateOptions({
          authMode: 'server'
        });
      });

      describe('State', () => {

        it('Validate providerLearnerId against userObject', () => {
          TestUtils.setState({
            singletonLearner: false,
            user: TestConstants.serverUserObject
          });
          const learnerId = TestConstants.serverUserObject.learners[0].providerId;
          return Should(LearnerManager.selectActiveLearner('randomId')).rejected().then(() => { 
            return Should(LearnerManager.selectActiveLearner(learnerId)).resolved();
          });
        });

        it('Learner data is stored', () => {
          TestUtils.setState({
            singletonLearner: false,
            user: TestConstants.serverUserObject
          });
          const learner = TestConstants.serverUserObject.learners[0];
          const learnerId = learner.providerId;
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(State.get('learnerId')).deepEqual(learner.id);
          });
        });

      }); //END State

      describe('API', () => {

        it('No API call sent', () => {
          TestUtils.setState({
            singletonLearner: false,
            user: TestConstants.serverUserObject
          });
          const learnerId = TestConstants.serverUserObject.learners[0].providerId;
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(server.requests).length(0);
          });
        });

      }); //END State

      describe('Function calls', () => {

        let spyLogout;

        before(() => {
          spyLogout = Sinon.spy(LearnerManager, 'logout');
        });

        beforeEach(() => {
          spyLogout.resetHistory();
        });

        after(() => {
          spyLogout.restore();
        });

        it('logout not called when learner exists', () => {
          TestUtils.setState({
            singletonLearner: false,
            user: TestConstants.serverUserObject
          });
          const learnerId = TestConstants.serverUserObject.learners[0].providerId;
          Should(spyLogout.called).false();
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(spyLogout.called).false();
          });
        });

        it('logout not called when learner does not exist', () => {
          TestUtils.setState({
            singletonLearner: false,
            user: TestConstants.serverUserObject
          });
          const learnerId = TestConstants.serverUserObject.learners[0].providerId;
          Should(spyLogout.called).false();
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(spyLogout.called).false();
          });
        });

      }); //END Function calls

    }); //END authMode:server

    describe('authMode:client', () => {

      beforeEach(() => {
        TestUtils.setStateOptions({
          authMode: 'client'
        });
      });

      describe('State', () => {

        it('Learners are merged when setUser called but learner does exist', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          const userId = TestConstants.clientUserObject.providerUserId;
          const existingLearner = {id: 999, providerId: 'someLearnerId'};
          TestUtils.setState({
            singletonLearner: false,
            user: {providerId: userId, learners:[existingLearner]}
          });
          const learnerId = TestConstants.clientUserObjectResponse.learners[0].providerId;
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            const user = State.get('user');
            Should(user.learners).length(TestConstants.clientUserObjectResponse.learners.length + 1);
            Should(user.learners[0]).deepEqual(existingLearner);
            Should(user.learners[1]).deepEqual(TestConstants.clientUserObjectResponse.learners[0]);
          });
        });

        it('User and Learner data is stored', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          const learner = TestConstants.clientUserObjectResponse.learners[0];
          const learnerId = learner.providerId;
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(server.requests).length(1);
            Should(State.get('learnerId')).deepEqual(learner.id);
          });
        });

        it('singletonLearner is set to true when no setUser is called', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.singletonUserObjectResponse)]);
          const learnerId = TestConstants.singletonUserObjectResponse.learners[0].providerId;
          Should(State.get('singletonLearner')).equal(undefined);
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(State.get('singletonLearner')).equal(true);
          });
        });

        it('singletonLearner remains false when setUser is called', () => {
          const userId = TestConstants.clientUserObject.providerUserId;
          TestUtils.setState({
            singletonLearner: false,
            user: {providerId: userId, learners:[]}
          });
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.singletonUserObjectResponse)]);
          const learnerId = TestConstants.singletonUserObjectResponse.learners[0].providerId;
          Should(State.get('singletonLearner')).equal(false);
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(State.get('singletonLearner')).equal(false);
          });
        });

      }); //END State

      describe('API Calls', () => {

        it('API call when no setUser called for initial learner', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          const learnerId = TestConstants.clientUserObjectResponse.learners[0].providerId;
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(server.requests).length(1);
            const request = server.requests[0];
            Should(request.method).equal('POST');
            Should(request.url).endWith(Constants.ENDPOINT.CLIENT_SESSION);
            const parsed = JSON.parse(request.requestBody);
            Should(parsed.providerUserId).equal(undefined);
            Should(parsed.providerLearnerId).equal(learnerId);
          });
        });

        it('API call when no setUser called for new learner', () => {
          TestUtils.setState({
            singletonLearner: true,
            user: {providerId: 'randomId', learners:[{id: 300, providerId: 'randomId'}]},
            learnerId: 300
          });
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          const learnerId = TestConstants.clientUserObjectResponse.learners[0].providerId;
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(server.requests).length(1);
            const request = server.requests[0];
            Should(request.method).equal('POST');
            Should(request.url).endWith(Constants.ENDPOINT.CLIENT_SESSION);
            const parsed = JSON.parse(request.requestBody);
            Should(parsed.providerUserId).equal(undefined);
            Should(parsed.providerLearnerId).equal(learnerId);
          });
        });

        it('API call sent when setUser called but learner does not exist', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          const userId = TestConstants.clientUserObject.providerUserId;
          TestUtils.setState({
            singletonLearner: false,
            user: {providerId: userId, learners:[]}
          });
          const learnerId = TestConstants.clientUserObjectResponse.learners[0].providerId;
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(server.requests).length(1);
            const request = server.requests[0];
            Should(request.method).equal('POST');
            Should(request.url).endWith(Constants.ENDPOINT.CLIENT_SESSION);
            const parsed = JSON.parse(request.requestBody);
            Should(parsed.providerUserId).equal(userId);
            Should(parsed.providerLearnerId).equal(learnerId);
          });
        });

        it('No API call when setUser called but learner does exist', () => {
          const userId = TestConstants.clientUserObject.providerUserId;
          const learnerId = TestConstants.singletonUserObjectResponse.learners[0].providerId;
          TestUtils.setState({
            singletonLearner: false,
            user: {providerId: userId, learners:[{providerId: learnerId}]}
          });
          Should(server.requests).length(0);
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(server.requests).length(0);
          });
        });

        it('Failed API call results in promise rejection', () => {
          server.respondWith([500, {}, '']);
          const learnerId = TestConstants.clientUserObjectResponse.learners[0].providerId;
          return Should(LearnerManager.selectActiveLearner(learnerId)).rejected().then((error) => {
            Should(server.requests).length(1);
            Should(error.message).startWith('KidaptiveError');
          });
        });

        it('Failed API call when setUser called keeps existing user and learner', () => {
          const user = {providerId: 'randomUserId', learners:[{id: 300, providerId: 'randomLearnerId'}]};
          const learnerId = 300;
          TestUtils.setState({
            singletonLearner: false,
            user,
            learnerId
          });
          server.respondWith([500, {}, '']);
          return Should(LearnerManager.selectActiveLearner('newRandomLearnerId')).rejected().then((error) => {
            Should(State.get('user')).deepEqual(user);
            Should(State.get('learnerId')).equal(learnerId);
          });
        });

        it('Failed API call when no setUser called removes user and learner', () => {
          const user = {providerId: 'randomId', learners:[{id: 300, providerId: 'randomId'}]};
          const learnerId = 300;
          TestUtils.setState({
            singletonLearner: true,
            user,
            learnerId
          });
          server.respondWith([500, {}, '']);
          return Should(LearnerManager.selectActiveLearner('newRandomLearnerId')).rejected().then((error) => {
            Should(State.get('user')).not.deepEqual(user);
            Should(State.get('user')).equal(undefined);
            Should(State.get('learnerId')).not.equal(learnerId);
            Should(State.get('learnerId')).equal(undefined);
          });
        });

      }); //END API Calls

      describe('Function calls', () => {

        let spyLogout;

        before(() => {
          spyLogout = Sinon.spy(LearnerManager, 'logout');
        });

        beforeEach(() => {
          spyLogout.resetHistory();
        });

        after(() => {
          spyLogout.restore();
        });

        it('logout called when no setUser is called and new learner ID provided', () => {
          TestUtils.setState({
            singletonLearner: true,
            user: {providerId: 'randomId', learners:[{id: 300, providerId: 'randomId'}]},
            learnerId: 300
          });
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.singletonUserObjectResponse)]);
          const learnerId = TestConstants.singletonUserObjectResponse.learners[0].providerId;
          Should(spyLogout.called).false();
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(spyLogout.called).true();
          });
        });

        it('logout is called when no setUser is called and new learner ID provided, but there is API error', () => {
          TestUtils.setState({
            singletonLearner: true,
            user: {providerId: 'randomId', learners:[{id: 300, providerId: 'randomId'}]},
            learnerId: 300
          });
          server.respondWith([500, {}, '']);
          const learnerId = TestConstants.singletonUserObjectResponse.learners[0].providerId;
          Should(spyLogout.called).false();
          return Should(LearnerManager.selectActiveLearner(learnerId)).rejected().then(() => {
            Should(spyLogout.called).true();
          });
        });

        it('logout is not called when no setUser is called and initial learner is provided', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.singletonUserObjectResponse)]);
          const learnerId = TestConstants.singletonUserObjectResponse.learners[0].providerId;
          Should(spyLogout.called).false();
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(spyLogout.called).false();
          });
        });

        it('logout is not called when no setUser is called and existing learner ID provided', () => {
          const learnerId = TestConstants.singletonUserObjectResponse.learners[0].providerId;
          TestUtils.setState({
            singletonLearner: true,
            user: {providerId: learnerId, learners:[{id: 300, providerId: learnerId}]},
            learnerId: 300
          });
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.singletonUserObjectResponse)]);
          Should(spyLogout.called).false();
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(spyLogout.called).false();
          });
        });

        it('logout is not called when setUser is called and learner exists', () => {
          const userId = TestConstants.clientUserObject.providerUserId;
          const learnerId = TestConstants.singletonUserObjectResponse.learners[0].providerId;
          TestUtils.setState({
            singletonLearner: false,
            user: {providerId: userId, learners:[{providerId: learnerId}]}
          });
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.singletonUserObjectResponse)]);
          Should(spyLogout.called).false();
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(spyLogout.called).false();
          });
        });

        it('logout is not called when setUser is called and learner does not exists', () => {
          const userId = TestConstants.clientUserObject.providerUserId;
          const learnerId = TestConstants.singletonUserObjectResponse.learners[0].providerId;
          TestUtils.setState({
            singletonLearner: false,
            user: {providerId: userId, learners:[]}
          });
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.singletonUserObjectResponse)]);
          Should(spyLogout.called).false();
          return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
            Should(spyLogout.called).false();
          });
        });

      }); //END Function calls

    }); //END authMode:client

  }); //END selectActiveLearner

}; //END export
