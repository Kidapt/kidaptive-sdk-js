/**
 * Created by solomonliu on 2017-05-24.
 */
"use strict";

var KidaptiveUserManager = function(sdk) {
    this.sdk = sdk;
};

KidaptiveUserManager.prototype.refreshUser = function() {
    return this.sdk.httpClient.ajax("GET", KidaptiveConstants.ENDPOINTS.USER).then(function(user) {
        this.currentUser = user;
        return user;
    }.bind(this));
};

KidaptiveUserManager.prototype.logoutUser = function() {
    return this.sdk.httpClient.ajax("POST", KidaptiveConstants.ENDPOINTS.LOGOUT).always(function() {
        this.currentUser = undefined;
    }.bind(this));
};

//TODO: preferences
