/**
 * Created by solomonliu on 2017-06-06.
 */
"use strict";
var KidaptiveUtils = {};

//construct a promise
//input is a function that accepts two functions: resolve and reject
//if resolve is called with a thenable, the promise will resolve with the same value as the thenable
//if resolve is called with a value, the promise will resolve that value
//if reject is called, the promise is rejected with that error.
KidaptiveUtils.Promise = function(func) {
    var def = $.Deferred();

    var resolve = function(value) {
        def.resolve(value);
    };
    var reject = function(error) {
        def.reject(error);
    };

    setTimeout(function() {
        try {
            func(resolve, reject)
        } catch (e) {
            def.reject(e);
        }
    });

    return def.then(function(v) {
        return v;
    });
};

//wrap a value in a resolved promise
KidaptiveUtils.Promise.resolve = function(value) {
    return KidaptiveUtils.Promise(function(resolve) {
        resolve(value);
    });
};

//wrap an error in a rejected error
KidaptiveUtils.Promise.reject = function(err) {
    return KidaptiveUtils.Promise(function(_, reject) {
        reject(err);
    });
};

//returns a promise
//if obj is a function and returns a thenable, resolves to the value of thenable
//if obj is a function and does not return a thenable, resolves to the return value
//if obj is a function and throws an error, rejects with the error
//if obj is not a function, resolves to obj
KidaptiveUtils.Promise.wrap = function(obj) {
    if (typeof obj === 'function') {
        return KidaptiveUtils.Promise(function(resolve, reject) {
            try {
                resolve(obj());
            } catch (e) {
                reject(e);
            }
        });
    } else {
        return KidaptiveUtils.Promise.resolve(obj);
    }

};

//wraps each function/value in a promise and executes them in parallel.
//Always resolves to an array of object specifying the state and value/error of each promise.
KidaptiveUtils.Promise.parallel = function(objArray) {
    return KidaptiveUtils.Promise(function(resolve) {
        var results = [];
        objArray.forEach(function(o, i) {
            KidaptiveUtils.Promise.wrap(o).then(function(v){
                return {resolved: true, value: v};
            }, function(e){
                return {resolved: false, error: e};
            }).then(function(r) {
                results[i] = r;
                if (Object.keys(results).length === objArray.length) {
                    resolve(results);
                }
            });
        });
        if (objArray.length === 0) {
            resolve(results);
        }
    });
};


//warps each function as a Promise and executes them in series, optionally specifying error type(s) to stop on
//if errors is a string, stop on that error type
//if errors is an array, stop on all error types in that array
//else stop on all errors
//if all functions complete without throwing a specified error, resolves to undefined
KidaptiveUtils.Promise.serial = function(funcArray, errors) {
    errors = KidaptiveUtils.copyObject(errors);

    if (typeof errors === 'string') {
        errors = [errors];
    } else if (!(errors instanceof Array)) {
        errors = undefined;
    }

    var promise = KidaptiveUtils.Promise.resolve();

    funcArray.forEach(function(f) {
        promise = promise.then(KidaptiveUtils.Promise.wrap.bind(undefined, f)).catch(errors ? function(e) {
            if (errors.indexOf(e.type) !== -1) {
                throw e;
            }
        } : undefined);
    });

    return promise.then(function(){});
};

var jsonHelper = function(o, inArray) {
    //normalize o
    o = KidaptiveUtils.copyObject(o);
    switch (typeof o) {
        case 'object':
            if (o !== null) {
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
            //null falls through
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

KidaptiveUtils.getObject = function(object, key) {
    key = KidaptiveUtils.copyObject(key);
    if (key === undefined) {
        return object;
    } else if (key instanceof Array) {
        key.forEach(function(i) {
            object = (object || {})[i]
        });
        return object;
    }
    return (object || {})[key];
};

KidaptiveUtils.putObject = function(object, key, value) {
    key = KidaptiveUtils.copyObject(key);
    var o = object;
    if (key instanceof Array) {
        if (key.length === 0) {
            return object;
        }
        key.forEach(function(k,i) {
            if (i === key.length - 1) {
                key = k;
            } else {
                o = o[k] || (o[k] = {});
            }
        });
    }
    if (value === undefined) {
        delete o[key];
    } else {
        o[key] = value;
    }
    return object;
};

KidaptiveUtils.toCamelCase = function(str, delimiters) {
    return str.split(delimiters).filter(function(s) {
        return s.length > 0;
    }).map(function(s, i) {
        s = s.toLowerCase();
        if (i) {
            return s[0].toUpperCase() + s.substr(1);
        }
        return s;
    }).join('');
};

KidaptiveUtils.localStorageSetItem = function(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.log('Warning: ALP SDK unable to write to localStorage. Cached data may be inconsistent or out-of-date');
    }
};

KidaptiveUtils.localStorageGetItem = function(key) {
    var cached = localStorage.getItem(key);
    if (cached === null) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "No item found for key " + key + " in localStorage");
    }
    return cached === 'undefined' ? undefined : JSON.parse(cached);
};

//create a copy of an object
KidaptiveUtils.copyObject = function(o, preserveFunctions) {
    var oCopy = JSON.stringify(o);
    oCopy = oCopy === undefined ? oCopy : JSON.parse(oCopy);
    if (preserveFunctions) {
        if (typeof o === 'function') {
            return o;
        } else if (oCopy instanceof Array) {
            for (var i = 0; i < o.length; i ++) {
                var v = KidaptiveUtils.copyObject(o[i],true);
                oCopy[i] = v === undefined ? null : v;
            }
        } else if (oCopy instanceof Object) {
            Object.keys(o).forEach(function(k) {
                var v = KidaptiveUtils.copyObject(o[k],true);
                if (v !== undefined) {
                    oCopy[k] = v;
                }
            });
        }
    }

    return oCopy;
};

//
KidaptiveUtils.checkObjectFormat = function(object, format) {
    //this normalizes objects, dropping undefined properties, converting primitive wrappers, converting subclasses of
    //Object to objects, etc
    object = KidaptiveUtils.copyObject(object,true);
    format = KidaptiveUtils.copyObject(format,true);

    if (object === undefined || format === undefined) {
        return;
    }

    if (format === null) {
        if (object !== null) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Expected null");
        }
    } else if (typeof format === 'function') {
        if (typeof object !== 'function') {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Expected function");
        }
    } else if (format instanceof Array) {
        if (!(object instanceof Array)) {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Expected array");
        }

        object.forEach(function(v, i) {
            try {
                KidaptiveUtils.checkObjectFormat(v, format[Math.min(i, format.length - 1)]);
            } catch (e) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Error at index " + i + ": " + e.message);
            }
        });
    } else if (format instanceof Object) {
        if (!(object instanceof Object) || object instanceof Array || typeof object === 'function') {
            throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Expected object");
        }
        Object.keys(format).forEach(function(k) {
            try {
                KidaptiveUtils.checkObjectFormat(object[k], format[k]);
            } catch (e) {
                throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Error at property " + k + ": " + e.message);
            }
        });
    } else if (typeof object !== typeof format) {
        throw new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "Expected " + typeof format);
    }
};