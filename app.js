var koa = require('koa');
var http=require('http');
var app = koa();
var port=process.env.POST || 3000;

//路由
require('./config/routes.js')(app);

//模板
require('./config/koa-swig')(app);

//404页面的中间件
app.use(function *pageNotFound(next){
  yield next;

  if (404 != this.status) return;

  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  this.status = 404;
  switch (this.accepts('html', 'json')) {
    case 'html':
      this.type = 'html';
      this.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      this.body = {
        status:0,
        info: 'Page Not Found'
      };
      break;
    default:
      this.type = 'text';
      this.body = 'Page Not Found';
  }
})

//静态资源文件目录
var serve=require('koa-static');
app.use(serve('./app/public'));

var server=http.createServer(app.callback());

//聊天
require('./app/common/chat.js')(server);

server.listen(port);