var mongoose=require('mongoose');
var tools=require('../common/tools');
var Schema=mongoose.Schema;

var memberChatTopicSchema=new Schema({
    name:{type:String,require:true,unique:true},
    description:{type:String},
    onlines:[{type:Schema.Types.ObjectId,ref:'member'}],
    time:{
        create:{type:Date,defaults:new Date().getTime()},
        update:{type:Date,defaults:new Date().getTime()}
    }
});

memberChatTopicSchema.pre('save',function(next){
    if(this.isNew){
        this.time.update=this.time.create=new Date().getTime();
    }else{
        this.time.update=new Date().getTime();
    }
    
    next();
});

//实例方法
memberChatTopicSchema.methods={
    
};
//静态方法
memberChatTopicSchema.statics={
    fetch:function(cb){//查询所有内容
        return this.find({}).sort('updatatime').exec(cb);
    }
};

module.exports=memberChatTopicSchema;