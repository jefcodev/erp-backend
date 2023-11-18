/*
    Ruta: /api/compras
*/
const { Router } = require('express');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getCompras,
    getComprasAll,
    getCompraById,
    createCompra,
    updateCompra,
    deleteCompra,
} = require('../../controllers/compra/compras');

const router = Router();

// Rutas para obtener compras
router.get('/', validarJWT, getCompras);
router.get('/all/', validarJWT, getComprasAll);
router.get('/:id', validarJWT, getCompraById);

// Ruta para crear una factura
router.post('/', [validarJWT],
    createCompra
);

// Ruta para actualizar una factura
router.put('/:id', [validarJWT],
    updateCompra
);

// Ruta para eliminar una factura
router.delete('/:id', [validarJWT],
    deleteCompra
);

module.exports = router;