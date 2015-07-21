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
    
    var index=require('../app/controllers/index');
    var member=require('../app/controllers/member');
    var user=require('../app/controllers/user');
    var admin=require('../app/controllers/admin');
    var adminMember=require('../app/controllers/adminMember');
    
    //首页
    router.get('/',index.index);
    
    //注册登陆
    router.get('/register',member.register);
    router.post('/register',member.register_post);
    router.get('/login',member.login);
    router.post('/login',member.login_post);
    router.get('/getinfo',member.getinfo);
    router.get('/logout',member.logout);
    
    //后台列表
    router.get('/admin',admin.admin);
    router.get('/admin/login',admin.login);
    router.post('/admin/login',admin.login_post);
    router.get('/admin/index',user.adminRequired,admin.index);
    //会员添加相关
    router.get('/admin/member/add',user.adminRequired,adminMember.memberAdd);
    router.post('/admin/member/add',user.adminRequired,adminMember.memberAdd_post);
    router.get('/admin/member/del',user.adminRequired,adminMember.memberDel);
    router.get('/admin/member/list',user.adminRequired,adminMember.memberList);
    
    app.use(router.routes());
};