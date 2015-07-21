var mongoose=require('mongoose');
var util=require('../common/util');

var articleSchema=new mongoose.Schema({
    title:{type:String,required:true},
    hits:{type:Number},
    author:{type:String},
    content:{type:String},
    time:{
        create:{type:Date,defaults:new Date().getTime()},
        update:{type:Date,defaults:new Date().getTime()}
    }
});

articleSchema.pre('save',function(next){
    if(this.isNew){
        this.time.update=this.time.create=new Date().getTime();
    }else{
        this.time.update=new Date().getTime();
    }
    
    this.password=util.md5(this.password);
    next();
});

//实例方法
articleSchema.methods={
    
};
//静态方法
articleSchema.statics={
    fetch:function(cb){//查询所有内容
        return this.find({}).sort('updatatime').exec(cb);
    },
    findById:function(id,cb){//通过id查找文章
        return this.findOne({'_id':id}).exec(cb);
    }
};

module.exports=articleSchema;