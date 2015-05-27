var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(1337, function(){
    console.log('listening on *:1337');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/assets'));

// usernames which are currently connected to the chat
var usernames = {};
var messageHistory = ['lol','mdr'];
var messI = messageHistory.length;
console.log('Message history: '+messageHistory);

io.on('connection', function(socket){
    //show the last 10 messages
    // 
    console.log(getTime());
    socket.emit('getHistory', messageHistory);
    
    socket.on('chat message', function(msg){
        time = getTime();
        //io.emit('chat message', '['+socket.username+']'+time+' '+msg);
        io.emit('chat message', socket.username, time, msg);
        messageHistory[messI++] = '['+socket.username+']'+time+' '+msg;
        console.log(messageHistory);
    });
    
    
    socket.on('getHistory', function(messageHistory){
         socket.emit('getHistory', messageHistory);
    });
    
    socket.on('chat service', function(msg){
        io.emit('chat service', msg);
    });
    
    
    socket.on('typing' , function()
    {
        io.emit('chat service', 'USER TYPING');
    });
    
    
    socket.on('adduser', function(username){
        time = getTime();
        socket.username = username;
        usernames[username] = username;
		io.emit('chat service', username+" connected "+time);
        messageHistory[messI++] = username+" connected "+time;
        socket.on('disconnect', function() {
              time = getTime();
              io.emit('chat service', username+" disconnected "+time);
              messageHistory[messI++] = username+" disconnected "+time;
                // remove the username from global usernames list
            delete usernames[socket.username];
            // update list of users in chat, client-side
            io.sockets.emit('updateusers', usernames);
            });
        
        // update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});
    
});

function getTime(){
    d = new Date();
    hour = d.getHours().toString();
    min = d.getMinutes().toString();
    if (min.length == 1){
     min = '0'+min;   
    }
    sec = d.getSeconds().toString();
    if (sec.length == 1){
     sec = '0'+sec;   
    }
    return time = hour+':'+min+':'+sec;
}