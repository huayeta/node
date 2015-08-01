var mongoose=require('mongoose');
var tools=require('../common/tools');

var memberSchema=new mongoose.Schema({
    account:{unique:true,type:String,required:true},
    password:{type:String,required:true},
    // 0:普通会员
    // >=50:后台会员
    role:{type:Number,defaults:0},
    time:{
        create:{type:Date,defaults:new Date().getTime()},
        update:{type:Date,defaults:new Date().getTime()}
    }
});

memberSchema.pre('save',function(next){
    var _this=this;
    
    if(this.isNew){
        this.time.update=this.time.create=new Date().getTime();
    }else{
        this.time.update=new Date().getTime();
    }
    
    _this.password=tools.md5(this.password);
    next();
});

//实例方法
memberSchema.methods={
    checkPassword:function(password){//检测密码是否正确
        return this.password==tools.md5(password);
    }
};
//静态方法
memberSchema.statics={
    fetch:function(cb){//查询所有用户
        return this.find({}).sort('time.create').exec(cb);
    },
    findByAccount:function(account,cb){//通过账号查出用户的信息
        return this.findOne({'account':account}).exec(cb);
    }
};

module.exports=memberSchema;