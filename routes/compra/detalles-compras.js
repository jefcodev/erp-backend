/*
    Ruta: /api/compras
*/
const { Router } = require('express');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getDetalleCompras,
    getDetalleCompraById,
    getDetallesCompraByIdCompra,
    createDetalleCompra,
    updateDetalleCompra
} = require('../../controllers/compra/detalles-compras');

const router = Router();

// Rutas para obtener detalles de compra
router.get('/', validarJWT, getDetalleCompras);
router.get('/id/:id', validarJWT, getDetalleCompraById);
router.get('/compra/:compra', validarJWT, getDetallesCompraByIdCompra);

// Ruta para crear un detalle compra
router.post('/', [validarJWT],
    createDetalleCompra
);

// Ruta para actualizar un detalle compra
router.put('/:id', [validarJWT],
    updateDetalleCompra
);

module.exports = router;