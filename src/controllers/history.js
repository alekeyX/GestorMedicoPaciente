// Modulos requeridos
const mongoose = require('mongoose')
// Modelo de historia
const History = require('../models/History')

// Crear un registro
async function createHistory(req, res, next) {
    try {
    const history = req.body;  
        await History.create(history, (error, history) =>{
            if (error) {
                res.send({message: error})
            } else {
                res.send(history)
            }
        })
        // await history.save()
        // res.status(201).send({
        //     message: "Paciente registrado satisfactoriamente!",
        // })
    } catch (error) {
        res.status(400).send({message: error})
    }
}

// Buscar por Id un historial
function getById(req, res, next ) {
    History.findById( req.params.id, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json(data)
        }
    })
}

// Encontrar a todos los historiales
function getAll (req, res, next) {
    // Patient.find((error, data) => {
    //     if (error) {
    //         next(error)
    //     } else {
    //         res.json(data)
    //     }
    // })
    History.find()
    .then( historys => {
        res.json(historys)
    })
    .catch( err => {
        next( new Error(err))
    })
}

// Encontrar todos los historiales por id de paciente
function getHistory (req, res, next) {
    const _patient = req.params.id
    
    Patient.find({patient: _patient})
    .populate('patient')
    .exec()
    .then( historys => {
        res.json(historys)
    })
    .catch( err => {
        next(new Error(err))
    })
    
}

// Actualizar historial
async function updateHistory( req, res, next ) {
    await History.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json({message: 'Datos actualizados exitosamente', data })
        }
    })
}

// Eliminar paciente
function deleteHistory( req, res, next ) {
    History.findByIdAndDelete( req.params.id, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json({ message: 'Historia eliminada', data })
        }
    })
}

module.exports = {
    createHistory,
    getById,
    getAll,
    updateHistory,
    deleteHistory,
    getHistory
}