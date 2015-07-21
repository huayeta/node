var mongoose=require('mongoose');
var util=require('../common/util');

var commentSchema=new mongoose.Schema({
    
    time:{
        create:{type:Date,defaults:new Date().getTime()},
        update:{type:Date,defaults:new Date().getTime()}
    }
});

commentSchema.pre('save',function(next){
    var _this=this;
    
    if(this.isNew){
        this.time.update=this.time.create=new Date().getTime();
    }else{
        this.time.update=new Date().getTime();
    }
    
    _this.password=util.md5(this.password);
    next();
});

//实例方法
commentSchema.methods={
    
};
//静态方法
commentSchema.statics={
    fetch:function(cb){//查询所有用户
        return this.find({}).sort('updatatime').exec(cb);
    },
    findByAccount:function(account,cb){//通过账号查出用户的信息
        return this.findOne({'account':account}).exec(cb);
    }
};

module.exports=commentSchema;