export default {
  DEFAULT: {
    AUTO_FLUSH_INTERVAL: 60000,
    LOGGING_LEVEL: 'all',
    TIER: 1
  },

  ENDPOINT: {
    INGESTION:'/ingestion'
  },

  HOST: {
    PROD:'https://service.kidaptive.com/v3',
    DEV:'https://develop.kidaptive.com/v3'
  },

  USER_ENDPOINTS: [
    'INGESTION'
  ]
};
