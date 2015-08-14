var parse=require('co-body');
var memberChatTopic=require('../models/memberChatTopic');
var tools=require('../common/tools');
var _=require('underscore');

exports.chat=function *(next){
    if(!tools.isJson(this)){
        this.body=yield this.render('member/chat/index',{});
    }else{
        //如果返回json
        var infos={};
        infos.topic=yield memberChatTopic.fetch();
        this.body=tools.success(infos);
    }
}

exports.topic_add_post=function *(next){
    var body= yield parse(this);
    if(!body.name)return this.body=tools.error('话题名称不能为空！');
    if(!body.id){
        var _memberChatTopic=new memberChatTopic(body);
        _memberChatTopic.isNew=true;
        _memberChatTopic.onlines.push(this.session.user._id);
        yield _memberChatTopic.save();
        this.body=tools.success('保存成功');
    }else{
        var _memberChatTopic=yield memberChatTopic.findById(body.id);
        if(!_memberChatTopic)return this.body=tools.error('该话题不存在');
        _.extend(_memberChatTopic,body);
        yield _memberChatTopic.save();
        this.body=tools.success('修改成功');
    }
}