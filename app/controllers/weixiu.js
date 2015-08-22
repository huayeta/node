
exports.index=function *(next){
    this.body=yield this.render('weixiu_index',{});
}

exports.support=function *(next){
    this.body=yield this.render('weixiu_support',{});
}

exports.show=function *(next){
    this.body=yield this.render('weixiu_show',{});
}