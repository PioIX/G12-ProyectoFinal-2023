const express = require("express");

const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const MySQL = require("./modulos/mysql");
const session = require("express-session");

const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
} = require("firebase/auth");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const Listen_Port = 3000;

const server = app.listen(Listen_Port, function () {
  console.log(
    "Servidor NodeJS corriendo en http://localhost:" + Listen_Port + "/"
  );
});

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCjyPLxQsL_pHPEjTdQg_LN6mjSUPrpYj4",
  authDomain: "proyectofiglioneta.firebaseapp.com",
  projectId: "proyectofiglioneta",
  storageBucket: "proyectofiglioneta.appspot.com",
  messagingSenderId: "635117257804",
  appId: "1:635117257804:web:119e9e09407b6fcc5820e9"
};
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);

// Importar AuthService
const authService = require("./authService");

const io = require("socket.io")(server);

const sessionMiddleware = session({
  secret: "gasjlkgjkslagjkla",
  resave: false,
  saveUninitialized: false,
})

app.use(sessionMiddleware);

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    await authService.registerUser(auth, { email, password });
    res.render("register", {
      message: "Registro exitoso. Puedes iniciar sesión ahora.",
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.render("register", {
      message: "Error en el registro: " + error.message,
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await authService.loginUser(auth, {
      email,
      password,
    });
    // Aquí puedes redirigir al usuario a la página que desees después del inicio de sesión exitoso
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.render("login", {
      message: "Error en el inicio de sesión: " + error.message,
    });
  }
});

app.get("/dashboard", (req, res) => {
  // Agrega aquí la lógica para mostrar la página del dashboard
  res.render("dashboard");
});

/************************************** */
app.get("/register", (req, res) => {
  // Agrega aquí la lógica para mostrar la página del dashboard
  res.render("register");
});

app.get("/papelito", (req, res) => {
  res.render("papelito");
});

app.get("/tateti", (req, res) => {
  res.render("tateti");
});

app.get("/pong", (req, res) => {
  res.render("pong");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/home", (req, res) => {
  res.render("home");
});


/*
//Ta-te-ti
const gameRooms = {};

io.on('connection', (socket) => {
  const req = socket.request;
  console.log('Un jugador se ha conectado.');

  // Unirse a la sala "faconeta"
  socket.join('faconeta');

  // Verificar si ya hay un jugador en la sala
  const room = io.sockets.adapter.rooms.get('faconeta');
  const numClients = room ? room.size -1: 0;
  console.log(room)
  console.log(numClients)

  if (req.session.client == -1) {
    req.session.client = numClients
    req.session.save() 
  }
  
  socket.emit('unirseSala', {sala: 'faconeta', client: req.session.client})

  if (numClients === 2) {
      // La sala ya tiene dos jugadores, no se permite un tercer jugador.
      socket.emit('roomFull', 'La sala está llena. Por favor, intenta más tarde.');
      socket.disconnect();
      return;
  }

  // Crear un nuevo juego para la sala "faconeta"
  gameRooms['faconeta'] = {
      board: ['', '', '', '', '', '', '', '', ''],
      currentPlayer: 'X',
      isGameActive: true,
  };

  // Emitir un evento personalizado para unirse a la sala
  socket.emit('joinRoom', 'faconeta');// join room es de otra forma: socket.join(room)

  socket.on('makeMove', (data) => {
      const { index, roomId, client } = data;
    
      console.log("Recibi un movimiento")

      socket.emit('mensaje', { result: 'Llega 1', client: client });
      io.to('faconeta').emit('mensaje', { result: 'Llega' });

      const game = gameRooms['faconeta'];
      const { board, currentPlayer } = game;

      if (isValidMove(board, index, currentPlayer)) {
          board[index] = currentPlayer;
          const roundWon = checkWin(board, currentPlayer);

          if (roundWon) {
              io.to('faconeta').emit('gameOver', { result: currentPlayer === 'X' ? 'PLAYERX_WON' : 'PLAYERO_WON' });
              game.isGameActive = false;
          } else if (!board.includes('')) {
              io.to('faconeta').emit('gameOver', { result: 'TIE' });
              game.isGameActive = false;
          } else {
              game.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
              io.to('faconeta').emit('opponentMove', { index, currentPlayer: game.currentPlayer });
          }
      }
  });

  socket.on('resetGame', () => {
      gameRooms['faconeta'] = {
          board: ['', '', '', '', '', '', '', '', ''],
          currentPlayer: 'X',
          isGameActive: true,
      };

      io.to('faconeta').emit('resetGame');
  });
});

function isValidMove(board, index, currentPlayer) {
  return board[index] === '' && (currentPlayer === 'X' || currentPlayer === 'O');
}

function checkWin(board, currentPlayer) {
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === currentPlayer && board[b] === currentPlayer && board[c] === currentPlayer) {
        return true; 
    }
}

return false; // No hay un ganador
}


//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera
//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera//Piedra,papel,tijera





const path = require('path');
const rooms = {};

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
      console.log('user disconnected');
  });

  socket.on('crearJuego', () => {
      const idSala = hacerid(6);
      rooms[idSala] = {};
      socket.join(idSala);
      socket.emit("nuevoJuego", {idSala: idSala})
  });

  socket.on('unirseJuego', (data) => {
      if(rooms[data.idSala] != null) {
          socket.join(data.idSala);
          socket.to(data.idSala).emit("jugadorConectado", {});
          socket.emit("jugadorConectado");
      }
  })

  socket.on("j1eleccion",(data)=>{
      let rspJugador = data.rspJugador;
      rooms[data.idSala].j1eleccion = rspJugador;
      socket.to(data.idSala).emit("j1eleccion",{rspJugador : data.rspJugador});
      if(rooms[data.idSala].j2eleccion != null) {
          declararGanador(data.idSala);
      }
  });

  socket.on("j2eleccion",(data)=>{
      let rspJugador = data.rspJugador;
      rooms[data.idSala].j2eleccion = rspJugador;
      socket.to(data.idSala).emit("j2eleccion",{rspJugador : data.rspJugador});
      if(rooms[data.idSala].j1eleccion != null) {
          declararGanador(data.idSala);
      }
  });
});

function declararGanador(idSala) {
  let j1eleccion = rooms[idSala].j1eleccion;
  let j2eleccion = rooms[idSala].j2eleccion;
  let ganador = null;
  if (j1eleccion === j2eleccion) {
      ganador = "e";
  } else if (j1eleccion == "Papel") {
      if (j2eleccion == "Tijera") {
          ganador = "j2";
      } else {
          ganador = "j1";
      }
  } else if (j1eleccion == "Roca") {
      if (j2eleccion == "Papel") {
          ganador = "j2";
      } else {
          ganador = "j1";
      }
  } else if (j1eleccion == "Tijera") {
      if (j2eleccion == "Roca") {
          ganador = "j2";
      } else {
          ganador = "j1";
      }
  }
  io.sockets.to(idSala).emit("resultado", {
      ganador: ganador
  });
  rooms[idSala].j1eleccion = null;
  rooms[idSala].j2eleccion = null;
}

function hacerid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG
//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG
//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG
//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG
//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG
//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG
//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG
//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG
//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG
//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG//PONG

/*
const roomsPong = {};

io.on('connection', (socket) => {
  console.log('Cliente conectado: ' + socket.id);

  socket.on('crearJuegoPong', () => {
      const idSalaPong = haceridPong(6);
      socket.join(idSalaPong);
      socket.emit('nuevoJuegoPong', { idSalaPong });
  });

  socket.on('unirseJuegoPong', (data) => {
      const idSalaPong = data.idSalaPong;
      socket.join(idSalaPong);
      socket.to(idSalaPong).emit('jugadorConectadoPong', { player: 2 });
      socket.emit('jugadorConectadoPong', { player: 1 });
  });
  
  socket.on('move', (data) => {
    const idSalaPong = data.idSalaPong;
    const direction = data.direction;

    const playerIndex = rooms[idSalaPong].players.findIndex(player => player.id === socket.id);
    if (playerIndex !== -1) {
        rooms[idSalaPong].players[playerIndex].move = direction;
    }

    io.to(idSalaPong).emit('move', { id: socket.id, direction: direction });
});
});





function haceridPong(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


*/

let rooms = [];


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('crearJuegoPong', () => {
        const idSalaPong = haceridPong(6);
        rooms[idSalaPong] = {};
        socket.join(idSalaPong);
        socket.emit("nuevoJuegoPong", {idSalaPong: idSalaPong})
    });
  
    socket.on('unirseJuegoPong', (data) => {
        if(rooms[data.idSalaPong] != null) {
            socket.join(data.idSalaPong);
            socket.to(data.idSalaPong).emit("jugadorConectadoPong", {});
            socket.emit("jugadorConectadoPong");
        }
    })

    
    socket.on("unirse", () => {
        console.log(rooms);

        // get room 
        let room;
        if (rooms.length > 0 && rooms[rooms.length - 1].players.length === 1) {
            room = rooms[rooms.length - 1];
        }

        if (room) {
            socket.join(room.id);
            socket.emit('playerNo', 2);

            // add player to room
            room.players.push({
                socketID: socket.id,
                playerNo: 2,
                score: 0,
                x: 690,
                y: 200,
            });

            // send message to room
            io.to(room.id).emit('startingGame');

            setTimeout(() => {
                io.to(room.id).emit('startedGame', room);

                // start game
                startGame(room);
            }, 3000);
        }
        else {
            room = {
                id: rooms.length + 1,
                players: [{
                    socketID: socket.id,
                    playerNo: 1,
                    score: 0,
                    x: 90,
                    y: 200,
                }],
                ball: {
                    x: 395,
                    y: 245,
                    dx: Math.random() < 0.5 ? 1 : -1,
                    dy: 0,
                },
                winner: 0,
            }
            rooms.push(room);
            socket.join(room.id);
            socket.emit('playerNo', 1);
        }
    });

    socket.on("move", (data) => {
        let room = rooms.find(room => room.id === data.roomID);

        if (room) {
            if (data.direction === 'up') {
                room.players[data.playerNo - 1].y -= 10;

                if (room.players[data.playerNo - 1].y < 0) {
                    room.players[data.playerNo - 1].y = 0;
                }
            }
            else if (data.direction === 'down') {
                room.players[data.playerNo - 1].y += 10;

                if (room.players[data.playerNo - 1].y > 440) {
                    room.players[data.playerNo - 1].y = 440;
                }
            }
        }

        // update rooms
        rooms = rooms.map(r => {
            if (r.id === room.id) {
                return room;
            }
            else {
                return r;
            }
        });

        io.to(room.id).emit('updateGame', room);
    });

    socket.on("leave", (roomID) => {
        socket.leave(roomID);
    });



    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

function startGame(room) {
    let interval = setInterval(() => {
        room.ball.x += room.ball.dx * 5;
        room.ball.y += room.ball.dy * 5;

        // check if ball hits player 1
        if (room.ball.x < 110 && room.ball.y > room.players[0].y && room.ball.y < room.players[0].y + 60) {
            room.ball.dx = 1;

            // change ball direction
            if (room.ball.y < room.players[0].y + 30) {
                room.ball.dy = -1;
            }
            else if (room.ball.y > room.players[0].y + 30) {
                room.ball.dy = 1;
            }
            else {
                room.ball.dy = 0;
            }
        }

        // check if ball hits player 2
        if (room.ball.x > 690 && room.ball.y > room.players[1].y && room.ball.y < room.players[1].y + 60) {
            room.ball.dx = -1;

            // change ball direction
            if (room.ball.y < room.players[1].y + 30) {
                room.ball.dy = -1;
            }
            else if (room.ball.y > room.players[1].y + 30) {
                room.ball.dy = 1;
            }
            else {
                room.ball.dy = 0;
            }
        }

        // up and down walls
        if (room.ball.y < 5 || room.ball.y > 490) {
            room.ball.dy *= -1;
        }


        // left and right walls
        if (room.ball.x < 5) {
            room.players[1].score += 1;
            room.ball.x = 395;
            room.ball.y = 245;
            room.ball.dx = 1;
            room.ball.dy = 0;
        }

        if (room.ball.x > 795) {
            room.players[0].score += 1;
            room.ball.x = 395;
            room.ball.y = 245;
            room.ball.dx = -1;
            room.ball.dy = 0;
        }


        if (room.players[0].score === 10) {
            room.winner = 1;
            rooms = rooms.filter(r => r.id !== room.id);
            io.to(room.id).emit('endGame', room);
            clearInterval(interval);
        }

        if (room.players[1].score === 10) {
            room.winner = 2;
            rooms = rooms.filter(r => r.id !== room.id);
            io.to(room.id).emit('endGame', room);
            clearInterval(interval);
        }

        io.to(room.id).emit('updateGame', room);
    }, 1000 / 60);
}


function haceridPong(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


































