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
        
        // recibir el id de un usuario para recuperar los mensajes de la base de datos
        socket.on('open-chat', (patient_medic_id, medic_id) => {
            Message.find({patient_id: patient_medic_id, 
                            medic_id: medic_id})
            .exec()
            .then( messages  => {
                io.emit('open-chat', messages);
            })
            .catch( error => {
                console.log(error);
            })
            // si un paciente escribe a un medico
            // else { 
            //     Message.find({patient_id: to_user_id, medic_id: from_user_id})
            //     .exec()
            //     .then( messages  => {
            //         // res.json(messages)
            //         console.log(messages);
            //     })
            //     .catch( error => {
            //         console.log(error);
            //     })
            // }
        });

        socket.on('new-message', (message) => {
            // Guardar mensaje en la base de datos
            crearMsg(message)
            Message.find({patient_id: message.patient_id, 
                            medic_id: message.medic_id})
            .exec()
            .then( messages  => {
                io.emit('open-chat', messages);
            })
            .catch( error => {
                console.log(error);
            })
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

// TODO crear 2 bases de datos
// uno para mensajes entre paciente y medico
// y otro para mensajes entre medicos

function getAll (req, res, next) {
    const _user = req.params.id
    Message.find({patient_id: _user})
    // .populate('medic_id')
    .exec()
    .then( messages  => {
        res.json(messages)
    })
    .catch( error => {
        next(new Error(error))
    })
}

// function getMsgByPatient (req, res, next) {
//     const _user = req.params.id
//     Message.find({patient_id: _user})
//     .populate('patient_id')
//     .exec()
//     .then( messages  => {
//         res.json(messages)
//     })
//     .catch( error => {
//         next(new Error(error))
//     })
// }

module.exports = {
    socketConnection,
    getAll
}