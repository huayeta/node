 define('handler', function (require, exports, module) {
     //一个事件驱动中心
     var handler = function () {
         this.handlers = {};
     };

     handler.prototype = {
         on: function (type, fn) {
             if (!this.handlers[type]) this.handlers[type] = [];
             this.handlers[type].push(fn);
         },
         fire: function () {
             var args = Array.prototype.slice.call(arguments);
             if (!args[0]) return;//没有触发事件
             if (this.handlers[args[0]] instanceof Array) {
                 var handlers = this.handlers[args[0]];
                 for (var i = 0, n = handlers.length; i < n; i++) {
                     handlers[i].apply(this,args.slice(1));
                 }
             }
         }
     }

     return handler;

 })