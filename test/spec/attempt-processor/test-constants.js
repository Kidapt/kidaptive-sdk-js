'use strict';

const learnerId = 200;

const user = {
  id: 100,
  providerId: 'providerUserId',
  learners: [
    {
      id: 200,
      providerId: 'providerLearnerId'
    }
  ]
};

const trialTime = 2000;

const dimensions = [{
  id: 301,
  description: 'First test dimension',
  label: 'Test1',
  name: 'TEST1',
  skillsDomainId: 700,
  uri: '/dimension/test1'
},{
  id: 302,
  description: 'Second test dimension',
  label: 'Test2',
  name: 'TEST2',
  skillsDomainId: 700,
  uri: '/dimension/test2'
}];

const localDimensions = [{
  id: 201,
  dimension: dimensions[0],
  gameId: 501,
  name: 'test1',
  uri: '/local_dimension/test1'
},{
  id: 202,
  dimension: dimensions[1],
  gameId: 501,
  name: 'test2',
  uri: '/local_dimension/test2'
}];

const items = [{
  id: 101,
  localDimension: localDimensions[0],
  mean: -1,
  promptId: 401,
  standardDeviation: 1,
  uri: '/item/test1'
},{
  id: 102,
  localDimension: localDimensions[1],
  mean: -1,
  promptId: 402,
  standardDeviation: 1,
  uri: '/item/test2'
}];

const uriToModel = {
  dimension: {
    [dimensions[0].uri]: dimensions[0],
    [dimensions[1].uri]: dimensions[1]
  },
  'local-dimension': {
    [localDimensions[0].uri]: localDimensions[0],
    [localDimensions[1].uri]: localDimensions[1]
  },
  item: {
    [items[0].uri]: items[0],
    [items[1].uri]: items[1]
  }
};

const defaultAbility = {
  dimension: dimensions[0],
  mean: 0.5,
  standardDeviation: 0.75,
  timestamp: 1000
}

const defaultState = {
  apiKey: 'testApiKey',
  initialized: true,
  options: {
    tier: 3, 
    authMode: 'client',
    environment: 'dev', 
    autoFlushInterval: 0, 
    loggingLevel: 'none'
  },
  user,
  learnerId,
  trialTime,
  ['latentAbilities.' + learnerId]: [defaultAbility],
  uriToModel
};

const defaultAttempt = {
  itemURI: items[0].uri,
  outcome: 1
};

export default {
  defaultAbility,
  defaultAttempt,
  defaultState,
  learnerId,
  items,
  trialTime
}
