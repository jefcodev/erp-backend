/*
    Ruta: /api/contabilidad/asientos
*/
const { Router } = require('express');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getAsientos,
    getAsientosAll,
    createAsiento,
    getAsientoById,
    deleteAsiento,
    updateAsiento
} = require('../../controllers/contabilidad/asientos');

const router = Router();

// Rutas para obtener asientos
router.get('/', validarJWT, getAsientos);
router.get('/all/', validarJWT, getAsientosAll);
router.get('/:id', getAsientoById);

// Ruta para crear un asiento
router.post('/', [validarJWT],
    createAsiento
);

// Ruta para actualizar un asiento
router.put('/:id', [validarJWT],
    updateAsiento
);

// Ruta para eliminar un asiento
router.delete('/:id', [validarJWT],
    deleteAsiento
);

module.exports = router;