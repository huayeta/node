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
    var adminModel=require('../app/controllers/adminModel');
    var adminCategory=require('../app/controllers/adminCategory');
    var upload=require('../app/controllers/upload');
    
    //首页
    router.get('/',index.index);
    
    //注册登陆
    router.get('/register',member.register);
    router.post('/register',member.register_post);
    router.get('/login',member.login);
    router.post('/login',member.login_post);
    router.get('/getinfo',member.getinfo);
    router.get('/logout',member.logout);
    
    //上传相关
    router.get('/upload/image',user.adminRequired,upload.image);
    router.post('/upload/image',user.adminRequired,upload.image_post);
    router.get('/upload/image_document',user.adminRequired,upload.image_document);
    
    //后台列表
    router.get('/admin',admin.admin);
    router.get('/admin/login',admin.login);
    router.post('/admin/login',admin.login_post);
    router.get('/admin/logout',admin.logout);
    router.get('/admin/index',user.adminRequired,admin.index);
    //会员添加相关
    router.get('/admin/member/add',user.adminRequired,adminMember.memberAdd);
    router.post('/admin/member/add',user.adminRequired,adminMember.memberAdd_post);
    router.get('/admin/member/del',user.adminRequired,adminMember.memberDel);
    router.get('/admin/member/list',user.adminRequired,adminMember.memberList);
    //模型相关
    router.get('/admin/model/list',user.adminRequired,adminModel.list);
    router.get('/admin/model/add',user.adminRequired,adminModel.add);
    router.post('/admin/model/add',user.adminRequired,adminModel.add_post);
    router.get('/admin/model/del',user.adminRequired,adminModel.del);
    //栏目相关
    router.get('/admin/category/list',user.adminRequired,adminCategory.list);
    router.get('/admin/category/add',user.adminRequired,adminCategory.add);
    router.post('/admin/category/add',user.adminRequired,adminCategory.add_post);
    router.get('/admin/category/del',user.adminRequired,adminCategory.del);
    app.use(router.routes());
};