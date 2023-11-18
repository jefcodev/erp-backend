/*
    Ruta: /api/formas-pago
*/
const express = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getTiposComprobantes,
    getTiposComprobantesAll,
    getTipoComprobanteById,
    getTipoComprobanteByCodigo,
    createTipoComprobante,
    updateTipoComprobante,
    deleteTipoComprobante
} = require('../../controllers/contabilidad/tipos-comprobantes');

const router = express.Router();

// Obtener todas las formas de pago
router.get('/', getTiposComprobantes);
router.get('/all/', getTiposComprobantesAll);
//router.get('/', validarJWT, getTiposComprobantes);

// Obtener una forma de pago por su ID
router.get('/id/:id', getTipoComprobanteById);

// Obtener una forma de pago por su Código
router.get('/codigo/:codigo', getTipoComprobanteByCodigo);

// Crear una forma de pago
router.post('/', [
    check('codigo', 'El código descripción es obligatoria').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    validarCampos
], createTipoComprobante);

// Actualizar una forma de pago
router.put('/:id', [
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    validarCampos
], updateTipoComprobante);

// Eliminar una forma de pago
router.delete('/:id', deleteTipoComprobante);

// Middleware para manejar errores
router.use((err, req, res, next) => {
    if (err) {
        return res.status(500).json({ error: 'Ha ocurrido un error en el servidor' });
    }
    next();
});

module.exports = router;
