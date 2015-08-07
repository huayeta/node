var superagent = require('superagent');
var tools=require('../common/tools');

var requestWechat=function(keyword,page){
    return function(cb){
        superagent
            .get('http://apis.baidu.com/antelope/wechat/article')
            .query({keyword:keyword,pageNo:page})
            .set({'apikey':'f7381557bdc7265ff36ce447755e84e3'})
            .end(function(err,content){
                cb(err,content.text)
            })
    }
}

exports.article=function *(next){
    var keyword=this.query.keyword;
    var page=parseInt(this.query.page?this.query.page:'1');
    var infos={'keyword':keyword};
    if(keyword){
        var result=JSON.parse(yield requestWechat(keyword,page));
        if(result.status=='200')infos.infos=result.list;
        
        infos.pages='<div class="pages"><ul>';
        if(page!=1){
            infos.pages+='<li><a href="'+tools.getCurUrl({ctx:this,add:{page:page-1}})+'">上一页</a></li>';
        }
        for(var i=1;i<=10;i++){
            if(i==page){
                infos.pages+='<li class="active"><span>'+page+'</span></li>';
            }else{
                infos.pages+='<li><a href="'+tools.getCurUrl({ctx:this,add:{page:i}})+'">'+i+'</a></li>';
            }
        }
        if(page<10){
            infos.pages+='<li><a href="'+tools.getCurUrl({ctx:this,add:{page:page+1}})+'">下一页</a></li>'
        }
        infos.pages+='</ul></div>';
    }
    this.body=yield this.render('admin/wechat/list',infos);
}