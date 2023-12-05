/*
    Ruta: /api/v1/quotation
*/
const { Router } = require('express');
const {check } = require('express-validator');

const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getClients, createClient } = require('../../controllers/quotations/clients');
const { getGroupClients } = require('../../controllers/quotations/group_clients');
const { getQuotations, createQuotation, getQuotationsId, createVenta, updateQuotation } = require('../../controllers/quotations/quotations');



const router = Router();


//CLients
router.get( '/clients' ,validarJWT, getClients );
router.post( '/clients' ,validarJWT, createClient );


//Group Clients

router.get( '/clients/group' ,validarJWT, getGroupClients );

//Quotations
router.get( '/' ,validarJWT, getQuotations );
router.get( '/:id' ,validarJWT, getQuotationsId );
router.post('/factura', createVenta);

router.post( '/' ,validarJWT, createQuotation);
router.put( '/' ,validarJWT, updateQuotation);




module.exports = router;