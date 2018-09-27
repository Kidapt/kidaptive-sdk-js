'use strict';

const defaultState = {
  initialized: true,
  learnerId: 200,
  user: {id: 100, providerId: 'userProviderId', learners: [{id: 200, providerId: 'learnerProviderId'}]},
  options: {
    tier: 3, 
    loggingLevel: 'none'
  }
};

export default {
  defaultState
}
