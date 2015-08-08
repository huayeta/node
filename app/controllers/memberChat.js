exports.chat=function *(next){
    this.body=yield this.render('member/chat/index',{});
}