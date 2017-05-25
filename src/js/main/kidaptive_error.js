/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";
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

KidaptiveError.KidaptiveErrorCode = {};
[
    "OK",
    "GENERIC_ERROR",
    "NOT_IMPLEMENTED",
    "INVALID_PARAMETER",
    "ILLEGAL_STATE",
    "INIT_ERROR",
    "MISSING_DELEGATE",
    "AUTH_ERROR",
    "NOT_LOGGED_IN",
    "LEARNER_NOT_FOUND",
    "TRIAL_NOT_OPEN",
    "URI_NOT_FOUND",

    "RECOMMENDER_ERROR",

    "API_KEY_ERROR",
    "WEB_API_ERROR"
].forEach(function(e) {
    KidaptiveError.KidaptiveErrorCode[e] = e;
});

module.exports = KidaptiveError;