var koa = require('koa');
var http=require('http');
var app = koa();

require('./app/router.js')(app);
//静态资源文件目录
var serve=require('koa-static');
app.use(serve('./public'));

var server=http.createServer(app.callback());

var io=require('socket.io')(server);
io.of('/chat').on('connection',function(socket){
    socket.on('chat message',function(msg){
//        console.log('message:'+msg);
        //单线通道
        socket.emit('new message',msg);
    });
    socket.on('emit message',function(msg){
        //广播向其他用户发消息
        socket.broadcast.emit('new message',msg);
    });
    socket.on('disconnect',function(){
        console.log('user disconnected!');
    });
})

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

server.listen(3000);