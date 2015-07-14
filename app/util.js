var _=require('underscore');
var crypto=require('crypto');//加密用的

var util={};

util.md5=function(content){
    var md5=crypto.createHash('md5');
    md5.update(content,'utf8');
    var body=md5.digest('hex');
    return body;
}

module.exports=util;