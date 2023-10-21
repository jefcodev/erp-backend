/*
    Ruta: /api/asientos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getAsientos, createAsiento, getAsientoById, deleteAsiento, updateAsiento } = require('../../controllers/contabilidad/asientos');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.get('/', getAsientos);
//router.get('/', validarJWT, getAsientos);

router.get('/:id', getAsientoById);

router.post('/', 
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    createAsiento
);
router.delete('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    deleteAsiento
);

router.put('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    updateAsiento
);

module.exports = router;