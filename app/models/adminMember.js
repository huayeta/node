var mongoose=require('mongoose');
var adminMemberSchema=require('../schemas/adminMember');

var adminMember=mongoose.model('admin_member',adminMemberSchema);

module.exports=adminMember;