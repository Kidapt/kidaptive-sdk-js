'use strict';
import LearnerManager from '../../src/learner-manager';
import State from '../../src/state';
import Should from 'should';

describe('KidaptiveSdk Learner Manager Unit Tests', () => {
  describe('setUser', () => {
    it('validate userObject for authMode:server', () => {
      //TODO VALIDATE OBJECT
    });
    it('validate userObject for authMode:client', () => {
      //TODO VALIDATE OBJECT
    });
    it('API call sent for authMode:client', () => {
      //TODO API CALL
    });
    it('API call response handled for authMode:client', () => {
      //TODO API CALL
    });
    it('Data is stored for authMode:server', () => {
      //TODO STORE DATA
    });
    it('Data is stored for authMode:client', () => {
      //TODO STORE DATA
    });
    it('Learner data is cleared for authMode:server', () => {
      //TODO CLEAR DATA
    });
    it('Learner data is cleared for authMode:client', () => {
      //TODO CLEAR DATA
    });
    it('Event queue is flushed for authMode:server', () => {
      //TODO FLUSH QUEUE
    });
    it('Event queue is flushed for authMode:client', () => {
      //TODO FLUSH QUEUE
    });
    it('Promise resolves after user data is stored', () => {
      //TODO STORE DATA
    });
  });

  describe('logout', () => {
    it('Event queue is flushed for authMode:server', () => {
      //TODO FLUSH QUEUE
    });
    it('Event queue is flushed for authMode:client', () => {
      //TODO FLUSH QUEUE
    });
    it('Logout endpoint is called when user defined for authMode:server', () => {
      //TODO CLEAR DATA
    });
    it('Logout endpoint is not called when no user defined for authMode:server', () => {
      //TODO CLEAR DATA
    });
    it('Logout endpoint is not called when user defined for authMode:client', () => {
      //TODO CLEAR DATA
    });
    it('User and learner data is cleared for authMode:server', () => {
      //TODO CLEAR DATA
    });
    it('User and learner data is cleared for authMode:client', () => {
      //TODO CLEAR DATA
    });
    it('Does nothing when no user defined for authMode:server', () => {
      //TODO SILENT OK
    });
    it('Does nothing when no user defined for authMode:client', () => {
      //TODO SILENT OK
    });
    it('Promise resolves after data is cleared', () => {
      //TODO CLEAR DATA
    });
  });

  describe('selectActiveLearner', () => {
    it('Validate ID for authMode:server against userObject', () => {
      //TODO Validate
    });
    it('Validate ID for authMode:client', () => {
      //TODO Validate
    });
    it('API call sent for authMode:client', () => {
      //TODO API CALL
    });
    it('API call response handled for authMode:client', () => {
      //TODO API CALL
    });
    it('Data is stored for authMode:server', () => {
      //TODO STORE DATA
    });
    it('Data is stored for authMode:client', () => {
      //TODO STORE DATA
    });
    it('Promise resolves after learner data is stored', () => {
      //TODO STORE DATA
    });
  });

  describe('clearActiveLearner', () => {
    it('Learner data is cleared', () => {
      //TODO CLEAR DATA
    });
    it('Promise resolves after learner data is cleared', () => {
      //TODO CLEAR DATA
    });
  });

  describe('getUser', () => {
    it('Gets object from setUser when authMode:server', () => {
      //TODO GET DATA
    });
    it('Gets object from setUser API call when authMode:client', () => {
      //TODO GET DATA
    });
    it('Gets object from selectActiveLearner API call when authMode:client', () => {
      //TODO GET DATA
    });
  });

  describe('getActiveLearner', () => {
    it('Gets learner object from setUser when authMode:server', () => {
      //TODO GET DATA
    });
    it('Gets learner object from setUser API call when authMode:client', () => {
      //TODO GET DATA
    });
    it('Gets learner object from selectActiveLearner API call when authMode:client', () => {
      //TODO GET DATA
    });
  });

  describe('getLearnerList', () => {
    it('Gets learner array from setUser when authMode:server', () => {
      //TODO GET DATA
    });
    it('Gets learner array from setUser API call when authMode:client', () => {
      //TODO GET DATA
    });
    it('Gets learner array from selectActiveLearner API call when authMode:client', () => {
      //TODO GET DATA
    });
  });
});
