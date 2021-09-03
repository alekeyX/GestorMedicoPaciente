const mongoose = require('mongoose')

const HistorySchema = mongoose.Schema ({
    medic:                  { type: String },
    motivoConsulta:         { type: String },
    enfermedadActual:       { type: String },
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
    exam_id:                { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    diagnostic_id:          { type: mongoose.Schema.Types.ObjectId, ref: 'Diagnostic' },
    patient_id:             { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
}, {
    timestamps: true
})

const History = mongoose.model('History', HistorySchema)

module.exports = History