var mongoose=require('mongoose');
var tools=require('../common/tools');

var adminMemberSchema=new mongoose.Schema({
    name:{type:String},
    module:{type:String},
    category_template:{type:String},
    list_template:{type:String},
    show_template:{type:String},
    time:{
        create:{type:Date,defaults:new Date().getTime()},
        update:{type:Date,defaults:new Date().getTime()}
    }
});

adminMemberSchema.pre('save',function(next){
    if(this.isNew){
        this.time.update=this.time.create=new Date().getTime();
    }else{
        this.time.update=new Date().getTime();
    }
    next();
});

//实例方法
adminMemberSchema.methods={
};
//静态方法
adminMemberSchema.statics={
    fetch:function(cb){
        return this.find({}).sort('time.create').exec(cb);
    },
    findById:function(id,cb){
        return this.findOne({'_id':id}).exec(cb);
    }
};

module.exports=adminMemberSchema;