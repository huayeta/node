seajs.use(['jquery','modal','validForm','template'],function($,modal,validForm,template){
    template.config('openTag','<<');
    template.config('closeTag','>>');
    
    var topicList=$('.j-topic-list');
    //初始化团队的信息
    function initTeam(){
        validForm.request({
            success:function(ret){
                if(ret.status){
                    if(ret.info.topic){
                        topicList.html(template('topicList',ret.info));
                    }
                }
            }
        });
    }
    initTeam();
    
    //添加话题按钮
    var $topicAdd=$('.j-topic-add');
    $topicAdd.click(function(){
        var topicModal=new modal();
        topicModal.alert({
            title:'创建话题',
            content:function(){
                return template('topicAdd',{});
            }
        });
        validForm.form({
            target:topicModal.boundingBox.find('form'),
            success:function(ret){
                if(ret.status){
                    topicModal.destroy();
                    initTeam();
                }else{
                    new modal().tips({content:ret.info});
                }
            }
        });
    });
})