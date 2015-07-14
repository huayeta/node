var mongoose=require('mongoose');

var memberSchema=new mongoose.Schema({
    account:{type:String,required:true,match:/^[a-zA-Z0-9_]{2,}$/i},
    password:{type:String,required:true},
    updatatime:{type:Date,defaults:new Date().getTime()}
});

memberSchema.pre('save',function(next){
    this.updatatime=new Date().getTime();
    next();
});

memberSchema.statics={
    fetch:function(cb){
        return this.find({}).sort('updatatime').exec(cb);
    },
    findByAccount:function(account,cb){
        return this.findOne({'account':account}).exec(cb);
    }
};

module.exports=memberSchema;