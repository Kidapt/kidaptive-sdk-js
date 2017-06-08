/**
 * Created by solomonliu on 2017-05-23.
 */
"use strict";

var KidaptiveHttpClient = function(_apiKey, dev) {
    this.host = dev ? KidaptiveConstants.HOST_DEV : KidaptiveConstants.HOST_PROD;
    this.apiKey = _apiKey;
};

KidaptiveHttpClient.USER_ENDPOINTS = [
    KidaptiveConstants.ENDPOINTS.USER,
    KidaptiveConstants.ENDPOINTS.LEARNER,
    KidaptiveConstants.ENDPOINTS.ABILITY,
    KidaptiveConstants.ENDPOINTS.LOCAL_ABILITY,
    KidaptiveConstants.ENDPOINTS.INSIGHT
];

KidaptiveHttpClient.CACHE_EXCLUDE_METHODS = ['POST'];
KidaptiveHttpClient.CACHE_EXCLUDE_ENDPOINTS = [KidaptiveConstants.ENDPOINTS.INSIGHT];

(function() {
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
        var cacheKey = (KidaptiveHttpClient.CACHE_EXCLUDE_METHODS.indexOf(method) < 0 && KidaptiveHttpClient.CACHE_EXCLUDE_ENDPOINTS.indexOf(endpoint) < 0) ? (sjcl.hash.sha256.hash(KidaptiveUtils.toJson(settings)).map(function(n){
            var s = (n+Math.pow(2,31)).toString(16);
            return '0'.repeat(8 - s.length) + s;
        }).join('') + ((KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) >= 0) ? '.alpUserData' : '.alpAppData')) : undefined;

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
                localStorage.removeItem(cacheKey);
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, xhr.responseText);
            } else if (xhr.status === 401) {
                //unauthorized. delete cached data
                KidaptiveHttpClient.deleteUserData();
                if (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) < 0) {
                    KidaptiveHttpClient.deleteAppData();
                }
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR, xhr.responseText);
            } else if (xhr.status) {
                localStorage.removeItem(cacheKey);
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
})();