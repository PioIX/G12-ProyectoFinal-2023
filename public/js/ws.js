const IP = "ws://localhost:3000"
var socket = io(IP);


function funcionPrueba() {
    socket.emit('desconectarse', "hola");
}

socket.on('reciboEvento', function(msg) {
    console.log(msg)
  });


socket.on('opponentMove', function(msg) {
    console.log(msg)
});


