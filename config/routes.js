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
    var upload=require('../app/controllers/upload');
    var admin=require('../app/controllers/admin');
    var adminMember=require('../app/controllers/adminMember');
    var adminUser=require('../app/controllers/adminUser');
    var adminModel=require('../app/controllers/adminModel');
    var adminCategory=require('../app/controllers/adminCategory');
    var adminArticle=require('../app/controllers/adminArticle');
    var adminWechat=require('../app/controllers/adminWechat');
    var memberChat=require('../app/controllers/memberChat');
    
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
    router.get('/admin/user/add',user.adminRequired,adminUser.add);
    router.post('/admin/user/add',user.adminRequired,adminUser.add_post);
    router.get('/admin/user/del',user.adminRequired,adminUser.del);
    router.get('/admin/user/list',user.adminRequired,adminUser.list);
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
    //文章相关
    router.get('/admin/article/list',user.adminRequired,adminArticle.list);
    router.get('/admin/article/add',user.adminRequired,adminArticle.add);
    router.post('/admin/article/add',user.adminRequired,adminArticle.add_post);
    router.get('/admin/article/del',user.adminRequired,adminArticle.del);
    //微信文章搜索
    router.get('/admin/wechat/article',user.adminRequired,adminWechat.article);
    
    //前台会员中心
    router.get('/member/chat',user.userRequired,memberChat.chat);
    router.post('/member/chat/topic/add',user.userRequired,memberChat.topic_add_post);
    
    app.use(router.routes());
};