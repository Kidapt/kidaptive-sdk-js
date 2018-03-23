/**
 * Created by solomonliu on 2017-05-23.
 */
'use strict';
import sha256 from 'js-sha256';
import superagent from 'superagent-q';
import KidaptiveConstants from './kidaptive_constants';
import KidaptiveError from './kidaptive_error';
import KidaptiveUtils from './kidaptive_utils';

var KidaptiveHttpClient = function(_apiKey, dev, defaultCache) {
    this.host = dev ? KidaptiveConstants.HOST_DEV : KidaptiveConstants.HOST_PROD;
    this.apiKey = _apiKey;
    defaultCache = defaultCache || {};
    Object.keys(defaultCache).forEach(function(k) {
        try {
            KidaptiveUtils.localStorageGetItem(k);
        } catch (e) {
            localStorage[k] = defaultCache[k];
        }
    });
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

KidaptiveHttpClient.isUserEndpoint = function(endpoint) {
    var isUserEndpoint = false;
    KidaptiveHttpClient.USER_ENDPOINTS.forEach(function(e) {
        if (!isUserEndpoint && endpoint.match('^' + e)) {
            isUserEndpoint = true;
        }
    });
    return isUserEndpoint;
};

KidaptiveHttpClient.prototype.ajax = function(method, endpoint, params, options) {
    options = options || {};
    return KidaptiveUtils.Promise.wrap(function() {
        var settings = {};

        var cacheKey = this.getCacheKey(method, endpoint, params, settings);

        var request = superagent(settings.method, settings.url);

        if (settings.xhrFields && settings.xhrFields.withCredentials) {
            request.withCredentials();
        }

        if (settings.method === 'POST') {
            request.send(settings.data);
        } else {
            request.query(settings.data);  
        }

        if (settings.contentType) {
            request.set('Content-Type', settings.contentType);
        }

        request.set('api-key', settings.headers['api-key']);

        return request.end().then(function(result) {
            if (!options.noCache) {
                KidaptiveUtils.localStorageSetItem(cacheKey, result.body);
            }
           return result.body;
        }, function(error) {
            if (error && error.status === 400) {
                localStorage.removeItem(cacheKey);
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, error.response && error.response.text);
            } else if (error && error.status === 401) {
                //unauthorized. delete cached data
                KidaptiveHttpClient.deleteUserData();
                if (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) < 0) {
                    KidaptiveHttpClient.deleteAppData();
                }
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.API_KEY_ERROR, error.response && error.response.text);
            } else if (error.status) {
                localStorage.removeItem(cacheKey);
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.WEB_API_ERROR, error.response && error.response.text);
            } else {
                try {
                    return KidaptiveUtils.localStorageGetItem(cacheKey);
                } catch (e) {
                    throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.GENERIC_ERROR, "HTTP Client Error");
                }
            }    
        });

    }.bind(this));
};

KidaptiveHttpClient.deleteUserData = function() {
    Object.keys(localStorage).forEach(function(k) {
        if (k.match(/^[\w-]*[.]alpUserData$/)) {
            localStorage.removeItem(k);
        }
    });
};

KidaptiveHttpClient.deleteAppData = function() {
    Object.keys(localStorage).forEach(function(k) {
        if (k.match(/^[\w-]*[.]alpAppData$/)) {
            localStorage.removeItem(k);
        }
    });
};

//util method for getting the cache key for a particular request. Useful for when
//other managers need to overwrite the stored values, e.g. ability estimates
//The settings parameter is optional empty object to be used by the http client to get the request settings object.
//Yay, code reuse.
KidaptiveHttpClient.prototype.getCacheKey = function(method, endpoint, params, settings) {
    settings = settings || {};

    settings.headers = {
        "api-key": KidaptiveHttpClient.isUserEndpoint(endpoint) ? this.sdk.userManager.apiKey : this.apiKey
    };

    //TODO xhrFields.withCredentials is always set so remove this from cache calculation on next major release
    settings.xhrFields = {
        withCredentials: true
    };

    settings.method = method;
    settings.url = this.host + endpoint;

    if (settings.method === 'GET') {
        settings.data = params;
    } else if (settings.method === 'POST') {
        settings.contentType = "application/json";
        //TODO change this to settings.data = params and allow http library to serialize
        settings.data = JSON.stringify(params);
    }

    //calculate cache key: sha256 of the stable json representation of ajax settings then convert to b64 for compactness
    //mark user data for deletion on logout or auth error
    var d = sha256.array(KidaptiveUtils.toJson(settings));

    return btoa(String.fromCharCode.apply(undefined,d))
            .replace(/[+]/g,'-')
            .replace(/[/]/g,'_')
            .replace(/=+/,'') + (KidaptiveHttpClient.isUserEndpoint(endpoint) ? '.alpUserData' : '.alpAppData');
};

export default KidaptiveHttpClient;
