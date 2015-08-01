var tools=require('../common/tools');

exports.userRequired=function *(next){
    var user=this.session.user;
//    console.log(user);
    if(!user)return this.redirect('/login?redirectTo='+encodeURIComponent(tools.getUrl(this)));
    yield next;
}

exports.adminRequired=function *(next){
    var admin=this.session.admin;
//    console.log(admin);
    if(!admin)return this.redirect('/admin/login?redirectTo='+encodeURIComponent(tools.getUrl(this)));
    yield next;
}