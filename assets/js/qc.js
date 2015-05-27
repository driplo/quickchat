var socket = io();
$('.msg-feed').scrollTop(1E10);
$('#minput').focus();

$('.send').on('click', function(){
    $('#form-msg').submit();
});

$('#form-msg').submit(function(){
    socket.emit('chat message', $('#minput').val());
    $('#minput').val('');
    return false;
});


function ReplaceWithObject(textSource, textToReplace, objectToReplace) {
    return textSource.replace(textToReplace, objectToReplace.outerHTML());
}
/*
$('#minput').on('input', function() { 
value = $(this).val();
if (value != ''){
    socket.emit('typing');   
}
});*/


// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
    // call the server-side function 'adduser' and send one parameter (value of prompt)
    socket.emit('adduser', prompt("What's your name?"));
    socket.on('getHistory', function(messageHistory){
    $('.msg-feed').empty();
    for (i=0; i<messageHistory.length; i++){
        $('.msg-feed').append('<li>' + messageHistory[i] + '</li>');
    }
});
});


socket.on('chat message', function(username,time,msg){
    $('.msg-feed').append('<div class="msg"><span class="username">'+username+'</span><span class="time">'+time+'</span><p class="message">'+msg+'</p></div>');
    $('.message').html(function (index, text) {
    this.innerHTML = text.replace("Kappa", "<img class='emote' src='/emotes/kappa.png'>");
    });
      $('.msg-feed').scrollTop(1E10);
});

socket.on('chat service', function(msg){
$('.msg-feed').append($('<li class="service">').text(msg));
});

// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(data) {
    $('.user-list ul').empty();
    $.each(data, function(key, value) {
        $('.user-list ul').append('<li>' + key + '</li>');
        if (key == 'batman'){
            alert('ur parents ded batmon');
        }
    });
    var nbuser = $('.user-list ul li').length;
    $('#nb-users').text(nbuser);
});