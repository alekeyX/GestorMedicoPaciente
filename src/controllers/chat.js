let http = require('http');
const mongoose = require('mongoose')
const Message = require('../models/Message');


function socketConnection(app){
    const server = http.Server(app)
    const socketIO = require('socket.io')
    const io = socketIO(server)
    
    server.listen(18000, () => {
        console.log(`Socket listo y escuchando en el puerto:${18000}`);
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
        // socket.on('new-message', async (message, room) => {
        //     console.log('give message');
        //     crearMsg(message)
        // })

        socket.on('disconnect', function() {
            console.log("user disconnected");
        })
    });
}

// crear mensaje
async function crearMsg(req, res) {
    try {
        const msg = new Message ({
            _id: new mongoose.Types.ObjectId(),
            medic_id: req.body.medic_id,
            patient_id: req.body.patient_id,
            from: req.body.from,
            msg: req.body.msg,
            createdAt: Date()
        });
        await msg.save()
        res.status(201).send({message: "mensaje recibido!"})
    } catch (error) {
        res.status(400).send({message: _message})
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
    getAll,
    crearMsg
}