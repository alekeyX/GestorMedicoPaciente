const mongoose = require('mongoose')

const ExamSchema = mongoose.Schema ({
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
}, {
    timestamps: true
})

const Exam = mongoose.model('Exam', ExamSchema)

module.exports = Exam