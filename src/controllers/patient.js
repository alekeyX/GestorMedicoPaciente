// Modulos requeridos
const db = require('../db/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs-extra')
const mongoose = require('mongoose')
const sortBy = require('sort-by')
const validator = require('validator')

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
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).send({message: 'Correo inválido'})
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
            medic_id: req.body.medic_id
        });
        await patient.save()
        res.status(201).send({
            message: "Paciente registrado satisfactoriamente!",
        })
    } catch (error) {
        let _message = ''
        for (let i in error.errors) {
            _message += error.errors[i].properties.message + "\n"
        }
        res.status(400).send({message: _message})
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

        const token = jwt.sign({_id: user._id}, db.SECRET_TOKEN, { expiresIn: '12h' });
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
    }).populate('medic_id')
}

// Encontrar a todos los pacientes
function getAll (req, res, next) {
    Patient.find()
    .populate('medic_id')
    .exec()
    .then( patients => {
        patients.sort(sortBy('username', 'firstName'))
        res.json(patients)
    })
    .catch( err => {
        next( new Error(err))
    })
}

// Encontrar a todos los pacientes por id de médico
function getPatient (req, res, next) {
    const ObjectId = mongoose.Types.ObjectId; 
    const _medic = req.params.id
    Patient.find({medic_id: new ObjectId(_medic)})
    .populate('medic_id')
    .then( patients => {
        res.json(patients)
    })
    .catch( err => {
        next(new Error(err))
    })
}

// Actualizar paciente
async function updatePatient( req, res, next ) {
    if (req.body.withoutImage !== 'none'){
        if( !req.file ){
            image = req.body.imagePath
        } else {
            image = req.file.path
        }
    } else {
        image = 'none'
        fs.unlink(path.resolve(req.body.imagePath))
    }
    if (!validator.isEmail(req.body.email)) {
        return res.status(400).send({message: 'Correo inválido'})
    }
    await Patient.findByIdAndUpdate(req.params.id, {
        $set: req.body, imagePath: image,
        },  
    (err, data) => {
        if(err) {
            if (err.codeName = 'DuplicateKey') {
                return res.status(400).send({message: 'Usuario o correo duplicado'})
            }
        } else {
            res.json({message: 'Datos actualizados exitosamente', data })
        }
    })
}

// Cambiar password
async function changePassword(req, res, next) {
    const _password = await bcrypt.hash(req.body.password, 8)
    await Patient.findOneAndUpdate(
        { _id: req.params.id }, 
        { $set: { password: _password}}
    )
    .then(() => {
        res.json({message: 'Contraseña cambiada'})
    })
    .catch((err) => next(err))
}

// Id de medico se adiciona a un paciente
async function medicAddPatient( req, res, next ) {
    _medic = req.params.medic_id
    await Patient.findOneAndUpdate(
        { _id: req.params.id }, 
        { $push: { medic_id: _medic }},
        { upsert: true, new: true },
    )
    .then(() => 
    res.json({message: 'Datos actualizados exitosamente' })
    )
    .catch((err) => next(err))
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
            res.json({ message: 'Paciente eliminado', data })
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
    getPatient,
    medicAddPatient,
    changePassword
}