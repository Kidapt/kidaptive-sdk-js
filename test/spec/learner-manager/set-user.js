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

    describe('authMode:server', () => {

      beforeEach(() => {
        TestUtils.setStateOptions({
          authMode: 'server'
        });
      });

      describe('validate userObject', () => {

        let userObject;
        beforeEach(() => {
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

      }); //END validate userObject


      describe('API calls', () => {

        it('No API call sent', () => {
          return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
            Should(server.requests).length(0);
          });
        });

      }); //END API calls

      describe('User and Learner State', () => {

        it('Data is stored', () => {
          return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
            Should(State.get('user')).deepEqual(TestConstants.serverUserObject);
          });
        });

        it('User is replaced when same user is provided', () => {
          TestUtils.setState({user: TestConstants.serverUserObject});
          const newUserObject = Utils.copyObject(TestConstants.serverUserObject);
          newUserObject.apiKey = 'newApiKey';
          return Should(LearnerManager.setUser(newUserObject)).resolved().then(() => {
            Should(State.get('user')).not.deepEqual(TestConstants.serverUserObject);
            Should(State.get('user')).deepEqual(newUserObject);
          });
        });

        it('Learner data is cleared', () => {
          TestUtils.setState({
            learnerId: 100
          });
          return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
            Should(State.get('learnerId')).equal(undefined);
          });
        });

        it('singletonLearner is set to false', () => {
          Should(State.get('singletonLearner')).equal(undefined);
          return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
            Should(State.get('singletonLearner')).equal(false);
          });
        });

      }); //END User and Learner State

      describe('Function Calls', () => {

        let spyLogout;
        let spyFlushEventQueue;

        before(() => {
          spyLogout = Sinon.spy(LearnerManager, 'logout');
          spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
        });

        beforeEach(() => {
          spyLogout.resetHistory();
          spyFlushEventQueue.resetHistory();
        });

        after(() => {
          spyLogout.restore();
          spyFlushEventQueue.restore();
        });

        it('Logout is called when initial user is provided', () => {
          Should(spyLogout.called).false();
          return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
            Should(spyLogout.called).true();
          });
        });

        it('Logout is called when new user is provided', () => {
          TestUtils.setState({
            singletonLearner: false,
            user: {
              apiKey: 'oldApiKey',
              id: 999,
              providerId: 'oldUserProviderId',
            }
          });
          Should(spyLogout.called).false();
          return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
            Should(spyLogout.called).true();
          });
        });

        it('Logout is not called when same user is provided', () => {
          TestUtils.setState({
            singletonLearner: false,
            user: TestConstants.serverUserObject
          });
          Should(spyLogout.called).false();
          return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
            Should(spyLogout.called).false();
          });
        });

        it('Event queue is flushed', () => {
          Should(spyFlushEventQueue.called).false();
          return Should(LearnerManager.setUser(TestConstants.serverUserObject)).resolved().then(() => {
            Should(spyFlushEventQueue.called).true();
          });
        });

      }); //END Function Calls

    }); //END authMode:server

    describe('authMode:client', () => {

      beforeEach(() => {
        TestUtils.setStateOptions({
          authMode: 'client'
        });
      });
      
      describe('validate userObject', () => {

        let userObject;
        beforeEach(() => {
          server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
          userObject = Utils.copyObject(TestConstants.clientUserObject);
        });

        describe('Provider User ID is required and must be a string', () => {
          const testFunction = parameter => {
            userObject.providerUserId = parameter;
            return LearnerManager.setUser(userObject);
          };
          TestUtils.validatePromiseProperty(testFunction, 'string', true);
        });

        describe('Able to pass in entire userObject if restricted fields not specified (not just providerUserId)', () => {
          const testFunction = parameter => {
            userObject.providerLearnerId = parameter
            return LearnerManager.setUser(userObject)
          }
          TestUtils.validatePromiseProperty(testFunction, 'string', false);
        })

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

      }); //END validate userObject


      describe('API calls', () => {

        it('API call sent', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
            Should(server.requests).length(1);
            const request = server.requests[0];
            Should(request.method).equal('POST');
            Should(request.url).endWith(Constants.ENDPOINT.CLIENT_SESSION);
            const parsed = JSON.parse(request.requestBody);
            Should(parsed.providerUserId).equal(TestConstants.clientUserObject.providerUserId);
          });
        });

        it('Failed API call results in promise rejection', () => {
          server.respondWith([500, {}, '']);
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).rejected().then((error) => {
            Should(server.requests).length(1);
            Should(error.message).startWith('KidaptiveError');
          });
        });

        it('API is called when same user is provided', () => {
          TestUtils.setState({
            singletonLearner: false,
            user: TestConstants.clientUserObjectResponse
          });
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
            Should(server.requests).length(1);
            const request = server.requests[0];
            Should(request.method).equal('POST');
            Should(request.url).endWith(Constants.ENDPOINT.CLIENT_SESSION);
            const parsed = JSON.parse(request.requestBody);
            Should(parsed.providerUserId).equal(TestConstants.clientUserObject.providerUserId);
          });
        });

      }); //END API calls

      describe('User and Learner State', () => {

        it('Data is stored', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
            Should(server.requests).length(1);
            Should(State.get('user')).deepEqual(TestConstants.clientUserObjectResponse);
          });
        });

        it('User is replaced when same user is provided', () => {
          TestUtils.setState({
            singletonLearner: false,
            user: TestConstants.clientUserObjectResponse
          });
          const newUserObject = Utils.copyObject(TestConstants.clientUserObjectResponse);
          const newLearner = {
            id: 300,
            providerId: 'providerLearnerId2'
          };
          newUserObject.learners.push(newLearner);
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(newUserObject)]);
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
            Should(State.get('user')).not.deepEqual(TestConstants.clientUserObjectResponse);
            Should(State.get('user')).deepEqual(newUserObject);
          });
        });

        it('Learner data is cleared', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          TestUtils.setState({
            learnerId: 100
          });
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
            Should(server.requests).length(1);
            Should(State.get('learnerId')).equal(undefined);
          });
        });

        it('Learner and user data not cleared when API error', () => {
          server.respondWith([500, {}, '']);
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

        it('singletonLearner is set to false', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          Should(State.get('singletonLearner')).equal(undefined);
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
            Should(State.get('singletonLearner')).equal(false);
          });
        });

      }); //END User and Learner State

      describe('Function Calls', () => {

        let spyLogout;
        let spyFlushEventQueue;

        before(() => {
          spyLogout = Sinon.spy(LearnerManager, 'logout');
          spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
        });

        beforeEach(() => {
          spyLogout.resetHistory();
          spyFlushEventQueue.resetHistory();
        });

        after(() => {
          spyLogout.restore();
          spyFlushEventQueue.restore();
        });

        it('Logout is called when initial user is provided', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          Should(spyLogout.called).false();
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
            Should(spyLogout.called).true();
          });
        });

        it('Logout is called when new user is provided', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          TestUtils.setState({user: {
            id: 999,
            providerId: 'oldUserProviderId',
          }});
          Should(spyLogout.called).false();
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
            Should(spyLogout.called).true();
          });
        });

        it('Logout is not called when same user is provided', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          TestUtils.setState({user: TestConstants.clientUserObjectResponse});
          Should(spyLogout.called).false();
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
            Should(spyLogout.called).false();
          });
        });

        it('Logout is not called when API call fails', () => {
          server.respondWith([500, {}, '']);
          Should(spyLogout.called).false();
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).rejected().then(() => {
            Should(spyLogout.called).false();
          });
        });

        it('Event queue is flushed', () => {
          server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(TestConstants.clientUserObjectResponse)]);
          Should(spyFlushEventQueue.called).false();
          return Should(LearnerManager.setUser(TestConstants.clientUserObject)).resolved().then(() => {
            Should(spyFlushEventQueue.called).true();
          });
        });

      }); //END Function Calls

    }); //END authMode:client

  }); //END setUser

}; //END export
