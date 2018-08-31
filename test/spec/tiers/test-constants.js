'use strict';

const defaultServerResponse = [200, {'Content-Type': 'application/json'}, '100'];

const defaultState = {
  apiKey: 'testApiKey',
  initialized: true,
  options: {
    tier: 0, 
    authMode: 'client',
    environment: 'dev', 
    autoFlushInterval: 0, 
    loggingLevel: 'none'
  }
};

export default {
  defaultServerResponse,
  defaultState
}
