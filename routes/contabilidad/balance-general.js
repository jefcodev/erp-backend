/*
    Ruta: /api/libro-diario
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getBalanceGeneral, getSumaAPP } = require('../../controllers/contabilidad/balance-general');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.get('/', getBalanceGeneral);
router.get('/suma', getSumaAPP);
//router.get('/', validarJWT, getAsientos);

module.exports = router;