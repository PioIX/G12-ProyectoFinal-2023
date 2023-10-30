
const socket = io();
let idSala=null;
let jugador1=false;

function crearJuego() {
    jugador1=true;
    socket.emit('crearJuego');
}

function unirseJuego() {
    idSala=document.getElementById("crearId").value;
    socket.emit('unirseJuego',{idSala: idSala});
}

socket.on("nuevoJuego",(data)=>{
    idSala=data.idSala;
    document.getElementById('inicio').style.display='none';
    document.getElementById('juego').style.display='block';
    document.getElementById('espera').innerHTML= "Espera por un jugador.Pasale su codigo ",{idSala};

});

socket.on("Jugadores conectados"), () => {
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('juego').style.display = 'none';
    document.getElementById('espera').style.display = 'flex';
}

socket.on("j1eleccion",(data)=>{
    if(!jugador1) {
        opcionRival(data);
    }
});

socket.on("j2eleccion",(data)=>{
    if(!jugador1) {
        opcionRival(data);
    }
});

socket.on("resultado",(data)=>{
    let ganadortexto = '';
    if(data.ganador != 'empate') {
        if(data.ganador == 'j1' && jugador1) {
            ganadortexto = 'Ganaste panflin';
        } else if(data.ganador == 'j1') {
            ganadortexto = 'Perdiste panflin';
        } else if(data.ganador == 'j2' && !jugador1) {
            ganadortexto = 'Ganaste panflin';
        } else if(data.ganador == 'j2') {
            ganadortexto = 'Perdiste panflin';
        }
    } else {
        ganadortexto = `It's a draw`;
    }
    document.getElementById('Estadooponente').style.display = 'none';
    document.getElementById('rivalboton').style.display = 'block';
    document.getElementById('Ganador').innerHTML = ganadortexto;
});



function opcion (rspopcion){
    const eleccion= jugador1 ? "j1eleccion" : "j2eleccion";
    socket.emit(eleccion,{
        rspopcion: rspopcion,
        idSala: idSala
    });
    let eleccionBoton = document.createElement('button');
    eleccionBoton.style.display = 'block';
    eleccionBoton.classList.add(rspopcion.toString().toLowerCase());
    eleccionBoton.innerText = rspopcion;
    ocument.getElementById('jugador1').innerHTML = "";
    document.getElementById('jugador2').appendChild(eleccionBoton);
}

<<<<<<< Updated upstream

function nAleatorio(){
    let n = Math.floor(Math.random() * 3);
    return n;
}


function addImagenes(){
    for(let i=0;i<imagenes.length;i++){
        if(opcionJugador == imagenes[i].name){
            imgJugador = imagenes[i].url;
            var inserta = `<img class="img-batalla" src=${imgJugador} alt="">`;
            imgAtaqueJugador.innerHTML = inserta;
        };
        
        if(opcionPc == imagenes[i].name){
            imgPc = imagenes[i].url;
            var inserta = `<img class="img-batalla" src=${imgPc} alt="">`;
            imgAtaquePc.innerHTML = inserta;
        };
        
    };


    seccionBatalla.style.display = 'flex';
    
};


window.addEventListener('load', iniciar);

socket.on('roomJoined', (roomId1) => {
});

btnPiedra.addEventListener('click', () => {
    makeMove('Piedra');
});

function makeMove(move) {
    const roomId1 = 'rivotril';
    socket.emit('makeMove1', { roomId1, move });
}

socket.on('gameUpdate', (data) => {
    msjBatalla.innerHTML = data.msjBatalla;
});

socket.on('mensaje1', (data) => {
    if (data.client!=client) {
    }
    console.log("Mensaje: ", data)
});

window.addEventListener('load', iniciar);
=======
function opcionRival(data){
    document.getElementById('Estadooponente').innerHTML = "Opponent made a choice";
    let rivalboton = document.createElement('button');
    rivalboton.id='rivalboton'
    rivalboton.classList.add(data.rspopcion.toString().toLowerCase());
    rivalboton.style.display = 'none';
    rivalboton.innerText = data.rspopcion;
    document.getElementById('jugador2').appendChild(rivalboton);
}   
>>>>>>> Stashed changes
