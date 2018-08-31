'use strict';
import TestUtils from '../test-utils';
import Constants from '../../../src/constants';
import Utils from '../../../src/utils';
import Should from 'should';

export default () => {

  describe('State Checking', () => {

    beforeEach(() => {
      TestUtils.resetStateAndCache();
    });

    after(() => {
      TestUtils.resetStateAndCache();
    });

    describe('checkInitialized', () => {

      it('Default checkInitialized() throws Error', () => {
        Should.throws(() => { 
          Utils.checkInitialized(); 
        }, Error);
      });

      it('init() then checkInitialized() does not throw Error', () => {
        TestUtils.setState({
          initialized: true
        });
        Should.doesNotThrow(() => { 
          Utils.checkInitialized(); 
        }, Error);
      });

      it('destroy() then checkInitialized() throws Error', () => {
        TestUtils.setState({
          initialized: false
        });
        Should.throws(() => { 
          Utils.checkInitialized(); 
        }, Error);
      });

    }); //END checkInitialized

    describe('checkTier', () => {

      it('checkTier without init throws Error', () => {
        Should.throws(() => { 
          Utils.checkTier(Constants.DEFAULT.TIER); 
        }, Error);
      });

      it('init default tier then checkTier with default does not throw Error', () => {
        TestUtils.setState({
          initialized: true,
          options: {tier: Constants.DEFAULT.TIER}
        });
        Should.doesNotThrow(() => {
          Utils.checkTier(Constants.DEFAULT.TIER);
        }, Error);
      });

      const tiers = [1, 2, 3];
      tiers.forEach(configuredTier => {
        tiers.forEach(requiredTier => {
          it('init tier ' + configuredTier + ' checkTier(' + requiredTier + ') ' + ((requiredTier > configuredTier) ? 'throws error' : 'does not throw error'), () => {
            TestUtils.setState({
              initialized: true,
              options: {tier: configuredTier}
            });
            if (requiredTier > configuredTier) {
              Should.throws(() => {
                Utils.checkTier(requiredTier);
              }, Error);
            } else {
              Should.doesNotThrow(() =>{
                Utils.checkTier(requiredTier);
              }, Error);
            }
          });
        });
      });

    }); //END checkTier

    describe('checkAuthMode', () => {

      it('checkAuthMode without init throws Error', () => {
        Should.throws(() => { 
          Utils.checkAuthMode(Constants.DEFAULT.AUTH_MODE); 
        }, Error);
      });

      it('init default authMode then checkAuthMode with default does not throw Error', () => {
        TestUtils.setState({
          initialized: true,
          options: {authMode: Constants.DEFAULT.AUTH_MODE}
        });
        Should.doesNotThrow(() => {
          Utils.checkTier(Constants.DEFAULT.AUTH_MODE);
        }, Error);
      });

      const authModes = ['client', 's2s'];
      authModes.forEach(configuredAuthMode => {
        authModes.forEach(requiredAuthMode => {
          it('init authMode ' + configuredAuthMode + ' checkAuthMode(' + requiredAuthMode + ') ' + ((requiredAuthMode > configuredAuthMode) ? 'throws error' : 'does not throw error'), () => {
            TestUtils.setState({
              initialized: true,
              options: {authMode: configuredAuthMode}
            });
            if (requiredAuthMode !== configuredAuthMode) {
              Should.throws(() => {
                Utils.checkAuthMode(requiredAuthMode);
              }, Error);
            } else {
              Should.doesNotThrow(() =>{
                Utils.checkAuthMode(requiredAuthMode);
              }, Error);
            }
          });
        });
      });

    }); //END checkAuthMode

    describe('checkLoggingLevel', () => {

      it('Default logging level', () => {
        Should(Utils.checkLoggingLevel(Constants.DEFAULT.LOGGING_LEVEL)).equal(true);
      });

      [ {config: 'none', check: 'all', expected: false},
        {config: 'none', check: 'warn', expected: false},
        {config: 'warn', check: 'all', expected: false},
        {config: 'warn', check: 'warn', expected: true},
        {config: 'all', check: 'all', expected: true},
        {config: 'all', check: 'warn', expected: true}
      ].forEach(test => {
        it('Configured to \'' + test.config + '\' checkLoggingLevel(\'' + test.check +'\') is ' + test.expected, () => {
          TestUtils.setState({
            initialized: true,
            options: {loggingLevel: test.config}
          });
          Should(Utils.checkLoggingLevel(test.check)).equal(test.expected);
        });
      });

    }); //END checkLoggingLevel

  }); //END State Checking

}; //END export
