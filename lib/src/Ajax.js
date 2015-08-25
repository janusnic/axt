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

(function(){
    var Ajax = {};
    if(typeof _$ !== 'undefined' && typeof _$.class !== 'undefined')
        Ajax = _$.class.extend({});

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

    Ajax.get = function (options) {
        return xhr('GET', options.url, options.data, options.headers, options.type);
    };

    Ajax.put = function (options) {
        return xhr('PUT', options.url, options.data, options.headers, options.type);
    };

    Ajax.post = function (options) {
        return xhr('POST', options.url, options.data, options.headers, options.type);
    };

    Ajax.delete = function (options) {
        return xhr('DELETE', options.url, options.data, options.headers, options.type);
    };

    return Ajax;

})();
