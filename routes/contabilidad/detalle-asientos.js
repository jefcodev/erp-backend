/*
    Ruta: /api/asientos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');
const { validarJWT } = require('../../middlewares/validar-jwt');

const {
    getDetalleAsientos,
    getDetalleAsientoById,
    getDetallesAsientoByIdAsiento,
    createDetalleAsiento,
    updateDetalleAsiento,
} = require('../../controllers/contabilidad/detalle-asientos');

const router = Router();

// Rutas para obtener detalles de asiento
router.get('/', validarJWT, getDetalleAsientos);
router.get('/:id/id', getDetalleAsientoById);
router.get('/:asiento/:asiento', getDetallesAsientoByIdAsiento);

// Ruta para crear un detalle asiento
router.post('/', [validarJWT],
    createDetalleAsiento
);

// Ruta para actualizar un detalle asiento
router.put('/:id', [validarJWT],
    updateDetalleAsiento
);

module.exports = router;