var parse=require('co-body');
var fs=require('fs');
var path=require('path');
var template=require('../../config/template');
var adminArticle=require('../models/adminArticle');
var adminCategory=require('../models/adminCategory');
var tools=require('../common/tools');
var _=require('underscore');

exports.list=function *(next){
    var categoryid=this.query.categoryid;
    var infos={};
    if(!categoryid){
        infos=yield adminArticle.fetch();
    }else{
        infos=yield adminArticle.find({categoryid:categoryid});
    }
    this.body=yield this.render('admin/article/list',{infos:infos});
}

exports.add=function *(next){
    var id=this.query.id;
    var infos={};
    if(id)infos=yield adminArticle.findById(id);
    if(!infos.author)infos.author=this.session.admin.account;
    //栏目列表
    infos.categorys=yield adminCategory.fetch();
    this.body=yield this.render('admin/article/add',infos);
}

exports.add_post=function *(next){
    var body= yield parse(this);
    if(!body.categoryid)return this.body=tools.error('请先选择栏目');
    if(!body.title)return this.body=tools.error('请先填写文章名称');
    if(!body.id){
        var _model=new adminArticle(body);
        _model.isNew=true;
        var _article=yield _model.save();
        if(!_article)return this.body=tools.error('参数错误');
        var _category=yield adminCategory.findById(body.categoryid);
        if(!_category)return this.body=tools.error('没有指定的栏目');
        _category.contents.push(_article._id);
        yield _category.save();
        return this.body=tools.success('添加成功！');
    }else{
        var _article=yield adminArticle.findById(body.id);
        if(_article.categoryid!=body.categoryid){
            //先找到要修改的栏目
            var _category=yield adminCategory.findById(body.categoryid);
            if(!_category)return this.body=tools.error('没有指定的栏目');
            _category.contents.push(body.id);
            yield _category.save();
            //去原来的栏目里面删除
            var _categoryOriginal=yield adminCategory.findById(_article.categoryid);
            _categoryOriginal.contents=_categoryOriginal.contents.filter(function(ele){
                return ele!=_article.id;
            });
            yield _categoryOriginal.save();
        }
        _article=_.extend(_article,body);
        yield _article.save();
        return this.body=tools.success('修改成功！');
    }
}

exports.del=function *(next){
    var id=this.query.id;
    if(!id)return this.body=tools.error('参数错误');
    yield adminArticle.remove({_id:id});
    return this.body=tools.success('删除成功');
}