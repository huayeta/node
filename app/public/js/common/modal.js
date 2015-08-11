define('modal', function (require, exports, module) {
    var $=require('jquery');
    var widget=require('widget');
    
    var modal=function(){
        this.cfg={
            width:500,
            height300,
            title:'系统提示',
            content:''
        }
    }
    
    modal.prototype=$.extend({},new widget(),{
        renderUI:function(){
            
        },
        binderUI:function(){},
        syncUI:function(){},
        destrouctor:function(){
            this.mask && this.mask.remove();
        },
        alert:function(cfg){
             $.extend(this.cfg,cfg);
            this.render();
            return this;
        }
    })
    
    return modal;
})