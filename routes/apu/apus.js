/* /api/v1/apu */

const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');
const { getApus, createApu, getApuDetalle } = require('../../controllers/apus/apus');

const router = Router();


router.get('/', validarJWT, getApus);
router.get('/:id', validarJWT, getApuDetalle);
router.post('/', validarJWT, createApu);

module.exports = router;

