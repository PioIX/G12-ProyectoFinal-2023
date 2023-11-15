
let idSala = null;
let jugador1 = false;
rondas = 0;
victorias = 0;
derrotas = 0;
empates = 0;
rondasTotales = 0;


function reiniciarJuego() {
    socket.emit('reiniciar', {idSala: idSala})
}

function volverAJugar() {
    document.getElementById('jugador1eleccion').innerHTML = '';
    document.getElementById('jugador2eleccion').innerHTML = '';
    document.getElementById('opponentState').innerHTML = 'Esperando al oponente';
    document.getElementById('botonrivalcito').style.display = 'none';
    document.getElementById('areaGanadora').innerHTML = '';
    document.getElementById('juego').style.display = 'flex';
}



function crearJuego() {
    jugador1 = true;
    socket.emit('crearJuego');
}

function unirseJuego() {
    idSala = document.getElementById('idSala').value;
    socket.emit('unirseJuego', { idSala: idSala });
}

window.addEventListener("keydown", (enterTecla) => {

    if (enterTecla.key === "Enter") {
        unirseJuego()
    }
})



socket.on("nuevoJuego", (data) => {
    idSala = data.idSala;
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('zonaJuego').style.display = 'block';
    let copyButton = document.createElement('button');
    copyButton.style.display = 'block';
    copyButton.classList.add('btn', 'btn-primary', 'py-2', 'my-2')
    copyButton.innerText = 'Copia el codigo';
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(idSala).then(function () {
            console.log('Async: Copying to clipboard was successful!');
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    });
    document.getElementById('waitingArea').innerHTML = `Comparti el siguiente codigo: "${idSala}" para que tu rival se una.`;
    document.getElementById('waitingArea').appendChild(copyButton);
});

socket.on("jugadorConectado", () => {
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('waitingArea').style.display = 'none';
    document.getElementById('juego').style.display = 'flex';
})

socket.on("reinicio", () => {
    document.getElementById('resultadoGlobal').innerHTML = `Rondas jugadas: ${rondas} | Victorias: ${victorias} | Derrotas: ${derrotas} | Empates: ${empates}`;

    document.getElementById('jugador1eleccion').innerHTML = `<button class="roca" onclick="mandarEleccion('Roca')">
    <img src="/img/Piedra.png" width="90px">
</button>
<button class="papel" onclick="mandarEleccion('Papel')">
    <img src="/img/Papel.png" width="90px">
</button>
<button class="tijera" onclick="mandarEleccion('Tijera')">
    <img src="/img/Tijeras.png" width="90px">`;
    document.getElementById('jugador2eleccion').innerHTML = '<p id="opponentState">Esperando al oponente</p>';

    document.getElementById('opponentState').innerHTML = 'Esperando al oponente';
    document.getElementById('botonrivalcito').style.display = 'none';
    document.getElementById('areaGanadora').innerHTML = '';
    document.getElementById('juego').style.display = 'flex';
}
)

socket.on("j1eleccion", (data) => {
    if (!jugador1) {
        opcionRival(data);
    }
    console.log("facon");
});

socket.on("j2eleccion", (data) => {
    if (jugador1) {
        opcionRival(data);
    }
    console.log("rivas");
});

socket.on("resultado", (data) => {
    let resultadoGlobal = document.getElementById('resultadoGlobal');
    let ganadortexto = '';

    if (data.ganador != 'e') {
        rondas++;
        rondasTotales++; // Incrementa el número de rondas jugadas

        if (data.ganador == 'j1' && jugador1) {
            ganadortexto = 'Ganaste panflin ';
            victorias++;
        } else if (data.ganador == 'j1') {
            ganadortexto = 'Perdiste Papirulo';
            derrotas++;
        } else if (data.ganador == 'j2' && !jugador1) {
            ganadortexto = 'Ganaste panflin';
            victorias++;
        } else if (data.ganador == 'j2') {
            ganadortexto = 'Perdiste Papirulo';
            derrotas++;
        } else {
            ganadortexto = `empataron: A JUGAR OTRA`;
            empates++;
        }
    }
    resultadoGlobal.textContent = `Rondas jugadas: ${rondas} | Victorias: ${victorias} | Derrotas: ${derrotas} | Empates: ${empates}
    `;
    document.getElementById('opponentState').style.display = 'none';
    document.getElementById('botonrivalcito').style.display = 'block';
    document.getElementById('areaGanadora').innerHTML = ganadortexto;
});



function mandarEleccion(rspJugador) {
    const eleccion = jugador1 ? "j1eleccion" : "j2eleccion";
    socket.emit(eleccion, {
        rspJugador: rspJugador,
        idSala: idSala
    });
    let eleccionJugador = rspJugador
    eleccionJugador.toString()
    console.log(rspJugador)
    if (eleccionJugador == "Roca") {
        let botonjugador = document.createElement('button');
        document.getElementById('jugador1eleccion').innerHTML = `<img src="/img/Piedra.png" width="90px">`;
        document.getElementById('jugador1eleccion').appendChild(botonjugador);
    } else if (eleccionJugador == "Tijera") {
        let botonjugador = document.createElement('button');
        document.getElementById('jugador1eleccion').innerHTML = `<img src="/img/Tijeras.png" width="90px">`;
        document.getElementById('jugador1eleccion').appendChild(botonjugador);

    } else if (eleccionJugador == "Papel") {
        let botonjugador = document.createElement('button');
        document.getElementById('jugador1eleccion').innerHTML = `<img src="/img/Papel.png" width="90px">`;
        document.getElementById('jugador1eleccion').appendChild(botonjugador);
    }
}


function opcionRival(data) {
    document.getElementById('opponentState').innerHTML = "El rival ya decidio";
    console.log(data.rspJugador)
    let eleccionJugador1 = data.rspJugador
    eleccionJugador1.toString()
    if (eleccionJugador1 == "Roca") {
        let botonRivalElegido = document.createElement('button');
        botonRivalElegido.id = 'botonrivalcito';
        botonRivalElegido.style.display = "none"
        botonRivalElegido.innerHTML = `<img src="/img/Piedra.png" width="90px">`;
        document.getElementById('jugador2eleccion').appendChild(botonRivalElegido);
    } else if (eleccionJugador1 == "Tijera") {
        let botonRivalElegido = document.createElement('button');
        botonRivalElegido.id = 'botonrivalcito';
        botonRivalElegido.style.display = "none"
        botonRivalElegido.innerHTML = `<img src="/img/Tijeras.png" width="90px">`;
        document.getElementById('jugador2eleccion').appendChild(botonRivalElegido);

    } else if (eleccionJugador1 == "Papel") {
        let botonRivalElegido = document.createElement('button');
        botonRivalElegido.id = 'botonrivalcito';
        botonRivalElegido.style.display = "none"
        botonRivalElegido.innerHTML = `<img src="/img/Papel.png" width="90px">`;
        document.getElementById('jugador2eleccion').appendChild(botonRivalElegido);
    }

}


