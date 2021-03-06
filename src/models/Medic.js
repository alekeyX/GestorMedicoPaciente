const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')

const MedicSchema = mongoose.Schema ({
    username:    { type: String, required: true, unique: true },
    password:    { type: String, required: true },
    firstName:   { type: String, required: true },
    lastName:    { type: String, required: true },
    role:        { type: String, required: true },
    email:       { type: String, required: true, unique: true, lowercase: true},
    genero:      { type: String },
    address:     { type: String },
    phone:       { type: String },
    specialty:   { type: String },
    imagePath:   { type: String },
    token:       {
        type: String
    }
}, {
    timestamps: true
})

// Antes de almacenar la contraseña en la base de datos la encriptamos con Bcrypt, esto es posible gracias al middleware de mongoose
MedicSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Método para no devolver la contraseña
MedicSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password
    return userObject
}

// Apply the uniqueValidator plugin to userSchema.
MedicSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

const Medic = mongoose.model('Medic', MedicSchema)

module.exports = Medic