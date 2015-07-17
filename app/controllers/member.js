var parse=require('co-body');
var template=require('../../config/template');
var member=require('../models/member');
var util=require('../util');

exports.register=function *(next){
    this.body=template('register',{});
}

exports.register_post=function *(next){
    var body= yield parse(this);
    if(!body.account)return this.body=util.error('账号不能为空！');
    if(!body.password)return this.body=util.error('密码不能为空！');
    if(body.repeatpassword!=body.password)return this.body=util.error('两次输入的密码不一致！');
    var persons=yield member.findByAccount(body.account);
    if(persons){
        this.body=util.error('该账号已经注册!');
    }else{
        var _member=new member({
            account:body.account,
            password:body.password
        });
        _member.save();
        this.body=util.success('注册成功！');
    }
}

exports.login=function *(next){
    this.body=template('login',{});
}

exports.login_post=function *(next){
    var body=yield parse(this);
    if(!body.account)return this.body=util.error('请先输入账号!');
    if(!body.password)return this.body=util.error('请先输入密码!');
    var user=yield member.findByAccount(body.account);
    if(!user)return this.body=util.error('该账号不存在!');
    if(!user.checkPassword(body.password)){
        return this.body=util.error('密码不正确！');
    }else{
        this.session.user=user;
        return this.body=util.success('登陆成功!');
    }
}

exports.getinfo=function *(next){
    if(this.session.user){
        this.body=util.success(this.session.user);
    }else{
        this.body=util.error('请先登陆');
    }
}

exports.logout=function *(next){
    this.session.user=null;
    this.redirect('/login');
}