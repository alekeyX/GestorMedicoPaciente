// Cargamos módulos
const User = require('../models/User')
const db = require('../db/database')
const service = require('../services/index')


// crear un registro
async function signUp (req, res) {
    try {
         const user = new User ({
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        })
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
}

// Login de un usuario registrado
async function signIn(req, res){
    // try {
    //     const { email, password } = req.body
        
    //     const user = User.findByCredentials({email, password})
    //     console.log(user);
        
    //     if(!user) return res.status(401).send({message: 'No existe el usuario'})

    //     const token = user.generateAuthToken()
    //     res.status(200).send({ 
    //         message: 'Te has logueado correctamente',
    //         user, token
    //     })
    // } catch (error) {
    //     res.status(400).send(error)
    // }
    User.find({ email: req.body.email }, (err, user) =>{
        if (err) return res.status(500).send({ message: err})
        if(!user) return res.status(404).send({message: 'No existe el usuario'})
        // TODO hacer comparacion de password
        req.user = user
        res.status(200).send({
            message: 'Te has logueado correctamente',
            token: service.createToken(user)
        })
    })
}

module.exports = {
    signUp,
    signIn
}