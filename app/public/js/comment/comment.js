define(function(require, exports, module){
	var $=require('jquery');
	var template=require('template');
	var validForm=require('validForm');
    var dialog=require('fnDialog');
    var BOX=require('box');
    var tools=require('tools');
    var loginInfo=BOX.getLoginInfo();

    template.config('openTag', '<<');
    template.config('closeTag', '>>');
	
	var init=function(a){
        var a=a||{};
        var defaults={
            m:'article'
        }
        var opts=$.extend(defaults,a);
        BOX.loadCss({url:'js/comment/css/comment.css'});
        //获取各种dom
		var com=$('[data-comment]');
        var main=com.filter('[data-comment=main]');
		var form=com.filter('[data-comment=form]');
        var box=com.filter('[data-comment=box]');
        var articleId=tools.getCurParams('id');
        var reply='';//储存回复html格式
        var num=0;//添加了评论的个数
        var MC='?m='+opts.m+'&c=comment';
        
        if(main)main.fadeIn();
		//提交评论
        validForm.form({
            target:form,
            isLogin:true,
            success:function(ret){
                if(ret.status){
                    validForm.request({
                        url:MC+'&id='+articleId,
                        isJson:true,
                        success:function(ret){
                            if(ret.status && ret.info && $.isArray(ret.info) && ret.info.length>0){
                                num+=1;
                                var data={list:[]};
                                data.list.push(ret.info[0]);
                                var compile=template('commoentTpl',data);
                                box.prepend(compile);
                                box.find('[data-comment-list]:first').hide().slideDown();
                            }
                        }
                    });
                }else{
                    dialog.tips({content:ret.info});
                }
            }
        });
        //更新DATA模型的数据
		validForm.request({
			url:'js/comment/comment.tpl',
			dataType:'html',
            async:true,
			success:function(ret){
				box.append(ret);
                reply=box.find('#reply');
			}
		})
		//获取更多
        var clickPage=BOX.clickPage({target:'[data-comment=more]',curPage:0,pageSize:10,url:MC+'&id='+articleId});
        clickPage.successBefore=function(){
            clickPage.target.text('正在加载中...');
        }
        clickPage.complete=function(){
            clickPage.target.text('已经全部加载完');
            clickPage.isComplete=true;
            clickPage.target.hide();
        }
        clickPage.success=function(ret){
            clickPage.target.text('点击加载更多');
            if(ret.status){
                if(ret.info && $.isArray(ret.info)){
                    if(ret.info.length==0){
                        clickPage.complete();
                    }else{
                        var arr=ret.info;
                        if(arr.length>num){
                            //初始化num
                            arr.length=arr.length-num;
                            num=0;
                            for(var i in arr){
                                if(loginInfo.status && arr[i].mid==loginInfo.info.account){
                                    arr[i].isdel=true;
                                }else{
                                    arr[i].isdel=false;
                                }
                            }
                            var data={list:arr};
                            var compile = template('commoentTpl', data);
                            box.append(compile);
                        }else{
                            num=num-arr.length;
                        }
                        //判断是否完全加载
                        if(ret.info.length<clickPage.pageSize){
                            clickPage.complete();
                        }
                    }
                }else{
                    clickPage.complete();
                }
            }
        }
        //“顶”函数
        box.delegate('[data-comment-vote]','click',function(){
            var _this=$(this);
            var id=_this.attr('data-comment-id');
            var valObj=_this.find('[data-comment-val]');
            var val=parseInt(valObj.text());
            validForm.request({
                url:MC+'&a=agree&id='+id,
                isJson:true,
                success:function(ret){
                    if(!ret.status){
                        if(ret.info=='请先登录'){
                            BOX.getLogin();
                        }else{
                            dialog.alert({content:ret.info});
                        }
                    }else{
                        dialog.tips({
                            content:ret.info,
                            callback:function(){
                                valObj.text(val+1);
                            }
                        })
                    }
                }
            });
        });
        //删除函数
        box.delegate('[data-comment-del]','click',function(){
            var _this=$(this);
            var id=_this.attr('data-comment-del');
            validForm.request({
                url:MC+'&a=del&id='+id,
                isJson:true,
                success:function(ret){
                    if(!ret.status){
                        if(ret.info=='请先登录'){
                            BOX.getLogin();
                        }else{
                            dialog.alert({content:ret.info});
                        }
                    }else{
                        dialog.tips({
                            content:ret.info,
                            callback:function(){
                                _this.closest('.u-com-list').fadeOut();
                                setTimeout(function(){_this.closest('.u-com-list').remove()},2000)
                            }
                        })
                    }
                }
            });
        });
        //“回复”函数
        box.delegate('[data-comment-reply=btn]','click',function(){
            var _this=$(this);
            var id=_this.attr('data-comment-id');
            var username=_this.attr('data-comment-username');
            var clone=reply.clone();
            var parent=_this.closest('[data-comment-list]');
            var children=parent.find('[data-comment-children]');
            clone.find('input[name=commentid]').val(id);
            parent.find('[data-comment-reply=box]').remove();
            
            if(username){
                clone.find('textarea[name=content]').html('回复 '+username+'：');
            }
            children.append(clone.html());
        })
        box.delegate('[data-comment-reply=form]','submit',function(){
            var _this=$(this);
            var parent=_this.closest('[data-comment-children]');
            validForm.form({
                target:this,
                url:MC+'&a=add',
                success:function(ret){
                    if(ret.status){
                        var commentid=_this.find('input[name=commentid]').val();
                        var tx=false;//是否首次加载
                        var arr=[];//储存子评论数组
                        var page=1;//子评论页数
                        children();
                        function children(){
                            validForm.request({
                                url:MC+'&id='+articleId+'&commentid='+commentid+'&page='+page,
                                isJson:true,
                                success:function(ret){
                                    if(ret.status){
                                        if(!tx){
                                            tx=true;
                                            arr=ret.info;
                                        }else{
                                            arr=arr.concat(ret.info);
                                        }
                                        if(ret.info.length>0){
                                            page+=1;
                                            children();
                                        }else{
                                            var data={list:[]};
                                            data.list=arr;
                                            $.each(data.list,function(i,n){
                                                n.parentId=commentid;
                                            })
                                            var compile=template('replyhtml',data);
                                            parent.html('');
                                            parent.append(compile);
                                            var replyVal=parent.closest('[data-comment-list]').find('[data-comment-reply=btn]:first').find('[data-comment-val]');
                                            replyVal.text(parseInt(replyVal.text())+1);
                                        }
                                    }else{
                                        dialog.alert({content:ret.info});
                                    }
                                }
                            });
                        }
                    }else{
                        parent.show();
                        if(ret.info=='账号不能为空'){
                            BOX.getLogin();
                        }else{
                            dialog.tips({content:ret.info});
                        }
                    }
                }
            });
            _this.submit();
            return false;
        });
	}
	
	module.exports={
		init:init
	}
});