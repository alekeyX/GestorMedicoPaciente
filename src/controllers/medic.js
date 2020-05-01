// Modulos requeridos
const db = require('../db/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs-extra')
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
            // _id: new mongoose.Types.ObjectId(),
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
        const token = jwt.sign({_id: medic._id}, db.SECRET_TOKEN, { expiresIn: '1h' })
        res.status(201).send({
            message: "Médico registrado satisfactoriamente!",
            medic, token 
        }).catch(err => {
            next(err)
        })
    } catch (error) {
        res.status(400).send({error: `${error}`})
    }
}

//  login de un medico registrado
async function signIn(req, res) {
    try {
        const { username, password } = req.body
        const medic = await Medic.findOne({username: username})        
        if (!medic) {
            return res.status(401).send({error: '¡Error de inicio de sesion! Verifique las credenciales de autenticación'})
        }
        const isPasswordMatch = await bcrypt.compare(password, medic.password)
        if (!isPasswordMatch) return res.status(401).send('Contraseña erronea')

        const token = jwt.sign({_id: medic._id}, db.SECRET_TOKEN, { expiresIn: '1h' });
        return res.status(200).json({medic, token});

    } catch (error) {
        res.status(400).send({error: `${error}`})
    }
}

// Buscar por Id a un médico
function getById(req, res, next ) {
    Medic.findById( req.params.id, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json({message: "Usuario encontrado", data})
        }
    })
}

// Encontrar a todos los médicos
function getAll (req, res, next) {
    Medic.find((error, data) => {
      if (error) {
        next(error)
      } else {
        res.json(data)
      }
    })
}

// Actualizar médico
async function updateMedic( req, res, next ) {
    if( !req.file ){
        image = req.body.imagePath
    } else {
        image = req.file.path
    }
    await Medic.findByIdAndUpdate(req.params.id, {
        $set: req.body, imagePath: image
    }, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json({message: 'Datos actualizados exitosamente', data })
        }
    })
}

// Eliminar médico
function deleteMedic( req, res, next ) {
    Medic.findOneAndRemove( req.params.id, (err, data) => {
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