/**
 * Created by cameronperry on 2017-11-07.
 */
'use strict';
import KidaptiveSdk from '../../src/kidaptive_sdk';
import should from 'should';

describe('KidaptiveSdk Unit Tests', function() {
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
            should.exist(sdk);
            done();
        }).catch(done);
    });     
});
