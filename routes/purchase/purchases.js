/*
    Ruta: /api/v1/purchase
*/
const { Router } = require('express');
const {check } = require('express-validator');

const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getIva } = require('../../controllers/purchases/iva');
const { getProviders } = require('../../controllers/purchases/providers');
const { getPurchases, createPurchase } = require('../../controllers/purchases/purchases');




const router = Router();


//Iva
router.get( '/iva' ,validarJWT, getIva );


//Providers
router.get( '/providers' ,validarJWT, getProviders );

//Purchases
router.get( '/' ,validarJWT, getPurchases );
router.post( '/' ,validarJWT, createPurchase );



module.exports = router;