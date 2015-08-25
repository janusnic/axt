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
describe('axt.EventEmitter', function() {

    var pkg = require('./../package.json');
    require('../lib/dist/axt-' + pkg.version + '.min.js');

    it('should support event triggering', function (done) {
        var MyEventClass = _$.EventEmitter.extend({
            init: function () {
            },
            set: function (prop) {
                this[prop.name] = prop.value;
                this.emit('changed', prop); //here we are emitting a custom event with prop as the arguments
            }
        });
        var propTest = {name: 'x', value: 2};
        var instance = new MyEventClass();
        instance.on('changed', function (property) {
            expect(propTest).toEqual(property);
            expect(instance.x).toEqual(2);
            done();
        });
        instance.set(propTest);
    });
});