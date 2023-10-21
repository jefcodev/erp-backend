/*
    Ruta: /api/proveedores
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getProveedores, getProveedorById, getProveedorByIndentificacion, createProveedor, updateProveedor, deleteProveedor } = require('../../controllers/compra/proveedores');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getProveedores);
router.get('/id/:id', getProveedorById);
router.get('/identificacion/:identificacion', getProveedorByIndentificacion);

router.post('/', validarJWT,
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    createProveedor
);
router.delete('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    deleteProveedor
);

router.put('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    updateProveedor
);

module.exports = router;