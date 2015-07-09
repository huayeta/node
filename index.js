var koa = require('koa');
var compress=require('koa-compress');
var router=require('./routers/index.js');

var app = koa();

app.use(compress());
app.use(router.routes());

//var session=require('koa-session');

//app.use(function *(next){
//    this.body='header\n';
//    yield saveResults.call(this);
//    this.body+='footer\n';
//});
//
//function *saveResults(){
//    this.body+='results saved!\n';
//}

//app.keys=['1'];//加密秘钥
//app.use(session(app));
//
//app.use(function *(next){
//    var start=new Date();
//    yield next;
//    var ms=new Date()-start;
//    this.set('X-Respose-Time',ms+'ms');
//});
//
//app.use(function *(next){
//    var start=new Date();
//    yield next;
//    var ms=new Date()-start;
////    console.log('%s %s - %s',this.method,this.url,ms);
//});
//
//app.use(function *(next){
//    this.body='Hello World!';
//    yield next;
//});
//
//app.use(function *(next){
////    console.log(this);
//    this.body=this;
//    this.cookies.set('name','zh01');
////    console.log(this.request.ip);
//    var n=this.session.views || 0;
//    this.session.views=++n;
//    this.body=n+' views';
//});
//
//app.on('error',function(err,ctx){
//    log.error('server',err,ctx);
//})

app.listen(3000);