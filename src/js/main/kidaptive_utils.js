/**
 * Created by solomonliu on 2017-06-06.
 */
"use strict";
var KidaptiveUtils = {};

(function() {
    var jsonHelper = function(o, inArray) {
        switch (typeof o) {
            case 'object':
                if (o !== null && !(o instanceof Boolean) && !(o instanceof Number) && !(o instanceof String)) {
                    if (o instanceof Array) {
                        return '[' + o.map(function(i) {
                                return jsonHelper(i, true);
                            }).join(',') + ']';
                    } else {
                        return '{' + Object.keys(o).sort().map(function(i){
                                var value = jsonHelper(o[i]);
                                return value === undefined ? value : [JSON.stringify(i), value].join(':');
                            }).filter(function(i){
                                return i !== undefined;
                            }).join(',') + '}';
                    }
                }
            case 'boolean':
            case 'number':
            case 'string':
                return JSON.stringify(o);
            default:
                return inArray ? 'null' : undefined;
        }
    };

    KidaptiveUtils.toJson = function(o) {
        return jsonHelper(o);
    };
})();
