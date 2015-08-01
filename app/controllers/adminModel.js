var parse=require('co-body');
var template=require('../../config/template');
var adminModel=require('../models/adminModel');
var tools=require('../common/tools');
var _=require('underscore');
var fs=require('fs');
var path=require('path');

exports.list=function *(next){
    var infos=yield adminModel.fetch();
    this.body=template('/admin/model/list',{infos:infos});
}

exports.add=function *(next){
    var id=this.query.id;
    var model={};
    if(id)model=yield adminModel.findById(id);
    var files=yield fs.readdir.bind(null,path.resolve(__dirname,'../views/'));;
    model.categorys=[];
    model.lists=[];
    model.shows=[];
    for(var i in files){
        if(/\.htm$/.test(files[i])){
            if(/^category.*/.test(files[i])){
                model.categorys.push(files[i]);
            }
            else if(/^list.*/.test(files[i])){
                model.lists.push(files[i]);
            }
            else if(/^show.*/.test(files[i])){
                model.shows.push(files[i]);
            }
        }
    }
    this.body=template('/admin/model/add',model)
}

exports.add_post=function *(next){
    var body= yield parse(this);
    if(!body.name || !body.module || !body.category_template || !body.list_template || !body.show_template) return this.body=tools.error('参数错误');
    if(!body.id){
        var model=new adminModel(body);
        model.isNew=true;
        yield model.save();
        return this.body=tools.success('添加成功！');
    }else{
        var model=yield adminModel.findById(body.id);
        model=_.extend(model,body);
        yield model.save();
        return this.body=tools.success('修改成功！');
    }
}

exports.del=function *(next){
    var id=this.query.id;
    if(!id)return this.body=tools.error('参数错误');
    yield adminModel.remove({_id:id});
    return this.body=tools.success('删除成功');
}