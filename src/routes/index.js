// Cargamos módulos requeridos
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path');
const { v4: uuidv4 } = require('uuid')
// Cargamos controladores
const auth = require('../middleware/auth');
const medicCtrl = require('../controllers/medic')
const patientCtrl = require('../controllers/patient')
const historyCtrl = require('../controllers/history')
const reservationCtrl = require('../controllers/reservation')
const chatCtrl = require('../controllers/chat')
const examCtrl = require('../controllers/exam')
const diagnosticCtrl = require('../controllers/diagnostic')

// Multer configuracion de subida de archivos
const DIR = './src/uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname));
    }
  });

// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  limits: { fileSize: 1000000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

// Especificamos nuestras rutas teniendo en cuenta los metodos creados en nuestro controlador

// Rutas de médicos
router.post('/medic', upload.single('imagePath'),  medicCtrl.createMedic )
router.post('/medic/signin', medicCtrl.signIn )
router.put('/medic/:id',  upload.single('imagePath'), medicCtrl.updateMedic )
router.put('/medic/password/:id',  medicCtrl.changePassword )
router.get('/medic',  medicCtrl.getAll )
router.get('/medics/:id',  medicCtrl.getMedicsbyIds )
router.get('/medic/:id',  medicCtrl.getById )
router.delete('/medic/:id',  medicCtrl.deleteMedic )

// Rutas de pacientes
router.post('/patient', upload.single('imagePath'),  patientCtrl.createPatient )
router.post('/patient/signin', patientCtrl.signIn )
router.put('/patient/password/:id',  patientCtrl.changePassword )
router.put('/patient/:id',  upload.single('imagePath'), patientCtrl.updatePatient )
router.put('/patient/:id/:medic_id',  patientCtrl.medicAddPatient )
router.get('/patients/:id',  patientCtrl.getPatient )
router.get('/patient',  patientCtrl.getAll )
router.get('/patient/:id',  patientCtrl.getById )
router.delete('/patient/:id',  patientCtrl.deletePatient )

// Rutas de historiales
router.post('/history',  historyCtrl.createHistory )
router.get('/histories/:id',  historyCtrl.getHistory )
router.put('/history/:id',   historyCtrl.updateHistory )
router.get('/history',  historyCtrl.getAll )
router.get('/history/:id',   historyCtrl.getById )
router.delete('/history/:id',   historyCtrl.deleteHistory )

// Rutas de Reservas
router.post('/reservation',   reservationCtrl.createReservation )
router.get('/reservations/:id',   reservationCtrl.getReservation )
router.get('/reservations/patient/:id',   reservationCtrl.getPatientReservation )
router.put('/reservation/:id',   reservationCtrl.updateReservation )
router.get('/reservation',  reservationCtrl.getAll )
router.get('/reservation/:id',   reservationCtrl.getById )
router.delete('/reservation/:id',   reservationCtrl.deleteReservation )

//  Rutas de chat
router.post('/chat',  chatCtrl.crearMsg )
router.get('/chat/:to/:from',  chatCtrl.getAll)

// Rutas de exams
router.post('/history/exam', examCtrl.createExam )
router.put('/history/exam/:id', examCtrl.updateExam)
router.get('/history/exam/:id', examCtrl.getById )
router.delete('/history/exam/:id', examCtrl.deleteExam )

// Rutas de diagnostics
router.post('/history/diagnostic', diagnosticCtrl.createDiagnostic )
router.put('/history/diagnostic/:id', diagnosticCtrl.updateDiagnostic)
router.get('/history/diagnostic/:id', diagnosticCtrl.getById )
router.delete('/history/diagnostic/:id', diagnosticCtrl.deleteDiagnostic)

module.exports = router;