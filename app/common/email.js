var nodemailer=require('nodemailer');
var _=require('underscore');

var user='*******@qq.com';
var pass='******';

var transporter=nodemailer.createTransport({
    service:'QQ',
    auth:{
        user:user,
        pass:pass
    }
});

var sendMail=function(a){
    var a=a||{};
    var defaults={
        form:'*******@qq.com',
        to:'',
        subject:'',
        text:'',
        html:''
    };
    var opts=_.extend(defaults,a);
    if(!opts.to)return false;
    transporter.sendMail(opts,function(err,info){
        if(err)return console.log(err);
        console.log(info);
    })
}

module.exports=sendMail;