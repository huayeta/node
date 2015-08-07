var mongoose=require('mongoose');
var tools=require('../common/tools');
var Schema=mongoose.Schema;

var adminCategorySchema=new mongoose.Schema({
    name:{type:String},
    module:{type:String},
    image:{type:String},
    url:{type:String},
    keywords:{type:String},
    description:{type:String},
    contents:[{type:Schema.Types.ObjectId,ref:'admin_article'}],
    category_template:{type:String},
    list_template:{type:String},
    show_template:{type:String},
    time:{
        create:{type:Date,defaults:new Date().getTime()},
        update:{type:Date,defaults:new Date().getTime()}
    }
});

adminCategorySchema.pre('save',function(next){
    if(this.isNew){
        this.time.update=this.time.create=new Date().getTime();
    }else{
        this.time.update=new Date().getTime();
    }
    next();
});

//实例方法
adminCategorySchema.methods={
};
//静态方法
adminCategorySchema.statics={
    fetch:function(cb){
        return this.find({}).sort('time.create').exec(cb);
    }
};

module.exports=adminCategorySchema;