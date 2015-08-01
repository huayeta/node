var parse=require('co-body');
var template=require('../../config/template');
var adminCategory=require('../models/adminCategory');
var tools=require('../common/tools');
var _=require('underscore');

exports.list=function *(next){
    var infos=yield adminCategory.fetch();
    this.body=template('/admin/category/list',{infos:infos});
}

exports.add=function *(next){
    var id=this.query.id;
    var infos={};
    if(id)infos=yield adminModel.findById(id);
    this.body=template('/admin/category/add',infos)
}

exports.add_post=function *(next){
    var body= yield parse(this);
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