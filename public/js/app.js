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
    let idSala=document.getElementById('crearId').value;
    console.log("idSala: ", idSala);
    socket.emit('unirseJuego',{idSala: idSala});
    console.log("d");
}

socket.on("nuevoJuego",(data)=>{
    idSala=data.idSala;
    document.getElementById('inicio').style.display='none';
    document.getElementById('zonajuego').style.display='block';
    document.getElementById('espera').innerHTML= `Espera por un jugador.Pasale su codigo ${idSala}`;

});

socket.on("Jugadoresconectados", (data) => {
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('espera').style.display = 'none';
    document.getElementById('juego').style.display = "none";
})

socket.on("j1eleccion",(data)=>{
    if(!jugador1) {
        opcionRival(data);
    }
});

socket.on("j2eleccion",(data)=>{
    if(jugador1) {
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
    document.getElementById('botonrival').style.display = 'block';
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
    document.getElementById('jugador1').appendChild(eleccionBoton);
}



function opcionRival(data) {
    document.getElementById('Estadooponente').innerHTML = "El oponente hizo un movimiento.";
    let botonrival = document.createElement('button');
    botonrival.id = 'botonrival';
    botonrival.classList.add(data.rspopcion.toString().toLowerCase());
    botonrival.style.display = 'none';
    botonrival.innerText = data.rspopcion;
    document.getElementById('jugador2').appendChild(botonrival);
}
