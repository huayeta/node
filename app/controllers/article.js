var template=require('../../config/template');

exports.index=function *(next){
    var DATA={title:'首页标题'};
    this.body=template('index',DATA);
}