const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')

const PatientSchema = mongoose.Schema ({
    username:    { type: String, required: true, unique: true },
    password:    { type: String, required: true },
    firstName:   { type: String, required: true },
    lastName:    { type: String, required: true },
    ci:          { type: String, required: true },
    age:         { type: String },
    role:        { type: String, required: true },
    email:       { type: String, required: true, unique: true, lowercase: true},
    genero:      { type: String },
    ethnicity:   { type: String },
    maritalStatus:{ type: String },
    ocupation:   { type: String },
    placeBirth:  { type: String },
    address:     { type: String },
    phone:       { type: String },
    imagePath:   { type: String },
    medic_id:    [{ type: String }],
    token:       { type: String }
}, {
    timestamps: true
})

// Antes de almacenar la contraseña en la base de datos la encriptamos con Bcrypt, esto es posible gracias al middleware de mongoose
PatientSchema.pre('save', async function (next) {
    const patient = this
    if (patient.isModified('password')) {
        patient.password = await bcrypt.hash(patient.password, 8)
    }
    next()
})

// Método para no devolver la contraseña
PatientSchema.methods.toJSON = function() {
    let patient = this
    let patientObject = patient.toObject()
    delete patientObject.password
    return patientObject
}

// Apply the uniqueValidator plugin to PatientSchema.
PatientSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

const Patient = mongoose.model('Patient', PatientSchema)

module.exports = Patient