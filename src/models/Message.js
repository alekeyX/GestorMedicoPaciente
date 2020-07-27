const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema ({
    patient_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    medic_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Medic' },
    msg:            { type: String },
    to:             { type: String },
    from:           { type: String },
    // read:       { type: Boolean }
}, {
    timestamps: true
})

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message