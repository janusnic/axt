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
