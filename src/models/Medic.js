const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const MedicSchema = mongoose.Schema ({
    username:    { type: String, required: true, unique: true },
    password:    { type: String, required: true },
    firstName:   { type: String, required: true },
    lastName:    { type: String, required: true },
    role:        { type: String },
    email:       {  type: String, required: true, unique: true, lowercase: true, validate: value => {
                    if (!validator.isEmail(value)) {
                        throw new Error({error: 'Direccion de correo invalida'})
                    }
                 }},
    genero:      { type: String },
    address:     { type: String },
    phone:       { type: Number },
    specialty:   { type: String },
    imagePath:   { type: String }
}, {
    timestamps: true
})

MedicSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const Medic = mongoose.model('Medic', MedicSchema)

module.exports = Medic