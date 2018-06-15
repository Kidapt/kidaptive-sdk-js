export default {
  DEFAULT: {
    AUTO_FLUSH_INTERVAL: 60000,
    LOGGING_LEVEL: 'all',
    TIER: 1,
    AUTH_MODE: 'client'
  },

  ENDPOINT: {
    INGESTION:'/ingestion',
    CLIENT_SESSION:'/learner/client-session',
    LOGOUT:'/user/logout'
  },

  HOST: {
    PROD:'https://service.kidaptive.com/v3',
    DEV:'https://develop.kidaptive.com/v3'
  },

  USER_ENDPOINTS: [
    'INGESTION',
    'LOGOUT'
  ]
};
