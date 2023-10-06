/* /api/v1/apu */

const { Router } = require('express');
const {check } = require('express-validator');

const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');
const { getApus } = require('../../controllers/apus/apus');

const router = Router();


router.get( '/' ,validarJWT, getApus );

module.exports = router;