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


//Ta-te-ti
const roomsTate = {};



io.on('connection', (socket) => {
  const req = socket.request;
  console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  
    socket.on('crearJuegoTate', () => {
        const idSalaTate = haceridTate(6);
        roomsTate[idSalaTate] = {};
        socket.join(idSalaTate);
        socket.emit("nuevoJuegoTate", {idSalaTate: idSalaTate})
    });
  
    socket.on('unirseJuegoTate', (data) => {
      console.log("fulbo")
        if(roomsTate[data.idSalaTate] != null) {
            socket.join(data.idSalaTate);
            socket.to(data.idSalaTate).emit("jugadorConectadoTate", {});
            socket.emit("jugadorConectadoTate");
        }
    });

    
    socket.on('makeMove', (data) => {
      const { index,roomsTate , client } = data;
    
      console.log("Recibi un movimiento")

      socket.emit('mensaje', { result: 'Llega 1', client: client });
      io.to('idSalaTate').emit('mensaje', { result: 'Llega' });

      const game = roomsTate[idSalaTate]
      const { board, currentPlayer } = game;

      if (isValidMove(board, index, currentPlayer)) {
          board[index] = currentPlayer;
          const roundWon = checkWin(board, currentPlayer);

          if (roundWon) {
              io.to('idSalaTate').emit('gameOver', { result: currentPlayer === 'X' ? 'PLAYERX_WON' : 'PLAYERO_WON' });
              game.isGameActive = false;
          } else if (!board.includes('')) {
              io.to('idSalaTate').emit('gameOver', { result: 'TIE' });
              game.isGameActive = false;
          } else {
              game.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
              io.to('idSalaTate').emit('opponentMove', { index, currentPlayer: game.currentPlayer });
          }
      }
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

return false; 
}

function haceridTate(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



//Piedra,papel,tijera
//Piedra,papel,tijera
//Piedra,papel,tijera
//Piedra,papel,tijera
//Piedra,papel,tijera
//Piedra,papel,tijera
//Piedra,papel,tijera
//Piedra,papel,tijera
//Piedra,papel,tijera
//Piedra,papel,tijera
//Piedra,papel,tijera
//Piedra,papel,tijera




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