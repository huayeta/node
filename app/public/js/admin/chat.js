seajs.use(['jquery','modal','validForm','template','tools','handler'],function($,modal,validForm,template,tools,handler){
    template.config('openTag','<<');
    template.config('closeTag','>>');
    
    var $team=$('.j-team');
    var $topicList=$('.j-topic-list');
    var $chatCon=$('.j-chat-con');
    var $topicAdd=$('.j-topic-add');
    var $user=$('.j-user');
    var teamId=tools.getCurParams('id');
    var USER;
    //同步获取会员信息
    validForm.request({
        url:'/member/getinfo',
        async:false,
        success:function(ret){
            if(ret.status)USER=ret.info;
        }
    })
    //信息监控中心
    var _handler=new handler();
    //团队改变的时候
    _handler.on('modifyTeam',function(ret){
        ret && $team.find('.name').text(ret.name);
    })
    //会员信息改变的时候
    _handler.on('modifyMember',function(ret){
        if(ret){
            var $parent=$user.closest('.m-chat-user');
            var $avatar=$parent.find('.avatar');
            var $nickname=$parent.find('.nickname');
            $avatar.attr('src',(ret.avatar?ret.avatar:'/images/common/avatar.jpg'));
            $nickname.text(ret.nickname);
        }
    })
    //上传图片
    tools.upload();
    //切换团队按钮
    $team.click(function(){
        var _this=$(this);
        validForm.request({
            url:'/team/add?members=1&id='+teamId,
            success:function(ret){
                if(!ret.status)return new modal().tips({content:ret.info});
                var _showBtnModal=new modal().showBtn({
                    title:'团队菜单',
                    offset:{top:-20},
                    target:_this[0],
                    buttons:[
                        {text:'团队设置',icon:'icon-pencil',hr:true,before:function(){return USER._id==ret.info.owner},click:function(){
                            var _modal=new modal().alert({
                                title:'团队设置',
                                padding:0,
                                content:function(){
                                    return template('team',ret.info);
                                }
                            });
                            tools.tabs();
                            validForm.form({
                                target:_modal.boundingBox.find('form')[0],
                                url:'/team/add',
                                success:function(re){
                                    if(!re.status)return new modal().tips({content:re.info});
                                    new modal().tips({content:'保存成功!'});
                                    _modal.destroy();
                                    _handler.fire('modifyTeam',re.info);
                                }
                            });
                            //退出团队
                            _modal.boundingBox.find('.j-del').click(function(){
                                _modal.destroy();
                                var txt=$(this).text();
                                new modal().confirm({content:'确认要'+txt+'吗？'}).on('confirm',function(){
                                    validForm.request({
                                        url:'/team/del?id='+teamId,
                                        success:function(re){
                                           if(!ret.status)return new modal().tips({content:ret.info});
                                            new modal().tips({content:txt+'成功！'});
                                            window.location.reload();
                                        }
                                    })
                                })
                            });
                        }},
                        {text:'添加团队',icon:'icon-plus-sign',url:'/team/list',hr:true,style:'color:#1976d2;'}
                    ]
                });
                //获取团队列表
                validForm.request({
                    url:'/team/list',
                    success:function(ret){
                        if(ret.status){
                            var arr=[];
                            ret.info.forEach(function(n){
                                arr.push({text:n.name,icon:'icon-user',url:'/team?id='+n._id});
                            });
                            _showBtnModal.addButtons(arr);
                        }
                    }
                })
            }
        });
    });
    //初始化点击按钮
    $topicList.delegate('.item-icon','click',function(){
        $(this).addClass('sel').siblings('.item-icon').removeClass('sel');
        var _this=$(this);
        validForm.request({
            url:'/team/topic/add?id='+_this.data('id'),
            success:function(ret){
                if(!ret.status)new modal().alert({content:ret.info});
                $chatCon.html(template('chatCon',ret.info));
            }
        });
    });
    //点击会员信息
    $user.click(function(){
        var _this=this;
        validForm.request({
            url:'/member/getinfo',
            success:function(ret){
                if(!ret.status)return new modal().tips({content:ret.info});
                new modal().showBtn({
                    title:false,
                    target:_this,
                    offset:{left:-20},
                    buttons:[
                        {text:'个人设置',icon:'icon-cog',click:function(){
                            var memberModal=new modal().alert({
                                title:'个人设置',
                                content:function(){
                                    return template('user',ret.info);
                                }
                            })
                            validForm.form({
                                target:memberModal.boundingBox.find('form')[0],
                                url:'/member/account',
                                success:function(ret){
                                    if(!ret.status)return new modal().tips({content:ret.info});
                                    new modal().tips({content:'保存成功！'});
                                    memberModal.destroy();
                                    _handler.fire('modifyMember',ret.info);
                                }
                            });
                        }},
                        {text:'退出账户',icon:'icon-off',click:function(){
                            window.location.href='/logout'
                        }}
                    ]
                });
            }
        });
    });
    //邀请会员
    $chatCon.delegate('.j-invitation','click',function(){
        var _this=$(this);
        var teamid=_this.data('teamid');
        var topicid=_this.data('topicid');
        var _modal=new modal();
        //获取团队跟话题会员列表
        validForm.request({
            url:'/team/infos?teamid='+teamid+'&topicid='+topicid,
            success:function(ret){
                if(!ret.status)return new modal().tips({content:ret.info});
                var members=[];
                ret.info.topic.members.forEach(function(n){
                    this.push(n._id);
                },members);
                ret.info.team.members.map(function(n){
                    n.isTopic=false;
                    if(members.indexOf(n._id)!=-1){
                        n.isTopic=true;
                    }
                    return n;
                })
                //弹窗
                _modal.alert({
                    title:'邀请成员',
                    padding:0,
                    content:function(){
                        return template('invitation',ret.info);
                    }
                });
                tools.tabs();
            }
        });
    })
    //初始化团队的信息
    $topicList.find('.item-icon:first-child').trigger('click');
    //添加话题
    function modifyTopic(info,cb){
        var info=info||{};
        var topicModal=new modal();
        topicModal.alert({
            title:'创建话题',
            padding:0,
            content:function(){
                return template('topicAdd',info);
            }
        });
        tools.tabs();
        validForm.form({
            target:topicModal.boundingBox.find('form'),
            success:function(ret){
                if(ret.status){
                    topicModal.destroy();
                    cb && $.isFunction(cb) && cb(ret.info);
                }else{
                    new modal().tips({content:ret.info});
                }
            }
        });
        topicModal.boundingBox.find('.j-del').click(function(){
            var _this=$(this);
            var id=_this.data('id');
            validForm.request({
                url:'/team/topic/del?id='+id,
                success:function(ret){
                    if(ret.status){
                        new modal().tips({content:ret.info});
                        $topicList.find('.item-icon.sel').remove();
                        $topicList.find('.item-icon:last-child').trigger('click');
                        topicModal.destroy();
                    }else{
                        new modal().tips({content:ret.info});
                    }
                }
            });
        });
    }
    //添加话题按钮
    $topicAdd.click(function(){
        modifyTopic({},function(info){
            new modal().tips({content:'保存成功'});
            $topicList.append(template('topicList',{topic:[info]}));
            $topicList.find('.item-icon:last-child').trigger('click');
        });
    });
    //修改话题按钮
    $chatCon.delegate('.j-topic-modify','click',function(){
        var _this=$(this);
        var id=_this.data('id');
        validForm.request({
            url:'/team/topic/add?id='+id,
            success:function(ret){
                if(!ret.status)return new modal().alert({content:ret.info});
                modifyTopic(ret.info,function(info){
                    new modal().tips({content:'修改成功!'});
                    $topicList.find('[data-id='+info._id+']').trigger('click').find('.title h2').text(info.name);
                });
            }
        });
    })
})