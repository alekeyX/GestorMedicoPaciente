// Cargamos módulos
const User = require('../models/User')
const db = require('../db/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
        // const token = await user.generateAuthToken() //Generara tokena para el arreglo de tokens
        const token = jwt.sign({_id: user._id}, db.SECRET_TOKEN, { expiresIn: 300 })
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send({error: `${error}`})
    }
}

// Login de un usuario registrado
async function signIn(req, res){
    try {
        const { email, password } = req.body
        const user = await User.findOne({email: email})        
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) return res.status(401).send('Wrong Password')

        const token = jwt.sign({_id: user._id}, db.SECRET_TOKEN);
        return res.status(200).json({user, token});

    } catch (error) {
        res.status(400).send({error: `${error}`})
    }
    // const { email, password } = req.body;
    // const user = await User.findOne({ email: email})
    // if(!user) return res.status(401).send("The email donesn't exists");
    // if(user.password !== password) return res.status(401).send('Wrong Password'); //No es optimo, se debe encriptar la contra

    // const token = jwt.sign({_id: user._id}, db.SECRET_TOKEN );
    // return res.status(200).json({token});
}

// Cerrar sesión de usuario de la aplicación
// Metodo para array de tokens
// async function logout(req, res) {
//     try {
//         req.user.tokens = req.user.tokens.filter((token) => {
//             return token.token != req.token
//         })
//         await req.user.save()
//         res.send()
//     } catch (error) {
//         res.status(500).send(error)
//     }
// }

// // Cerrar sesión de todos los dispositivos
// Metodo para array de tokens dentro el model user
// async function logoutAll (req, res) {
//     try {
//         req.user.tokens.splice(0, req.user.tokens.length)
//         await req.user.save()
//         res.send()
//     } catch (error) {
//         res.status(500).send(error)
//     }
// }

module.exports = {
    signUp,
    signIn
}
