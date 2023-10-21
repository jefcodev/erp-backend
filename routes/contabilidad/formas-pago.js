/*
    Ruta: /api/formas-pago
*/
const express = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../../middlewares/validar-campos');
const { validarJWT } = require('../../middlewares/validar-jwt');

const { getFormasPago, getFormaPagoById, getFormaPagoByCodigo, createFormaPago, updateFormaPago, deleteFormaPago } = require('../../controllers/contabilidad/formas-pago');

const router = express.Router();

// Obtener todas las formas de pago
router.get('/', getFormasPago);
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

/*
 OTRA FORMA de validar compraas


//    Ruta: /api/formas-pago

    const express = require('express');
const { check, validationResult } = require('express-validator');

const { validarJWT } = require('../../middlewares/validar-jwt');
const {
    getFormasPago,
    getFormaPagoById,
    createFormaPago,
    updateFormaPago,
    deleteFormaPago
} = require('../../controllers/contabilidad/formas-pago');

const router = express.Router();

// Middleware para validar los campos
const validarFormaPago = [
    check('codigo').notEmpty().withMessage('El código es obligatorio'),
    check('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Obtener todas las formas de pago
router.get('/', validarJWT, getFormasPago);

// Obtener una forma de pago por su ID
router.get('/:id', getFormaPagoById);

// Crear una forma de pago
router.post('/', validarJWT, validarFormaPago, createFormaPago);

// Actualizar una forma de pago
router.put('/:id', validarJWT, validarFormaPago, updateFormaPago);

// Eliminar una forma de pago
router.delete('/:id', validarJWT, deleteFormaPago);

// Middleware para manejar errores
router.use((err, req, res, next) => {
    if (err) {
        return res.status(500).json({ error: 'Ha ocurrido un error en el servidor' });
    }
    next();
});

module.exports = router;

 */
