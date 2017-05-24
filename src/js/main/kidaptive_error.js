/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";
var KidaptiveError = function(type, message) {
    Error.call(this, message);
    this.type = type;
};

KidaptiveError.prototype = Object.create(Error.prototype);
KidaptiveError.prototype.constructor = KidaptiveError;

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