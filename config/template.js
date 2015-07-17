var template=require('art-template');
var path=require('path');

//模板的配置
template.config('base',path.resolve(__dirname,'../app/views/'));
template.config('extname','.htm');
template.config('cache',false);//关闭缓存

module.exports=template;