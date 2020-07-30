let http = require('http');
const mongoose = require('mongoose')
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
        
        // recibir el id de un usuario a quien escribiremos
        socket.on('open-chat', (to_user_id) => {
            io.emit('open-chat', to_user_id);
        });

        // devolver mensajes de la bd
        socket.on('get-message', async data => {
            let messages = await Message.find({patient_id: data.patient_id, 
                medic_id: data.medic_id})
            io.emit('new-message', messages)
        })

        // Guardar mensaje en la base de datos
        socket.on('new-message', async (message) => {
            crearMsg(message)
            // devolver mensajes de la bd
            let messages = await Message.find({patient_id: message.patient_id, 
                medic_id: message.medic_id})
            io.emit('new-message', messages)
        });

        socket.on("disconnect", function() {
            console.log("user disconnected");
        });
    });
}

// crear mensaje
async function crearMsg (req) {
    try {
        const msg = new Message ({
            _id: new mongoose.Types.ObjectId(),
            medic_id: req.medic_id,
            patient_id: req.patient_id,
            to: req.to,
            from: req.from,
            msg: req.msg
        });
        await msg.save()
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    socketConnection,
}