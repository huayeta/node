var mongoose=require('mongoose');
var tools=require('../common/tools');

var adminUploadSchema=new mongoose.Schema({
    filename:{type:String,required:true},
    filepath:{unique:true,type:String,required:true},
    size:{type:Number},
    type:{type:String},
    time:{
        create:{type:Date,defaults:new Date().getTime()},
        update:{type:Date,defaults:new Date().getTime()}
    }
});

adminUploadSchema.pre('save',function(next){
    if(this.isNew){
        this.time.update=this.time.create=new Date().getTime();
    }else{
        this.time.update=new Date().getTime();
    }
    next();
});

//实例方法
adminUploadSchema.methods={
};
//静态方法
adminUploadSchema.statics={
    fetch:function(cb){
        return this.find({}).sort('time.create').exec(cb);
    },
    findById:function(id,cb){
        return this.findOne({'_id':id}).exec(cb);
    }
};

module.exports=adminUploadSchema;