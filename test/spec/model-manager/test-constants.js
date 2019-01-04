'use strict';

const defaultState = {
  apiKey: 'testApiKey',
  initialized: true,
  options: {
    tier: 3, 
    authMode: 'client',
    environment: 'dev', 
    autoFlushInterval: 0, 
    loggingLevel: 'none'
  }
};

export default {
  defaultState
}
