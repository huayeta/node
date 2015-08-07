var parse=require('co-body');
var fs=require('fs');
var path=require('path');
var template=require('../../config/template');
var adminCategory=require('../models/adminCategory');
var adminModel=require('../models/adminModel');
var tools=require('../common/tools');
var _=require('underscore');

exports.list=function *(next){
    var infos=yield adminCategory.fetch();
    this.body=yield this.render('admin/category/list',{infos:infos});
}

exports.add=function *(next){
    var id=this.query.id;
    var infos={};
    if(id)infos=yield adminCategory.findById(id);
    var files=yield fs.readdir.bind(null,path.resolve(__dirname,'../views/'));
    //解析物理文件
    infos.categorys=[];
    infos.lists=[];
    infos.shows=[];
    for(var i in files){
        if(/\.htm$/.test(files[i])){
            if(/^category.*/.test(files[i])){
                infos.categorys.push(files[i]);
            }
            else if(/^list.*/.test(files[i])){
                infos.lists.push(files[i]);
            }
            else if(/^show.*/.test(files[i])){
                infos.shows.push(files[i]);
            }
        }
    }
    //栏目模型
    infos.modules=yield adminModel.fetch();
    this.body=template('/admin/category/add',infos);
}

exports.add_post=function *(next){
    var body= yield parse(this);
    if(!body.module)return this.body=tools.error('请先选择栏目模型');
    if(!body.name)return this.body=tools.error('请先填写栏目名称');
    if(!body.id){
        var _model=new adminCategory(body);
        _model.isNew=true;
        yield _model.save();
        return this.body=tools.success('添加成功！');
    }else{
        var _model=yield adminCategory.findById(body.id);
        _model=_.extend(_model,body);
        yield _model.save();
        return this.body=tools.success('修改成功！');
    }
}

exports.del=function *(next){
    var id=this.query.id;
    if(!id)return this.body=tools.error('参数错误');
    yield adminCategory.remove({_id:id});
    return this.body=tools.success('删除成功');
}