var koa = require('koa');
var http=require('http');
var app = koa();
var port=process.env.POST || 3000;

//路由
require('./config/routes.js')(app);

//静态资源文件目录
var serve=require('koa-static');
app.use(serve('./app/public'));

var server=http.createServer(app.callback());

//聊天
require('./app/common/chat.js')(server);

server.listen(port);