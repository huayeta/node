seajs.use(['jquery','modal','validForm','template','tools'],function($,modal,validForm,template,tools){
    template.config('openTag','<<');
    template.config('closeTag','>>');
    
    var $team=$('.j-team');
    var $topicList=$('.j-topic-list');
    var $chatCon=$('.j-chat-con');
    var $topicAdd=$('.j-topic-add');
    var $user=$('.j-user');
    //上传图片
    tools.upload();
    //切换团队按钮
    $team.click(function(){
        window.location.href='/team';
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
                                    new modal().tips({content:ret.info});
                                    if(ret.status)memberModal.destroy();
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