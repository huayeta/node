var template = require('../../config/template');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var tools = require('../common/tools');
var adminUpload =require('../models/adminUpload');
var page=require('../common/page');

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

function exists(dir) {
    return function (cb) {
        fs.exists(dir, function (exists) {
            cb(null, exists);
        });
    }
}

function mkdir(dir) {
    return function (cb) {
        fs.mkdir(dir, 0777, cb);
    }
}

exports.image_post = function* (next) {
    var fields =
        yield formParse(this);
    //    console.log(fields);
    if (fields && fields.length > 0) {
        // var readStream = fs.createReadStream(fields[1].file.path);
        //判断uploads目录存在
        var uploadsDir = path.join(__dirname, '../public/uploads');
        if (!(yield exists(uploadsDir))) yield mkdir(uploadsDir);
        //判断年份目录存在
        var year = new Date().getFullYear();
        var yearDir = path.join(uploadsDir, '/' + year);
        if (!(yield exists(yearDir))) yield mkdir(yearDir);
        //写入文件
        var filename = filenameTmp = fields[0].name;
        var filepath = path.join(yearDir, '/' + filename);
        //判断是否写入文件重复了
        var i = 1;
        while (yield exists(filepath)) {
            filename = filenameTmp.replace(/^(.*)+?\.(.+)$/ig, function (match, $1, $2) {
                return $1 + '(' + i + ').' + $2;
            });
            filepath = path.join(yearDir, '/' + filename);
            i++;
        }
        var writeStream = fs.createWriteStream(filepath);
        var readStream = fs.createReadStream(fields[1].file.path);
        readStream.pipe(writeStream);
        //添加上传的图片
        var _upload=new adminUpload({
            isNew:true,
            filepath:'/uploads/' + year + '/' + filename,
            filename: filename,
            size: fields[0].size,
            type: fields[0].type
        });
        yield _upload.save();
        //返回数据
        this.body = tools.success({
            filepath: '/uploads/' + year + '/' + filename,
            filename: filename,
            size: fields[0].size,
            createtime: fields[0].lastModifiedDate,
            type: fields[0].type
        });
    }
}

exports.image_document=function *(next){
    if(this.query.kw){
        var results=yield page({search:{filename:new RegExp(this.query.kw,'i')},model:adminUpload,pageLimit:12,ctx:this});
    }else{
        var results=yield page({model:adminUpload,pageLimit:12,ctx:this});
    }
    var DATA = {
        title: '图片列表',
        kw:this.query.kw,
        infos:results.infos,
        pages:results.page.pages
    };
    if(tools.isJson(this)){
        return this.body=tools.success(DATA.infos);
    }
    this.body = template('/admin/upload/image_document', DATA);
}
