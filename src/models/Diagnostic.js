const mongoose = require('mongoose')

const DiagnosticSchema = mongoose.Schema ({
    diagnostico:            { type: String },
    tratamiento:            { type: String },
}, {
    timestamps: true
})

const Diagnostic = mongoose.model('Diagnostic', DiagnosticSchema)

module.exports = Diagnostic