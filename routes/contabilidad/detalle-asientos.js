/*
    Ruta: /api/asientos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getDetalleAsientos, getDetalleAsientoById,getDetalleAsientosByAsiento, createDetalleAsiento, updateDetalleAsiento } = require('../../controllers/contabilidad/detalle-asientos');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.get('/', getDetalleAsientos);
//router.get('/', validarJWT, getDetalleAsientos);

router.get('/:id/id', getDetalleAsientoById);
router.get('/:asiento/:asiento', getDetalleAsientosByAsiento);

router.post('/', 
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    createDetalleAsiento
);

router.put('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    updateDetalleAsiento
);

module.exports = router;