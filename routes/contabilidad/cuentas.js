/*
    Ruta: /api/cuentas
*/
const { Router } = require('express');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getCuentas,
    getCuentasAll,
    getCuentaById,
    getCuentaByCodigo,
    createCuenta,
    updateCuenta,
    deleteCuenta,
} = require('../../controllers/contabilidad/cuentas');

const router = Router();

// Rutas para obtener cuentas
router.get('/', validarJWT, getCuentas);
router.get('/all/', validarJWT, getCuentasAll);
router.get('/id/:id', getCuentaById);
router.get('/codigo/:codigo', getCuentaByCodigo);

// Ruta para crear una cuenta
router.post('/', [validarJWT],
    createCuenta
);

// Ruta para actualizar una cuenta
router.put('/:id', [validarJWT],
    updateCuenta
);

// Ruta para eliminar una cuenta
router.delete('/:id', [validarJWT],
    deleteCuenta
);

module.exports = router;