/*
    Ruta: /api/libro-diario
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getLibroDiario, getSumaDebeHaber } = require('../../controllers/contabilidad/libro-diario');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.get('/', getLibroDiario);
router.get('/suma', getSumaDebeHaber);
//router.get('/', validarJWT, getAsientos);

module.exports = router;