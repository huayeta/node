define('modal', function (require, exports, module) {
    var $=require('jquery');
    var widget=require('widget');
    
    var modal=function(){
        this.config={
            width:500,
            height:300,
            title:'系统提示',
            padding:'20px',
            content:'',
            isMask:true
        }
    }
    
    modal.prototype=$.extend({},new widget(),{
        renderUI:function(){
            var _this=this;
            switch(this.config.type){
                case 'alert':
                    this.boundingBox=$('<div class="m-modal-con"><div class="modal-header"><span class="remove icon-remove"></span><span class="title">'+this.config.title+'</span></div><div class="modal-content" style="padding:'+this.config.padding+'">'+($.isFunction(this.config.content)?this.config.content():this.config.content)+'</div></div>');
                    break;
                case 'loading':
                    this.boundingBox=$('<div class="m-modal-loading"><span class="icon icon-spinner icon-spin icon-2x"></span>正在加载中......</div>');
                    break;
                case 'tips':
                    this.boundingBox=$('<div class="m-modal-tips"><span class="icon-info-sign icon"></span>'+($.isFunction(this.config.content)?this.config.content():this.config.content)+'</div>');
                    break;
                case 'showBtn':
                    this.boundingBox=$('<div class="m-modal-showBtn">'+(this.config.title?'<div class="modal-header"><span class="remove icon-remove"></span><span class="title">'+this.config.title+'</span></div>':'')+'<div class="modal-content showBtn"></div></div>');
                    var index=0;
                    _this.addButtons=function(buttons,tx){
                        var tpl='';
                        buttons.forEach(function(n){
                            if(n.before && $.isFunction(n.before) && n.before()===false){return;};
                            tpl+='<div class="item-menu" data-index="'+index+'" '+(n.style?('style="'+n.style+'"'):'')+'><i class="icon '+n.icon+'"></i><span class="tt">'+n.text+'</span></div>';
                             n.hr && (tpl+='<div class="hr"></div>');
                            index++;
                        });
                        _this.boundingBox.find('.showBtn').append(tpl);
                        if(!tx){
                            _this.config.buttons=_this.config.buttons.concat(buttons);
                        }
                    }
                    if(this.config.buttons && Array.isArray(this.config.buttons)){
                        _this.addButtons(this.config.buttons,true);
                    }
                    break;
                case 'confirm':
                    this.boundingBox=$('<div class="m-modal-con" style="width:390px;"><div class="modal-content">'+($.isFunction(this.config.content)?this.config.content():this.config.content)+'</div><div class="modal-footer"><a class="confirm">确认</a><a class="cancel">取消</a></div></div>');
                    break;
            }
            //处理模态
            if(this.config.isMask){
                this.mask=$('<div class="m-modal-mask"></div>');
                switch(this.config.isMask){
                    case 'default':
                        this.mask=$('<div class="m-modal-mask default"></div>');
                        break;
                    default:
                        this.mask=$('<div class="m-modal-mask"></div>');
                        break;
                }
                this.mask.appendTo('body');
            }
        },
        bindUI:function(){
            var _this=this;
            switch(this.config.type){
                case 'alert':
                    _this.boundingBox.delegate('.modal-header .remove','click',function(){
                        _this.fire('close');
                        _this.destroy();
                    });
                    break;
                case 'tips':
                    setTimeout(function(){
                        _this.fire('close');
                        _this.destroy();
                    },1500);
                    break;
                case 'showBtn':
                    _this.close=function(){
                        _this.fire('close');
                        _this.destroy();
                    };
                    _this.boundingBox.delegate('.modal-header .remove','click',_this.close);
                    _this.boundingBox.delegate('.item-menu','click',function(){
                        var $this=$(this);
                        var index=$this.data('index');
                        if(_this.config.buttons && Array.isArray(_this.config.buttons)){
                            if(_this.config.buttons[index].url){
                                window.location.href=_this.config.buttons[index].url;
                            }else{
                                _this.config.buttons[index].click && _this.config.buttons[index].click();
                            }
                        }
                        _this.close();
                    })
                    _this.mask.click(_this.close);
                    break;
                case 'confirm':
                    _this.boundingBox.delegate('.modal-footer .confirm','click',function(){
                        _this.fire('confirm');
                        _this.destroy();
                    });
                    _this.boundingBox.delegate('.modal-footer .cancel','click',function(){
                        _this.fire('cancel');
                        _this.destroy();
                    })
                    break;
            }
        },
        syncUI:function(){
            var _this=this;
            switch(this.config.type){
                case 'alert':
                    this.boundingBox.css({
                        width:this.config.width
                    });
                    break;
                case 'showBtn':
                    var $target=$(_this.config.target);
                    var offset=$target.offset();
                    var top=offset.top;
                    var left=offset.left;
                    var height=$target.outerHeight();
                    var _height=this.boundingBox.height();
                    var width=$target.outerWidth();
                    var _width=this.boundingBox.width();
                    var maxHeight=$(window).innerHeight();
                    var maxWidth=$(window).innerWidth();
                    if(top+height+_height<maxHeight){
                        _this.boundingBox.css({top:top+height-this.config.offset.top});
                    }else{
                        _this.boundingBox.css({bottom:maxHeight-top+this.config.offset.top});
                    }
                    if(left+_width<maxWidth){
                        _this.boundingBox.css({left:left+this.config.offset.left});
                    }else{
                        _this.boundingBox.css({right:maxWidth-left-width-this.config.offset.left});
                    }
                    break;
            }
        },
        destructor:function(){
            this.mask && this.mask.remove();
        },
        alert:function(cfg){
             $.extend(this.config,cfg,{type:'alert'});
            this.render();
            return this;
        },
        loading:function(cfg){
            $.extend(this.config,cfg,{type:'loading',isMask:'default'});
            this.render();
            return this;
        },
        tips:function(cfg){
            $.extend(this.config,cfg,{type:'tips',isMask:false});
            this.render();
            return this;
        },
        showBtn:function(cfg){
            $.extend(true,this.config,{offset:{left:0,top:0}},cfg,{type:'showBtn',isMask:'default'});
            this.render();
            return this;
        },
        confirm:function(cfg){
            $.extend(true,this.config,{offset:{left:0,top:0}},cfg,{type:'confirm'});
            this.render();
            return this;
        }
    })
    
//    new modal().alert({content:'1111'}).on('close',function(){
//        console.log('alert close');
//    });
//    var mo=new modal();
//    mo.loading();
//    setTimeout(function(){mo.destroy();},1000)
        
//    new modal().tips({content:'11111'}).on('close',function(){
//        console.log('tips close');
//    });
//    new modal().showBtn({
//        title:'话题设置',
//        target:$('.j-topic-add')[0],
//        buttons:[{
//            text:'话题',
//            icon:'icon-remove',
//            click:function(){
//                console.log(1);
//            }
//        }]
//    });
//    new modal().confirm({content:'11111'}).on('confirm',function(){
//        console.log('confirm');
//    }).on('cancel',function(){
//        console.log('cancel');
//    });
    return modal;
})