var parse=require('co-body');
var template=require('../../config/template');
var member=require('../models/member');
var tools=require('../common/tools');
var _=require('underscore');

exports.register=function *(next){
    this.body=template('register',{});
}

exports.register_post=function *(next){
    var body= yield parse(this);
    if(!body.account)return this.body=tools.error('账号不能为空！');
    if(!body.password)return this.body=tools.error('密码不能为空！');
    if(body.repeatpassword!=body.password)return this.body=tools.error('两次输入的密码不一致！');
    var persons=yield member.findByAccount(body.account);
    if(persons){
        this.body=tools.error('该账号已经注册!');
    }else{
        var _member=new member({
            isNew:true,
            account:body.account,
            password:body.password
        });
        _member.save();
        this.body=tools.success('注册成功！');
    }
}

exports.login=function *(next){
//    console.log(this.req.headers.referer);
    this.body=template('login',{});
}

exports.login_post=function *(next){
    var body=yield parse(this);
    if(!body.account)return this.body=tools.error('请先输入账号!');
    if(!body.password)return this.body=tools.error('请先输入密码!');
    var user=yield member.findByAccount(body.account);
    if(!user)return this.body=tools.error('该账号不存在!');
    if(!user.checkPassword(body.password)){
        return this.body=tools.error('密码不正确！');
    }else{
        this.session.user=user;
        //更新登陆时间
        user.time.update=new Date().getTime();
        yield user.save();
        //判断来源
        var _url='';
        if(this.query.redirectTo)_url=this.query.redirectTo;
        
        this.body=tools.success('登陆成功!',_url);
    }
}

exports.getinfo=function *(next){
    if(this.session.user){
        var _member=yield member.findById(this.session.user._id);
        this.body=tools.success(_member);
    }else{
        this.body=tools.error('请先登陆');
    }
}

exports.account_post=function *(next){
    var body=yield parse(this);
    if(!this.session.user)return this.body=tools.error('请先登录');
    var _member=yield member.findById(this.session.user._id);
    _.extend(_member,body);
    var _new=yield _member.save();
    this.body=tools.success(_new);
}

exports.logout=function *(next){
    this.session.user=null;
    this.redirect('/login');
}