// Ruta: /api/clientes

const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getClientes,
    createCliente,
    getClienteById,
    deleteCliente,
    updateCliente,
    getClienteByIndentificacion,
} = require('../../controllers/venta/clientes');

const router = Router();

// Rutas para obtener clientes
router.get('/', validarJWT, getClientes);
router.get('/id/:id', validarJWT, getClienteById);
router.get('/identificacion/:identificacion', validarJWT, getClienteByIndentificacion);

// Ruta para crear un cliente
router.post('/',
    [
        validarJWT,
        check('identificacion', 'La identificación es obligatoria').not().isEmpty(),
        check('razon_social', 'La razón social es obligatoria').not().isEmpty(),
        check('direccion', 'La dirección es obligatoria').not().isEmpty(),
        check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    createCliente
);

// Ruta para actualizar un cliente
router.put('/:id',
    [
        validarJWT,
        check('razon_social', 'La razón social es obligatoria').not().isEmpty(),
        check('direccion', 'La dirección es obligatoria').not().isEmpty(),
        check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    updateCliente
);

// Ruta para eliminar un cliente
router.delete('/:id',
    [
        validarJWT,
        validarCampos,
    ],
    deleteCliente
);

module.exports = router;