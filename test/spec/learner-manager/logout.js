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

    it('Event queue is flushed for authMode:server', () => {
      const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      Should(spyFlushEventQueue.called).false();
      return Should(LearnerManager.logout(TestConstants.clientUserObject)).resolved().then(() => {
        Should(spyFlushEventQueue.called).true();
        spyFlushEventQueue.restore();
      });
    });

    it('Event queue is flushed for authMode:client', () => {
      const spyFlushEventQueue = Sinon.spy(EventManager, 'flushEventQueue');
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      Should(spyFlushEventQueue.called).false();
      return Should(LearnerManager.logout(TestConstants.clientUserObject)).resolved().then(() => {
        Should(spyFlushEventQueue.called).true();
        spyFlushEventQueue.restore();
      });
    });

    it('Logout endpoint is called when user defined for authMode:server', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      TestUtils.setStateOptions({
        authMode: 'server'
      });
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

    it('Logout endpoint is not called when no user defined for authMode:server', () => {
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(0);
      });
    });

    it('Logout endpoint is not called when user defined for authMode:client', () => {
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      TestUtils.setState({
        user: {id: 100}
      });
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(0);
      });
    });

    it('Logout endpoint is not called when user not defined for authMode:client', () => {
      TestUtils.setStateOptions({
        authMode: 'client'
      });
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(0);
      });
    });

    it('Any endpoint returning error does not prevent client logout on authMode:server', () => {
      server.respondWith([500, {}, '']);
      TestUtils.setStateOptions({
        authMode: 'server'
      });
      TestUtils.setState({
        user: {id: 100}
      });
      return Should(LearnerManager.logout()).resolved().then(() => {
        Should(server.requests).length(1);
        Should(State.get('user')).equal(undefined);
      });
    });

    it('User and learner data is cleared for authMode:server', () => {
      server.respondWith([200, {'Content-Type': 'application/json'}, '"ok"']);
      TestUtils.setStateOptions({
        authMode: 'server'
      });
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

    it('User and learner data is cleared for authMode:client', () => {
      TestUtils.setStateOptions({
        authMode: 'client'
      });
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

  }); //END logout

}; //END export
