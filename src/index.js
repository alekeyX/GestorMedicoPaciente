const mongoose = require('mongoose')
const app = require('./app')
const db = require('./db/database')
const socket = require('./controllers/chat')

mongoose.connect(db.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
    }, (err, res) => {
    if(err) {
        return console.log(`Error al conectar a la base de datos: ${err}`);
    }
    console.log('Conexion a la base de datos establecida...');

    let server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

    server.listen(db.port, () => {
        console.log(`API REST corriendo en https://api-consultorio-web.herokuapp.com:${db.port}`);
    })

    socket.socketConnection(io)
})