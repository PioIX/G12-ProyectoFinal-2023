//const socket = io();
let idSala=null;
let jugador1=false;

function crearJuego() {
    console.log("hola")
    jugador1=true;
    socket.emit('crearJuego');
}

function unirseJuego() {
    console.log("hola")
    
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
    document.getElementById('jugador1').innerHTML = "";
    document.getElementById('jugador2').appendChild(eleccionBoton);
}