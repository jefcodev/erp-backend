/*
    Ruta: /api/ventas
*/
const { Router } = require('express');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getVentas,
    getVentasAll,
    getVentaById,
    createVenta,
    updateVenta,
    deleteVenta,
} = require('../../controllers/venta/ventas');

const router = Router();

// Rutas para obtener Ventas
router.get('/', validarJWT, getVentas);
router.get('/all/', validarJWT, getVentasAll);
router.get('/:id', validarJWT, getVentaById);

// Ruta para crear una Venta
router.post('/', [validarJWT],
    createVenta
);

// Ruta para actualizar una Venta
router.put('/:id', [validarJWT],
    updateVenta
);

// Ruta para eliminar una Venta
router.delete('/:id', [validarJWT],
    deleteVenta
);

module.exports = router;