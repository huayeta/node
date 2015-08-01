var parse=require('co-body');
var template=require('../../config/template');
var adminMember=require('../models/adminMember');
var tools=require('../common/tools');
var _=require('underscore');

exports.admin=function *(next){
    this.redirect('/admin/index');
}

exports.login=function *(next){
    this.body=template('admin/login',{});
}

exports.login_post=function *(next){
    var body=yield parse(this);
    if(!body.account)return this.body=tools.error('请先输入账号!');
    if(!body.password)return this.body=tools.error('请先输入密码!');
    var user=yield adminMember.findByAccount(body.account);
    if(!user)return this.body=tools.error('该账号不存在!');
    if(!user.checkPassword(body.password)){
        return this.body=tools.error('密码不正确！');
    }else{
        this.session.admin=user;

        //判断来源
        var _url='';
        if(this.query.redirectTo)_url=this.query.redirectTo;
        
        this.body=tools.success('登陆成功!',_url);
    }
}

exports.logout=function *(next){
    this.session.admin=null;
    this.redirect('/admin/login');
}

exports.index=function *(next){
    var DATA={title:'后台首页',admin:this.session.admin};
    this.body=template('admin/index',DATA);
}