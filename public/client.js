// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
	var $messages = $('#messages');
	var $messageBox = $('#m');
	var $messageForm = $('form');
	var $users = $('#users');
	var $changeUserForm = $('#changeUserForm');
	var $changeUserBox = $('#c');
	var $identity = $('#identity');

	socket.emit('new user', 'New client has connected');
	socket.on('clientConnected', function(data) {
		$identity.html(data.userInfo);
		$messages.append($('<li>').text(data.userInfo));
	});
	
	socket.on('loadhistory', function(data) {
		var chathistory = '';
		for(x = 0; x < data.length; x++) {
			$messages.append($('<li>').text(data[x]));
		}
	});
	
	socket.on('usersonline', function(data) {
		var html ='';
		for(x = 0; x < data.length; x++) {
			html = html + data[x] + "<br/>";
		}
		$users.html(html);
	});
	
    $messageForm.submit(function(e){
		e.preventDefault();
		socket.emit('chat', $messageBox.val());
		$messageBox.val('');
    });
	
	socket.on('userError', function(msg){
		$messages.append($('<li>').text(msg.error));
	});
	
	socket.on('identityChange', function(data) {
			$identity.html(data.userInfo);
	});
	
    socket.on('chat', function(msg){
		$messages.append($('<li>').html(msg.timestamp + ' ' + '<span style="color:' + msg.color + '"' + '>' + msg.nick + '</span>' + ': ' + msg.message));
	});
});
