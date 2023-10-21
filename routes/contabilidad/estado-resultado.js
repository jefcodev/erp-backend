/*
    Ruta: /api/libro-diario
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getEstadoResultado , getSumaIEG } = require('../../controllers/contabilidad/estado-resultado');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.get('/', getEstadoResultado);
router.get('/suma', getSumaIEG);
//router.get('/', validarJWT, getAsientos);

module.exports = router;