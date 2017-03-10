var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));
var nicknames = [];
var chathistory = [];
// listen to 'chat' messages
io.on('connection', function(socket){
    console.log('A user connected');
	socket.on('new user', function(data){
		var temp1 = Math.random().toString(36).substr(2, 9);
		socket.emit('clientConnected',{userInfo: 'You are ' + temp1});
		socket.emit('loadhistory', chathistory);
		socket.nickname = temp1;
		nicknames.push(temp1);
		io.sockets.emit('usersonline', nicknames);
	});
	
	socket.on('chat', function(msg){
		var hours = new Date();
		var mins = new Date();
		if (msg.startsWith('/nickcolor')) {
			socket.color = msg.slice(11);
		}else if (msg.startsWith('/nick')) {
				if(nicknames.indexOf(msg.slice(6)) !=-1) {
					socket.emit('userError', {error: 'Username already in use.'});
				}else{
					var temp2 = nicknames.indexOf(socket.nickname);
					socket.nickname = msg.slice(6);
					nicknames[temp2] = socket.nickname;
					socket.emit('identityChange', {userInfo: 'You are ' + socket.nickname});
					io.sockets.emit('usersonline', nicknames);
				}
		}else{
			var chatm = hours.getHours() + ':' +mins.getMinutes() + ' ' + socket.nickname + ': ' + msg;
			chatm = chatm.toString();
			chathistory.push(chatm);
			io.sockets.emit('chat', {color: socket.color, message: msg, nick: socket.nickname, timestamp: hours.getHours() + ':' + mins.getMinutes()});
		}
	});	
	
    socket.on('disconnect', function (){
        console.log('A user disconnected');
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		io.sockets.emit('usersonline', nicknames);
    });
});
