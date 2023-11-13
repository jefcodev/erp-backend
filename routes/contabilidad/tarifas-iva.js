/*
    Ruta: /api/tarifas-iva
*/
const { Router } = require('express');
const { validarJWT } = require('../../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const {
    getTarifasIVA,
    getTarifaIVAById,
    createTarifaIVA,
    updateTarifaIVA,
    deleteTarifaIVA,
    getTarifasIVAAll
} = require('../../controllers/contabilidad/tarifa-iva');

const router = Router();

router.get('/', validarJWT, getTarifasIVA);
router.get('/all/', validarJWT, getTarifasIVAAll);
router.get('/id/:id', validarJWT, getTarifaIVAById);

router.post('/', validarJWT, createTarifaIVA
);

router.put('/:id', validarJWT, updateTarifaIVA
);

router.delete('/:id', validarJWT, deleteTarifaIVA
);


module.exports = router;