/*
    Ruta: /api/facturas
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getDetalleFacturas,
    getDetalleFacturaById,
    getDetallesFacturaByIdFactura,
    createDetalleFactura,
    updateDetalleFactura
} = require('../../controllers/compra/detalle-facturas');

const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.get('/', getDetalleFacturas);
//router.get('/', validarJWT, getDetalleFacturas);

//router.get('/:id', getDetalleFacturaById);
router.get('/id/:id', getDetalleFacturaById);
router.get('/factura/:factura', getDetallesFacturaByIdFactura);

router.post('/',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    createDetalleFactura
);

router.put('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    updateDetalleFactura
);

module.exports = router;