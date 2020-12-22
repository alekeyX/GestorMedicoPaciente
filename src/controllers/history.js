// Modelo de historia
const Patient = require('../models/Patient')
const History = require('../models/History')
const sortBy = require('sort-by')

// Crear un registro
async function createHistory(req, res, next) {
    try {
    const history = req.body;
        await History.create(history, (error, history) =>{
            if (error) {
                res.send({message: error})
            } else {
                Patient.findByIdAndUpdate(req.body.patient, {
                    $addToSet: {history: history._id}
                },  { new: true }, (err) => {
                    if (err) {
                        next(err)
                    } else {
                        res.status(201).send({ message: 'Historia registrada satisfactoriamente!' })
                    }
                })
            }
        })
    } catch (error) {
        res.status(400).send({message: 'Algo salió mal'})
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
    }).populate('patient_id')
}

// Encontrar a todos los historiales
function getAll (req, res, next) {
    History.find()
    .populate('patient_id')
    .then( historys => {
        historys.sort(sortBy('createdAt'))
        res.json(historys)
    })
    .catch( err => {
        next( new Error(err))
    })
}

// Encontrar todos los historiales por id de paciente
function getHistory (req, res, next) {
    const _patient = req.params.id
    History.find({patient_id: _patient})
    .populate('patient_id')
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
            res.status(400).send({message: 'Algo salió mal'})
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