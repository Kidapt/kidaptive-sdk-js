/**
 * Created by solomonliu on 2017-06-01.
 */
"use strict";

describe('KidaptiveHttpClient Unit Tests', function() {
    var API_KEY = 'API_KEY';
    var ENDPOINT = 'ENDPOINT';
    var DATA = {boolean: true, number: 1, string: 'a', array:[]};
    var PARAMS = {boolean: false, number: 2, string: 'b', array:[3]};

    var ajaxStub;
    var appDelSpy;
    var userDelSpy;

    before(function() {
        ajaxStub = sinon.stub($, 'ajax');
        appDelSpy = sinon.spy(KidaptiveHttpClient, 'deleteAppData');
        userDelSpy = sinon.spy(KidaptiveHttpClient, 'deleteUserData');
    });

    after(function(){
        ajaxStub.restore();
        appDelSpy.restore();
        userDelSpy.restore();
    });

    beforeEach(function() {
        localStorage.clear();
        ajaxStub.reset();
        ajaxStub.resolves(DATA);
        appDelSpy.reset();
        userDelSpy.reset();
    });

    afterEach(function() {
    });

    it('dev parameters', function() {
        var client = new KidaptiveHttpClient(API_KEY, true);
        client.ajax('GET', ENDPOINT, PARAMS);

        $.ajax.calledOnce.should.true();
        var args = $.ajax.lastCall.args[0];
        should.exist(args);
        args.should.property('url').startWith(KidaptiveConstants.HOST_DEV).endWith(ENDPOINT);
        args.should.property('headers').property('api-key').equal(API_KEY);
        args.should.property('xhrFields').property('withCredentials').true();
        args.should.property('method').equal('GET');
        args.should.property('data').properties(PARAMS);
    });

    it('prod parameters', function() {
        var client = new KidaptiveHttpClient(API_KEY);
        client.ajax('GET', ENDPOINT, PARAMS);

        $.ajax.calledOnce.should.true();
        var args = $.ajax.lastCall.args[0];
        should.exist(args);
        args.should.property('url').startWith(KidaptiveConstants.HOST_PROD).endWith(ENDPOINT);
        args.should.property('headers').property('api-key').equal(API_KEY);
        args.should.property('xhrFields').property('withCredentials').true();
        args.should.property('method').equal('GET');
        args.should.property('data').properties(PARAMS);
    });

    it('post', function() {
        var client = new KidaptiveHttpClient(API_KEY, true);
        client.ajax('POST', ENDPOINT, PARAMS);

        $.ajax.calledOnce.should.true();
        var args = $.ajax.lastCall.args[0];
        should.exist(args);
        args.should.property('url').startWith(KidaptiveConstants.HOST_DEV).endWith(ENDPOINT);
        args.should.property('headers').property('api-key').equal(API_KEY);
        args.should.property('xhrFields').property('withCredentials').true();
        args.should.property('method').equal('POST');
        args.should.property('data').equal(JSON.stringify(PARAMS));
    });

    it('bad method', function() {
        var client = new KidaptiveHttpClient(API_KEY, true);
        return client.ajax('METHOD', ENDPOINT, PARAMS).should.rejected().then(function() {
            appDelSpy.called.should.false();
            userDelSpy.called.should.false();
        });
    });

    it('caching', function() {
        var client = new KidaptiveHttpClient(API_KEY);

        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            ajaxStub.rejects({});
            return client.ajax('GET', ENDPOINT, PARAMS);
        }).then(function(value) {
            value.should.properties(DATA);
        });
    });

    it('caching undefined', function() {
        var client = new KidaptiveHttpClient(API_KEY);
        ajaxStub.resolves();

        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            ajaxStub.rejects({});
            return client.ajax('GET', ENDPOINT, PARAMS);
        }).then(function(value) {
            should(value).undefined();
        });
    });

    it('no caching for post', function() {
        var client = new KidaptiveHttpClient(API_KEY);

        return client.ajax('POST', ENDPOINT, PARAMS).then(function() {
            ajaxStub.rejects({});
            return client.ajax('POST', ENDPOINT, PARAMS);
        }).should.rejected().then(function() {
            appDelSpy.called.should.false();
            userDelSpy.called.should.false();
        });
    });

    it('caching miss method', function() {
        var client = new KidaptiveHttpClient(API_KEY);

        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            ajaxStub.rejects({});
            return client.ajax('POST', ENDPOINT, PARAMS);
        }).should.rejected().then(function() {
            appDelSpy.called.should.false();
            userDelSpy.called.should.false();
        });
    });

    it('caching miss endpoint', function() {
        var client = new KidaptiveHttpClient(API_KEY);

        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            ajaxStub.rejects({});
            return client.ajax('GET', "ENDPOINT2", PARAMS);
        }).should.rejected().then(function() {
            appDelSpy.called.should.false();
            userDelSpy.called.should.false();
        });
    });

    it('caching miss params', function() {
        var client = new KidaptiveHttpClient(API_KEY);

        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            ajaxStub.rejects({});
            return client.ajax('GET', ENDPOINT, {});
        }).should.rejected().then(function() {
            appDelSpy.called.should.false();
            userDelSpy.called.should.false();
        });
    });

    it('caching miss API key', function() {
        var client = new KidaptiveHttpClient(API_KEY);

        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            ajaxStub.rejects({});
            return new KidaptiveHttpClient("API_KEY2").ajax('GET', ENDPOINT, PARAMS);
        }).should.rejected().then(function() {
            appDelSpy.called.should.false();
            userDelSpy.called.should.false();
        });
    });

    it('caching miss host', function() {
        var client = new KidaptiveHttpClient(API_KEY);

        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            ajaxStub.rejects({});
            return new KidaptiveHttpClient(API_KEY, true).ajax('GET', ENDPOINT, PARAMS);
        }).should.rejected().then(function() {
            appDelSpy.called.should.false();
            userDelSpy.called.should.false();
        });
    });

    it('caching error with status code', function() {
        var client = new KidaptiveHttpClient(API_KEY);

        return client.ajax('GET', ENDPOINT, PARAMS).then(function() {
            ajaxStub.rejects({status:123});
            return client.ajax('GET', ENDPOINT, PARAMS);
        }).should.rejected().then(function() {
            appDelSpy.called.should.false();
            userDelSpy.called.should.false();
        });
    });

    it('user data removal', function() {
        var client = new KidaptiveHttpClient(API_KEY);
        var def = $.Deferred().resolve();

        Object.keys(KidaptiveConstants.ENDPOINTS).forEach(function(e){
            def = def.then(function() {
                return client.ajax('GET', KidaptiveConstants.ENDPOINTS[e], PARAMS);
            });
        });

        def = def.then(function() {
            ajaxStub.rejects({});
            KidaptiveHttpClient.deleteUserData();
        });

        Object.keys(KidaptiveConstants.ENDPOINTS).forEach(function(e) {
            def = def.then(function() {
                var endpoint = KidaptiveConstants.ENDPOINTS[e];
                var ajaxResult = client.ajax('GET', endpoint, PARAMS);
                if (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) >= 0)
                    return ajaxResult.should.rejected();
                else {
                    return ajaxResult.should.fulfilled();
                }
            });
        });

        return def;
    });

    it('app data removal', function() {
        var client = new KidaptiveHttpClient(API_KEY);
        var def = $.Deferred().resolve();

        Object.keys(KidaptiveConstants.ENDPOINTS).forEach(function(e){
            def = def.then(function() {
                return client.ajax('GET', KidaptiveConstants.ENDPOINTS[e], PARAMS);
            });
        });

        def = def.then(function() {
            ajaxStub.rejects({});
            KidaptiveHttpClient.deleteAppData();
        });

        Object.keys(KidaptiveConstants.ENDPOINTS).forEach(function(e) {
            def = def.then(function() {
                var endpoint = KidaptiveConstants.ENDPOINTS[e];
                var ajaxResult = client.ajax('GET', endpoint, PARAMS);
                if (KidaptiveHttpClient.USER_ENDPOINTS.indexOf(endpoint) >= 0 && KidaptiveHttpClient.CACHE_EXCLUDE_ENDPOINTS.indexOf(endpoint) < 0)
                    return ajaxResult.should.fulfilled();
                else {
                    return ajaxResult.should.rejected();
                }
            });
        });

        return def;
    });

    it('401 user data removal', function() {
        var client = new KidaptiveHttpClient(API_KEY);
        var def = $.Deferred().resolve();

        Object.keys(KidaptiveConstants.ENDPOINTS).forEach(function(e){
            def = def.then(function() {
                return client.ajax('GET', KidaptiveConstants.ENDPOINTS[e], PARAMS);
            });
        });

        def = def.then(function() {
            ajaxStub.rejects({status:401});
        });

        return def.then(function() {
            return client.ajax('GET', KidaptiveHttpClient.USER_ENDPOINTS[0], {});
        }).should.rejected().then(function() {
            appDelSpy.called.should.false();
            userDelSpy.called.should.true();
        });
    });

    it('401 user data removal', function() {
        var client = new KidaptiveHttpClient(API_KEY);
        var def = $.Deferred().resolve();

        Object.keys(KidaptiveConstants.ENDPOINTS).forEach(function(e){
            def = def.then(function() {
                return client.ajax('GET', KidaptiveConstants.ENDPOINTS[e], PARAMS);
            });
        });

        def = def.then(function() {
            ajaxStub.rejects({status:401});
        });

        return def.then(function() {
            return client.ajax('GET', KidaptiveConstants.ENDPOINTS[0], {});
        }).should.rejected().then(function() {
            appDelSpy.called.should.true();
            userDelSpy.called.should.true();
        });
    });
});