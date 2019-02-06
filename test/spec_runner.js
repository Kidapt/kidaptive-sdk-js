/**
 * Created by cameronperry on 2017-11-07.
 */
require.config({
    baseUrl: '../src/js/main/',
    urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: '../../../node_modules/jquery/dist/jquery',
        sjcl: '../../../node_modules/sjcl/sjcl',
        mocha: '../../../node_modules/mocha/mocha',
        should: '../../../node_modules/should/should',
        sinon: '../../../node_modules/sinon/pkg/sinon'
    },
    shim: {
        mocha: {
            exports: 'mocha'
        }
    }
});

require([
    'mocha',
    'should',
    'sinon'
], function(
    mocha,
    should,
    sinon
) {
    window.sinon = sinon;

    if (typeof initMochaPhantomJS === 'function') {
        initMochaPhantomJS();
    }
    mocha.setup('bdd');

    // use window.requirejs variable since mocha overwrites window.require on import
    requirejs([
        'spec/kidaptive_sdk_spec.js',
        'spec/kidaptive_http_client_spec.js',
        'spec/kidaptive_event_manager_spec.js'
    ], function () {
        mocha.checkLeaks();
        mocha.run();
    });
});
