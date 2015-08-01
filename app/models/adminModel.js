var mongoose=require('mongoose');
var adminModelSchema=require('../schemas/adminModel');

var adminModel=mongoose.model('admin_model',adminModelSchema);

module.exports=adminModel;