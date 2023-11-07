/*
    Ruta: /api/facturas
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getFacturas,
    getFacturasAll,
    createFactura,
    getFacturaById,
    deleteFactura,
    updateFactura
} = require('../../controllers/venta/facturas');

const router = Router();

// Rutas para obtener facturas
router.get('/', validarJWT, getFacturas);
router.get('/all/', validarJWT, getFacturasAll);
router.get('/:id', validarJWT, getFacturaById);

// Ruta para crear una factura
router.post('/', [validarJWT],
    createFactura
);

// Ruta para actualizar una factura
router.put('/:id', [validarJWT],
    updateFactura
);

// Ruta para eliminar una factura
router.delete('/:id', [validarJWT],
    deleteFactura
);

module.exports = router;