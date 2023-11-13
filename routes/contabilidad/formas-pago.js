/*
    Ruta: /api/formas-pago
*/
const express = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getFormasPago,
    getFormasPagoAll,
    getFormaPagoById,
    getFormaPagoByCodigo,
    createFormaPago,
    updateFormaPago,
    deleteFormaPago
} = require('../../controllers/contabilidad/formas-pago');

const router = express.Router();

// Obtener todas las formas de pago
router.get('/', getFormasPago);
router.get('/all/', getFormasPagoAll);
//router.get('/', validarJWT, getFormasPago);

// Obtener una forma de pago por su ID
router.get('/id/:id', getFormaPagoById);

// Obtener una forma de pago por su Código
router.get('/codigo/:codigo', getFormaPagoByCodigo);

// Crear una forma de pago
router.post('/', [
    check('codigo', 'El código descripción es obligatoria').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    validarCampos
], createFormaPago);

// Actualizar una forma de pago
router.put('/:id', [
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    validarCampos
], updateFormaPago);

// Eliminar una forma de pago
router.delete('/:id', deleteFormaPago);

// Middleware para manejar errores
router.use((err, req, res, next) => {
    if (err) {
        return res.status(500).json({ error: 'Ha ocurrido un error en el servidor' });
    }
    next();
});

module.exports = router;
