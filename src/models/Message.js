const mongoose = require('mongoose')

const date = Date()

const MessageSchema = mongoose.Schema ({
    patient_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    medic_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Medic' },
    msg:            { type: String },
    from:           { type: String },
    createdAt:      { type: String, default: date}
})

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message