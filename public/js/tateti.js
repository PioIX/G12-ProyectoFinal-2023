let idSalaTate = null;
let jugador1 = false;
let turnos = true;
let client = -1;

const tiles = Array.from(document.querySelectorAll(".tile"));
const playerDisplay = document.querySelector(".display-player");
const resetButton = document.querySelector("#reset");
const announcer = document.querySelector(".announcer");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;

const PLAYERX_WON = "PLAYERX_WON";
const PLAYERO_WON = "PLAYERO_WON";
const TIE = "TIE";

console.log("hola");
/*
        Indexes within the board
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

/*
    socket.on('joinRoom', (room) => {
        roomId = room;
    });
    */

function crearJuegoTate() {
    jugador1 = true;
    socket.emit("crearJuegoTate");
}

function unirseJuegoTate() {
    let idSalaTate = document.getElementById("idSalaTate").value;
    socket.emit("unirseJuegoTate", { idSalaTate: idSalaTate });
}

socket.on("nuevoJuegoTate", (data) => {
    let idSalaTate = data.idSalaTate;
    document.getElementById("inicioTate").style.display = "none";
    document.getElementById("zonaJuegoTate").style.display = "block";
    let copyButton = document.createElement("button");
    copyButton.style.display = "block";
    copyButton.classList.add("btn", "btn-primary", "py-2", "my-2");
    copyButton.innerText = "Copia el codigo";
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(idSalaTate).then(
            function () {
                console.log("Async: Copying to clipboard was successful!");
            },
            function (err) {
                console.error("Async: Could not copy text: ", err);
            }
        );
    });
    document.getElementById(
        "esperaTate"
    ).innerHTML = `Comparti el siguiente codigo: "${idSalaTate}" para que tu rival se una.`;
    document.getElementById("esperaTate").appendChild(copyButton);
});

socket.on("jugadorConectadoTate", () => {
    document.getElementById("inicioTate").style.display = "none";
    document.getElementById("esperaTate").style.display = "none";
    document.getElementById("juegoTate").style.display = "flex";
    console.log(idSalaTate);
});

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];
        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        announce(currentPlayer === "X" ? PLAYERX_WON : PLAYERO_WON);
        isGameActive = false;
        return;
    }

    if (!board.includes("")) announce(TIE);
}

const announce = (type) => {
    switch (type) {
        case PLAYERO_WON:
            announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
            break;
        case PLAYERX_WON:
            announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
            break;
        case TIE:
            announcer.innerText = "Tie";
    }
    announcer.classList.remove("hide");
};

const isValidAction = (tile) => {
    if (tile.innerText === "X" || tile.innerText === "O") {
        return false;
    }

    return true;
};

const updateBoard = (index) => {
    board[index] = currentPlayer;
};

function moveUser(tile, index) {
    console.log("BOTON");
    if (turnos == true) {
        userAction(tile, index);
    }
}

function userAction(tile, index) {
    if (isValidAction(tile) && isGameActive) {
        tile.innerText = currentPlayer;
        tile.classList.add(`player${currentPlayer}`);
        turnos = false;
        updateBoard(index);
        handleResultValidation();
        socket.emit("makeMove", { index: index, idSalaTate: idSalaTate });
        if (currentPlayer === "X") {
            currentPlayer = "O";
        } else {
            currentPlayer = "X";
        }
    }
}

/*resetButton.addEventListener("click", () => {
    resetBoard();

    socket.emit("resetGame");
});*/

const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    announcer.classList.add("hide");

    tiles.forEach((tile) => {
        tile.innerText = "";
        tile.classList.remove("playerX");
        tile.classList.remove("playerO");
    });
};

console.log("TILES", tiles)
tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => moveUser(tile, index));
});

socket.on("connect", () => {
    console.log("Me conecte al socket");
    console.log(turnos);
});

socket.on("opponentMove", (data) => {
    if (data.currentPlayer == client) {
        turnos = true;
    } else {
        turnos = false;
    }

    if (data.roomsTate === idSalaTate) {
        const tile = tiles[data.index];
        if (isValidAction(tile)) {
            tile.innerText = currentPlayer === "X" ? "O" : "X";
            tile.classList.add(`player${currentPlayer === "X" ? "O" : "X"}`);
            updateBoard(data.index);
            handleResultValidation();
        }
    }
});

socket.on("makeMove", (data) => {
    const { index, idSalaTate } = data;

    const game = roomsTate[idSalaTate];
    const { board, currentPlayer } = game;
    if (data.currentPlayer == currentPlayer) {
        turnos = true;
        if (isValidMove(board, index, currentPlayer)) {
            board[index] = currentPlayer;
            const roundGanada = checkWin(board, currentPlayer);

            if (roundGanada) {
                io.to(idSalaTate).emit("gameOver", {
                    result: currentPlayer === "X" ? "PLAYERX_WON" : "PLAYERO_WON",
                });
                game.isGameActive = false;
            } else if (!board.includes("")) {
                io.to(idSalaTate).emit("gameOver", { result: "TIE" });
                game.isGameActive = false;
            } else {
                game.currentPlayer = currentPlayer === "X" ? "O" : "X";
                io.to(idSalaTate).emit("opponentMove", {
                    index,
                    currentPlayer: game.currentPlayer,
                });
            }
        }
    }
});
