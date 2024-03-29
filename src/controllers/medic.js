// Modulos requeridos
const db = require('../db/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs-extra')
const mongoose = require('mongoose')
const sortBy = require('sort-by')
const validator = require('validator')

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
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).send({message: 'Correo inválido'})
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
        let _message = ''
        for (let i in error.errors) {
            _message += error.errors[i].properties.message + "\n"
        }
        res.status(400).send({message: _message})
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

        const token = jwt.sign({_id: user._id}, db.SECRET_TOKEN, { expiresIn: '12h' });
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

// Encontrar a varios médicos por id 
function getMedicsbyIds (req, res, next) {
    // Recibe array de id's y buscar un medico por cada id y guardarlos en otro array
    let medics_id = new Array()
    let medics = new Array()
    let _id = ''
    let j = 0
    for (var i in req.params.id) {
        if(req.params.id[i] != ',') {
            _id += req.params.id[i]
        } else {
            medics_id.push(_id)
            _id = ''
        }
    }
    medics_id.push(_id)
    while (j < medics_id.length) {
        Medic.findById( medics_id[j], (error, data) => {
            if (error){
                next(error)
            } else {
                medics.push(data)
                if(medics.length == medics_id.length){
                    res.json(medics)
                }
            }
        })
        j++
    }
}

// Actualizar médico
async function updateMedic( req, res, next ) {
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
    await Medic.findOneAndUpdate({_id: req.params.id}, {
        $set: req.body, imagePath: image
    }, {new: true}, (err, data) => {
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
    await Medic.findOneAndUpdate(
        { _id: req.params.id }, 
        { $set: { password: _password}}
    )
    .then(() => {
        res.json({message: 'Contraseña cambiada'})
    })
    .catch((err) => next(err))
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
            res.json({ message: 'Médico eliminado exitosamente', data })
        }
    })
}

module.exports = {
    createMedic,
    signIn,
    getById,
    getAll,
    getMedicsbyIds,
    updateMedic,
    deleteMedic,
    changePassword
}