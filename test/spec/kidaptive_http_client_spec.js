/**
 * Created by solomonliu on 2017-06-01.
 */
'use strict';
import KidaptiveHttpClient from '../../src/kidaptive_http_client';
import KidaptiveConstants from '../../src/kidaptive_constants';
import KidaptiveUtils from '../../src/kidaptive_utils';
import should from 'should';
import sinon from 'sinon';

describe('KidaptiveHttpClient Unit Tests', function() {
    var API_KEY = 'API_KEY';
    var USER_API_KEY = 'USER_API_KEY';
    var ENDPOINT = 'ENDPOINT';
    var DATA = {boolean: true, number: 1, string: "a", array:[]};
    var PARAMS = {boolean: false, number: 2, string: 'b', array:[1,2]};
    var QUERYPARAMS = 'boolean=false&number=2&string=b&array=1&array=2'

    var server, appDelSpy, userDelSpy;

    var createClient = function(dev) {
        var client = new KidaptiveHttpClient(API_KEY, dev);
        client.sdk = {
            userManager: {
                apiKey: USER_API_KEY
            }
        };
        return client;
    };

    var parseUrl = function(url) {
        var result = {};
        var parts = url.split('?');
        result.url = parts[0];
        result.query = parts[1] !== undefined ? parts[1] : null;
        return result;
    }

    before(function() {
        server = sinon.fakeServer.create();
        server.respondImmediately = true;
        appDelSpy = sinon.spy(KidaptiveHttpClient, 'deleteAppData');
        userDelSpy = sinon.spy(KidaptiveHttpClient, 'deleteUserData');
    });

    after(function(){
        server.restore();
        appDelSpy.restore();
        userDelSpy.restore();
    });

    beforeEach(function() {
        localStorage.clear();
        server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(DATA)]);
        server.resetHistory();
        appDelSpy.resetHistory();
        userDelSpy.resetHistory();
    });

    afterEach(function() {
    });

    it('dev parameters', function() {
        var client = createClient(true);
        return client.ajax('GET', ENDPOINT, PARAMS).then(function(){
            should(server.requests).property('length').equal(1);
            var request = server.requests[0];
            var parsedUrl = parseUrl(request.url);
            should(parsedUrl).property('url').startWith(KidaptiveConstants.HOST_DEV).endWith(ENDPOINT);
            should(request).property('requestHeaders').property('api-key').equal(API_KEY);
            should(request).property('withCredentials').true();
            should(request).property('method').equal('GET');
            should(parsedUrl).property('query').equal(QUERYPARAMS);
            should(request).property('requestBody').equal(null);
        });
    });

    it('prod parameters', function() {
        var client = createClient();
        return client.ajax('GET', ENDPOINT, PARAMS).then(function(){
            should(server.requests).property('length').equal(1);
            var request = server.requests[0];
            var parsedUrl = parseUrl(request.url);
            should(parsedUrl).property('url').startWith(KidaptiveConstants.HOST_PROD).endWith(ENDPOINT);
            should(request).property('requestHeaders').property('api-key').equal(API_KEY);
            should(request).property('withCredentials').true();
            should(request).property('method').equal('GET');
            should(parsedUrl).property('query').equal(QUERYPARAMS);
            should(request).property('requestBody').equal(null);
        });
    });

    it('post', function() {
        var client = createClient();
        return client.ajax('POST', ENDPOINT, PARAMS).then(function(){
            should(server.requests).property('length').equal(1);
            var request = server.requests[0];
            var parsedUrl = parseUrl(request.url);
            should(parsedUrl).property('url').startWith(KidaptiveConstants.HOST_PROD).endWith(ENDPOINT);
            should(request).property('requestHeaders').property('api-key').equal(API_KEY);
            should(request).property('withCredentials').true();
            should(request).property('method').equal('POST');
            should(parsedUrl).property('query').equal(null);
            should(request).property('requestBody').equal(JSON.stringify(PARAMS));
        });
    });


    it('caching', function() {
        var client = createClient(true);
        return client.ajax('GET', ENDPOINT, PARAMS).then(function(){
            server.requests.should.property('length').equal(1);
            server.respondWith([0, {}, '']);
            return client.ajax('GET', ENDPOINT, PARAMS);
        }).then(function(response) {
            should(server.requests).property('length').equal(2);
            should(response).eql(DATA);
        });
    });

    it('caching null', function() {
        var client = createClient(true);
        server.respondWith([200, {'Content-Type': 'application/json'}, '']);
        return client.ajax('GET', ENDPOINT, PARAMS).then(function(response){
            should(server.requests).property('length').equal(1);
            server.respondWith([0, {}, '']);
            return client.ajax('GET', ENDPOINT, PARAMS);
        }).then(function(response) {
            should(server.requests).property('length').equal(2);
            should(response).equal(null);
        });
    });


    it('no cache option', function() {
        var client = createClient();
        return client.ajax('POST', ENDPOINT, PARAMS, {noCache:true}).then(function() {
            should(server.requests).property('length').equal(1);
            server.respondWith([0, {}, '']);
            return client.ajax('POST', ENDPOINT, PARAMS);
        }).should.rejected().then(function() {
            should(server.requests).property('length').equal(2);
            should(appDelSpy.called).false();
            should(userDelSpy.called).false();
        });
    });

    it('caching miss method', function() {
        var client = createClient();
        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            should(server.requests).property('length').equal(1);
            server.respondWith([0, {}, '']);
            return client.ajax('POST', ENDPOINT, PARAMS);
        }).should.rejected().then(function() {
            should(server.requests).property('length').equal(2);
            should(appDelSpy.called).false();
            should(userDelSpy.called).false();
        });
    });

    it('caching miss endpoint', function() {
        var client = createClient();
        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            should(server.requests).property('length').equal(1);
            server.respondWith([0, {}, '']);
            return client.ajax('GET', "ENDPOINT2", PARAMS);
        }).should.rejected().then(function() {
            should(server.requests).property('length').equal(2);
            should(appDelSpy.called).false();
            should(userDelSpy.called).false();
        });
    });

    it('caching miss params', function() {
        var client = createClient();
        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            should(server.requests).property('length').equal(1);
            server.respondWith([0, {}, '']);
            return client.ajax('GET', ENDPOINT, {});
        }).should.rejected().then(function() {
            should(server.requests).property('length').equal(2);
            should(appDelSpy.called).false();
            should(userDelSpy.called).false();
        });
    });

    it('caching miss API key', function() {
        var client = createClient();
        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            should(server.requests).property('length').equal(1);
            server.respondWith([0, {}, '']);
            return new KidaptiveHttpClient("API_KEY2").ajax('GET', ENDPOINT, PARAMS);
        }).should.rejected().then(function() {
            should(server.requests).property('length').equal(2);
            should(appDelSpy.called).false();
            should(userDelSpy.called).false();
        });
    });

    it('caching miss host', function() {
        var client = createClient();
        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            should(server.requests).property('length').equal(1);
            server.respondWith([0, {}, '']);
            return new KidaptiveHttpClient(API_KEY, true).ajax('GET', ENDPOINT, PARAMS);
        }).should.rejected().then(function() {
            should(server.requests).property('length').equal(2);
            should(appDelSpy.called).false();
            should(userDelSpy.called).false();
        });
    });

    it('caching error with status code', function() {
        var client = createClient();
        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            should(server.requests).property('length').equal(1);
            server.respondWith([123, {}, '']);
            return client.ajax('GET', ENDPOINT, PARAMS);
        }).should.rejected().then(function() {
            should(server.requests).property('length').equal(2);
            should(appDelSpy.called).false();
            should(userDelSpy.called).false();
            server.respondWith([0, {}, '']);
            return client.ajax('GET', ENDPOINT, PARAMS);
        }).should.rejected();
    });

    it('user data removal', function() {
        var client = createClient();
        var deferred = Object.keys(KidaptiveConstants.ENDPOINTS).reduce(function(deferred, key) {
            return deferred.then(function() {
                return client.ajax('GET', KidaptiveConstants.ENDPOINTS[key], PARAMS);
            });
        }, KidaptiveUtils.Promise.wrap());
        deferred = deferred.then(function() {
            server.respondWith([0, {}, '']);
            KidaptiveHttpClient.deleteUserData();
        });
        return Object.keys(KidaptiveConstants.ENDPOINTS).reduce(function(deferred, key) {
            return deferred.then(function() {
                var endpoint = KidaptiveConstants.ENDPOINTS[key];
                var ajaxResult = client.ajax('GET', endpoint, PARAMS);
                if (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) >= 0)
                    return ajaxResult.should.rejected();
                else {
                    return ajaxResult.should.fulfilled();
                }
            });
        }, deferred);
    });

    it('app data removal', function() {
        var client = createClient();
        var deferred = Object.keys(KidaptiveConstants.ENDPOINTS).reduce(function(deferred, key) {
            return deferred.then(function() {
                return client.ajax('GET', KidaptiveConstants.ENDPOINTS[key], PARAMS);
            });
        }, KidaptiveUtils.Promise.wrap());
        deferred = deferred.then(function() {
            server.respondWith([0, {}, '']);
            KidaptiveHttpClient.deleteAppData();
        });
        return Object.keys(KidaptiveConstants.ENDPOINTS).reduce(function(deferred, key) {
            return deferred.then(function() {
                var endpoint = KidaptiveConstants.ENDPOINTS[key];
                var ajaxResult = client.ajax('GET', endpoint, PARAMS);
                if (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) >= 0)
                    return ajaxResult.should.fulfilled();
                else {
                    return ajaxResult.should.rejected();
                }
            });
        }, deferred);
    });

    it('401 user data removal', function() {
        var client = createClient();
        var deferred = Object.keys(KidaptiveConstants.ENDPOINTS).reduce(function(deferred, key) {
            return deferred.then(function() {
                return client.ajax('GET', KidaptiveConstants.ENDPOINTS[key], PARAMS);
            });
        }, KidaptiveUtils.Promise.wrap());
        deferred = deferred.then(function() {
            server.respondWith([401, {}, '']);
        });
        return deferred.then(function() {
            return client.ajax('GET', KidaptiveHttpClient.USER_ENDPOINTS[0], {});
        }).should.rejected().then(function() {
            should(appDelSpy.called).false();
            should(userDelSpy.called).true();
        });
    });

    it('401 app data removal', function() {
        var client = createClient();
        var deferred = Object.keys(KidaptiveConstants.ENDPOINTS).reduce(function(deferred, key) {
            return deferred.then(function() {
                return client.ajax('GET', KidaptiveConstants.ENDPOINTS[key], PARAMS);
            });
        }, KidaptiveUtils.Promise.wrap());
        deferred = deferred.then(function() {
            server.respondWith([401, {}, '']);
        });
        return deferred.then(function() {
            return client.ajax('GET', ENDPOINT, {});
        }).should.rejected().then(function() {
            should(appDelSpy.called).true();
            should(userDelSpy.called).true();
        });
    });

    it('default cache no existing value', function() {
        var client = createClient();
        var defaultCache = {};
        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            Object.keys(localStorage).forEach(function(k) {
                defaultCache[k] = '{}';
            });
            localStorage.clear();
            server.respondWith([0, {}, '']);
            client = new KidaptiveHttpClient(API_KEY, false, defaultCache);
            return client.ajax('GET', ENDPOINT, PARAMS);
        }).should.fulfilledWith({});
    });

    it('default cache existing value', function() {
        var client = createClient();
        var defaultCache = {};
        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            Object.keys(localStorage).forEach(function(k) {
                defaultCache[k] = '{}';
            });
            server.respondWith([0, {}, '']);
            client = new KidaptiveHttpClient(API_KEY, false, defaultCache);
            return client.ajax('GET', ENDPOINT, PARAMS);
        }).should.fulfilledWith(DATA);
    });
});
