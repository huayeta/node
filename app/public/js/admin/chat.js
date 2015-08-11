seajs.use(['jquery','handler','widget'],function($,handler,widget){
    var obj=function(){
        this.name='my name';
    }
    obj.prototype=$.extend({},new widget(),{
        name1:function(){
            return 'my prototype name';
        }
    })
    var jj=new obj();
    jj.cc='1';
    var cc=new obj();
    console.log(jj);
    console.log(jj.__proto__);
    console.log(obj.prototype.isPrototypeOf(jj));
    console.log(jj.hasOwnProperty('name'));
    console.log(jj.constructor==obj);
    console.log('name12' in jj)
    
    var events=new handler();
    
    jj.on('alert',function(){
        console.log(1111);
    })
    
    cc.fire('alert');
    
    console.log(new widget());
})