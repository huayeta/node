var mongoose=require('mongoose');
var tools=require('../common/tools');
var Schema=mongoose.Schema;

var memberTopicSchema=new Schema({
    name:{type:String,require:true},
    description:{type:String},
    isdel:{type:Boolean,defaults:true},
    owner:{type:Schema.Types.ObjectId,ref:'member'},
    team:{type:Schema.Types.ObjectId,ref:'member_team'},
    members:[{type:Schema.Types.ObjectId,ref:'member'}],
    time:{
        create:{type:Date,defaults:new Date().getTime()},
        update:{type:Date,defaults:new Date().getTime()}
    }
});

memberTopicSchema.pre('save',function(next){
    if(this.isNew){
        this.time.update=this.time.create=new Date().getTime();
    }else{
        this.time.update=new Date().getTime();
    }
    if(this.isdel==undefined)this.isdel=true;
    next();
});

//实例方法
memberTopicSchema.methods={
    
};
//静态方法
memberTopicSchema.statics={
    fetch:function(cb){//查询所有内容
        return this.find({}).sort('updatatime').exec(cb);
    },
    findByName:function(name,cb){
        return this.findOne({name:name}).exec(cb);
    }
};

module.exports=memberTopicSchema;