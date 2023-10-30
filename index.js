const express = require("express");
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');


const exphbs = require("express-handlebars");
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
const server = createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const Listen_Port = 3000;
/*
app.listen(Listen_Port, function () {
  console.log(
    "Servidor NodeJS corriendo en http://localhost:" + Listen_Port + "/"
  );
});*/
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
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


<<<<<<< Updated upstream
=======





/*
>>>>>>> Stashed changes
const gameRooms = {};


io.on('connection', (socket) => {
    console.log('Un jugador se ha conectado.');
  
    // Unirse a la sala "faconeta"
    socket.join('faconeta');

    // Verificar si ya hay un jugador en la sala
    const room = io.sockets.adapter.rooms.get('faconeta');
    const numClients = room ? room.size -1: 0;
    console.log(room)
    console.log(numClients)
    
    socket.emit('unirseSala', {sala: 'faconeta', client: numClients})
  
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

<<<<<<< Updated upstream
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

/////PIEDRA PAPEL TIJERA APARTIR DE ACA ABAJO////

io.on('connection1', (socket) => {
  console.log('Un jugador se ha conectado.');

  // Unirse a la sala "faconeta"
  socket.join('rivotril');

  // Verificar si ya hay un jugador en la sala
  const room1 = io.sockets.adapter.rooms['rivotril'];
  const numClients1 = room1 ? room1.length : 0;
  
  socket.emit('unirseSala1', {sala: 'rivotril', client: numClients1})

  if (numClients1 === 2) {
      // La sala ya tiene dos jugadores, no se permite un tercer jugador.
      socket.emit('roomFull', 'La sala está llena. Por favor, intenta más tarde.');
      socket.disconnect();
      return;
  }
});


let rooms1 = {};
socket.on('makeMove', (data) => {
  const roomId1 = data.roomId1;
  const move = data.move;
  const room = rooms1[roomId1];
  console.log("Recibi un movimiento")
      socket.emit('mensaje1', { result: 'Llega 1' });
      io.to('rivotril').emit('mensaje1', { result: 'Llega' });

  io.to(roomId1).emit('gameUpdate', {
      msjBatalla: msjBatalla, 
      imgJugador: imgJugador,
      imgPc: imgPc,
  });
});




=======
*/
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
            socket.to(data.idSala).emit("Jugadores conectados", {});
            socket.emit("Jugadores conectados");
        }
    })

    socket.on("j1eleccion",(data)=>{
        let rspopcion = data.rspopcion;
        rooms[data.idSala].j1eleccion = rspopcion;
        socket.to(data.roomUniqueId).emit("j1eleccion",{rspopcion : data.rspopcion});
        if(rooms[data.idSala]. j2eleccion!= null) {
            declararGanador(data.idSala);
        }
    });

    socket.on("j2eleccion",(data)=>{
      let rspopcion = data.rspopcion;
      rooms[data.idSala].j2eleccion = rspopcion;
      socket.to(data.roomUniqueId).emit("j2eleccion",{rspopcion : data.rspopcion});
      if(rooms[data.idSala]. j1eleccion!= null) {
          declararGanador(data.idSala);
      }
  });
});

function declararGanador(idSala) {
    let j1eleccion = rooms[idSala].j1eleccion;
    let j2eleccion = rooms[idSala].j2eleccion;
    let ganador = null;
    if (j1eleccion === j2eleccion) {
        ganador = "empate ";
    } else if (j1eleccion == "papel") {
        if (j2eleccion == "tijera") {
            ganador = "j2";
        } else {
            ganador = "j1";
        }
    } else if (j1eleccion == "roca") {
        if (j2eleccion == "papel") {
            ganador = "j2";
        } else {
            ganador = "j1";
        }
    } else if (j1eleccion == "tijera") {
        if (j2eleccion == "roca") {
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
>>>>>>> Stashed changes
