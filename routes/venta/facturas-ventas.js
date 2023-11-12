/*
    Ruta: /api/facturas
*/
const { Router } = require('express');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getFacturas,
    getFacturasAll,
    getFacturaById,
    createFactura,
    updateFactura,
    deleteFactura,
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