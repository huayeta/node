var parse=require('co-body');
var memberTopic=require('../models/memberTopic');
var memberTeam=require('../models/memberTeam');
var member=require('../models/member');
var tools=require('../common/tools');
var _=require('underscore');

exports.team=function *(next){
    if(!this.query.id)return this.redirect('/team/list');
    var infos={};
    infos.team=yield memberTeam.findOne({_id:this.query.id,members:this.session.user._id});
    if(!infos.team) return this.redirect('/team/list');
    infos.topic=yield memberTopic.find({team:this.query.id,members:this.session.user._id});
    infos.user=yield member.findMember(this.session.user._id);
    if(!infos.user.avatar)infos.user.avatar='/member/common/avatar.jpg';
    infos.teamId=this.query.id;
    infos.host=this.protocol+'://'+this.host;
    if(!tools.isJson(this)){
        this.body=yield this.render('member/team/index',infos);
    }else{
        //如果返回json
        this.body=tools.success(infos);
    }
}

//获取成员列表
exports.infos=function *(next){
    var infos={};
    //话题会员
    if(this.query.topicid){
        infos.topic=yield memberTopic.findById(this.query.topicid).populate('members');
    }
    //团队会员
    if(this.query.teamid){
        infos.team=yield memberTeam.findById(this.query.teamid).populate('members');
    }
    this.body=tools.success(infos);
}

//团队列表
exports.team_list=function *(next){
    var infos={};
    infos.infos=yield memberTeam.fetch(this);
    if(tools.isJson(this)){
        this.body=tools.success(infos.infos);
    }else{
        this.body=yield this.render('member/team/list',infos);
    }
}

//团队添加
exports.team_add=function *(next){
    if(this.query.id){
        if(this.query.members==1){
            var team=yield memberTeam.findById(this.query.id).populate('members');
        }else{
            var team=yield memberTeam.findById(this.query.id);
        }
        if(!team)return this.body=tools.error('没有该团队');
        return this.body=tools.success(team);
    }
}

exports.team_add_post=function *(next){
    var body= yield parse(this);
    if(!body.name)return this.body=tools.error('名称不能为空');
    if(!body.id){
        var _memberTeam=yield memberTeam.findByName(this,body.name);
        if(_memberTeam)return this.body=tools.error('不能添加重复的团队');
        var _newMemberTeam=new memberTeam(_.extend({owner:this.session.user._id},body));
        _newMemberTeam.isNew=true;
        _newMemberTeam.members.push(this.session.user._id);//把自己添加到团队里面
        var _new=yield _newMemberTeam.save();
        //建立公告板
        var _memberTopic=new memberTopic({name:'公告板',owner:this.session.user._id,members:[this.session.user._id],team:_new._id,isdel:false,isNew:true});
        yield _memberTopic.save();
        this.body=tools.success(_new);
    }else{
        if(yield memberTeam.findOne({owner:this.session.user._id,name:body.name,_id:{'$ne':body.id}}))return this.body=tools.error('该团队已经存在');
        var _memberTeam=yield memberTeam.findById(body.id);
        if(!_memberTeam)return this.body=tools.error('该团队不存在');
        //不是自己的团队
        if(_memberTeam.owner!=this.session.user._id)return this.body=tools.error('参数错误');
        _.extend(_memberTeam,body);
        var _new=yield _memberTeam.save();
        this.body=tools.success(_new);
    }
}

//退出团队
exports.team_del=function *(next){
    var id=this.query.id;
    if(!id)return this.body=tools.error('参数错误');
    var _memberTeam=yield memberTeam.findById(id);
    if(!_memberTeam)return this.body=tools.error('参数错误');
    if(_memberTeam.owner!=this.session.user._id){
        //退出团队
        var _new=yield memberTeam.update({_id:id},{'$pull':{'members':this.session.user._id}});
        return this.body=tools.success('退出成功');
    }else{
        //删除团队
        var _memberTeam=yield memberTeam.remove({owner:this.session.user._id,_id:id});
        if(!_memberTeam.result.ok)return this.body=tools.error('参数错误');
        //删除相关话题
        yield memberTopic.remove({team:id});
        return this.body=tools.success('删除成功!');
    }
}

//团队邀请
exports.team_invitation=function *(next){
    var id=this.query.id;
    if(!id)return this.body=yield tools.msg(this,{msg:'团队不存在',url:'/team/list'});
    var _memberTeam=yield memberTeam.findById(id);
    if(!_memberTeam)return this.body=yield tools.msg(this,{msg:'团队不存在',url:'/team/list'});
    yield memberTeam.update({_id:id},{'$addToSet':{'members':this.session.user._id}});
    yield memberTopic.update({team:id,isdel:false},{'$addToSet':{'members':this.session.user._id}});
    this.body=yield tools.msg(this,{msg:'加入团队成功',url:'/team/list'});
}

//话题添加
exports.topic_add=function *(next){
    if(!tools.isJson(this)){
        
    }else{
        if(!this.query.id)return this.body=tools.success({});
        var _memberTopic=yield memberTopic.findById(this.query.id).populate('members');
        if(!_memberTopic)return this.body=tools.error('该主题不存在');
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
        var _memberTopic=yield memberTopic.findById(body.id);
        if(!_memberTopic)return this.body=tools.error('该话题不存在');
        if(_memberTopic.owner!=this.session.user._id)return this.body=tools.error('没有权限操作');
        if(yield memberTopic.findOne({owner:this.session.user._id,name:body.name,_id:{'$ne':body.id}}))return this.body=tools.error('名字重复了');
        _.extend(_memberTopic,body);
        var _new=yield _memberTopic.save();
        this.body=tools.success(_new);
    }
}

//话题退出
exports.topic_del=function *(next){
    if(!this.query.id)return this.body=tools.error('参数错误');
    var _memberTopic=yield memberTopic.findById(this.query.id);
    if(!_memberTopic)return this.body=tools.error('话题不存在');
    if(!_memberTopic.isdel)return this.body=tools.error('该话题不可退出');
    if(this.session.user._id==_memberTopic.owner){
        //是删除话题
        yield memberTopic.remove({_id:this.query.id});
        return this.body=tools.success('删除成功');
    }else{
        //退出话题
        yield memberTopic.update({_id:this.query.id},{'$pull':{'members':this.session.user._id}});
        return this.body=tools.success('退出成功');
    }
}