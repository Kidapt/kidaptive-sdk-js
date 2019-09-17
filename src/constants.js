export default {
  DEFAULT: {
    AUTH_MODE: 'client',
    AUTO_FLUSH_INTERVAL: 60000,
    LOGGING_LEVEL: 'all',
    TIER: 1,
    IRT_METHOD: 'irt_cat',
    IRT_SCALING_FACTOR:  Math.sqrt(8 / Math.PI),
    IRT_DEFAULT_ITEM_DIFFICULTY: 0
  },

  ENDPOINT: {
    ABILITY:'/ability',
    CLIENT_SESSION:'/learner/client-session',
    DIMENSION:'/dimension',
    GAME:'/game',
    INGESTION:'/ingestion',
    INSIGHT:'/insight',
    LOCAL_ABILITY:'/local-ability',
    LOCAL_DIMENSION:'/local-dimension',
    LOGOUT:'/user/logout',
    METRIC:'/metric'
  },

  HOST: {
    DEV:'https://develop.kidaptive.com/v3',
    PROD:'https://service.kidaptive.com/v3'
  },

  USER_ENDPOINTS: [
    'ABILITY',
    'CLIENT_SESSION',
    'INGESTION',
    'INSIGHT',
    'LOCAL_ABILITY',
    'LOGOUT',
    'METRIC'
  ],

  CACHE_KEY: {
    USER: '.alpUserData',
    APP: '.alpAppData'
  }
};
