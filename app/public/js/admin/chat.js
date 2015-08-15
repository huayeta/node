seajs.use(['jquery','modal','validForm','template','tools'],function($,modal,validForm,template,tools){
    template.config('openTag','<<');
    template.config('closeTag','>>');
    
    var $topicList=$('.j-topic-list');
    var $chatCon=$('.j-chat-con');
    var $topicAdd=$('.j-topic-add');
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