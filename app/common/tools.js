var _ = require('underscore');
var crypto = require('crypto'); //加密用的

var tools = {};

tools.md5 = function (content) {
    var md5 = crypto.createHash('md5');
    md5.update(content, 'utf8');
    var body = md5.digest('hex');
    return body;
}

tools.success = function (info, url) {
    var _url = '';
    if (url) _url = url;
    return {
        status: 1,
        info: info,
        url: _url
    };
}

tools.error = function (info, url) {
    var _url = '';
    if (url) _url = url;
    return {
        status: 0,
        info: info,
        url: _url
    };
}

tools.getUrl = function (ctx) {
    return ctx.protocol + '://' + ctx.host + ctx.url;
}

tools.isGeneratorFunction = function (obj) {
    return obj && obj.constructor && 'GeneratorFunction' === obj.constructor.name;
}

tools.isGenerator = function (obj) {
    return obj && 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

tools.isPromise = function (obj) {
    return obj && 'function' == typeof obj.then;
}

tools.isObject = function (obj) {
    return obj && Object == obj.constructor;
}

tools.isArray = function (obj) {
    return Array.isArray(obj);
}

tools.isNumber = function (a) {
    return !isNaN(a);
}

module.exports = tools;