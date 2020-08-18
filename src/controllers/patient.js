// Modulos requeridos
const db = require('../db/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs-extra')
const mongoose = require('mongoose')
const sortBy = require('sort-by')
// Modelo paciente
const Patient = require('../models/Patient')

// Crear un registro
async function createPatient(req, res) {
    try {
        if( !req.file ){
            image = 'none'
        } else {
            image = req.file.path
        }
    const patient = new Patient ({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            ci: req.body.ci,
            age: req.body.age,
            email: req.body.email,
            role: req.body.role,
            genero: req.body.genero,
            ethnicity: req.body.ethnicity,
            maritalStatus: req.body.maritalStatus,
            ocupation: req.body.ocupation,
            placeBirth: req.body.placeBirth,
            address: req.body.address,
            phone: req.body.phone,
            imagePath: image,
        });
        await patient.save()
        res.status(201).send({
            message: "Paciente registrado satisfactoriamente!",
        })
    } catch (error) {
        res.status(400).send({message: error})
    }
}

//  login de un paciente registrado
async function signIn(req, res) {
    try {
        const { username, password } = req.body
        const user = await Patient.findOne({username: username})        
        if (!user) {
            return res.status(401).send({message: 'Nombre incorrecto'})
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) return res.status(401).send({message: 'Contraseña incorrecta'})

        const token = jwt.sign({_id: user._id}, db.SECRET_TOKEN, { expiresIn: '24h' });
        user.token = token
        return res.status(200).json(user);

    } catch (error) {
        res.status(400).send({message: `${error}`})
    }
}

// Buscar por Id a un paciente
function getById(req, res, next ) {
    Patient.findById( req.params.id, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json(data)
        }
    })
}

// Encontrar a todos los pacientes
function getAll (req, res, next) {
    Patient.find()
    .exec()
    .then( patients => {
        patients.sort(sortBy('username', 'firstName'))
        res.json(patients)
    })
    .catch( err => {
        next( new Error(err))
    })
}

// Actualizar paciente
async function updatePatient( req, res, next ) {
    const password = await bcrypt.hash(req.body.password, 8)
    if( !req.file ){
        image = req.body.imagePath
    } else {
        image = req.file.path
    }
    await Patient.findByIdAndUpdate(req.params.id, {
        $set: req.body, password: password, imagePath: image
    }, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json({message: 'Datos actualizados exitosamente' })
        }
    })
}

// Eliminar paciente
function deletePatient( req, res, next ) {
    Patient.findByIdAndDelete( req.params.id, (err, data) => {
        if( data ) {
            fs.unlink(path.resolve(data.imagePath))
        }
        if(err) {
            next(err)
        } else {
            res.json({ message: 'Paciente eliminado' })
        }
    })
}

module.exports = {
    createPatient,
    signIn,
    getById,
    getAll,
    updatePatient,
    deletePatient,
}