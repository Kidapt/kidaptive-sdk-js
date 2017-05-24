/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";
var constants = require("./kidaptive_constants");
var KidaptiveError = require("./kidaptive_error");

var KidaptiveHttpClient = function(apiKey, dev) {
    var host = dev ? constants.HOST_DEV : constants.HOST_PROD;

    var promiseHelper = function(jqxhr) {
        return jqxhr.then(function(data) {
            return data;
        }, function(xhr) {
            if (xhr.status == 400) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, xhr.responseText);
            } else if (xhr.status == 401) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR, xhr.responseText);
            } else if (xhr.status) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.WEB_API_ERROR, xhr.responseText);
            } else {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.GENERIC_ERROR, "HTTP Client Error");
            }
        });
    };

    var getCommonSettings = function() {
        return {
            headers: {
                "api-key": apiKey
            },
            xhrFields: {
                withCredentials: true
            }
        }
    };

    this.ajax = function(method, endpoint, params) {
        var settings = getCommonSettings();
        settings.method = method;
        settings.url = host + endpoint;

        if (settings.method == 'GET') {
            settings.data = params;
        } else if (settings.method == 'POST') {
            settings.contentType = "application/json";
            settings.data = JSON.stringify(params);
        } else {
            return $.Deferred().reject(new KidaptiveError(KidaptiveErrorCode.INVALID_PARAMETER, "Method must be 'GET' or 'POST'"));
        }

        return promiseHelper($.ajax(settings));
    }
};

module.exports = KidaptiveHttpClient;