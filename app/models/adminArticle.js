var mongoose=require('mongoose');
var adminArticleSchema=require('../schemas/adminArticle');

var adminArticle=mongoose.model('admin_article',adminArticleSchema);

module.exports=adminArticle;