let http = require('http');
const mongoose = require('mongoose')
const Message = require('../models/Message');


function socketConnection(app){
    const server = http.Server(app)
    const socketIO = require('socket.io')
    const io = socketIO(server)
    
    server.listen(15522, () => {
        console.log(`Socket listo y escuchando en https://api-consultorio-web.herokuapp.com:${15522}`);
    })
    
    io.on('connection', (socket) => {
        console.log('user connected');

        // Unirse a un room
        socket.on('joinRoom', (room) => {
            console.log('join room');
            socket.join(room);
        })

        // Salir de un room
        socket.on('leaveRoom', (room) => {
            console.log('leave room');
            socket.leave(room);
        })

        // Guardar mensaje en la base de datos
        socket.on('new-message', async (message, room) => {
            console.log('give message');
            crearMsg(message)
            // devolver mensajes de la bd
            let messages = await Message.find({patient_id: message.patient_id, 
                medic_id: message.medic_id})
            //     .limit(20)
            //     .sort({$natural:-1})
            console.log('get message');
            io.to(room).emit('new-message', messages)
        })

        socket.on('disconnect', function() {
            console.log("user disconnected");
        })
    });
}

// crear mensaje
function crearMsg (req) {
    try {
        const msg = new Message ({
            _id: new mongoose.Types.ObjectId(),
            medic_id: req.medic_id,
            patient_id: req.patient_id,
            from: req.from,
            msg: req.msg,
            createdAt: Date()
        });
        msg.save()
    } catch (error) {
        console.log(error);
        next(error)
    }
}

// Devolver mensajes de la db
function getAll (req, res, next) {
    const _to = req.params.to
    const _from = req.params.from
    Message.find({patient_id: _to, 
        medic_id: _from})
    .then( messages => {
        res.json(messages)
    })
    .catch( err => {
        next( new Error(err))
    })
}

module.exports = {
    socketConnection,
    getAll
}