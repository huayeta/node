define('modal', function (require, exports, module) {
    var $=require('jquery');
    var widget=require('widget');
    
    var modal=function(){
        this.config={
            width:500,
            height:300,
            title:'系统提示',
            content:'',
            isMask:true
        }
    }
    
    modal.prototype=$.extend({},new widget(),{
        renderUI:function(){
            switch(this.config.type){
                case 'alert':
                    this.boundingBox=$('<div class="m-modal-con"><div class="modal-header"><span class="remove icon-remove"></span><span class="title">系统提示</span></div><div class="modal-content">'+($.isFunction(this.config.content)?this.config.content():this.config.content)+'</div></div>');
                    break;
                case 'loading':
                    this.boundingBox=$('<div class="m-modal-loading"><span class="icon icon-spinner icon-spin icon-2x"></span>正在加载中......</div>');
                    break;
                case 'tips':
                    this.boundingBox=$('<div class="m-modal-tips"><span class="icon-info-sign icon"></span>'+($.isFunction(this.config.content)?this.config.content():this.config.content)+'</div>');
                    break;
            }
            //处理模态
            if(this.config.isMask){
                this.mask=$('<div class="m-modal-mask"></div>');
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
                    if(_this.mask){
                        _this.mask.click(function(){
                            _this.fire('close');
                            _this.destroy();
                        });
                    }
                    break;
                case 'loading':
                    break;
                case 'tips':
                    setTimeout(function(){
                        _this.fire('close');
                        _this.destroy();
                    },1500);
                    break;
            }
        },
        syncUI:function(){
            switch(this.config.type){
                case 'alert':
                    this.boundingBox.css({
                        width:this.config.width
                    });
                    break;
                case 'loading':
                    break;
            }
        },
        destructor:function(){
            switch(this.config.type){
                case 'alert':
                    this.mask && this.mask.remove();
                    break;
                case 'loading':
                    break;
            }
        },
        alert:function(cfg){
             $.extend(this.config,cfg,{type:'alert'});
            this.render();
            return this;
        },
        loading:function(cfg){
            $.extend(this.config,cfg,{type:'loading'});
            this.render();
            return this;
        },
        tips:function(cfg){
            $.extend(this.config,cfg,{type:'tips',isMask:false});
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
    return modal;
})