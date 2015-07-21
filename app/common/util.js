var _=require('underscore');
var crypto=require('crypto');//加密用的

var util={};

util.md5=function(content){
    var md5=crypto.createHash('md5');
    md5.update(content,'utf8');
    var body=md5.digest('hex');
    return body;
}

util.success=function(info,url){
    var _url='';
    if(url)_url=url;
    return {status:1,info:info,url:_url};
}

util.error=function(info,url){
    var _url='';
    if(url)_url=url;
    return {status:0,info:info,url:_url};
}

util.getUrl=function(ctx){
    return ctx.protocol+'://'+ctx.host+ctx.url;
}

module.exports=util;