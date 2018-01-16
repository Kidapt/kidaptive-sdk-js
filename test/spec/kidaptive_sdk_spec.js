/**
 * Created by cameronperry on 2017-11-07.
 */
define([
    'kidaptive_sdk'
], function(
    KidaptiveSdk
) {
    'use strict';

    return describe('KidaptiveSdk Unit Tests', function() {
        it('sdk init', function(done) {
            this.timeout(10000);
            KidaptiveSdk.init("gPt1fU+pTaNgFv61Qbp3GUiaHsGcu+0h8", {version:"0.0.0"}, {
                dev:true,
                flushInterval:10000,
                noOidc:true,
                autoFlushCallbacks:function(resultPromise) {
                    resultPromise.then(console.log);
                }
            }).then(function(sdk) {
                console.log(sdk);
                should.exist(sdk);
                done();
            }).catch(done);
        });     
    });

});
