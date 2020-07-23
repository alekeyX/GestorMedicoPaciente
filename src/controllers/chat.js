let http = require('http');
const Message = require('../models/Message');

function socketConnection(app){
    const server = http.Server(app)
    const socketIO = require('socket.io')
    const io = socketIO(server)
    
    server.listen(5000, () => {
        console.log(`Socket listo y escuchando en http://localhost:${5000}`);
    })
    
    io.on('connection', (socket) => {
        console.log('user connected');
        
        // recibir el id de un usuario para recuperar los mensajes de la base de datos
        socket.on('open-chat', (user_id) => {
            console.log(user_id);
            io.emit('open-chat', user_id);
        });

        socket.on('new-message', (message) => {
            console.log(message);

            io.emit('new-message', message);
        });

        socket.on("disconnect", function() {
            console.log("user disconnected");
        });
    });
}

// crear mensaje
async function crearMsg (req, res, next) {
    try {
        const msg = req.body;
        await msg.save()
        res.status(201).send({
            message: "Mensaje registrado"
        })
    } catch (error) {
        res.status(400).send({message: `${error}`})
    }
}

function getAll (res, res, next) {
    const _user = req.params.id
    Message.find({from: _user})
    .populate('from')
    .exec()
    .then( messages  => {
        res.json(messages)
    })
    .catch( error => {
        next(new Error(error))
    })
}

module.exports = {
    socketConnection
}