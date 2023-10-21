/*
    Ruta: /api/cuentas
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getCuentas, createCuenta, getCuentaById, getCuentaByCodigo, deleteCuenta, updateCuenta } = require('../../controllers/contabilidad/cuentas');
const { validarJWT } = require('../../middlewares/validar-jwt');



const router = Router();


router.get('/', validarJWT, getCuentas);
router.post('/', validarJWT,
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    createCuenta
);
router.delete('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    deleteCuenta
);

router.put('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    updateCuenta
);

router.get('/id/:id', getCuentaById);
router.get('/codigo/:codigo', getCuentaByCodigo);



module.exports = router;