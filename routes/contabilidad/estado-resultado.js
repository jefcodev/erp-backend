/*
    Ruta: /api/estado-resultado
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');
const { validarJWT } = require('../../middlewares/validar-jwt');

const {
    getEstadoResultado,
    getSumaIEG,
    getEstadoResultadoFecha,
    getSumaIEGFecha,
} = require('../../controllers/contabilidad/estado-resultado');

const router = Router();

router.get('/', getEstadoResultado);
router.get('/suma', getSumaIEG);
//router.get('/', validarJWT, getAsientos);

router.get('/:fecha_inicio/:fecha_fin', getEstadoResultadoFecha);
router.get('/suma/:fecha_inicio/:fecha_fin', getSumaIEGFecha);

module.exports = router;