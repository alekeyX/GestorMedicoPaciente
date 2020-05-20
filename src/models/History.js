const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')

const HistorySchema = mongoose.Schema ({
    patient:                { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    motivoConsulta:         { type: String, required: true },
    enfermedadActual:       { type: String, required: true },
    antecedentesPersonales: { type: String },
    antecedentesFamiliares: { type: String },
    age:                    { type: Number },
    habitosToxicos:         { type: String },
    // Examen fisico
    peso:                   { type: String },
    altura:                 { type: String },
    talla:                  { type: String },
    FC:                     { type: String },
    FR:                     { type: String },
    temperatura:            { type: String },
    impresionGeneral:       { type: String },
    constitucion:           { type: String },
    facies:                 { type: String },
    actitud:                { type: String },
    decubito:               { type: String },
    marcha:                 { type: String },
    // Piel, faneras y tejido celular subcutaneo
    aspecto:                { type: String },
    distribucionPilosa:     { type: String },
    lesiones:               { type: String },
    faneras:                { type: String },
    tejidoCelularSub:       { type: String },
    // Cabeza
    craneoCara:             { type: String },
    cueroCabelludo:         { type: String },
    regionFrontal:          { type: String },
    regionOrbitonasal:      { type: String },
    regionOrofaringea:      { type: String },
    //  Cuello
    cInspeccion:            { type: String },
    cPalpacion:             { type: String },
    cPercusion:             { type: String },
    cAuscultacion:          { type: String },
    // Respiratorio
    rInspeccion:            { type: String },
    rPalpacion:             { type: String },
    rPercusion:             { type: String },
    rAuscultacion:          { type: String },
    // Cardiovascular
    cdInspeccion:           { type: String },
    cdPalpacion:            { type: String },
    cdAuscultacion:         { type: String },
    cdPulsos:               { type: String },
    // Abdomen
    aInspeccion:            { type: String },
    aPalpacion:             { type: String },
    aPercusion:             { type: String },
    aAuscultacion:          { type: String },
    // Neurologo
    glasglow:               { type: String },
    motilidadActiva:        { type: String },
    motilidadPasiva:        { type: String },
    motilidadRefleja:       { type: String },
    paresCraneales:         { type: String },
    sensibilidadProfunda:   { type: String },
    sensibilidadSuperficial:{ type: String },
    // Diagnostico
    diagnostico:            { type: String },
    tratamiento:            { type: String },
}, {
    timestamps: true
})

// Antes de almacenar la contraseña en la base de datos la encriptamos con Bcrypt, esto es posible gracias al middleware de mongoose
// HistorySchema.pre('save', async function (next) {
//     const history = this
//     if (history.isModified('password')) {
//         history.password = await bcrypt.hash(history.password, 8)
//     }
//     next()
// })

// Método para no devolver la contraseña
HistorySchema.methods.toJSON = function() {
    let history = this
    let historyObject = history.toObject()
    delete historyObject.password
    return historyObject
}

// Apply the uniqueValidator plugin to HistorySchema.
HistorySchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

const History = mongoose.model('history', HistorySchema)

module.exports = History