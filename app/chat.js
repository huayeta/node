module.exports = function(server){
    var io=require('socket.io')(server);
    //建立独立通道
    io.of('/chat').on('connection',function(socket){
        socket.on('chat message',function(msg){
            console.log('message:'+msg);
            //单线通道
            socket.emit('new message',msg);
        });
        socket.on('emit message',function(msg){
            //广播向其他用户发消息
            socket.broadcast.emit('new message',msg);
        });
        socket.on('disconnect',function(){
            console.log('user disconnected!');
        });
    })
}