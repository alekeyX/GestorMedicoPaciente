// Cargamos los módulos que usaremos
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const db = require('../db/database')

// Creamos el objeto del esquema con sus correspondientes campos
const UserSchema = mongoose.Schema({
    name:   { type: String },
    email:  { type: String, required: true, lowercase: true, validate: value => {
                if (!validator.isEmail(value)) {
                    throw new Error({error: 'Invalid Email address'})
                }
            }},
    password: { type: String, required: true, minLength: 6 },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// Antes de almacenar la contraseña en la base de datos la encriptamos con Bcrypt, esto es posible gracias al middleware de mongoose
UserSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Generar token para el usuario
UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id}, db.SECRET_TOKEN)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// Buscar un usuario por email y password
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email} )
    console.log(user);
    
    if(!user) return res.status(401).send("The email donesn't exists");

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) return res.status(401).send('Wrong Password')

    return res.status(200).json({user, token});
    
}

const User = mongoose.model('User', UserSchema)

module.exports = User