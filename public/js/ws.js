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

/*
socket.on('makeMove', (index) => {
    // Emitir el movimiento al oponente
    socket.broadcast.emit('opponentMove', index);
});

  socket.on('resetGame', () => {
    // Reinicia el juego y notifica a todos los jugadores.
  });

  socket.on('desconectarse', (data) => {
    console.log('Un jugador se ha desconectado: ', data);
    //la desconexion .
    socket.emit("reciboEvento", "Buenas")
  });
*/