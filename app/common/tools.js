var _ = require('underscore');
var crypto = require('crypto'); //加密用的

var tools = {};

//md5加密
tools.md5 = function (content) {
    var md5 = crypto.createHash('md5');
    md5.update(content, 'utf8');
    var body = md5.digest('hex');
    return body;
}

//请求是否是json请求
tools.isJson=function(ctx){
    return ctx.accepts('html','json')=='json';
}

//成功返回
tools.success = function (info, url) {
    var _url = '';
    if (url) _url = url;
    return {
        status: 1,
        info: info,
        url: _url
    };
}

//失败返回
tools.error = function (info, url) {
    var _url = '';
    if (url) _url = url;
    return {
        status: 0,
        info: info,
        url: _url
    };
}

//获取当前网址
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