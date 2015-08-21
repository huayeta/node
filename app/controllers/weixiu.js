

exports.index=function *(next){
    this.body=yield this.render('weixiu_index',{});
}