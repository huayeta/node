var mongoose=require('mongoose');
var tools=require('../common/tools');
var Schema=mongoose.Schema;

var adminArticleSchema=new mongoose.Schema({
    title:{type:String,required:true},
    categoryid:{type:Schema.Types.ObjectId,ref:'admin_category'},
    image:{type:String},
    url:{type:String},
    keywords:{type:String},
    description:{type:String},
    hits:{type:Number,defaults:0},
    author:{type:String},
    content:{type:String},
    time:{
        create:{type:Date,defaults:new Date().getTime()},
        update:{type:Date,defaults:new Date().getTime()}
    }
});

adminArticleSchema.pre('save',function(next){
    if(this.isNew){
        this.time.update=this.time.create=new Date().getTime();
    }else{
        this.time.update=new Date().getTime();
    }
    
    next();
});

//实例方法
adminArticleSchema.methods={
    
};
//静态方法
adminArticleSchema.statics={
    fetch:function(cb){//查询所有内容
        return this.find({}).sort('updatatime').exec(cb);
    }
};

module.exports=adminArticleSchema;