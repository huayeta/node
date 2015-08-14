 define('widget', function (require, exports, module) {
     var $ = require('jquery');

     var widget = function () {
         this.boundingBox = null; //最外层的jquery对象
     };

     widget.prototype = {
         on: function (type, fn) {
             if (!this.handlers[type]) this.handlers[type] = [];
             this.handlers[type].push(fn);
             return this;
         },
         fire: function () {
             var args = Array.prototype.slice.call(arguments);
             if (!args[0]) return; //没有触发事件
             if (this.handlers[args[0]] instanceof Array) {
                 var handlers = this.handlers[args[0]];
                 for (var i = 0, n = handlers.length; i < n; i++) {
                     handlers[i].apply(this, args.slice(1));
                 }
             }
             return this;
         },
         render: function (container) {
             this.renderUI();
             this.handlers = {};
             this.bindUI();
             this.syncUI();
             $(container || document.body).append(this.boundingBox);
         },
         destroy: function () {
             this.destructor();
             this.boundingBox.off();
             this.boundingBox.remove();
         },
         renderUI: function () {}, //渲染html，初始化this.boundingBox
         bindUI: function () {}, //绑定事件
         syncUI: function () {}, //渲染跟绑定完之后的回调
         destructor: function () {} //销毁后的回调
     }

     return widget;

 })