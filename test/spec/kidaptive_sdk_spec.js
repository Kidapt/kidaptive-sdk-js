/**
 * Created by cameronperry on 2017-11-07.
 */
define([
    'kidaptive_sdk',
    '../../test/spec/cache/kidaptive_test_http_cache.js'
], function(
    KidaptiveSdk,
    KidaptiveTestHttpCache
) {
    'use strict';

    describe('KidaptiveSdk Unit Tests', function() {
        it('sdk init', function() {
            return KidaptiveSdk.init("gPt1fU+pTaNgFv61Qbp3GUiaHsGcu+0h8", {version:"0.0.0"}, {
                dev:true,
                flushInterval:10000,
                noOidc:true,
                autoFlushCallbacks:function(resultPromise) {
                    resultPromise.then(console.log);
                },
                defaultHttpCache: KidaptiveTestHttpCache
            }).then(function(sdk) {
                console.log(sdk);
                should.exist(sdk);
            });
        });
    });

});
