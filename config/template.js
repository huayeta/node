var template=require('art-template');
var path=require('path');

//模板的配置
template.config('base',path.resolve(__dirname,'../app/views/'));
template.config('extname','.htm');//后缀
template.config('cache',false);//关闭缓存
template.config('openTag','{%');
template.config('closeTag','%}');
template.config('compress',false);//是否压缩
template.config('escape',false);//html编码输出

module.exports=template;