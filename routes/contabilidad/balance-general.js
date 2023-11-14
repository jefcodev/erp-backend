/*
    Ruta: /api/balance-general
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');
const { validarJWT } = require('../../middlewares/validar-jwt');

const {
    getBalanceGeneral,
    getSumaAPP,
    getBalanceGeneralFecha,
    getSumaAPPFecha
} = require('../../controllers/contabilidad/balance-general');

const router = Router();

router.get('/', getBalanceGeneral);
router.get('/suma', getSumaAPP);
//router.get('/', validarJWT, getAsientos);

router.get('/:fecha_inicio/:fecha_fin', getBalanceGeneralFecha);
router.get('/suma/:fecha_inicio/:fecha_fin', getSumaAPPFecha);

module.exports = router;