var path=require('path');
var Router=require('koa-router');
var template=require('art-template');
var accepts=require('accepts');

var router=new Router();

template.config('base',path.resolve(__dirname,'../views/'));
template.config('extname','.htm');

//模板的使用
router.get('/',function *(next){
//    this.body='hello world';
    var DATA={title:'首页标题'};
    this.body=template('index',DATA);
});

//编写多个中间件
router.get('/user/:id',function *(next){
    yield next;
    console.log(2);
    this.body=this.params;
},function *(next){
    console.log(1);
});

//嵌套路由,预先设计好格式
//*预设路径
var tmpRouter=new Router({prefix:'/nest'});
//*对参数预先处理
tmpRouter.param('category',function *(category,next){
//    console.log(category);//category的值
    yield next;
});
//*对路径预先处理
tmpRouter.use('/:category/:id',function *(next){
//    console.log(this.params);
    console.log(accepts(this.req).type());
    yield next;
})
tmpRouter.get('/:category/:id',function *(next){
    this.body=this.params;
});
router.get('/nest/:category/:id',tmpRouter.routes());

module.exports = router;