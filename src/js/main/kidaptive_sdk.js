/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";
var KidaptiveError = require('./kidaptive_error');
var KidaptiveConstants = require('./kidaptive_constants');
var KidaptiveHttpClient = require('./kidaptive_http_client');

var sdkPromise;

//this constructor returns a promise. the
var KidaptiveSdk = function(apiKey, appVersion, options) {
    if (!sdkPromise) {
        //check jquery version
        if ($().jquery < '3') {
            //promises not implemented correctly, throw normal error
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.GENERIC_ERROR, "jQuery version must be >= 3");
        }

        var appInfo;
        //TODO: initialize managers
        //TODO: public methods
        this.getAppInfo = function() {
            return JSON.parse(JSON.stringify(appInfo));
        };

        //create new sdk instance
        sdkPromise = $.Deferred().resolve().then(function () {
            if (!apiKey) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Api key is required");
            }

            if (!appVersion) {
                appVersion = {};
            }
            appVersion.version = appVersion.version || '';
            appVersion.build = appVersion.build || '';

            options = options || {};

            var client = new KidaptiveHttpClient(apiKey, options.dev);
            return client.ajax("GET", KidaptiveConstants.ENDPOINTS.APP).then(function (app) {
                if (appVersion.version < app.minVersion) {
                    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER,
                        "Version >= " + app.minVersion + " required. Provided " + appInfo.version);
                }

                appInfo =  app;
                appInfo.version = appVersion.version;
                appInfo.build = appVersion.build;
                //TODO: sync models
            }).then(function() {
                return this;
            }.bind(this));
        }.bind(this));

        sdkPromise.then(function() {
            //get user info if login is successful
            //TODO: Load user info
            //TODO: Load learner info
        }, function () {
            //if there is an init error, unset the promise so we can try again.
            sdkPromise = undefined;
        });
    } else if (apiKey || appVersion || options) {
        return $.Deferred().reject(new KidaptiveError(KidaptiveError.KidaptiveErrorCode.ILLEGAL_STATE, "SDK initialization in progress or successful"))
    }

    return sdkPromise;
};

KidaptiveSdk.KidaptiveError = KidaptiveError;
KidaptiveSdk.KidaptiveConstants = KidaptiveConstants;

module.exports = KidaptiveSdk;