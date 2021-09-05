const mongoose = require('mongoose')

const ReservationSchema = mongoose.Schema ({
    days:       { type: String},
    date:       { type: Date},
    hours:      { type: String},
    enable:     { type: Boolean },
    available:  { type: Boolean },
    medic_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'Medic' },
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', auto: true }
}, {
    timestamps: true
})

const Reservation = mongoose.model('Reservation', ReservationSchema)
module.exports = Reservation