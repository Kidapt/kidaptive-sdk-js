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

  describe('logout', () => {

    let server;
    let spyFlushEventQueue;
    let spyClearUserCache;

    before(() => {
      server = Sinon.fakeServer.create();
      spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      spyClearUserCache = Sinon.spy(Utils, 'clearUserCache');
    });

    beforeEach(() => {
      server.resetHistory();
      server.respondImmediately = true;
      server.respondWith(TestConstants.defaultServerResponse);
      TestUtils.resetStateAndCache();
      TestUtils.setState(TestConstants.defaultState);
      spyFlushEventQueue.resetHistory();
      spyClearUserCache.resetHistory();
    });

    after(() => {
      server.restore();
      TestUtils.resetStateAndCache();
      spyFlushEventQueue.restore();
      spyClearUserCache.restore();
    });

    describe('authMode:server', () => {

      beforeEach(() => {
        TestUtils.setStateOptions({
          authMode: 'server'
        });
      });

      it('Event queue is flushed', () => {
        Should(spyFlushEventQueue.called).false();
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(spyFlushEventQueue.called).true();
        });
      });

      it('User cache is cleared', () => {
        Should(spyClearUserCache.called).false();
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(spyClearUserCache.called).true();
        });
      });

      it('Logout endpoint is called when user defined', () => {
        server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
        TestUtils.setState({
          user: {id: 100}
        });
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(server.requests).length(1);
          const request = server.requests[0];
          Should(request.method).equal('POST');
          Should(request.url).endWith(Constants.ENDPOINT.LOGOUT);
        });
      });

      it('Logout endpoint is not called when no user defined', () => {
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(server.requests).length(0);
        });
      });

      it('User and learner data is cleared', () => {
        server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
        TestUtils.setState({
          user: {id: 100},
          learnerId: 200
        });
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(server.requests).length(1);
          Should(State.get('user')).equal(undefined);
          Should(State.get('learnerId')).equal(undefined);
        });
      });

      it('singletonLearner is set to undefined', () => {
        TestUtils.setState({
          singletonLearner: true
        });
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(State.get('singletonLearner')).equal(undefined);
        });
      });

      it('Any endpoint returning error does not prevent client logout', () => {
        server.respondWith([500, {}, '']);
        TestUtils.setState({
          singletonLearner: true,
          user: {id: 100},
          learnerId: 200,
          eventQueue: [{events: [{name: 'testEvent'}]}]
        });
        Should(spyFlushEventQueue.called).false();
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(server.requests).length(2);
          Should(State.get('user')).equal(undefined);
          Should(State.get('learnerId')).equal(undefined);
          Should(State.get('singletonLearner')).equal(undefined);
          Should(spyClearUserCache.called).true();
        });
      });

    }); //END authMode:server

    describe('authMode:client', () => {

      beforeEach(() => {
        TestUtils.setStateOptions({
          authMode: 'client'
        });
      });

      it('Event queue is flushed', () => {
        Should(spyFlushEventQueue.called).false();
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(spyFlushEventQueue.called).true();
        });
      });

      it('User cache is cleared', () => {
        Should(spyClearUserCache.called).false();
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(spyClearUserCache.called).true();
        });
      });

      it('Logout endpoint is not called when user defined', () => {
        TestUtils.setState({
          user: {id: 100}
        });
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(server.requests).length(0);
        });
      });

      it('Logout endpoint is not called when user not defined', () => {
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(server.requests).length(0);
        });
      });

      it('User and learner data is cleared', () => {
        TestUtils.setState({
          user: {id: 100},
          learnerId: 200
        });
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(server.requests).length(0);
          Should(State.get('user')).equal(undefined);
          Should(State.get('learnerId')).equal(undefined);
        });
      });

      it('singletonLearner is set to undefined', () => {
        TestUtils.setState({
          singletonLearner: true
        });
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(State.get('singletonLearner')).equal(undefined);
        });
      });

      it('Any endpoint returning error does not prevent client logout', () => {
        server.respondWith([500, {}, '']);
        TestUtils.setState({
          singletonLearner: true,
          user: {id: 100},
          learnerId: 200,
          eventQueue: [{events: [{name: 'testEvent'}]}]
        });
        Should(spyFlushEventQueue.called).false();
        return Should(LearnerManager.logout()).resolved().then(() => {
          Should(server.requests).length(1);
          Should(State.get('user')).equal(undefined);
          Should(State.get('learnerId')).equal(undefined);
          Should(State.get('singletonLearner')).equal(undefined);
          Should(spyClearUserCache.called).true();
        });
      });

    }); //END authMode:client

  }); //END logout

}; //END export
