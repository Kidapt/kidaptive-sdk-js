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
    KidaptiveConstants.ENDPOINTS.INSIGHT,
    KidaptiveConstants.ENDPOINTS.INGESTION,
    KidaptiveConstants.ENDPOINTS.LOGOUT
];

KidaptiveHttpClient.prototype.ajax = function(method, endpoint, params, options) {
    options = options || {};
    return KidaptiveUtils.Promise.wrap(function() {
        var settings = {};

        var cacheKey = this.getCacheKey(method, endpoint, params, settings);

        return $.ajax(settings).then(function(data) {
            if (!options.noCache) {
                KidaptiveUtils.localStorageSetItem(cacheKey, data);
            }
            return data;
        }, function(xhr) {
            if (xhr.status === 400) {
                KidaptiveUtils.localStorageSetItem(cacheKey);
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, xhr.responseText);
            } else if (xhr.status === 401) {
                //unauthorized. delete cached data
                KidaptiveHttpClient.deleteUserData();
                if (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) < 0) {
                    KidaptiveHttpClient.deleteAppData();
                }
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR, xhr.responseText);
            } else if (xhr.status) {
                KidaptiveUtils.localStorageSetItem(cacheKey);
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.WEB_API_ERROR, xhr.responseText);
            } else {
                var cached = KidaptiveUtils.localStorageGetItem(cacheKey);

                if (cached) {
                    return cached;
                }

                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.GENERIC_ERROR, "HTTP Client Error");
            }
        });
    }.bind(this));
};

KidaptiveHttpClient.deleteUserData = function() {
    Object.keys(localStorage).forEach(function(k) {
        if (k.endsWith('.alpUserData')) {
            KidaptiveUtils.localStorageSetItem(k);
        }
    });
};

KidaptiveHttpClient.deleteAppData = function() {
    Object.keys(localStorage).forEach(function(k) {
        if (k.endsWith('.alpAppData')) {
            KidaptiveUtils.localStorageSetItem(k);
        }
    });
};

//util method for getting the cache key for a particular request. Useful for when
//other managers need to overwrite the stored values, e.g. ability estimates
//The settings parameter is optional empty object to be used by the http client to get the request settings object.
//Yay, code reuse.
KidaptiveHttpClient.prototype.getCacheKey = function(method, endpoint, params, settings) {
    settings = settings || {};

    //make settings an empty object; wouldn't want any stray settings screwing stuff up.
    Object.keys(settings).forEach(function(p) {
        delete settings[p];
    });

    settings.headers = {
        "api-key": this.apiKey
    };

    settings.xhrFields = {
        withCredentials: true
    };

    settings.method = method;
    settings.url = this.host + endpoint;

    if (settings.method === 'GET') {
        settings.data = params;
    } else if (settings.method === 'POST') {
        settings.contentType = "application/json";
        settings.data = JSON.stringify(params);
    } else {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Method must be 'GET' or 'POST'");
    }

    //calculate cache key: sha256 of the stable json representation of ajax settings then convert to b64 for compactness
    //mark user data for deletion on logout or auth error
    var d = new DataView(new ArrayBuffer(32));
    sjcl.hash.sha256.hash(KidaptiveUtils.toJson(settings)).forEach(function(n,i){
        d.setInt32(4*i,n);
    });
    return btoa(String.fromCharCode.apply(undefined, new Array(32).fill(0).map(function(_,i) {
        return d.getUint8(i);
    }))).replace(/[+]/g,'-').replace(/[/]/g,'_').replace(/=+/,'') + ((KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) >= 0) ? '.alpUserData' : '.alpAppData');
};