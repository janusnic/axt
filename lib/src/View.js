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

var View = _$.EventEmitter.extend({
    el: undefined,
    template: undefined,
    model: undefined,
    init: function($el){
        this.el = $el;
    },
    getModel: function(){
        return this.model;
    },
    setModel: function(model){
        this.model = model;
    },
    render: function(){
        if(this.el.innerHTML !== undefined && (typeof this.template).toLowerCase() === 'function')
            this.el.innerHTML = this.template(this.model);
        this.emit('render', this);
    },
    update: function(){
        if(this.model !== undefined && this.model.dirty !== undefined && this.model.dirty){
            this.model.dirty = false;
            this.render();
        }
        this.emit('update', this);
    }

});


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    root._$.View = View;
    module.exports.View = root._$.View;
}
else{
    if(typeof window._$ === 'undefined')
        window._$ = {};
    window._$.View = View;
}