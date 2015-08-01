var template = require('../../config/template');
var formidable = require('formidable');
var fs = require('fs');
var path=require('path');
var thunkify=require('thunkify');

exports.image = function* (next) {
    var DATA = {
        title: '首页标题'
    };
    this.body = template('/admin/upload/image', DATA);
}

function formParse(ctx) {
    return function (cb) {
        var form = new formidable.IncomingForm();
        form.parse(ctx.req, cb);
    }
}

function existsCo(dir){
    return function(cb){
        fs.exists(dir,function(exists){
            cb(null,exists);
        });
    }
}

function mkdirCo(dir){
    return function(cb){
        fs.mkdir(dir,0777,cb);
    }
}


exports.image_post = function* (next) {
    var fields =
        yield formParse(this);
    console.log(fields);
    if(fields && fields.length>0){
        var readStream=fs.createReadStream(fields[1].file.path);
        var uploadsDir=path.join(__dirname,'../public/js');
        console.log(yield existsCo(uploadsDir));
         this.body={status:0,info:'1'};
//        var writeStream=fs.createWriteStream(path.resolve(__dirname,''));
    }
}