/*
    Ruta: /api/facturas
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getFacturas, createFactura, getFacturaById, deleteFactura, updateFactura } = require('../../controllers/compra/facturas');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.get('/', getFacturas);
//router.get('/', validarJWT, getFacturas);

router.get('/:id', getFacturaById);

router.post('/', 
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    createFactura
);
router.delete('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    deleteFactura
);

router.put('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    updateFactura
);

module.exports = router;