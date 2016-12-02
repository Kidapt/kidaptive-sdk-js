/**
 * Created by solomonliu on 7/8/16.
 */

enum KidaptiveErrorCode {
    OK = <any> "OK",
    GENERIC_ERROR = <any> "GENERIC_ERROR",
    NOT_IMPLEMENTED = <any> "NOT_IMPLEMENTED",
    INVALID_PARAMETER = <any> "INVALID_PARAMETER",
    MISSING_DELEGATE = <any> "MISSING_DELEGATE",
    AUTH_ERROR = <any> "AUTH_ERROR",
    NOT_LOGGED_IN = <any> "NOT_LOGGED_IN",
    LEARNER_NOT_FOUND = <any> "LEARNER_NOT_FOUND",
    TRIAL_NOT_OPEN = <any> "TRIAL_NOT_OPEN",
    URI_NOT_FOUND = <any> "URI_NOT_FOUND",

    RECOMMENDER_ERROR = <any> "RECOMMENDER_ERROR",

    API_KEY_ERROR = <any> "API_KEY_ERROR",
    WEB_API_ERROR = <any> "WEB_API_ERROR",

    MULTIPLE_ERRORS = <any> "MULTIPLE_ERRORS"
}

class KidaptiveError extends Error {
    constructor(public code: KidaptiveErrorCode, message: string) {
        super(message);
        this.name = "KidaptiveError";
    }
}

export {KidaptiveErrorCode, KidaptiveError};