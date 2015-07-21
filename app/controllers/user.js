var util=require('../common/util');

exports.userRequired=function *(next){
    var user=this.session.user;
    console.log(user);
    if(!user)this.redirect('/login?redirectTo='+encodeURIComponent(util.getUrl(this)));
    yield next;
}

exports.adminRequired=function *(next){
    var admin=this.session.admin;
    if(!admin)this.redirect('/admin/login?redirectTo='+encodeURIComponent(util.getUrl(this)));
    yield next;
}