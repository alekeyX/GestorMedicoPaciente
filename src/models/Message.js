const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema ({
    to:         { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    from:       { type: mongoose.Schema.Types.ObjectId, ref: 'Medic' },
    msg:        { type: String },
    read:       { type: Boolean }
}, {
    timestamps: true
})

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message