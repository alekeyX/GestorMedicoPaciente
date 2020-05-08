// Cargamos módulos
const db = require('../db/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Cargamos modelos
const User = require('../models/User')

// crear un registro
async function signUp (req, res) {
    try {
        const user = new User ({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            role: req.body.role
        })
        await user.save()
        // const token = await user.generateAuthToken() //Generara tokena para el arreglo de tokens
        const token = jwt.sign({_id: user._id}, db.SECRET_TOKEN, { expiresIn: '1h' })
        user.token = token
        res.status(201).send({ user })
    } catch (error) {
        res.status(400).send({error: `${error}`})
    }
}

// Login de un usuario registrado
async function signIn(req, res){
    try {
        const { username, password } = req.body
        const user = await User.findOne({username: username})        
        if (!user) {
            return res.status(401).send({message: 'Nombre incorrecto'})
        }
        
        if(user) {
            const isPasswordMatch = await bcrypt.compare(password, user.password)
            if (!isPasswordMatch) return res.status(401).send({message: 'Contraseña incorrecta'})
            const token = jwt.sign({_id: user._id}, db.SECRET_TOKEN, { expiresIn: '1h' });
            user.token = token
            return res.status(200).json(user);
        }

    } catch (error) {
        res.status(400).send({error: `${error}`})        
    }
}

function getById(req, res, next ) {
    User.findById( req.params.id, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json(data)
        }
    })
}

function getAll(req, res, next) {
    User.find((err, data) => {
        if (err) {
            next (err)
        } else {
            res.json(data)
        }
    })
}

function updateUser(req, res, next) {
    User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (err, data) => {
        if (err) {
            next(err)
        } else {
            res.json({ message: 'Usuario actualizado', data })
        }
    })
}

function deleteUser(req, res, next) {
    User.findByIdAndDelete(req.params.id, (err, data) => {
        if(data) {
            next(err)
        } else {
            res.status(200).json({ message: 'Usuario eliminado', data })
        }
    })

}

module.exports = {
    signUp,
    signIn,
    getById,
    getAll,
    updateUser,
    deleteUser
}
