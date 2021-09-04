const Exam = require("../models/Exam");

// Crear un registro
async function createExam(req, res, next) {
    try {
        const exam = req.body;
        await Exam.create(exam, (error, response) => {
            if (error) {
                res.send({ message: error });
            } else {
                res.status(201).send(response);
            }
        });
    } catch (error) {
        res.status(400).send({ message: "Algo salió mal" });
    }
}

// Buscar por Id un historial
function getById(req, res, next) {
    Exam.findById(req.params.id, (err, data) => {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });
}

// Actualizar historial
async function updateExam(req, res, next) {
    await Exam.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        (err, data) => {
            if (err) {
                res.status(400).send({ message: "Algo salió mal" });
            } else {
                res.json(data);
            }
        }
    );
}

// Eliminar paciente
function deleteExam(req, res, next) {
    Exam.findByIdAndDelete(req.params.id, (err, data) => {
        if (err) {
            next(err);
        } else {
            res.json({ message: "Examen eliminado", data });
        }
    });
}

module.exports = {
    createExam,
    getById,
    updateExam,
    deleteExam,
};
