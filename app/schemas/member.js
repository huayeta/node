var mongoose=require('mongoose');
var util=require('../util.js');

var memberSchema=new mongoose.Schema({
    account:{unique:true,type:String,required:true},
    password:{type:String,required:true},
    createtime:{type:Date},
    updatatime:{type:Date,defaults:new Date().getTime()}
});

memberSchema.pre('save',function(next){
    var _this=this;
    this.createtime=new Date().getTime();
    this.updatatime=new Date().getTime();  
    
    _this.password=util.md5(this.password);
    next();
});

//实例方法
memberSchema.methods={
    checkPassword:function(password){//检测密码是否正确
        return this.password==util.md5(password);
    }
};
//静态方法
memberSchema.statics={
    fetch:function(cb){//查询所有用户
        return this.find({}).sort('updatatime').exec(cb);
    },
    findByAccount:function(account,cb){//通过账号查出用户的信息
        return this.findOne({'account':account}).exec(cb);
    }
};

module.exports=memberSchema;