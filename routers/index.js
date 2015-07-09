var path=require('path');
var router=require('koa-router')();
var template=require('art-template');

template.config('base',path.resolve(__dirname,'../views/'));
template.config('extname','.htm');

console.log(router.param);

router.get('/',function *(next){
//    this.body='hello world';
    var DATA={title:'首页标题'};
    
    
    this.body=template('index',DATA);
});

router.get('/user/:id',function *(next){
    this.body=this.params;
});

router.get('/get',function *(next){
    this.body='get request!';
});

module.exports = router;