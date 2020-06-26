const mongoose = require('mongoose')

const ReservationSchema = mongoose.Schema ({
    days:       { type: String},
    dateStart:  { type: Date},
    dateEnd:    { type: Date},
    date:       { type: Date},
    hours:      { type: String},
    enable:     { type: Boolean },
    available:  { type: Boolean },
    patient_id: { type: String },
    medic_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'Medic' },
}, {
    timestamps: true
})

const Reservation = mongoose.model('Reservation', ReservationSchema)
module.exports = Reservation