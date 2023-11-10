class Pelota {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}


class Player {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.score = 0
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.font = "20px Arial"
        ctx.fillText(this.score, this.x < 400 ? 370 - ((this.score.toString().length - 1) * 12) : 420, 30)

        ctx.fillRect(this.x < 400 ? 790 : 0, 0, 10, 500)
    }
}



let startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', startGame);



let message = document.getElementById('message');


let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');


let jugador1;
let jugador2;
let pelota;

let arrancar = false;
let jugadorN = 0;
let roomID;


function crearJuegoPong() {
    socket.emit('crearJuegoPong');
}

function unirseJuegoPong() {
    idSalaPong = document.getElementById('idSalaPong').value;
    socket.emit('unirseJuegoPong', {idSalaPong: idSalaPong});
    console.log("arranco")
}

socket.on("nuevoJuegoPong", (data) => {
    idSalaPong = data.idSalaPong;
    document.getElementById('inicioPong').style.display = 'none';
    document.getElementById('zonaJuegoPong').style.display = 'block';
    let copyButton = document.createElement('button');
    copyButton.style.display = 'block';
    copyButton.classList.add('btn','btn-primary','py-2', 'my-2')
    copyButton.innerText = 'Copia el codigo';
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(idSalaPong).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    });
    document.getElementById('esperaPong').innerHTML = `Comparti el siguiente codigo: "${idSalaPong}" para que tu rival se una.`;
    document.getElementById('esperaPong').appendChild(copyButton);
});

socket.on("jugadorConectadoPong", () => {
    document.getElementById('inicioPong').style.display = 'none';
    document.getElementById('esperaPong').style.display = 'none';
    document.getElementById('juegoPong').style.display = 'flex';
})


function startGame() {
    startBtn.style.display = 'none';

    if (socket.connected) {
        socket.emit('unirse');
        message.innerText = "Espera al otro jugador"
    }
    else {
        message.innerText = "Refresca la pagina"
    }
}

socket.on("JugadorN", (nuevoJugador) => {
    console.log("tito");
    jugadorN = nuevoJugador;
});

socket.on("inicioJuego", () => {
    arrancar = true;
    message.innerText = "El juego va a arrancar";
});

socket.on("juego", (room) => {
    console.log(room);

    roomID = room.id;
    message.innerText = "";

    jugador1 = new Player(room.players[0].x, room.players[0].y, 20, 60, 'red');
    jugador2 = new Player(room.players[1].x, room.players[1].y, 20, 60, 'blue');

    jugador1.score = room.players[0].score;
    jugador2.score = room.players[1].score;


    pelota = new Pelota(room.pelota.x, room.pelota.y, 10, 'white');

    window.addEventListener('keydown', (e) => {
        if (arrancar) {
            if (e.keyCode === 38) {
                console.log("J1 Arriba")
                socket.emit("movimiento", {
                    roomID: roomID,
                    jugadorN: jugadorN,
                    direction: 'up'
                })
            } else if (e.keyCode === 40) {
                console.log("J2 abajo")
                socket.emit("movimiento", {
                    roomID: roomID,
                    jugadorN: jugadorN,
                    direction: 'down'
                })
            }
        }
    });

    draw();
});

socket.on("cambios", (room) => {
    jugador1.y = room.players[0].y;
    jugador2.y = room.players[1].y;

    jugador1.score = room.players[0].score;
    jugador2.score = room.players[1].score;

    pelota.x = room.pelota.x;
    pelota.y = room.pelota.y;

    draw();
});

socket.on("finJuego", (room) => {
    arrancar = false;
    message.innerText = `${room.winner === jugadorN ? "Ganaste!" : "Perdiste!"}`;

    socket.emit("desconexion", roomID);


    setTimeout(() => {
        ctx.clearRect(0, 0, 800, 500);
        startBtn.style.display = 'block';
    }, 2000);
});



function draw() {
    ctx.clearRect(0, 0, 800, 500);


    jugador1.draw(ctx);
    jugador2.draw(ctx);
    pelota.draw(ctx);

    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.setLineDash([10, 10])
    ctx.moveTo(400, 5);
    ctx.lineTo(400, 495);
    ctx.stroke();
}