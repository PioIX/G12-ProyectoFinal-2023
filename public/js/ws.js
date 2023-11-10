/*const IP = "ws://localhost:3000"
var socket = io(IP);*/
var socket = io();

function funcionPrueba() {
    socket.emit('desconectarse', "hola");
}

socket.on('reciboEvento', function(msg) {
    console.log(msg)
  });


socket.on('opponentMove', function(msg) {
    console.log(msg)
    let index = msg.index;
    let tiles = document.getElementsByClassName("tile");
    userAction(tiles[index], index);
});

let envie = -1

function mandarMensaje(mensaje) {
    mensaje = document.getElementById("mensaje").value
    if (envie == -1) {
    socket.emit("incoming-message", { data: mensaje });
    console.log("envie", mensaje);
    document.getElementById("chat").innerHTML += `
    <div class="chat2">
      <p class="chatderecha"> ${mensaje}</p>
    </div>
    `    
    envie = 1
    }};
    
socket.on("server-message", data => { 
    console.log("tengo que mandar", data);
    if (envie == -1) {
        document.getElementById("chat").innerHTML += `
            <div class="chat1">
              <p class="chatizquierda">${data.mensaje}</p>
          </div>
          `
          envie = 1
    }
    envie=-1
});