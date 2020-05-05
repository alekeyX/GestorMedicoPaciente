// Cargamos módulos requeridos
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path');
const { v4: uuidv4 } = require('uuid')
// Cargamos controladores
const userCtrl = require('../controllers/user')
const medicCtrl = require('../controllers/medic')
const auth = require('../middleware/auth')

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
  storage: storage
  // limits: { fileSize: 100000 },
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  //   }
  // }
});

// Especificamos nuestras rutas teniendo en cuenta los metodos creados en nuestro controlador

// Rutas de médicos
router.post('/medic', upload.single('imagePath'), medicCtrl.createMedic )
// router.post('/signin', medicCtrl.signIn )
router.put('/medic/:id', upload.single('imagePath'), medicCtrl.updateMedic )
router.get('/medic', auth, medicCtrl.getAll )
router.get('/medic/:id', auth, medicCtrl.getById )
router.delete('/medic/:id', auth,  medicCtrl.deleteMedic )

// Rutas de user
router.post('/signup', userCtrl.signUp )
router.post('/signin', userCtrl.signIn )
router.get('/users/', userCtrl.getAll)
router.get('/users/:id', auth, userCtrl.getById)
router.put('users/:id', auth, userCtrl.updateUser)
router.delete('users/:id', auth, userCtrl.deleteUser)

router.get('/', (req, res) => res.send('hello world'))
router.get('/tasks',auth,  (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Task one',
            description: 'lorem ipsum',
            date: "2020-04-28T20:39:05.2111Z"
        },
        {
            _id: 2,
            name: 'Task two',
            description: 'lorem ipsum',
            date: "2020-04-28T20:39:05.2111Z"
        },
        {
            _id: 3,
            name: 'Task three',
            description: 'lorem ipsum',
            date: "2020-04-28T20:39:05.2111Z"
        },
    ])
})

module.exports = router;