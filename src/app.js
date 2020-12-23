// Modulos requeridos
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const router = require('./routes/index')
const socket = require('./controllers/chat')
// TODO express-validator // Para validaciones en de campos en el req.body

// const corsOptions = {
//   origin: 'http://localhost:4200',
//   optionsSuccessStatus: 200,
//   credentials: true
// };

// Setup Express.js
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('dev'));
// Inicializacion de socket.io
socket.socketConnection(app)


// API rutas
app.use('/api', router)

// Hacer que la carpeta "uploads" de imágenes esté disponible públicamente
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/src/uploads', express.static(path.join(__dirname, 'uploads')));

// Error favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204));

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  // Dominio que tengan acceso (ej. 'http://example.com')
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");

  // Metodos de solicitud que deseas permitir
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Encabecedados que permites (ej. 'X-Requested-With,content-type')
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

module.exports = app