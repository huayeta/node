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
    var memberTeam=require('../app/controllers/memberTeam');
    var weixiu=require('../app/controllers/weixiu');
    
    //首页
    router.get('/',index.index);
        
    //会员相关
    router.get('/member/getinfo',member.getinfo);
    router.post('/member/account',member.account_post);
    
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
    router.get('/team',user.userRequired,memberTeam.team);
    router.get('/team/list',user.userRequired,memberTeam.team_list);
    router.get('/team/add',user.userRequired,memberTeam.team_add);
    router.post('/team/add',user.userRequired,memberTeam.team_add_post);
    router.get('/team/del',user.userRequired,memberTeam.team_del);
    router.get('/team/invitation',user.userRequired,memberTeam.team_invitation);
    router.get('/team/topic/add',user.userRequired,memberTeam.topic_add);
    router.post('/team/topic/add',user.userRequired,memberTeam.topic_add_post);
    router.get('/team/topic/del',user.userRequired,memberTeam.topic_del);
    router.get('/team/infos',user.userRequired,memberTeam.infos);
//    router.get('/member/team/topic/list',user.userRequired,memberTeam.topic_list);
    
    //微秀
    router.get('/weixiu',weixiu.index);
    router.get('/weixiu/support',weixiu.support);
    router.get('/weixiu/show',weixiu.show);
    
    app.use(router.routes());
};