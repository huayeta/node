var mongoose=require('mongoose');
var memberSchema=require('../schemas/member');

var member=mongoose.model('member',memberSchema);

module.exports=member;