/*
    Ruta: /api/iva
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getIVA, getSumaDebeHaber } = require('../../controllers/contabilidad/iva') 
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.get('/', getIVA);
router.get('/suma', getSumaDebeHaber);
//router.get('/', validarJWT, getAsientos);

module.exports = router;