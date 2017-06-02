/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";

var userEndpoints = [
    KidaptiveConstants.ENDPOINTS.USER,
    KidaptiveConstants.ENDPOINTS.LEARNER,
    KidaptiveConstants.ENDPOINTS.ABILITY,
    KidaptiveConstants.ENDPOINTS.LOCAL_ABILITY,
    KidaptiveConstants.ENDPOINTS.INSIGHT
];

var cacheExcludeMethods = ['POST'];
var cacheExcludeEndpoints = [KidaptiveConstants.ENDPOINTS.INSIGHT];

//json encoding with consistent object name order
var toJson = function(input, inArray) {
    if (typeof input === 'object') {
        if ((input instanceof Boolean) || (input instanceof Number) || (input instanceof String)) {
            input = input.valueOf();
        }
    }
    switch (typeof input) {
        case 'object':
            if (input instanceof Array) {
                return '[' + input.map(function(v){
                        return toJson(v,true)
                    }).join(',') + ']';
            } else {
                return '{' + Object.keys(input).sort().map(function(v){
                        var value = toJson(input[v]);
                        return (value === undefined) ? undefined : [JSON.stringify(v), value].join(':');
                    }).filter(function(v) {
                        return v !== undefined;
                    }).join(',') + '}'
            }
        case 'boolean':
        case 'number':
        case 'string':
            return JSON.stringify(input);
        default:
            return inArray ? JSON.stringify(null) : undefined;
    }
};

var KidaptiveHttpClient = function(_apiKey, dev) {
    this.host = dev ? KidaptiveConstants.HOST_DEV : KidaptiveConstants.HOST_PROD;
    this.apiKey = _apiKey;
};

KidaptiveHttpClient.prototype.ajax = function(method, endpoint, params) {
    var settings = {
        headers: {
            "api-key": this.apiKey
        },
        xhrFields: {
            withCredentials: true
        }
    };
    settings.method = method;
    settings.url = this.host + endpoint;

    if (settings.method === 'GET') {
        settings.data = params;
    } else if (settings.method === 'POST') {
        settings.contentType = "application/json";
        settings.data = JSON.stringify(params);
    } else {
        return $.Deferred().reject(new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Method must be 'GET' or 'POST'"));
    }

    //calculate cache key: sha256 of the json representation of ajax settings
    //mark user data for deletion of logout
    var cacheKey = (cacheExcludeMethods.indexOf(method) < 0 && cacheExcludeEndpoints.indexOf(endpoint) < 0) ? (sjcl.hash.sha256.hash(toJson(settings)).map(function(n){
        var s = (n+Math.pow(2,31)).toString(16);
        return '0'.repeat(8 - s.length) + s;
    }).join('') + ((userEndpoints.indexOf(endpoint) >= 0) ? '.alpUserData' : '.alpAppData')) : undefined;

    return $.ajax(settings).then(function(data) {
        if (cacheKey) {
            try {
                localStorage.setItem(cacheKey, JSON.stringify(data));
            } catch (e) {
                console.log('Warning: ALP SDK unable to write to localStorage. Cached data may be inconsistent or out-of-date');
            }
        }
        return data;
    }, function(xhr) {
        if (xhr.status === 400) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, xhr.responseText);
        } else if (xhr.status === 401) {
            //unauthorized. delete cached data
            KidaptiveHttpClient.deleteUserData();
            if (userEndpoints.indexOf(endpoint) < 0) {
                KidaptiveHttpClient.deleteAppData();
            }
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR, xhr.responseText);
        } else if (xhr.status) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.WEB_API_ERROR, xhr.responseText);
        } else {
            var cached = localStorage.getItem(cacheKey);

            if (cached) {
                return (cached === 'undefined') ? undefined : JSON.parse(cached);
            }

            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.GENERIC_ERROR, "HTTP Client Error");
        }
    });
};

KidaptiveHttpClient.deleteUserData = function() {
    Object.keys(localStorage).forEach(function(k) {
        if (k.endsWith('.alpUserData')) {
            localStorage.removeItem(k);
        }
    });
};

KidaptiveHttpClient.deleteAppData = function() {
    Object.keys(localStorage).forEach(function(k) {
        if (k.endsWith('.alpAppData')) {
            localStorage.removeItem(k);
        }
    });
};