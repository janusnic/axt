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

var Model = _$.EventEmitter.extend({
    url: undefined,
    data: undefined,
    ajax: undefined,
    content_type: undefined,
    headers: undefined,
    idAttribute: 'id',
    id:undefined,
    events: [
        'loaded',
        'saved',
        'deleted'
    ],
    error: undefined,
    dirty: false,

    init: function(){
        this.ajax = _$.Ajax.extend({});
        this._super.init();
    },
    load: function(id){
        var self = this;
        var iheaders = this.headers ? this.headers : [];
        var iid = id ? id : '';
        return this.ajax.get({
            url: this.url+'/'+iid,
            type: this.content_type,
            headers: iheaders
        }).success(function(data){
            this.data = data;
            this.emit('loaded', this);
        });
    },
    save: function(){
        var self = this;
        var iheaders = this.headers ? this.headers : [];
        var iid = id ? id : '';
        return this.ajax.post({
            url: this.url+'/'+iid,
            type: this.content_type,
            headers: iheaders,
            data: this.data
        }).success(function(){
            this.emit('saved', this);
        });
    },
    delete: function(){
        var self = this;
        var iheaders = this.headers ? this.headers : [];
        var iid = id ? id : '';
        return this.ajax.delete({
            url: this.url+'/'+iid,
            type: this.content_type,
            headers: iheaders,
            data: this.data
        }).success(function(){
            this.emit('deleted', this);
        });
    },
    get: function(name){
        return this.data[name];
    },
    set: function(key, val, options) {
        if (key == null) return this;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        var data;
        if (typeof key === 'object') {
            data = key;
            options = val;
        } else {
            (data = {})[key] = val;
        }

        options || (options = {});

        // Run validation.
        if (!this.validate(data)) return false;

        // Extract attributes and options.
        var unset      = options.unset;
        var silent     = options.silent;
        var changes    = [];
        var changing   = this._changing;
        this._changing = true;

        if (!changing) {
            this._previousAttributes = this.data;
            this.changed = {};
            this.dirty = true;
        }

        var current = this.data;
        var changed = this.changed;
        var prev    = this._previousAttributes;

        // For each `set` attribute, update or delete the current value.
        for (var attr in data) {
            val = data[attr];
            if (!current[attr]==val) changes.push(attr);
            if (!prev[attr]==val) {
                changed[attr] = val;
            } else {
                delete changed[attr];
            }
            unset ? delete current[attr] : current[attr] = val;
        }

        // Update the `id`.
        this.id = this.get(this.idAttribute);

        // Trigger all relevant attribute changes.
        if (!silent) {
            if (changes.length) this._pending = options;
            for (var i = 0; i < changes.length; i++) {
                this.emit('change:' + changes[i], {changed:changes[i], model:this});
            }
        }

        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (changing) return this;
        if (!silent) {
            while (this._pending) {
                options = this._pending;
                this._pending = false;
                this.emit('change', this, options);
            }
        }
        this._pending = false;
        this._changing = false;
        return this;
    },
    has: function(name) {
        return this.get(name) != null;
    },
    sync: function(){

    },
    validate: function(data) {
        if(data)
            this.emit('valid', this, data);
        else
            this.emit('invalid', this, data);
        return true;
    }
});


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    root._$.Model = Model;
    module.exports.Model = root._$.Model;
}
else{
    if(typeof window._$ === 'undefined')
        window._$ = {};
    window._$.Model = Model;
}