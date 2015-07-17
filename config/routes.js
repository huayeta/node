module.exports = function(app){
    var Router=require('koa-router');
    var mongoose=require('mongoose');
    var session=require('koa-session-store');
    var mongooseStore=require('koa-session-mongoose');
    
    mongoose.connect('mongodb://127.0.0.1/huayeta');
    
    //session的配置
    app.keys = ['huayeta']; //加密秘钥
    app.use(session({
        store:mongooseStore.create({
            collection:'sessions',
            connection:mongoose.connection
        })
    }));
        
    var router=new Router();
    
    router.use(function *(next){
        console.log(this.session.user);
        yield next;
    });
    
    var index=require('../app/controllers/index');
    var member=require('../app/controllers/member');
    
    //首页
    router.get('/',index.index);
    
    //注册登陆
    router.get('/register',member.register);
    router.post('/register',member.register_post);
    router.get('/login',member.login);
    router.post('/login',member.login_post);
    router.get('/getinfo',member.getinfo);
    router.get('/logout',member.logout);
    
    app.use(router.routes());
};