'use strict';
import TestConstants from './test-constants';
import TestUtils from '../../test-utils';
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
        TestUtils.validateProperty(testFunction, 'string', true, [learnerId]);
      });

    }); //END Validate providerLearnerId

    it('Validate ID for authMode:server against userObject', () => {
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      TestUtils.setState({
        user: TestConstants.serverUserObject
      });
      const learnerId = TestConstants.serverUserObject.learners[0].providerId;
      return Should(LearnerManager.selectActiveLearner('randomId')).rejected().then(() => { 
        return Should(LearnerManager.selectActiveLearner(learnerId)).resolved();
      });
    });

    it('API call sent for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      const userId = TestConstants.clientUserObject.providerUserId;
      TestUtils.setState({
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

    it('No API call sent for authMode:server', () => {
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      TestUtils.setState({
        user: TestConstants.serverUserObject
      });
      const learnerId = TestConstants.serverUserObject.learners[0].providerId;
      return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
        Should(server.requests).length(0);
      });
    });

    it('Failed API call results in promise rejection for authMode:client', () => {
      server.respondWith([500, {}, '']);
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      const learnerId = TestConstants.clientUserObjectResponse.learners[0].providerId;
      return Should(LearnerManager.selectActiveLearner(learnerId)).rejected().then((error) => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError');
      });
    });

    it('Learner data is stored for authMode:server', () => {
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      TestUtils.setState({
        user: TestConstants.serverUserObject
      });
      const learner = TestConstants.serverUserObject.learners[0];
      const learnerId = learner.providerId;
      return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
        Should(State.get('learnerId')).deepEqual(learner.id);
      });
    });

    it('User and Learner data is stored for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      const learner = TestConstants.clientUserObjectResponse.learners[0];
      const learnerId = learner.providerId;
      return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
        Should(server.requests).length(1);
        Should(State.get('learnerId')).deepEqual(learner.id);
      });
    });

  }); //END selectActiveLearner

}; //END export
