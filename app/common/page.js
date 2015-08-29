var _ = require('underscore');
var tools=require('./tools');
var URL=require('url');
var path=require('path');

var findPagination = function (a) {
    var a = a || {};
    var defaults = {
        search: {}, //查询条件
        columns: '', //查询字段
        pageCur: 1, //当前页
        pageLimit: 10, //每页多少钱
        ctx:'',
        model: '' //模型
    };
    var opts = _.extend(defaults, a);
    if(opts.ctx){
        if(opts.ctx.query.page)opts.pageCur=opts.ctx.query.page;
        if(opts.ctx.query.pageLimit)opts.pageLimit=opts.ctx.query.pageLimit;
    }
    return function (cb) {
        if (!opts.model) return cb(true, {});
        var skip = (opts.pageCur - 1) * opts.pageLimit;
        var query = opts.model.find(opts.search).select(opts.columns).limit(opts.pageLimit).skip(skip);
        query.exec(function (error, results) {
            if (error) return cb(true, {});
            opts.model.count(opts.search, function (error, count) {
                if (error) return cb(true, {});
                var info = {page:{}};
                info.page.count=count;
                info.page.pageCount = Math.ceil(count / opts.pageLimit);
                info.page.pageCur = parseInt(opts.pageCur);
                info.page.pageLimit = parseInt(opts.pageLimit);
                info.infos = results;
                
                //计算pages
                info.page.pages='<div class="pages"><ul><li><a>'+info.page.count+'条</a></li>';
                //上一页
                if(info.page.pageCur!=1)info.page.pages+='<li><a href="'+tools.getCurUrl({ctx:opts.ctx,add:{page:info.page.pageCur-1}})+'">上一页</a></li>';
                if(info.page.pageCur<=5){
                    //当小于5页的时候
                    var max=(info.page.pageCount>=5?5:info.page.pageCount);
                    for(var i=1;i<=max;i++){
                        if(info.page.pageCur==i){
                            info.page.pages+='<li class="active"><span>'+i+'</span></li>';
                        }else{
                            info.page.pages+='<li><a href="'+tools.getCurUrl({ctx:opts.ctx,add:{page:i}})+'">'+i+'</a></li>';
                        }
                    }
                }else{
                    //大于5页的时候
                    info.page.pages+='<li><a href="'+tools.getCurUrl({ctx:opts.ctx,add:{page:1}})+'">1</a></li><li><a href="'+tools.getCurUrl({ctx:opts.ctx,add:{page:2}})+'">2</a></li><li><span>...</span></li>';
                    info.page.pages+='<li><a href="'+tools.getCurUrl({ctx:opts.ctx,add:{page:info.page.pageCur-1}})+'">'+(info.page.pageCur-1)+'</a></li>';
                    info.page.pages+='<li class="active"><span>'+info.page.pageCur+'</span></li>';
                    if(info.page.pageCur+1<=info.page.pageCount){
                       info.page.pages+='<li><a href="'+tools.getCurUrl({ctx:opts.ctx,add:{page:info.page.pageCur+1}})+'">'+(info.page.pageCur+1)+'</a></li>'; 
                    }
                }
                //下一页
                if(info.page.pageCur<info.page.pageCount)info.page.pages+='<li><a href="'+tools.getCurUrl({ctx:opts.ctx,add:{page:info.page.pageCur+1}})+'">下一页</a></li>';
                //跳转
                info.page.pages+='<li class="jump">共'+info.page.pageCount+'页 跳至<input type="text" onkeyup="document.getElementById(\'jumppage\').href=\''+tools.getCurUrl({ctx:opts.ctx,add:{page:''}})+'\'+this.value;">页</li><li class="active"><a id="jumppage">跳转</a></li>';
                info.page.pages+='</ul></div>';
                
                cb(null, info);
            });
        });
    }
}

module.exports = findPagination;