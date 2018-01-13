/**
 * Created by solomonliu on 2017-05-24.
 */

define([
    './kidaptive_constants.js',
    './kidaptive_error.js',
    './kidaptive_utils.js'
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

    KidaptiveUserManager.prototype.storeUser = function(user) {
        if (user.apiKey) {
            this.apiKey = user.apiKey;
            KidaptiveUtils.localStorageSetItem(this.apiKeyCacheKey, user);
            delete user.apiKey;
        }
        this.currentUser = user;
        KidaptiveUtils.localStorageSetItem(this.sdk.httpClient.getCacheKey('GET', KidaptiveConstants.ENDPOINTS.USER), user);
    };

    KidaptiveUserManager.prototype.createUser = function(params) {
        params = KidaptiveUtils.copyObject(params) || {};
        var format = {email:'', password:'', nickname:''};
        KidaptiveUtils.checkObjectFormat(params, format);

        if (!params.email) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "email is required");
        }

        if (!params.password) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "password is required");
        }

        Object.keys(params).forEach(function(key) {
            if (format[key] === undefined) {
                delete params[key];
            }
        });
        return this.sdk.httpClient.ajax('POST', KidaptiveConstants.ENDPOINTS.CREATE_USER, params, {noCache:true}).then(function(user) {
            this.storeUser(user);
            return user;
        }.bind(this));
    };

    KidaptiveUserManager.prototype.updateUser = function(params) {
        params = KidaptiveUtils.copyObject(params) || {};
        var format = {password:'', nickname:'', deviceId:''};
        KidaptiveUtils.checkObjectFormat(params, format);

        Object.keys(params).forEach(function(key) {
            if (format[key] === undefined) {
                delete params[key];
            }
        });

        ['nickname', 'deviceId'].forEach(function(prop) {
            if (params[prop] === undefined) {
                params[prop] = this.currentUser[prop];
            }
        }.bind(this));

        return this.sdk.httpClient.ajax('POST', KidaptiveConstants.ENDPOINTS.USER, params, {noCache:true}).then(function(user) {
            this.storeUser(user);
            return user;
        }.bind(this));
    };

    KidaptiveUserManager.prototype.loginUser = function(params) {
        params = KidaptiveUtils.copyObject(params) || {};
        var format = {email:'', password:''};
        KidaptiveUtils.checkObjectFormat(params, format);

        if (!params.email) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "email is required");
        }

        if (!params.password) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "password is required");
        }

        Object.keys(params).forEach(function(key) {
            if (format[key] === undefined) {
                delete params[key];
            }
        });
        return this.sdk.httpClient.ajax('POST', KidaptiveConstants.ENDPOINTS.LOGIN, params, {noCache:true}).then(function(user) {
            this.storeUser(user);
            return user;
        }.bind(this));
    };

    KidaptiveUserManager.prototype.refreshUser = function() {
        return this.sdk.httpClient.ajax("GET", KidaptiveConstants.ENDPOINTS.USER).then(function(user) {
            this.currentUser = user;
            return user;
        }.bind(this));
    };

    KidaptiveUserManager.prototype.logoutUser = function() {
        this.currentUser = undefined;
        return this.sdk.httpClient.ajax("POST", KidaptiveConstants.ENDPOINTS.LOGOUT, undefined, {noCache:true}).then(function() {
            this.apiKey = this.sdk.httpClient.apiKey;
            localStorage.removeItem(this.apiKeyCacheKey);
        }.bind(this), function(error) {
            this.apiKey = this.sdk.httpClient.apiKey;
            localStorage.removeItem(this.apiKeyCacheKey);
            throw error;
        }.bind(this));
    };

    //TODO: preferences

    return KidaptiveUserManager;
});
