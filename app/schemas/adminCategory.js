var mongoose=require('mongoose');
var tools=require('../common/tools');

var adminCategorySchema=new mongoose.Schema({
    name:{type:String},
    //1:栏目,2:分类
    type:{type:Number,defaults:1},
    modul:{type:String},
    pid:{type:String,defaults:0},
    image:{type:String},
    url:{type:String},
    keywords:{type:String},
    description:{type:String},
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
    },
    findById:function(id,cb){
        return this.findOne({'_id':id}).exec(cb);
    }
};

module.exports=adminCategorySchema;