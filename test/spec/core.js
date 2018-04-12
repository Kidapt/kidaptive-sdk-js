'use strict';
import KidaptiveSdk from '../../src/index';
import Constants from '../../src/constants';
import State from '../../src/state';
import Should from 'should';
import Sinon from 'sinon';

describe('KidaptiveSdk Core Unit Tests', () => {
  describe('getSdkVersion', () => {
    before(() => {
      State.clear();
    });
    after(() => {
      State.clear();
    });
    it('works without init', () => {
      Should(KidaptiveSdk.getSdkVersion()).not.Promise();
      Should.doesNotThrow(() => {
        KidaptiveSdk.getSdkVersion();
      }, Error);
    });
    it('works with init', () => {
      State.set('initialized', true);
      Should(KidaptiveSdk.getSdkVersion()).not.Promise();
      Should.doesNotThrow(() => {
        KidaptiveSdk.getSdkVersion();
      }, Error);
    });
    it('returns correct version', () => {
      Should(KidaptiveSdk.getSdkVersion()).not.equal(undefined);
      Should(KidaptiveSdk.getSdkVersion()).equal(VERSION); //VERSION defined by build process
    });
  });

  describe('init', () => {
    const apiKey = 'testApiKey';
    let options;
    beforeEach(() => {
      options = {
        environment: 'dev',
        tier: 1,
        baseUrl: 'http://baseUrl',
        appUri: '/app/uri',
        version: '1.0.0',
        build: '1.0.0.100',
        autoFlushInterval: 10000,
        autoFlushCallback: [() => {}, () => {}],
        loggingLevel: 'none'
      };
    });
    //TODO FUTURE: check other tiers
    it('before init State.get("initialized") is false', () => {
      Should(State.get('initialized')).not.ok();
    });
    it('promise resolved after initialization complete', () => {
      return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => {
        Should(State.get('initialized')).ok();
      });
    });
    it('State.get("initialized") is true', () => {
      Should(State.get('initialized')).ok();
    });
    it('sets apiKey in state', () => {
      Should(State.get('apiKey')).equal(apiKey);
    });
    it('sets options in state', () => {
      Should(State.get('options')).deepEqual(options);
    });
    it('second init call is rejected', () => {
      return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
        return Should(KidaptiveSdk.destroy()).resolved();
      });
    });
    it('apiKey required', () => {
      return Should(KidaptiveSdk.init(undefined, options)).rejected().then(() => { 
        return Should(KidaptiveSdk.init(apiKey, options)).resolved();
      }).then(() => { 
        return Should(KidaptiveSdk.destroy()).resolved();
      }); 
    });
    it('apiKey must be string', () => {
      return Should(KidaptiveSdk.init(null, options)).rejected().then(() => { 
        return Should(KidaptiveSdk.init(true, options)).rejected();
      }).then(() => { 
        return Should(KidaptiveSdk.init(false, options)).rejected();
      }).then(() => { 
        return Should(KidaptiveSdk.init(100, options)).rejected();
      }).then(() => { 
        return Should(KidaptiveSdk.init({}, options)).rejected();
      }).then(() => { 
        return Should(KidaptiveSdk.init([], options)).rejected();
      }).then(() => { 
        return Should(KidaptiveSdk.init(() => {}, options)).rejected();
      }).then(() => { 
        return Should(KidaptiveSdk.init(apiKey, options)).resolved();
      }).then(() => { 
        return Should(KidaptiveSdk.destroy()).resolved();
      });
    });
    describe('validate options', () => {
      it('environment is required', () => {
        options.environment = undefined;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.environment = 'dev';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('environment must be string', () => {
        options.environment = null;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.environment = true;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.environment = false;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.environment = 100;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.environment = {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.environment = [];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.environment = () => {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.environment = 'dev';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('environment must be dev, prod, or custom', () => {
        options.environment = 'not dev';
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.environment = 'dev';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.environment = 'prod';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.environment = 'custom';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('baseUrl is optional when environment is not custom', () => {
        options.environment = 'dev';
        options.baseUrl = undefined
        return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.environment = 'dev';
          options.baseUrl = null;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('baseUrl is required when environment is custom', () => {
        options.environment = 'custom';
        options.baseUrl = undefined
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.environment = 'custom';
          options.baseUrl = null;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.baseUrl = 'http://'
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('baseUrl must be a string if defined', () => {
        options.baseUrl = true;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.baseUrl = false;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.baseUrl = 100;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.baseUrl = {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.baseUrl = [];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.baseUrl = () => {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.baseUrl = 'http://baseurl';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('tier is optional', () => {
        options.tier = undefined
        return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.tier = null;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('tier must be a number if defined', () => {
        options.tier = true;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.tier = false;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.tier = '1';
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.tier = {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.tier = [];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.tier = () => {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.tier = 1;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('tier must be 1', () => {
        //TODO FUTURE: ADD OTHER TIERS
        options.tier = 2;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.tier = 0;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.tier = -1;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.tier = 1;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('appUri is optional', () => {
        options.appUri = undefined
        return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.appUri = null;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('appUri must be a string if defined', () => {
        options.appUri = true;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.appUri = false;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.appUri = 100;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.appUri = {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.appUri = [];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.appUri = () => {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.appUri = '/app/uri';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('version is optional', () => {
        options.version = undefined
        return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.version = null;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        });
      });
      it('version must be a string', () => {
        options.version = true;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.version = false;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.version = 100;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.version = {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.version = [];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.version = () => {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.version = '1.0.0';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('build is optional', () => {
        options.build = undefined
        return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.build = null;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        });
      });
      it('build must be a string', () => {
        options.build = true;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.build = false;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.build = 100;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.build = {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.build = [];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.build = () => {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.build = '1.0.0.100';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('autoFlushInterval is optional', () => {
        options.autoFlushInterval = undefined
        return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.autoFlushInterval = null;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        });
      });
      it('autoFlushInterval must be a number', () => {
        options.autoFlushInterval = true;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.autoFlushInterval = false;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushInterval = '1';
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushInterval = {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushInterval = [];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushInterval = () => {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushInterval = 10000;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('autoFlushInterval must be at least 0', () => {
        options.autoFlushInterval = -1;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.autoFlushInterval = 0;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.autoFlushInterval = 1;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('autoFlushCallback is optional', () => {
        options.autoFlushCallback = undefined
        return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.autoFlushCallback = null;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        });
      });
      it('autoFlushCallback must be a function or array of functions', () => {
        options.autoFlushCallback = true;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.autoFlushCallback = false;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushCallback = 100;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushCallback = {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushCallback = 'some string';
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushCallback = [true];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushCallback = [false];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushCallback = [100];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushCallback = [{}];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushCallback = ['some string'];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.autoFlushCallback = () => {};
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.autoFlushCallback = [];
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.autoFlushCallback = [() => {}];
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        });
      });
      it('autoFlushCallback always transformed into an array when provided', () => {
        options.autoFlushCallback = () => {};
        return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => { 
          const setOptions = State.get('options') || {};
          Should(setOptions.autoFlushCallback).Array();
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => {
          options.autoFlushCallback = undefined;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => { 
            const setOptions = State.get('options') || {};
            Should(setOptions.autoFlushCallback).equal(undefined);
            return Should(KidaptiveSdk.destroy()).resolved();
          });
        })
      });
      it('loggingLevel is optional', () => {
        options.loggingLevel = undefined
        return Should(KidaptiveSdk.init(apiKey, options)).resolved().then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.loggingLevel = null;
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        });
      });
      it('loggingLevel must be a string', () => {
        options.loggingLevel = true;
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.loggingLevel = false;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.loggingLevel = 100;
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.loggingLevel = {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.loggingLevel = [];
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.loggingLevel = () => {};
          return Should(KidaptiveSdk.init(apiKey, options)).rejected();
        }).then(() => { 
          options.loggingLevel = 'all';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
      it('loggingLevel must be all, warn, or none', () => {
        options.loggingLevel = 'other';
        return Should(KidaptiveSdk.init(apiKey, options)).rejected().then(() => { 
          options.loggingLevel = 'all';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.loggingLevel = 'warn';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }).then(() => { 
          options.loggingLevel = 'none';
          return Should(KidaptiveSdk.init(apiKey, options)).resolved();
        }).then(() => { 
          return Should(KidaptiveSdk.destroy()).resolved();
        }); 
      });
    });
    it('handles default option values', () => {
      return Should(KidaptiveSdk.init(apiKey, {environment: 'dev'})).resolved().then(() => {
        const setOptions = State.get('options') || {};
        Should(setOptions.tier).equal(Constants.DEFAULT.TIER);
        Should(setOptions.autoFlushInterval).equal(Constants.DEFAULT.AUTO_FLUSH_INTERVAL);
        Should(setOptions.loggingLevel).equal(Constants.DEFAULT.LOGGING_LEVEL);
        return Should(KidaptiveSdk.destroy()).resolved();
      });
    });
  });

  describe('destroy', () => {
    it('promise resolved after destroy complete', () => {
      return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev'})).resolved().then(() => {
        Should(State.get('initialized')).ok();
        return Should(KidaptiveSdk.destroy()).resolved()
      }).then(() => {
        Should(State.get('initialized')).not.ok();
      });
    });
    it('requires init to be called first', () => {
      return Should(KidaptiveSdk.destroy()).rejected()
    });
    it('calls State.clear()', () => {
      const spyStateClear = Sinon.spy(State, 'clear');
      Should(spyStateClear.called).false();
      return Should(KidaptiveSdk.init('testApiKey', {environment: 'dev'})).resolved().then(() => {
        Should(spyStateClear.called).false();
        return Should(KidaptiveSdk.destroy()).resolved()
      }).then(() => {
        Should(spyStateClear.called).true();
        spyStateClear.restore();
      });
    });
    it('State.get("initialized") is false', () => {
      Should(State.get('initialized')).not.ok();
    });
  });
});
