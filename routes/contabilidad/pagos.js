// Ruta: /api/pagos

const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getPagos,
    getPagosSearch,
    getPagosAll,
    getPagoById,
    getPagosByIdFacturaCompra,
    getPagosByIdFacturaVenta,
    createPago,
    updatePago,
    deletePago
} = require('../../controllers/contabilidad/pagos');

const router = Router();

// Rutas para obtener provedores
router.get('/', validarJWT, getPagos);
router.get('/search/', validarJWT, getPagosSearch);
router.get('/all/', getPagosAll);
router.get('/id/:id', validarJWT, getPagoById);
router.get('/factura/compra/:id', validarJWT, getPagosByIdFacturaCompra);
router.get('/factura/venta/:id', validarJWT, getPagosByIdFacturaVenta);

// Ruta para crear un pago
router.post('/',
    [
        validarJWT,
    ],
    createPago
);

// Ruta para actualizar un pago
router.put('/:id',
    [
        validarJWT,
    ],
    updatePago
);

// Ruta para eliminar un pago
router.delete('/:id', [validarJWT],
    deletePago
);

module.exports = router;