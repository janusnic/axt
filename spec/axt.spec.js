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
var assert = require('assert');
var pkg = require('./../package.json');
require('../lib/dist/axt-'+pkg.version+'.min.js');



it("should contain it's core classes", function(done){
    assert(typeof _$ !== 'undefined');
    assert(typeof _$.Class !== 'undefined');
    assert(typeof _$.Ajax !== 'undefined');
    assert(typeof _$.EventEmitter !== 'undefined');
    done();
});

it("should support polymorphism", function(done){
    var BaseClass = _$.Class.extend({
        init: function(){
            assert(this instanceof BaseClass);
        }
    });
    var InheritedClass = BaseClass.extend({
        init: function(){
            assert(this instanceof InheritedClass);
        }
    });
    var a = new BaseClass();
    var b = new InheritedClass();
    assert(a !== b);
    assert(b instanceof BaseClass);
    assert(!(a instanceof InheritedClass));
    done();
});