const IP = "ws://localhost:3000"
var socket = io(IP);

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
    document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
    envie=-1
});