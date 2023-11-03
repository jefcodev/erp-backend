// Ruta: /api/proveedores

const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getProveedores,
    getProveedoresSearch,
    getProveedoresAll,
    getProveedorById,
    getProveedorByIndentificacion,
    createProveedor,
    updateProveedor,
    deleteProveedor
} = require('../../controllers/compra/proveedores');

const router = Router();

// Rutas para obtener provedores
router.get('/', validarJWT, getProveedores);
router.get('/search/', validarJWT, getProveedoresSearch);
router.get('/all/', getProveedoresAll);
router.get('/id/:id', validarJWT, getProveedorById);
router.get('/identificacion/:identificacion', validarJWT, getProveedorByIndentificacion);

// Ruta para crear un proveedor
router.post('/',
    [
        validarJWT,
        check('identificacion', 'La identificación es obligatoria.').not().isEmpty(),
        check('razon_social', 'La razón social es obligatoria.').not().isEmpty(),
        check('direccion', 'La dirección es obligatoria.').not().isEmpty(),
        check('telefono', 'El teléfono es obligatorio.').not().isEmpty(),
        check('email', 'El email es obligatorio.').isEmail(),
        validarCampos,
    ],
    createProveedor
);

// Ruta para actualizar un proveedor
router.put('/:id',
    [
        validarJWT,
        check('razon_social', 'La razón social es obligatoria.').not().isEmpty(),
        check('direccion', 'La dirección es obligatoria.').not().isEmpty(),
        check('telefono', 'El teléfono es obligatorio.').not().isEmpty(),
        check('email', 'El email es obligatorio.').isEmail(),
        validarCampos,
    ],
    updateProveedor
);

// Ruta para eliminar un proveedor
router.delete('/:id', [validarJWT],
    deleteProveedor
);

module.exports = router;