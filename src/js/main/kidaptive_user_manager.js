/**
 * Created by solomonliu on 2017-05-24.
 */

define([
    'kidaptive_constants',
    'kidaptive_error',
    'kidaptive_utils'
], function(
    KidaptiveConstants,
    KidaptiveError,
    KidaptiveUtils
) {
    'use strict';

    var KidaptiveUserManager = function(sdk) {
        this.sdk = sdk;
        this.apiKeyCacheKey = sdk.httpClient.getCacheKey('GET', KidaptiveConstants.ENDPOINTS.APP).replace(/[.].*/,'.alpApiKey');
        try {
            this.apiKey = KidaptiveUtils.getObject(KidaptiveUtils.localStorageGetItem(this.apiKeyCacheKey), ['apiKey']) || sdk.httpClient.apiKey;
        } catch (e) {
            this.apiKey = sdk.httpClient.apiKey;
        }
    };

    KidaptiveUserManager.prototype.createUser = function(params) {
        console.error("KidaptiveUserManager.createUser - not supported in offline-only SDK");
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveUserManager.createUser - not supported in offline-only SDK");
    };

    KidaptiveUserManager.prototype.updateUser = function(params) {
        console.error("KidaptiveUserManager.updateUser - not supported in offline-only SDK");
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveUserManager.updateUser - not supported in offline-only SDK");
    };

    KidaptiveUserManager.prototype.loginUser = function(params) {
        console.error("KidaptiveUserManager.updateUser - not supported in offline-only SDK");
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.NOT_SUPPORTED_ERROR, "KidaptiveUserManager.updateUser - not supported in offline-only SDK");
    };

    KidaptiveUserManager.prototype.refreshUser = function() {
        console.warn("KidaptiveUserManager.refreshUser - no-op, resolving to currentUser");
        return KidaptiveUtils.Promise(function(res) {
             res(this.currentUser);
        }.bind(this));
    };

    KidaptiveUserManager.prototype.logoutUser = function() {
        this.currentUser = undefined;
        return KidaptiveUtils.Promise(function(res) {
            this.apiKey = this.sdk.httpClient.apiKey;
            localStorage.removeItem(this.apiKeyCacheKey);
            res();
        }.bind(this));
    };

    return KidaptiveUserManager;
});
