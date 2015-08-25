/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - Gabriel Reiser, greiser
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


    var root = {};
    if(typeof global !== 'undefined')
        root = global;
    if(typeof window !== 'undefined')
        root = window;
    if (typeof root._$ === 'undefined')
        root._$ = {};
    var Class = function () {
    };

    Object.prototype.alias = function(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    };

    Class.extend = function (prop) {
        var _super = this.prototype;
        var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
        this.initializing = true;
        var prototype = new this();
        this.initializing = false;
        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!this.initializing && this.init)
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
        root._$.class = Class;
        module.exports.class = root._$.class;
    }
    else{
        if(typeof window._$ === 'undefined')
            window._$ = {};
        window._$.class = Class;
    }


 /*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - Gabriel Reiser, greiser
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var root = {};
if(typeof global !== 'undefined')
    root = global;
if(typeof window !== 'undefined')
    root = window;
if (typeof root._$ === 'undefined')
    root._$ = {};

    var Ajax = {};
    if(typeof _$ !== 'undefined' && typeof _$.class !== 'undefined')
        Ajax = _$.class.extend({
            get: function(options) {
                return xhr('GET', options.url, options.data, options.headers, options.type);
            },
            put: function (options) {
                return xhr('PUT', options.url, options.data, options.headers, options.type);
            },
            post: function (options) {
                return xhr('POST', options.url, options.data, options.headers, options.type);
            },
            delete: function (options) {
                return xhr('DELETE', options.url, options.data, options.headers, options.type);
            }
        });

    var parseJSON = function (req) {
        var result;
        try {
            result = JSON.parse(req.responseText);
        } catch (e) {
            result = req.responseText;
        }
        return [result, req];
    };

    var parseXML = function(req) {
        var result;
        if (window.DOMParser) {
            var parser = new DOMParser();
            result = parser.parseFromString(req.responseText, "text/xml");
        }
        else // Internet Explorer
        {
            result = new ActiveXObject("Microsoft.XMLDOM");
            result.async = false;
            result.loadXML(req.responseText);
        }
        return [result, req];
    };

    var xhr = function (type, url, data, headers, contentType) {
        if(headers === 'undefined')
            headers = [{"Content-Type":"application/json"}];
        var methods = {
            success: function () {},
            error: function () {}
        };
        var XHR = XMLHttpRequest || ActiveXObject || require('xhr2');
        var request = new XHR('MSXML2.XMLHTTP.3.0');
        request.open(type, url, true);
        for(var header in headers){
            request.setRequestHeader(header[0], header[1]);
        }
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 300) {
                    methods.success.apply(methods, contentType.toLowerCase() === 'json' ? parseJSON(request): parseXML(request));
                } else {
                    methods.error.apply(methods, contentType.toLowerCase() === 'json' ? parseJSON(request): parseXML(request));
                }
            }
        };
        request.send(data);
        var callbacks = {
            success: function (callback) {
                methods.success = callback;
                return callbacks;
            },
            error: function (callback) {
                methods.error = callback;
                return callbacks;
            }
        };

        return callbacks;
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        root._$.ajax = Ajax;
        module.exports.ajax = root._$.ajax;
    }
    else{
        if(typeof window._$ === 'undefined')
            window._$ = {};
        window._$.ajax = Ajax;
    }


 /*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - Gabriel Reiser, greiser
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var root = {};
if(typeof global !== 'undefined')
    root = global;
if(typeof window !== 'undefined')
    root = window;
if (typeof root._$ === 'undefined')
    root._$ = {};

    var EventEmitter = _$.class.extend({
        listeners: undefined,
        init: function(){
            listeners = new Array();
        },
        addListener: function(event, callback){
            if(listeners.length < 50)
                listeners.push({event:event, callback:callback});
            else
                throw new Error("Event Emitters are limited to 50 listeners maximum.");
        },
        addListenerOnce: function(event, callback){
            var self = this;
            var done = function(){
                this.callback(arguments);
                this.cleanup();
            };
            done.callback = callback;
            done.cleanup = function(){
                self.off(event, done);
            };
            listeners.push({event:event, callback:done});
        },
        removeListener: function(event, callback){
            for(var i = 0; i<listeners.length; i++){
                if(listeners[i].callback === callback)
                    listeners[i] = null;
            }
        },
        emitEvent: function(event){
            for(var i = 0; i<listeners.length; i++){
                if(listeners[i] !== null){
                    if(listeners[i].event == event){
                        var argArray = new Array();
                        for(var args in arguments){
                            argArray.push(arguments[args]);
                        }
                        listeners[i].callback.apply(this,argArray.slice(1) || []);
                    }
                }
            }
        },
        on: alias('addListener'),
        off: alias('removeListener'),
        onOnce: alias('addListenerOnce'),
        trigger: alias('emitEvent'),
        emit: alias('emitEvent')
    });

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        root._$.eventEmitter = EventEmitter;
        module.exports.eventEmitter = root._$.eventEmitter;
    }
    else{
        if(typeof window._$ === 'undefined')
            window._$ = {};
        window._$.eventEmitter = EventEmitter;
    }
