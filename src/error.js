class KidaptiveSdkError {
  constructor(type, message) {
    const thisError = new Error('KidaptiveError (' + type + ') ' + message);
    thisError.type = type;
    return thisError;
  }
}

KidaptiveSdkError.ERROR_CODES = {
  GENERIC_ERROR: 'GENERIC_ERROR',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  ILLEGAL_STATE: 'ILLEGAL_STATE',
  API_KEY_ERROR: 'API_KEY_ERROR',
  WEB_API_ERROR: 'WEB_API_ERROR'
};

export default KidaptiveSdkError;
