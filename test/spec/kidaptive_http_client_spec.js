/**
 * Created by solomonliu on 2017-06-01.
 */
define([
    'kidaptive_http_client',
    'kidaptive_constants',
    'kidaptive_utils',
    '../../test/spec/cache/kidaptive_test_http_cache.js'
], function(
    KidaptiveHttpClient,
    KidaptiveConstants,
    KidaptiveUtils,
    KidaptiveTestHttpCache
) {
    'use strict';

    describe('KidaptiveHttpClient Unit Tests', function() {
        var API_KEY = 'API_KEY';
        var USER_API_KEY = 'USER_API_KEY';
        var ENDPOINT = 'ENDPOINT';
        var DATA = {boolean: true, number: 1, string: 'a', array:[]};
        var PARAMS = {boolean: false, number: 2, string: 'b', array:[3]};

        //  data from KidaptiveTestHttpCache
        var CACHE_API_KEY = 'gPt1fU+pTaNgFv61Qbp3GUiaHsGcu+0h8';
        var CACHE_APP = {id: 1015, uri: '/kidaptive/quiz_demo', name: 'Kidaptive Quiz Demo'};

        var userDelSpy;
        var getCacheKeySpy;

        var createClient = function(dev, apiKeyArg) {
            var apiKey = apiKeyArg ? apiKeyArg : API_KEY;
            var client = new KidaptiveHttpClient(apiKey, dev, KidaptiveTestHttpCache);
            client.sdk = {
                userManager: {
                    apiKey: USER_API_KEY
                }
            };

            return client;
        };

        before(function() {
            userDelSpy = sinon.spy(KidaptiveHttpClient, 'deleteUserData');
            getCacheKeySpy = sinon.spy(KidaptiveHttpClient.prototype, 'getCacheKey');
        });

        after(function(){
            userDelSpy.restore();
            getCacheKeySpy.restore();
        });

        beforeEach(function() {
            localStorage.clear();
            userDelSpy.reset();
            getCacheKeySpy.reset();
        });

        afterEach(function() {
        });

        it('dev parameters', function() {
            var client = createClient(true);
            return client.ajaxLocal('GET', ENDPOINT, PARAMS).then(function(){
                getCacheKeySpy.calledOnce.should.true();
                var method = getCacheKeySpy.lastCall.args[0];
                method.should.equal('GET');

                var endpoint = getCacheKeySpy.lastCall.args[1];
                endpoint.should.equal(ENDPOINT);

                var params = getCacheKeySpy.lastCall.args[2];
                params.should.equal(PARAMS);

                var settings = getCacheKeySpy.lastCall.args[3];
                should.exist(settings);
                console.log("settings " + JSON.stringify(settings));
                settings.should.property('url').startWith(KidaptiveConstants.HOST_DEV).endWith(ENDPOINT);
                settings.should.property('headers').property('api-key').equal(API_KEY);
                settings.should.property('xhrFields').property('withCredentials').true();
                settings.should.property('method').equal('GET');
                settings.should.property('data').properties(PARAMS);
            });
        });

        it('prod parameters', function() {
            var client = createClient();
            return client.ajaxLocal('GET', ENDPOINT, PARAMS).then(function(){
                getCacheKeySpy.calledOnce.should.true();
                var method = getCacheKeySpy.lastCall.args[0];
                method.should.equal('GET');

                var endpoint = getCacheKeySpy.lastCall.args[1];
                endpoint.should.equal(ENDPOINT);

                var params = getCacheKeySpy.lastCall.args[2];
                params.should.equal(PARAMS);

                var settings = getCacheKeySpy.lastCall.args[3];
                should.exist(settings);
                console.log("settings " + JSON.stringify(settings));
                settings.should.property('url').startWith(KidaptiveConstants.HOST_PROD).endWith(ENDPOINT);
                settings.should.property('headers').property('api-key').equal(API_KEY);
                settings.should.property('xhrFields').property('withCredentials').true();
                settings.should.property('method').equal('GET');
                settings.should.property('data').properties(PARAMS);
            });
        });

        it('post', function() {
            var client = createClient();
            return client.ajaxLocal('POST', ENDPOINT, PARAMS).then(function(value){
                getCacheKeySpy.called.should.false();
                should.not.exist(value);
            });
        });

        it('caching', function() {
            var client = createClient(true, CACHE_API_KEY);

            return client.ajaxLocal('GET', KidaptiveConstants.ENDPOINTS.APP).then(function(value) {
                value.should.properties(CACHE_APP);
            });
        });

        it('caching undefined', function() {
            var client = createClient();

            return client.ajaxLocal('GET', ENDPOINT, PARAMS).then(function(value) {
                should(value).undefined();
            });
        });

        it('caching miss method', function() {
            var client = createClient();

            localStorage.clear();
            var key = client.getCacheKey('GET', ENDPOINT, PARAMS, {});
            KidaptiveUtils.localStorageSetItem(key, DATA);

            return client.ajaxLocal('GET', ENDPOINT, PARAMS).then(function(value) {
                value.should.properties(DATA);
                return client.ajaxLocal('POST', ENDPOINT, PARAMS);
            }).then(function(value) {
                should(value).undefined();
            });
        });

        it('caching miss endpoint', function() {
            var client = createClient();

            localStorage.clear();
            var key = client.getCacheKey('GET', ENDPOINT, PARAMS, {});
            KidaptiveUtils.localStorageSetItem(key, DATA);

            return client.ajaxLocal('GET', ENDPOINT, PARAMS).then(function(value) {
                value.should.properties(DATA);
                return client.ajaxLocal('GET', 'ENDPOINT2', PARAMS);
            }).then(function(value) {
                should(value).undefined();
            });
        });

        it('caching miss params', function() {
            var client = createClient();

            localStorage.clear();
            var key = client.getCacheKey('GET', ENDPOINT, PARAMS, {});
            KidaptiveUtils.localStorageSetItem(key, DATA);

            return client.ajaxLocal('GET', ENDPOINT, PARAMS).then(function(value) {
                value.should.properties(DATA);
                return client.ajaxLocal('GET', ENDPOINT, {});
            }).then(function(value) {
                should(value).undefined();
            });
        });

        it('caching miss API key', function() {
            var client = createClient();

            localStorage.clear();
            var key = client.getCacheKey('GET', ENDPOINT, PARAMS, {});
            KidaptiveUtils.localStorageSetItem(key, DATA);

            return client.ajaxLocal('GET', ENDPOINT, PARAMS).then(function(value) {
                value.should.properties(DATA);
                return new KidaptiveHttpClient("API_KEY2").ajaxLocal('GET', ENDPOINT, PARAMS);
            }).then(function(value) {
                should(value).undefined();
            });
        });

        it('caching miss host', function() {
            var client = createClient();

            localStorage.clear();
            var key = client.getCacheKey('GET', ENDPOINT, PARAMS, {});
            KidaptiveUtils.localStorageSetItem(key, DATA);

            return client.ajaxLocal('GET', ENDPOINT, PARAMS).then(function(value) {
                value.should.properties(DATA);
                return new KidaptiveHttpClient(API_KEY, true).ajaxLocal('GET', ENDPOINT, PARAMS);
            }).then(function(value) {
                should(value).undefined();
            });
        });

        it('user data removal', function() {
            var client = createClient();
            var def = $.Deferred().resolve();
            localStorage.clear();

            Object.keys(KidaptiveConstants.ENDPOINTS).forEach(function(e){
                var endpoint = KidaptiveConstants.ENDPOINTS[e];
                var key = client.getCacheKey('GET', endpoint, PARAMS, {});
                KidaptiveUtils.localStorageSetItem(key, DATA);
            });

            def = def.then(function() {
                KidaptiveHttpClient.deleteUserData();
            });

            Object.keys(KidaptiveConstants.ENDPOINTS).forEach(function(e) {
                def = def.then(function() {
                    var endpoint = KidaptiveConstants.ENDPOINTS[e];
                    var ajaxResult = client.ajaxLocal('GET', endpoint, PARAMS, {});
                    if (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) >= 0)
                        return ajaxResult.then(function(value) {
                            should(value).undefined();
                        });
                    else {
                        return ajaxResult.then(function(value) {
                            value.should.properties(DATA);
                        });
                    }
                });
            });

            return def;
        });

        it('default cache no existing value', function() {
            var client = createClient();
            var defaultCache = {};

            var key = client.getCacheKey('GET', ENDPOINT, PARAMS);
            KidaptiveUtils.localStorageSetItem(key, DATA);

            return client.ajaxLocal('GET', ENDPOINT, PARAMS).then(function() {
                Object.keys(localStorage).forEach(function(k) {
                    console.log("local storage key: "  + k);
                    defaultCache[k] = "{}";
                });
                localStorage.clear();
                client = new KidaptiveHttpClient(API_KEY,false,defaultCache);
                return client.ajaxLocal('GET', ENDPOINT, PARAMS);
            }).should.fulfilledWith({});
        });

        it('default cache existing value', function() {
            var client = createClient();
            var defaultCache = {};

            var key = client.getCacheKey('GET', ENDPOINT, PARAMS);
            KidaptiveUtils.localStorageSetItem(key, DATA);

            return client.ajaxLocal('GET', ENDPOINT, PARAMS).then(function() {
                Object.keys(localStorage).forEach(function(k) {
                    defaultCache[k] = "{}";
                });
                client = new KidaptiveHttpClient(API_KEY,false,defaultCache);
                return client.ajaxLocal('GET', ENDPOINT, PARAMS);
            }).should.fulfilledWith(DATA);
        });

    });
});
