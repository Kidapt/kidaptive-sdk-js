'use strict';

const defaultKey = 'myRecommender';

const defaultRecommender = {
  getRecommendation: () => {}
}

const defaultResult = {
  type: 'default',
  recommendations: ['result1'],
  context: {propery: 'value'}
};

const defaultState = {
  initialized: true,
  options: {
    tier: 2, 
    loggingLevel: 'none'
  }
};

export default {
  defaultKey,
  defaultRecommender,
  defaultResult,
  defaultState
}
