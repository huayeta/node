module.exports = function(app){
    var render = require('koa-swig');
    var path = require('path');
    app.context.render=render({
        root:path.resolve(__dirname,'../app/views'),
        autoescape:false,
        varControls:['<%','%>'],
        cache:false,
        ext:'htm'
    });
    
}