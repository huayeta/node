module.exports = function(app){
    var path=require('path');
    var Router=require('koa-router');
    var template=require('art-template');
    var mongoose=require('mongoose');
    var crypto=require('crypto');//加密用的

    var router=new Router();

    template.config('base',path.resolve(__dirname,'../views/'));
    template.config('extname','.htm');

    //模板的使用
    router.get('/',function *(next){

        var DATA={title:'首页标题'};
        this.body=template('index',DATA);
    });

    //数据库的操作
    router.get('/mongoose',function *(next){
        //连接到huayeta这个数据库
        var db=mongoose.createConnection('127.0.0.1','huayeta');

        db.once('open',function(){
            console.log('mongodb working!');
            var Schema=mongoose.Schema;
            var userSchema=new Schema({
                name:{type:String,default:''},
                age:{type:Number,min:0,max:150},
                creattime:{type:Date,default:Date.now}
            });
            //对name字段过滤
            userSchema.path('name').set(function(name){
                return name+'1';
            });
            //对保存方法过滤
            userSchema.pre('save',function(next){
                console.log('save fired!');
                next();
            });
            //这里会连接到users这个表
            var userModel=db.model('user',userSchema);
            //添加数据
    //        var userEntity=new userModel({name:'zh01',age:19});
    //        userEntity.save();
            //查询数据，只列出name和age
    //        userModel.find({},'name age',function(err,person){
    //            console.log(person);
    //        });
            userModel.findById('559f429e8f74749107588376',function(err,person){
                console.log(person);
            });
        });
        db.on('error',function(){
            console.log('connection error!');
        });
    });

    //md5加密
    router.get('/md5',function *(next){
        this.body='请带上加密参数';
    });
    router.get('/md5/:content',function *(next){
        var content=this.params.content;
        var md5=crypto.createHash('md5');
        md5.update(content,'utf8');
        var body=md5.digest('hex');
        this.body=content+'的md5值为：'+body;
    });

    //编写多个中间件
    router.get('/user/:id',function *(next){
        yield next;
        console.log(2);
        this.body=this.params;
    },function *(next){
        console.log(1);
    });

    //嵌套路由,预先设计好格式
    //*预设路径
    var tmpRouter=new Router({prefix:'/nest'});
    //*对参数预先处理
    tmpRouter.param('category',function *(category,next){
    //    console.log(category);//category的值
        yield next;
    });
    //*对路径预先处理
    tmpRouter.use('/:category/:id',function *(next){
    //    console.log(this.params);
        yield next;
    })
    tmpRouter.get('/:category/:id',function *(next){
        this.body=this.params;
    });
    router.get('/nest/:category/:id',tmpRouter.routes());
    app.use(router.routes());
};