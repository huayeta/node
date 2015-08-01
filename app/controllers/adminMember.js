var parse=require('co-body');
var template=require('../../config/template');
var adminMember=require('../models/adminMember');
var tools=require('../common/tools');
var _=require('underscore');

exports.memberAdd=function *(next){
    var id=this.query.id;
    var user={};
    if(id){
        user=yield adminMember.findById(id);
    }
    this.body=template('admin/member/add',user);
}

exports.memberAdd_post=function *(next){
    var body= yield parse(this);
    if(!body.account)return this.body=tools.error('请先填写账号！');
    if(!body.id){
        if(!body.password)return this.body=tools.error('密码不能为空！');
        if(body.repeatpassword!=body.password)return this.body=tools.error('两次密码输入的不一样！');
        var user=yield adminMember.findByAccount(body.account);
        if(user) return this.body=tools.error('该账号已经存在！');
        var _user=new adminMember(_.extend({isNew:true},body));
        yield _user.save();
        this.body=tools.success('添加成功！');
    }else{
        var user=yield adminMember.findByAccount(body.account);
        if(user && user._id!=body.id)return this.body=tools.error('该账号已经存在');
        if(body.password && body.password!=body.repeatpassword)return this.body=tools('两次输入的密码不一样！');
        var _user=yield adminMember.findById(body.id);
        _user.account=body.account;
        if(body.password)_user.password=body.password;
        yield _user.save();
        this.body=tools.success('修改成功！');
    }
}

exports.memberDel=function *(next){
    var id=this.query.id;
    if(!id)return this.body=tools.error('参数错误');
    yield adminMember.remove({_id:id});
    this.body=tools.success('删除成功！');
}

exports.memberList=function *(next){
    var infos=yield adminMember.fetch();
    this.body=template('admin/member/list',{infos:infos});
}