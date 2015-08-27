var mongoose=require('mongoose');
var tools=require('../common/tools');
var Schema=mongoose.Schema;

var memberTeam=new Schema({
    name:{type:String,require:true},
    description:{type:String},
    owner:{type:Schema.Types.ObjectId,ref:'member',require:true},
    members:[{type:Schema.Types.ObjectId,ref:'member'}],
    time:{
        create:{type:Date,defaults:new Date().getTime()},
        update:{type:Date,defaults:new Date().getTime()}
    }
});

memberTeam.pre('save',function(next){
    if(this.isNew){
        this.time.update=this.time.create=new Date().getTime();
    }else{
        this.time.update=new Date().getTime();
    }
    
    next();
});

//实例方法
memberTeam.methods={
    
};
//静态方法
memberTeam.statics={
    fetch:function(ctx,cb){//查询所有内容
        return this.find({'members':ctx.session.user._id}).sort('updatatime').exec(cb);
    },
    findByName:function(ctx,name,cb){
        return this.findOne({owner:ctx.session.user._id,name:name}).exec(cb);
    }
};

module.exports=memberTeam;