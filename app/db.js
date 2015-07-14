var mongoose=require('mongoose');

var dbFn=function(open,error){
    var url='127.0.0.1';
    var database='huayeta';
    var db=mongoose.createConnection(url,database);
    db.once('open',function(){
        if(open && typeof open == 'function')return open(mongoose,db);
    });
    db.on('error',function(){
        if(error && typeof error=='function')return error(mongoose,db);
    });
}

module.exports=dbFn;