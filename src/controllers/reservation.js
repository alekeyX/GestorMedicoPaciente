// Modelo de historia
const Reservation = require('../models/Reservation')
const sortBy = require('sort-by')
const moment = require('moment');
// Crear un registro
async function createReservation(req, res, next) {
    try {
        // Convervir los dias del body en valor numerico
        req.body.days.forEach(day => {
            var selectDay
            if (day === 'Lunes') {
                selectDay = 1
            } else {
                if (day === 'Martes') {
                    selectDay = 2
                } else {
                    if (day === 'Miércoles') {
                        selectDay = 3
                    } else {
                        if (day === 'Jueves') {
                            selectDay = 4
                        } else {
                            if (day === 'Viernes') {
                                selectDay = 5
                            } else {
                                if (day === 'Sabado') {
                                    selectDay = 6
                                } else {
                                    selectDay = 7
                                }
                            }
                        }
                    }
                }
            }
            // Convertimos las fechas del body en formato de moment
            let date = moment().format('YYYY-MM-DD')
            let start = req.body.dateStart
            let end = req.body.dateEnd
            var from = moment(start)
            from.format('YYYY/MM/DD')
            var to = moment(end)
            to.format('YYYY/MM/DD')
            
            // Verificar si la fecha para reservas es aun vigente
            if(moment(date).isBefore(to)) {
                // Ir sumando un dia desde la fecha inicial hasta la fecha final
                while (!from.isAfter(to)) {
                    // Comparar si el dia es un dia elegido por el medico para tener reservas
                    if (from.day() === selectDay) {
                            req.body.hours.forEach(hour => { 
                                // Guardar un registro por cada dia y hora habiles elegidas por el usuario   
                                const reserva = new Reservation ({
                                    days: day,
                                    dateStart: req.body.dateStart,
                                    dateEnd: req.body.dateEnd,
                                    date: from,
                                    hours: hour,
                                    enable: req.body.enable,
                                    available: req.body.available,
                                    patient_id: '',
                                    medic_id: req.body.medic_id
                                })
                                reserva.save()
                                res.status(201).send({message: 'Fechas habilitadas exitosamente!'})
                            });
                        }
                        from.add(1, 'days')
                    }
                } else {
                    res.status(201).send({message: 'Ya venció la fecha elegida'})
                }
        });
    } catch (error) {
        res.status(400).send({message: error})
    }
}

// Buscar por Id 
function getById(req, res, next ) {
    Reservation.findById( req.params.id, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json(data)
        }
    })
}

// Encontrar a todos las reservas
function getAll (req, res, next) {
    Reservation.find()
    .populate('medic_id')
    .then( reservations => {
        reservations.sort(sortBy('date', 'hours'))
        res.json(reservations)
    })
    .catch( err => {
        next( new Error(err))
    })
}

// Encontrar todos las reservas por id de medico
function getReservation (req, res, next) {
    const _medic = req.params.id
    Reservation.find({medic_id: _medic})
    .populate('medic_id')
    .exec()
    .then( reservations => {
        res.json(reservations)
    })
    .catch( err => {
        next(new Error(err))
    })
}

// Actualizar reserva
async function updateReservation( req, res, next ) {
    await Reservation.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json({message: 'Datos actualizados exitosamente', data })
        }
    })
}

// Eliminar paciente
function deleteReservation( req, res, next ) {
    Reservation.findByIdAndDelete( req.params.id, (err, data) => {
        if(err) {
            next(err)
        } else {
            res.json({ message: 'Reserva eliminada', data })
        }
    })
}

module.exports = {
    createReservation,
    getById,
    getAll,
    updateReservation,
    deleteReservation,
    getReservation
}