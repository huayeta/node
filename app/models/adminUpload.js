var mongoose=require('mongoose');
var adminUploadSchema=require('../schemas/adminUpload');

var adminUpload=mongoose.model('admin_upload',adminUploadSchema);

module.exports=adminUpload;