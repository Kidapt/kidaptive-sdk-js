'use strict';
import Constants from '../../src/constants';
import LearnerManager from '../../src/learner-manager';
import EventManager from '../../src/event-manager';
import State from '../../src/state';
import Should from 'should';
import Sinon from 'sinon';

describe('KidaptiveSdk Learner Manager Unit Tests', () => {
  let options = {tier: 1, authMode: 'client', environment: 'dev', autoFlushInterval: 0, loggingLevel: 'none'}
  let server;
  let serverUserObject;
  let clientUserObject;
  let clientUserObjectResponse;
  before(() => {
    server = Sinon.fakeServer.create()
    server.respondImmediately = true;
    State.set('apiKey', 'testApiKey');
    State.set('initialized', true);
    State.set('options', options);
    serverUserObject = {
      apiKey: 'userApiKey',
      id: 100,
      providerId: 'userProviderId',
      learners: [
        {
          id: 200,
          providerId: 'learnerProviderId'
        }
      ]
    };
    clientUserObject = {
      providerUserId: 'userProviderId'
    };
    clientUserObjectResponse = {"id":100,"providerId":"providerUserId","learners":[{"id":200,"providerId":"providerLearnerId"}]};
  });
  beforeEach(() => {
    server.resetHistory();
  });
  after(() => {
    State.clear();
    localStorage.clear();
    server.restore();
  });
  describe('setUser', () => {
    describe('validate userObject for authMode:server', () => {
      let userObject;
      beforeEach(() => {
        options.authMode = 'server';
        State.set('options', options);
        userObject = serverUserObject;
      });
      it('API key is required', () => {
        userObject.apiKey = undefined;
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.apiKey = 'userApiKey';
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('API key must be a string', () => {
        userObject.apiKey = null;
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.apiKey = true;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.apiKey = false;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.apiKey = 100;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.apiKey = {};
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.apiKey = [];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.apiKey = () => {};
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.apiKey = 'userApiKey';
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('ID is required', () => {
        userObject.id = undefined;
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.id = 100;
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('ID must be a number', () => {
        userObject.id = null;
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.id = true;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.id = false;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.id = '100';
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.id = {};
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.id = [];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.id = () => {};
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.id = 100;
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('Learners is required', () => {
        userObject.learners = undefined;
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.learners = [];
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('Learners must be a array', () => {
        userObject.learners = null;
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.learners = true;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = false;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = '100';
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = 100;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = {};
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = () => {};
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [];
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('Learner must be an object', () => {
        userObject.learners = [null];
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.learners = [true];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [false];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = ['100'];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [100];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [[]];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [() => {}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: 200, providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('Learner ID is required', () => {
        userObject.learners = [{providerId: 'learnerProviderId'}];
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.learners = [{id: 200, providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('Learner ID must be a number', () => {
        userObject.learners = [{id: null, providerId: 'learnerProviderId'}];
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.learners = [{id: true, providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: false, providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: '200', providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: {}, providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: [], providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: () => {}, providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: 200, providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('Learner Provider ID is required', () => {
        userObject.learners = [{id: 200}];
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.learners = [{id: 200, providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('Learner Provider ID must be a string', () => {
        userObject.learners = [{id: 200, providerId: null}];
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.learners = [{id: 200, providerId: true}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: 200, providerId: false}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: 200, providerId: 200}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: 200, providerId: {}}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: 200, providerId: []}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: 200, providerId: () => {}}];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.learners = [{id: 200, providerId: 'learnerProviderId'}];
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
    });
    describe('validate userObject for authMode:client', () => {
      let userObject;
      before(() => { 
        server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      });
      beforeEach(() => {
        options.authMode = 'client';
        State.set('options', options);
        userObject = clientUserObject;
      });
      it('Provider User ID is required', () => {
        userObject.providerUserId = undefined;
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.providerUserId = 'userProviderId';
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('Provider User ID must be a string', () => {
        userObject.providerUserId = null;
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.providerUserId = true;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.providerUserId = false;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.providerUserId = 100;
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.providerUserId = {};
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.providerUserId = [];
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.providerUserId = () => {};
          return Should(LearnerManager.setUser(userObject)).rejected();
        }).then(() => { 
          userObject.providerUserId = 'userProviderId';
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('API key must not be defined', () => {
        userObject.apiKey = 'userApiKey';
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.apiKey = undefined;
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('Provider ID must not be defined', () => {
        userObject.providerId = 'userProviderId';
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.providerId = undefined;
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
      it('ID must not be defined', () => {
        userObject.id = 'userProviderId';
        return Should(LearnerManager.setUser(userObject)).rejected().then(() => { 
          userObject.id = undefined;
          return Should(LearnerManager.setUser(userObject)).resolved();
        });
      });
    });
    it('API call sent for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(clientUserObjectResponse)]);
      options.authMode = 'client';
      State.set('options', options);
      return Should(LearnerManager.setUser(clientUserObject)).resolved().then(() => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(request.method).equal('POST');
        Should(request.url).endWith(Constants.ENDPOINT.CLIENT_SESSION);
        const parsed = JSON.parse(request.requestBody);
        Should(parsed.providerUserId).equal(clientUserObject.providerUserId);
      });
    });
    it('No API call sent for authMode:server', () => {
      options.authMode = 'server';
      State.set('options', options);
      return Should(LearnerManager.setUser(serverUserObject)).resolved().then(() => {
        Should(server.requests).length(0);
      });
    });
    it('Failed API call results in promise rejection for authMode:client', () => {
      server.respondWith([500, {}, '']);
      options.authMode = 'client';
      State.set('options', options);
      return Should(LearnerManager.setUser(clientUserObject)).rejected().then((error) => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError');
      });
    });
    it('Data is stored for authMode:server', () => {
      options.authMode = 'server';
      State.set('options', options);
      return Should(LearnerManager.setUser(serverUserObject)).resolved().then(() => {
        Should(State.get('user')).deepEqual(serverUserObject);
      });
    });
    it('Data is stored for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(clientUserObjectResponse)]);
      options.authMode = 'client';
      State.set('options', options);
      State.set('user', undefined);
      State.set('learner', undefined);
      return Should(LearnerManager.setUser(clientUserObject)).resolved().then(() => {
        Should(server.requests).length(1);
        Should(State.get('user')).deepEqual(clientUserObjectResponse);
      });
    });
    it('Learner data is cleared for authMode:server', () => {
      options.authMode = 'server';
      State.set('options', options);
      State.set('learner', {id: 100, providerId: '100'});
      return Should(LearnerManager.setUser(serverUserObject)).resolved().then(() => {
        Should(State.get('learner')).equal(undefined);
      });
    });
    it('Learner data is cleared for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(clientUserObjectResponse)]);
      options.authMode = 'client';
      State.set('options', options);
      State.set('learner', {id: 100, providerId: '100'});
      return Should(LearnerManager.setUser(clientUserObject)).resolved().then(() => {
        Should(server.requests).length(1);
        Should(State.get('learner')).equal(undefined);
      });
    });
    it('Learner and user data not cleared for authMode:client when API error', () => {
      server.respondWith([500, {}, '']);
      options.authMode = 'client';
      State.set('options', options);
      State.set('user', 100);
      State.set('learner', 200);
      return Should(LearnerManager.setUser(clientUserObject)).rejected().then(() => {
        Should(server.requests).length(1);
        Should(State.get('user')).equal(100);
        Should(State.get('learner')).equal(200);
      });
    });
    it('Event queue is flushed for authMode:server', () => {
      const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      options.authMode = 'server';
      State.set('options', options);
      Should(spyFlushEventQueue.called).false();
      return Should(LearnerManager.setUser(serverUserObject)).resolved().then(() => {
        Should(spyFlushEventQueue.called).true();
        spyFlushEventQueue.restore();
      });
    });
    it('Event queue is flushed for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(clientUserObjectResponse)]);
      const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      options.authMode = 'client';
      State.set('options', options);
      Should(spyFlushEventQueue.called).false();
      return Should(LearnerManager.setUser(clientUserObject)).resolved().then(() => {
        Should(spyFlushEventQueue.called).true();
        spyFlushEventQueue.restore();
      });
    });
  });

  describe('selectActiveLearner', () => {
    describe('Validate providerLearnerId', () => {
      beforeEach(() => {
        server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(clientUserObjectResponse)]);
        options.authMode = 'client';
        State.set('options', options);
      });
      it('providerLearnerId is required', () => {
        return Should(LearnerManager.selectActiveLearner(undefined)).rejected().then(() => { 
          return Should(LearnerManager.selectActiveLearner('providerLearnerId')).resolved();
        });
      });
      it('providerLearnerId must be a string', () => {
        return Should(LearnerManager.selectActiveLearner(null)).rejected().then(() => { 
          return Should(LearnerManager.selectActiveLearner(true)).rejected();
        }).then(() => {
          return Should(LearnerManager.selectActiveLearner(false)).rejected();
        }).then(() => {
          return Should(LearnerManager.selectActiveLearner(100)).rejected();
        }).then(() => {
          return Should(LearnerManager.selectActiveLearner({})).rejected();
        }).then(() => {
          return Should(LearnerManager.selectActiveLearner([])).rejected();
        }).then(() => { 
          return Should(LearnerManager.selectActiveLearner(() => {})).rejected();
        }).then(() => {
          return Should(LearnerManager.selectActiveLearner('providerLearnerId')).resolved();
        });
      });
    });
    it('Validate ID for authMode:server against userObject', () => {
      options.authMode = 'server';
      State.set('options', options);
      State.set('user', serverUserObject);
      const learnerId = serverUserObject.learners[0].providerId;
      return Should(LearnerManager.selectActiveLearner('randomId')).rejected().then(() => { 
        return Should(LearnerManager.selectActiveLearner(learnerId)).resolved();
      });
    });
    it('API call sent for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(clientUserObjectResponse)]);
      options.authMode = 'client';
      State.set('options', options);
      const learnerId = clientUserObjectResponse.learners[0].providerId;
      return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(request.method).equal('POST');
        Should(request.url).endWith(Constants.ENDPOINT.CLIENT_SESSION);
        const parsed = JSON.parse(request.requestBody);
        Should(parsed.providerUserId).equal(clientUserObject.providerUserId);
        Should(parsed.providerLearnerId).equal(learnerId);
      });
    });
    it('No API call sent for authMode:server', () => {
      options.authMode = 'server';
      State.set('options', options);
      State.set('user', serverUserObject);
      const learnerId = serverUserObject.learners[0].providerId;
      return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
        Should(server.requests).length(0);
      });
    });
    it('Failed API call results in promise rejection for authMode:client', () => {
      server.respondWith([500, {}, '']);
      options.authMode = 'client';
      State.set('options', options);
      const learnerId = clientUserObjectResponse.learners[0].providerId;
      return Should(LearnerManager.selectActiveLearner(learnerId)).rejected().then((error) => {
        Should(server.requests).length(1);
        Should(error.message).startWith('KidaptiveError');
      });
    });
    it('Learner data is stored for authMode:server', () => {
      options.authMode = 'server';
      State.set('options', options);
      State.set('user', serverUserObject);
      const learner = serverUserObject.learners[0];
      const learnerId = learner.providerId;
      return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
        Should(State.get('learner')).deepEqual(learner);
      });
    });
    it('User and Learner data is stored for authMode:client', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(clientUserObjectResponse)]);
      options.authMode = 'client';
      State.set('options', options);
      const learner = clientUserObjectResponse.learners[0];
      const learnerId = learner.providerId;
      return Should(LearnerManager.selectActiveLearner(learnerId)).resolved().then(() => {
        Should(server.requests).length(1);
        Should(State.get('learner')).deepEqual(learner);
      });
    });
  });

  describe('logout', () => {
    it('Event queue is flushed for authMode:server', () => {
      const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      options.authMode = 'server';
      State.set('options', options);
      State.set('user', undefined);
      State.set('learner', undefined);
      Should(spyFlushEventQueue.called).false();
      return Should(LearnerManager.logout(clientUserObject)).resolved().then(() => {
        Should(spyFlushEventQueue.called).true();
        spyFlushEventQueue.restore();
      });
    });
    it('Event queue is flushed for authMode:client', () => {
      const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      options.authMode = 'client';
      State.set('options', options);
      State.set('user', undefined);
      State.set('learner', undefined);
      Should(spyFlushEventQueue.called).false();
      return Should(LearnerManager.logout(clientUserObject)).resolved().then(() => {
        Should(spyFlushEventQueue.called).true();
        spyFlushEventQueue.restore();
      });
    });
    it('Logout endpoint is called when user defined for authMode:server', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      options.authMode = 'server';
      State.set('options', options);
      State.set('user', {id: 100});
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(1);
        const request = server.requests[0];
        Should(request.method).equal('POST');
        Should(request.url).endWith(Constants.ENDPOINT.LOGOUT);
      });
    });
    it('Logout endpoint is not called when no user defined for authMode:server', () => {
      options.authMode = 'server';
      State.set('options', options);
      State.set('user', undefined);
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(0);
      });
    });
    it('Logout endpoint is not called when user defined for authMode:client', () => {
      options.authMode = 'client';
      State.set('options', options);
      State.set('user', {id: 100});
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(0);
      });
    });
    it('Logout endpoint is not called when user not defined for authMode:client', () => {
      options.authMode = 'client';
      State.set('options', options);
      State.set('user', undefined);
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(0);
      });
    });
    it('Any endpoint returning error does not prevent client logout on authMode:server', () => {
      server.respondWith([500, {}, '']);
      options.authMode = 'server';
      State.set('options', options);
      State.set('user', {id: 100});
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(1);
        Should(State.get('user')).equal(undefined);
      });
    });
    it('User and learner data is cleared for authMode:server', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      options.authMode = 'server';
      State.set('options', options);
      State.set('user', {id: 100});
      State.set('learner', {id: 200});
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(1);
        Should(State.get('user')).equal(undefined);
        Should(State.get('learner')).equal(undefined);
      });
    });
    it('User and learner data is cleared for authMode:client', () => {
      options.authMode = 'client';
      State.set('options', options);
      State.set('user', {id: 100});
      State.set('learner', {id: 200});
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(0);
        Should(State.get('user')).equal(undefined);
        Should(State.get('learner')).equal(undefined);
      });
    });
  });

  describe('clearActiveLearner', () => {
    it('Promise is resolved when learner data is cleared', () => {
      State.set('learner', true);
      Should(State.get('learner')).equal(true);
      return Should(LearnerManager.clearActiveLearner()).resolved().then(() => {
        Should(State.get('learner')).equal(undefined);
      });
    });
  });

  describe('getUser', () => {
    it('Gets user data from state', () => {
      State.set('user', true);
      Should(LearnerManager.getUser()).equal(true);
      State.set('user', undefined);
      Should(LearnerManager.getUser()).equal(undefined);
    });
    it('When a falsey value is set, default to undefined', () => {
      State.set('user', false);
      Should(LearnerManager.getUser()).equal(undefined);
      State.set('user', undefined);
      Should(LearnerManager.getUser()).equal(undefined);
    });
  });

  describe('getActiveLearner', () => {
    it('Gets learner data from state', () => {
      State.set('learner', true);
      Should(LearnerManager.getActiveLearner()).equal(true);
      State.set('learner', undefined);
      Should(LearnerManager.getActiveLearner()).equal(undefined);
    });
    it('When a falsey value is set, default to undefined', () => {
      State.set('learner', false);
      Should(LearnerManager.getActiveLearner()).equal(undefined);
      State.set('learner', undefined);
      Should(LearnerManager.getActiveLearner()).equal(undefined);
    });
  });

  describe('getLearnerList', () => {
    it('Gets learner array from user state', () => {
      State.set('user', {learners: [true]});
      Should(LearnerManager.getLearnerList()).Array;
      Should(LearnerManager.getLearnerList().length).equal(1);
      Should(LearnerManager.getLearnerList()[0]).equal(true);
    });
    it('Defaults to empty array if non array value set', () => {
      State.set('user', {learners: true});
      Should(LearnerManager.getLearnerList()).Array;
      Should(LearnerManager.getLearnerList().length).equal(0);
    });
    it('Defaults to empty array if no learner list set', () => {
      State.set('user', {learners: undefined});
      Should(LearnerManager.getLearnerList()).Array();
      Should(LearnerManager.getLearnerList().length).equal(0);
    });
    it('Defaults to empty array if no user set', () => {
      State.set('user', undefined);
      Should(LearnerManager.getLearnerList()).Array();
      Should(LearnerManager.getLearnerList().length).equal(0);
    });
  });
});
