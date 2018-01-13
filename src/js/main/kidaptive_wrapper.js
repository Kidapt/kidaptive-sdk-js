/**
 * Created by cameronperry on 2017-11-01.
 */

(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory); // AMD
    } else if (typeof exports === 'object' && exports && typeof require === 'function' && typeof module === 'object') {
        module.exports = factory(exports); // CommonJS
    } else {
        factory(root.KidaptiveSdk || (root.KidaptiveSdk = {})); // <script>
    }

})(typeof window !== "undefined" ? window : this, function(KidaptiveSdk) {
    'use strict';

// @CODE
// compiled kidaptive_sdk is injected here

    return KidaptiveSdk;
});
