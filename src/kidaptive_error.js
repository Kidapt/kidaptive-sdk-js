/**
 * Created by solomonliu on 2017-05-23.
 */
'use strict';

var KidaptiveError = function(type, message) {
    var e = new Error(message);
    Object.getOwnPropertyNames(e).map(function(k) {
        Object.defineProperty(this, k, Object.getOwnPropertyDescriptor(e, k));
    }.bind(this));
    this.type = type;
};

KidaptiveError.prototype = Object.create(Error.prototype);
KidaptiveError.prototype.constructor = KidaptiveError;
KidaptiveError.prototype.name = 'KidaptiveError';
KidaptiveError.prototype.toString = function() {
    return this.name + ' (' + this.type + '): ' + this.message;
};

KidaptiveError.KidaptiveErrorCode = {
    GENERIC_ERROR: 'GENERIC_ERROR',
    INVALID_PARAMETER: 'INVALID_PARAMETER',
    ILLEGAL_STATE: 'ILLEGAL_STATE',
    API_KEY_ERROR: 'API_KEY_ERROR',
    WEB_API_ERROR: 'WEB_API_ERROR'
};

export default KidaptiveError;
