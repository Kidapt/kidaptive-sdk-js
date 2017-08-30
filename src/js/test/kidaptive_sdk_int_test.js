/**
 * Created by solomonliu on 2017-06-21.
 */
KidaptiveSdk.init("gPt1fU+pTaNgFv61Qbp3GUiaHsGcu+0h8", {version:"0.0.0"}, {
    dev:true,
    flushInterval:10000,
    noOidc:true
}).then(function(_) {
    sdk = _;
}, console.log);