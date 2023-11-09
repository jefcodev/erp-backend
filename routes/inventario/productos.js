/*
    Ruta: /api/productos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getProductos, getProductosAll, createProducto, getProductoById, deleteProducto, updateProducto } = require('../../controllers/inventario/productos');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.get('/', getProductos);
router.get('/all/', getProductosAll);
router.post('/',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    createProducto
);
router.delete('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    deleteProducto
);

router.put('/:id',
    /* [   validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],  */
    updateProducto
);

router.get('/:id', getProductoById);



module.exports = router;