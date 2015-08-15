var parse=require('co-body');
var memberTopic=require('../models/memberTopic');
var memberTeam=require('../models/memberTeam');
var tools=require('../common/tools');
var _=require('underscore');

exports.team=function *(next){
    if(!this.query.id)return this.redirect('/team/list');
    var infos={};
    infos.topic=yield memberTopic.find({team:this.query.id,members:this.session.user._id});
    infos.user=this.session.user;
    infos.teamId=this.query.id;
    if(!tools.isJson(this)){
        this.body=yield this.render('member/team/index',infos);
    }else{
        //如果返回json
        this.body=tools.success(infos);
    }
}

//团队添加
exports.team_list=function *(next){
    var infos={};
    infos.infos=yield memberTeam.fetch(this);
    this.body=yield this.render('member/team/list',infos)
}

exports.team_add_post=function *(next){
    var body= yield parse(this);
    if(!body.name)return this.body=tools.error('名称不能为空');
    var _memberTeam=yield memberTeam.findByName(this,body.name);
    if(_memberTeam)return this.body=tools.error('不能添加重复的团队');
    var _newMemberTeam=new memberTeam(_.extend({owner:this.session.user._id},body));
    _newMemberTeam.isNew=true;
    _newMemberTeam.members.push(this.session.user._id);//把自己添加到团队里面
    var _new=yield _newMemberTeam.save();
    this.body=tools.success(_new);
}

//话题添加
exports.topic_add=function *(next){
    if(!tools.isJson(this)){
        
    }else{
        if(!this.query.id)return this.body=tools.success({});
        var _memberTopic=yield memberTopic.findById(this.query.id).populate('members');
        if(!_memberTopic)return this.body=tools.error('该主题不存在');
        console.log(_memberTopic);
        this.body=tools.success(_memberTopic);
    }
}

exports.topic_add_post=function *(next){
    var body= yield parse(this);
    if(!body.team)return this.body=tools.error('没有归属团队！');
    if(!body.name)return this.body=tools.error('话题名称不能为空！');
    if(!body.id){
        if(yield memberTopic.findOne({owner:this.session.user._id,name:body.name}))return this.body=tools.error('该话题已经存在');
        var _memberTopic=new memberTopic(_.extend({owner:this.session.user._id},body));
        _memberTopic.isNew=true;
        _memberTopic.members.push(this.session.user._id);
        var _new=yield _memberTopic.save();
        this.body=tools.success(_new);
    }else{
        if(yield memberTopic.findOne({owner:this.session.user._id,name:body.name,_id:{'$ne':body.id}}))return this.body=tools.error('名字重复了');
        var _memberTopic=yield memberTopic.findById(body.id);
        if(!_memberTopic)return this.body=tools.error('该话题不存在');
        _.extend(_memberTopic,body);
        var _new=yield _memberTopic.save();
        this.body=tools.success(_new);
    }
}

//话题退出
exports.topic_exit=function *(next){
    if(!this.query.id)return this.body=tools.error('参数错误');
//    var _memberTopic=yield 
}