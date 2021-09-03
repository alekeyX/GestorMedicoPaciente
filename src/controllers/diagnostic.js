const Diagnostic = require('../models/Diagnostic')

async function createDiagnostic(req, res, next) {
    try {
    const diagnostic = req.body;
        await Diagnostic.create(diagnostic, (error, response) => {
            if (error) {
                res.send({message: error})
            } else {
                res.status(201).send(response)
            }
        })
    } catch (error) {
        res.status(400).send({message: 'Algo salió mal'})
    }
}

function getById(req, res, next ) {
    Diagnostic.findById( req.params.id, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json(data)
        }
    })
}

async function updateDiagnostic( req, res, next ) {
    await Diagnostic.findByIdAndUpdate(req.body._id, {
        $set: req.body
    }, (err, data) => {
        if(err) {
            res.status(400).send({message: 'Algo salió mal'})
        } else {
            res.json( data )
        }
    })
}

function deleteDiagnostic( req, res, next ) {
    Diagnostic.findByIdAndDelete( req.params.id, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json({ message: 'diagnostico eliminado', data })
        }
    })
}

module.exports = {
    createDiagnostic,
    getById,
    updateDiagnostic,
    deleteDiagnostic
}