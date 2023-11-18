/*
    Ruta: /api/Ventas
*/
const { Router } = require('express');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getDetalleVentas,
    getDetalleVentaById,
    getDetallesVentaByIdVenta,
    createDetalleVenta,
    updateDetalleVenta
} = require('../../controllers/venta/detalles-ventas');

const router = Router();

// Rutas para obtener detalles de Venta
router.get('/', validarJWT, getDetalleVentas);
router.get('/id/:id', validarJWT, getDetalleVentaById);
router.get('/venta/:venta', validarJWT, getDetallesVentaByIdVenta);

// Ruta para crear un detalle Venta
router.post('/', [validarJWT],
    createDetalleVenta
);

// Ruta para actualizar un detalle Venta
router.put('/:id', [validarJWT],
    updateDetalleVenta
);

module.exports = router;