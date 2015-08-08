var parse=require('co-body');
var template=require('../../config/template');
var member=require('../models/member');
var tools=require('../common/tools');
var _=require('underscore');

exports.add=function *(next){
    var id=this.query.id;
    var user={};
    if(id){
        user=yield member.findById(id);
    }
    this.body=template('admin/user/add',user);
}

exports.add_post=function *(next){
    var body= yield parse(this);
    if(!body.account)return this.body=tools.error('请先填写账号！');
    if(!body.id){
        if(!body.password)return this.body=tools.error('密码不能为空！');
        if(body.repeatpassword!=body.password)return this.body=tools.error('两次密码输入的不一样！');
        var user=yield member.findByAccount(body.account);
        if(user) return this.body=tools.error('该账号已经存在！');
        var _user=new member(_.extend({isNew:true},body));
        yield _user.save();
        this.body=tools.success('添加成功！');
    }else{
        var user=yield member.findByAccount(body.account);
        if(user && user._id!=body.id)return this.body=tools.error('该账号已经存在');
        if(body.password && body.password!=body.repeatpassword)return this.body=tools('两次输入的密码不一样！');
        var _user=yield member.findById(body.id);
        _user.account=body.account;
        if(body.password)_user.password=body.password;
        yield _user.save();
        this.body=tools.success('修改成功！');
    }
}

exports.del=function *(next){
    var id=this.query.id;
    if(!id)return this.body=tools.error('参数错误');
    yield member.remove({_id:id});
    this.body=tools.success('删除成功！');
}

exports.list=function *(next){
    var infos=yield member.fetch();
    this.body=template('admin/user/list',{infos:infos});
}