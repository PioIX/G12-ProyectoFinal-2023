//const IP = "ws://10.1.4.200:3000"
var socket = io();

function funcionPrueba() {
    socket.emit('desconectarse', "hola");
}

socket.on('reciboEvento', function(msg) {
    console.log(msg)
  });

socket.on("connect", () => {
    console.log("Conectado");
})


socket.on('opponentMove', function(msg) {
    console.log(msg)
    let index = msg.index;
    let tiles = document.getElementsByClassName("tile");
    userAction(tiles[index], index);
});


