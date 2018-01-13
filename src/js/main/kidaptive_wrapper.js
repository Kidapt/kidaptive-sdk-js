/**
 * Created by cameronperry on 2017-11-01.
 */

(function(root, factory) {
    'use strict';

    if (typeof exports === 'object' && exports) {
        factory(exports);
    } else {
        var KidaptiveSdk = {};
        factory(KidaptiveSdk);
        if (typeof define === "function" && define.amd) {
            define(KidaptiveSdk);
        } else {
            root.KidaptiveSdk = KidaptiveSdk;
        }
    }

})(typeof window !== "undefined" ? window : this, function(exports) {
    'use strict';

// @CODE
// compiled kidaptive_sdk is injected here

    return exports;
});
