'use strict';

const clientUserObject = {
  providerUserId: 'userProviderId',
  providerLearnerId: 'userProviderId'
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

const singletonUserObjectResponse = {
  id: 100,
  providerId: 'providerLearnerId',
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

const dimensionList = [
  {id: 1, uri: 'dimension/1'},
  {id: 2, uri: 'dimension/2'},
  {id: 3, uri: 'dimension/3'}
];

const localDimensionList = [
  {id: 1, dimension: dimensionList[0], uri: 'local-dimension/1'},
  {id: 2, dimension: dimensionList[0], uri: 'local-dimension/2'},
  {id: 3, dimension: dimensionList[1], uri: 'local-dimension/3'},
  {id: 4, dimension: dimensionList[1], uri: 'local-dimension/4'},
  {id: 5, dimension: dimensionList[2], uri: 'local-dimension/5'}
];

const uriToDimension = {
  [dimensionList[0].uri]: dimensionList[0],
  [dimensionList[1].uri]: dimensionList[1],
  [dimensionList[2].uri]: dimensionList[2],
};

const uriToLocalDimension = {
  [localDimensionList[0].uri]: localDimensionList[0],
  [localDimensionList[1].uri]: localDimensionList[1],
  [localDimensionList[2].uri]: localDimensionList[2],
  [localDimensionList[3].uri]: localDimensionList[3],
  [localDimensionList[4].uri]: localDimensionList[4],
};

const latentAbilities = [
  {dimension: dimensionList[0], mean: 1, standardDeviation: 1.5, timestamp: 100},
  {dimension: dimensionList[1], mean: 0, standardDeviation: 2, timestamp: 100},
  {dimension: dimensionList[2], mean: 0, standardDeviation: 1, timestamp: 100}
];

const defaultAbility = {
  mean: 0,
  standardDeviation: 1,
  timestamp: 0
};

const defaultExtensionLocalEstimate = {
  mean: 0.5,
  standardDeviation: 2.0,
  timestamp: 11
};
const updatedExtensionLocalEstimate = {
  mean: 0.7,
  standardDeviation: 1.5,
  timestamp: 113
};
const defaultExtensionLatentEstimate = {
  mean: 0.6,
  standardDeviation: 2.2,
  timestamp: 12
};
const updatedExtensionLatentEstimate = {
  mean: 0.8,
  standardDeviation: 1.6,
  timestamp: 114
};
const irtExtension = {
  getInitialLocalAbilityEstimate: (localDimensionUri) => {
    return defaultExtensionLocalEstimate;
  },
  resetLocalAbilityEstimate: (localAbilityEstimate) => {
    return updatedExtensionLocalEstimate;
  },
  getInitialLatentAbilityEstimate: (dimensionUri) => {
    return defaultExtensionLatentEstimate;
  },
  resetLatentAbilityEstimate: (latentAbilityEstimate) => {
    return updatedExtensionLatentEstimate;
  }
};

export default {
  clientUserObject,
  clientUserObjectResponse,
  defaultAbility,
  defaultExtensionLatentEstimate,
  defaultExtensionLocalEstimate,
  defaultServerResponse,
  defaultState,
  dimensionList,
  irtExtension,
  latentAbilities,
  localDimensionList,
  serverUserObject,
  singletonUserObjectResponse,
  updatedExtensionLatentEstimate,
  updatedExtensionLocalEstimate,
  uriToDimension,
  uriToLocalDimension
}
