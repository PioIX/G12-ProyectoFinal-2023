



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
    document.getElementById('juegoPong').style.display = '';
})


class Ball {
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


let player1;
let player2;
let ball;

let isGameStarted = false;
let playerNo = 0;
let roomID;


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

socket.on("jugador", (newPlayerNo) => {
    console.log(newPlayerNo);
    playerNo = newPlayerNo;
});

socket.on("empezar", () => {
    isGameStarted = true;
    message.innerText = "El juego va a arrancar";
});

socket.on("juego", (room) => {
    console.log(room);

    roomID = room.id;
    message.innerText = "";

    player1 = new Player(room.players[0].x, room.players[0].y, 20, 60, 'red');
    player2 = new Player(room.players[1].x, room.players[1].y, 20, 60, 'blue');

    player1.score = room.players[0].score;
    player2.score = room.players[1].score;


    ball = new Ball(room.ball.x, room.ball.y, 10, 'white');

    window.addEventListener('keydown', (e) => {
        if (isGameStarted) {
            if (e.keyCode === 38) {
                console.log("Jugador 1 arriba")
                socket.emit("movimiento", {
                    roomID: roomID,
                    playerNo: playerNo,
                    direction: 'up'
                })
            } else if (e.keyCode === 40) {
                console.log("Jugador 2 arriba")
                socket.emit("movimiento", {
                    roomID: roomID,
                    playerNo: playerNo,
                    direction: 'down'
                })
            }
        }
    });

    draw();
});

socket.on("actualizarJuego", (room) => {
    player1.y = room.players[0].y;
    player2.y = room.players[1].y;

    player1.score = room.players[0].score;
    player2.score = room.players[1].score;

    ball.x = room.ball.x;
    ball.y = room.ball.y;

    draw();
});

socket.on("terminarJuego", (room) => {
    isGameStarted = false;
    message.innerText = `${room.winner === playerNo ? "Ganaste!" : "Perdiste!"}`;

    socket.emit("afuera", roomID);


    setTimeout(() => {
        ctx.clearRect(0, 0, 800, 500);
        startBtn.style.display = 'block';
    }, 2000);
});



function draw() {
    ctx.clearRect(0, 0, 800, 500);
    player1.draw(ctx);
    player2.draw(ctx);
    ball.draw(ctx);
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.setLineDash([10, 10])
    ctx.moveTo(400, 5);
    ctx.lineTo(400, 495);
    ctx.stroke();
}