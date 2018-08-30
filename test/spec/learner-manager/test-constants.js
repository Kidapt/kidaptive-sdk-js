'use strict';

const clientUserObject = {
  providerUserId: 'userProviderId'
};

const clientUserObjectResponse = {
  id: 100,
  providerId: 'providerUserId',
  learners: [
    {
      id: 200,
      providerId: 'providerLearnerId'
    }
  ]
};

const defaultServerResponse = [404, {}, ''];

const defaultState = {
  apiKey: 'testApiKey',
  initialized: true,
  options: {
    tier: 1, 
    authMode: 'client',
    environment: 'dev', 
    autoFlushInterval: 0, 
    loggingLevel: 'none'
  }
};

const serverUserObject = {
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

export default {
  clientUserObject,
  clientUserObjectResponse,
  defaultServerResponse,
  defaultState,
  serverUserObject
}
