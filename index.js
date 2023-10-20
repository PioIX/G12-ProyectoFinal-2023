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


// web socket tateti//
io.on('connection', (socket) => {
  console.log('Un jugador se ha conectado.');

  socket.on('makeMove', (index) => {
    console.log('tito')
    // Emitir el movimiento al oponente
    socket.broadcast.emit('opponentMove', index);
});

  socket.on('resetGame', () => {
    // Reinicia el juego y notifica a todos los jugadores.
  });

  socket.on('desconectarse', (data) => {
    console.log('Un jugador se ha desconectado: ', data);
    //la desconexion .
    socket.emit("reciboEvento", "Buenas")
  });

  
});