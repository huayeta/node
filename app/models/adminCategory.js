var mongoose=require('mongoose');
var adminCategorySchema=require('../schemas/adminCategory');

var adminCategory=mongoose.model('admin_category',adminCategorySchema);

module.exports=adminCategory;