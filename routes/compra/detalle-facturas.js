/*
    Ruta: /api/facturas
*/
const { Router } = require('express');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getDetalleFacturas,
    getDetalleFacturaById,
    getDetallesFacturaByIdFactura,
    createDetalleFactura,
    updateDetalleFactura
} = require('../../controllers/compra/detalle-facturas');

const router = Router();

// Rutas para obtener detalles de factura
router.get('/', validarJWT, getDetalleFacturas);
router.get('/id/:id', validarJWT, getDetalleFacturaById);
router.get('/factura/:factura', validarJWT, getDetallesFacturaByIdFactura);

// Ruta para crear un detalle factura
router.post('/', [validarJWT],
    createDetalleFactura
);

// Ruta para actualizar un detalle factura
router.put('/:id', [validarJWT],
    updateDetalleFactura
);

module.exports = router;