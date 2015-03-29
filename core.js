/****************************************************
 * Core.js
 ***************************************************/

'use strict';

function needsNew() {
    throw new TypeError("Failed to construct: Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
 * a Generic core object
 */
var Core = (function () {

    var constructor = this;

    /**
     * Prevent direct execution
     */
    //if (!(this instanceof Core))
    //    needsNew();

    /**
     * datastore getter
     */
    function get (key) {
        return this.data[key];
    }


    /**
     * datastore setter
     */
    function set (key, value) {
        return this.data[key] = value;
    }


    /**
     * Executes an array of functions, Sequentially
     */
    function executeFunctionArray (functionArray, args) {
        if (typeof(functionArray) !== "object" || !functionArray.length) return false;

        for (var i = 0; i < functionArray.length; i++) {
            args = functionArray[i](args);
        }

        return args;
    }


    /**
     * Registers a new global on the current object
     */
    function registerGlobal (key, value) {

        if (typeof(this[key]) === "undefined") {

            if (typeof(value) === "function") {

                this[key] = function () {
                    /**
                     * Prepare Arguments
                     *
                     * TODO: (Source: MDN)
                     * You should not slice on arguments because it prevents optimizations in JavaScript
                     * engines (V8 for example). Instead, try constructing a new array by iterating
                     * through the arguments object.
                     */
                    // var args = Array.prototype.slice.call(arguments);
                    var args = arguments;
                    if (args.length === 0) args = null;

                    /**
                     * Execute Before hooks on the arguments
                     */
                    if (this.hooks[key] && this.hooks[key].before && this.hooks[key].before.length > 0)
                        args = executeFunctionArray(this.hooks[key].before, args);

                    /**
                     * Execute the intended function
                     */
                    var result = value.apply(this, args);

                    /**
                     * Execute After hooks on the result
                     */
                    if (this.hooks[key] && this.hooks[key].after && this.hooks[key].after.length > 0)
                        result = executeFunctionArray(this.hooks[key].after, result);

                    return result;
                };

            } else {

                // If the global is being set to any other type of object or value, just do it.
                this[key] = value;

            }

        } else {
            console.log("ERROR: A module attempted to write to the `" + key + "` namespace, but it is already being used.");
        }
    }


    /**
     * Registers a new before hook on a method
     *
     * Example:
     * We could add a before hook to generateUID which always set the separator to `+`
     *
     * ```javascript
     * this.before('generateUID', function(args) {
     *     if (args) args[0] = '+';
     *     return args;
     * });
     * ```
     *
     * Then, when we called generateUID('-'), we would get a GUID separated by `+` instead.
     *
     * TODO: Consider moving this.before & this.after to a private namespace to they cannot
     * be easily accessed by 3rd party code.
     *
     */
    function before (key, func) {
        if (!this.hooks[key]) this.hooks[key] = {};
        if (!this.hooks[key].before) this.hooks[key].before = [];
        this.hooks[key].before.push(func);
    }


    /**
     * Registers a new after hook on a this method
     */
    function after (key, func) {
        if (!this.hooks[key]) this.hooks[key] = {};
        if (!this.hooks[key].after) this.hooks[key].after = [];
        this.hooks[key].after.push(func);
    }


    /**
     * Return public objects & methods
     */
    var obj = {
        data: {},
        hooks: {},
        executeFunctionArray: executeFunctionArray,
        registerGlobal: registerGlobal,
        __proto__: constructor,
        before: before,
        after: after,
        get: get,
        set: set
    };

    return function () {
        return obj;
    };
})();

/* global define:true module:true window: true */
if (typeof define === 'function' && define['amd'])      { define(function() { return Core; }); }
if (typeof module !== 'undefined' && module['exports']) { module['exports'] = Core; }
if (typeof window !== 'undefined')                      { window['Core'] = Core; }