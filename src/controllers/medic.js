// Modulos requeridos
const db = require('../db/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs-extra')
const mongoose = require('mongoose')
const sortBy = require('sort-by')
// Modelo médico
const Medic = require('../models/Medic')

// Crear un registro
async function createMedic(req, res, next) {
    try {
        if( !req.file ){
            image = 'none'
        } else {
            image = req.file.path
        }
    const medic = new Medic ({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role,
            address: req.body.address,
            phone: req.body.phone,
            specialty: req.body.specialty,
            genero: req.body.genero,
            imagePath: image
        });
        await medic.save()
        // const token = jwt.sign({_id: medic._id}, db.SECRET_TOKEN, { expiresIn: '1h' })
        // medic.token = token
        res.status(201).send({
            message: "Médico registrado satisfactoriamente!",
        })
    } catch (error) {
        res.status(400).send({message: `${error}`})
    }
}

//  login de un medico registrado
async function signIn(req, res) {
    try {
        const { username, password } = req.body
        const user = await Medic.findOne({username: username})        
        if (!user) {
            return res.status(401).send({message: 'Nombre incorrecto'})
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) return res.status(401).send({message: 'Contraseña incorrecta'})

        const token = jwt.sign({_id: user._id}, db.SECRET_TOKEN, { expiresIn: '1h' });
        user.token = token
        return res.status(200).json(user);

    } catch (error) {
        res.status(400).send({message: `${error}`})
    }
}

// Buscar por Id a un médico
function getById(req, res, next ) {
    Medic.findById( req.params.id, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json(data)
        }
    })
}

// Encontrar a todos los médicos
function getAll (req, res, next) {
    Medic.find((error, data) => {
        if (error) {
            next(error)
        } else {
            data.sort(sortBy('firstName', 'lastName'))
            res.json(data)
        }
    })
}

// Actualizar médico
async function updateMedic( req, res, next ) {
    // const password = await bcrypt.hash(req.body.password, 8)
    if( !req.file ){
        image = req.body.imagePath
    } else {
        image = req.file.path
    }
    await Medic.findOneAndUpdate({_id: req.params.id}, {
        // $set: req.body, password: password, imagePath: image
        $set: req.body, imagePath: image
    }, {new: true}, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json({message: 'Datos actualizados exitosamente', data })
        }
    })
}

// Eliminar médico
function deleteMedic( req, res, next ) {
    Medic.findByIdAndDelete( req.params.id, (err, data) => {
        if( data ) {
            fs.unlink(path.resolve(data.imagePath))
        }
        if(err) {
            next(err)
        } else {
            res.json({ message: 'Médico eliminado', data })
        }
    })
}

module.exports = {
    createMedic,
    signIn,
    getById,
    getAll,
    updateMedic,
    deleteMedic
}